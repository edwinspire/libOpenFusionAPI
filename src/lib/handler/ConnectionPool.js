import { Sequelize } from "sequelize";
import Connection from "tedious/lib/connection.js";
import Request from "tedious/lib/request.js";
import BulkLoad from "tedious/lib/bulk-load.js";
import { TYPES } from "tedious/lib/data-type.js";
import { ISOLATION_LEVEL } from "tedious/lib/transaction.js";

const tediousDialectModule = {
  Connection,
  Request,
  BulkLoad,
  TYPES,
  ISOLATION_LEVEL,
};

class ConnectionPool {
  constructor(maxConnections = 50) {
    this.connections = new Map();
    this.MAX_CONNECTIONS = maxConnections;
  }

  /**
   * Valida si una conexión en caché sigue siendo funcional.
   * Intenta un authenticate() ligero sin query pesada.
   */
  async validateConnection(sequelize) {
    try {
      // Intenta validar la conexión con authenticate()
      // Si falla, retorna false (conexión muerta)
      await sequelize.authenticate();
      return true;
    } catch (err) {
      console.warn(`[ConnectionPool] Connection validation failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Gestiona el ciclo de vida de las conexiones para evitar fugas de memoria.
   * Implementa una estrategia LRU (Least Recently Used).
   */
  async getConnection(configHash, paramsSQL) {
    // 1. Si existe, actualizamos timestamp y retornamos
    if (this.connections.has(configHash)) {
      const connData = this.connections.get(configHash);

      // Auto-recuperacion: reciclar conexiones MSSQL creadas sin dialectModule.
      const isMssql = connData?.sequelize?.options?.dialect === "mssql";
      const hasDialectModule = !!connData?.sequelize?.options?.dialectModule;
      if (isMssql && !hasDialectModule) {
        try {
          await connData.sequelize.close();
        } catch (err) {
          console.error("Error closing legacy mssql connection:", err);
        }
        this.connections.delete(configHash);
      } else {
        // Validar la conexión solo si lleva más de 30s sin usarse (evita SELECT 1+1 en cada request)
        const idleMs = Date.now() - (connData.lastUsed || 0);
        const needsValidation = idleMs > 30_000;
        const isValid = needsValidation ? await this.validateConnection(connData.sequelize) : true;
        if (isValid) {
          connData.lastUsed = Date.now();
          return connData.sequelize;
        } else {
          // Conexión muerta: cerrar y eliminar del caché
          console.log(`[ConnectionPool] Stale connection detected for ${configHash}, recreating...`);
          try {
            await connData.sequelize.close();
          } catch (err) {
            console.error("Error closing stale connection:", err);
          }
          this.connections.delete(configHash);
          // Continúa para crear nueva conexión
        }
      }
    }

    // 2. Si no existe, verificamos límite
    if (this.connections.size >= this.MAX_CONNECTIONS) {
      // Buscar la conexión más antigua (LRU)
      let oldestHash = null;
      let oldestTime = Infinity;

      for (const [hash, data] of this.connections.entries()) {
        if (data.lastUsed < oldestTime) {
          oldestTime = data.lastUsed;
          oldestHash = hash;
        }
      }

      if (oldestHash) {
        console.log(`Closing idle connection: ${oldestHash}`);
        const oldConn = this.connections.get(oldestHash);
        try {
          await oldConn.sequelize.close();
        } catch (err) {
          console.error("Error closing idle connection:", err);
        }
        this.connections.delete(oldestHash);
      }
    }

    // 3. Crear nueva conexión
    const sequelizeOptions = {
      ...paramsSQL.config.options,
    };

    const buildSequelize = (options) => new Sequelize(
      paramsSQL.config.database,
      paramsSQL.config.username,
      paramsSQL.config.password,
      options
    );

    let sequelize = buildSequelize(sequelizeOptions);

    // 4.5 Validar que la nueva conexión sea funcional
    try {
      await sequelize.authenticate();
    } catch (err) {
      const isMssql = sequelizeOptions?.dialect === "mssql";
      const canRetryWithDialectModule = isMssql && !sequelizeOptions?.dialectModule;

      if (canRetryWithDialectModule) {
        console.warn(`[ConnectionPool] Default MSSQL connection failed for ${configHash}. Retrying with explicit dialectModule.`, err.message);
        try {
          await sequelize.close();
        } catch (closeErr) {
          console.error("Error closing failed default connection:", closeErr);
        }

        const retryOptions = {
          ...sequelizeOptions,
          dialectModule: tediousDialectModule,
        };
        sequelize = buildSequelize(retryOptions);

        try {
          await sequelize.authenticate();
        } catch (retryErr) {
          console.error(`[ConnectionPool] Failed to authenticate fallback MSSQL connection for ${configHash}:`, retryErr.message);
          try {
            await sequelize.close();
          } catch (closeRetryErr) {
            console.error("Error closing failed fallback connection:", closeRetryErr);
          }
          throw new Error(`Cannot authenticate connection to database: ${retryErr.message}`);
        }
      } else {
        console.error(`[ConnectionPool] Failed to authenticate new connection for ${configHash}:`, err.message);
        try {
          await sequelize.close();
        } catch (closeErr) {
          console.error("Error closing failed connection:", closeErr);
        }
        throw new Error(`Cannot authenticate connection to database: ${err.message}`);
      }
    }

    // 4. Guardar en mapa
    this.connections.set(configHash, {
      sequelize: sequelize,
      lastUsed: Date.now(),
    });

    return sequelize;
  }
}

// Export a singleton instance
export const Pool = new ConnectionPool();
