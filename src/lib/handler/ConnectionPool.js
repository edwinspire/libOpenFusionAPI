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
        connData.lastUsed = Date.now();
        return connData.sequelize;
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

    // Node 24 + tedious can fail on CJS default interop; pass dialectModule explicitly.
    if (sequelizeOptions?.dialect === "mssql" && !sequelizeOptions.dialectModule) {
      sequelizeOptions.dialectModule = tediousDialectModule;
    }

    const sequelize = new Sequelize(
      paramsSQL.config.database,
      paramsSQL.config.username,
      paramsSQL.config.password,
      sequelizeOptions
    );

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
