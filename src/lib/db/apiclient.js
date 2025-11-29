// crud_credit_system.js
import dbsequelize from "./sequelize.js"; // su instancia sequelize
import { Op } from "sequelize";
import {
  ApiClient,
  ApiKey,
  ClientWallet,
  WalletMovement,
  ApiKeyEndpoint,
  ApiUsageLog,
  Endpoint,
} from "./models.js"; // ajuste la ruta si la tiene en otro archivo

// -----------------------------
// ApiClient CRUD
// -----------------------------
export const ApiClientCRUD = {
  async create(data) {
    return await ApiClient.create(data);
  },

  async get(idclient) {
    return await ApiClient.findByPk(idclient, {
      include: [{ model: ApiKey, as: "apikeys" }, { model: ClientWallet, as: "wallet" }],
    });
  },

  async findByUsername(username) {
    return await ApiClient.findOne({ where: { username } });
  },

  async list(filter = {}) {
    const where = {};
    if (filter.enabled !== undefined) where.enabled = filter.enabled;
    if (filter.username) where.username = { [Op.iLike]: `%${filter.username}%` };
    return await ApiClient.findAll({ where, limit: filter.limit || 100, order: [["createdAt", "DESC"]] });
  },

  async update(idclient, data) {
    const rec = await ApiClient.findByPk(idclient);
    if (!rec) return null;
    return await rec.update(data);
  },

  async delete(idclient) {
    return await ApiClient.destroy({ where: { idclient } });
  },
};

// -----------------------------
// ApiKey CRUD
// -----------------------------
export const ApiKeyCRUD = {
  async create(data) {
    // data must include idclient and apikey (hash)
    return await ApiKey.create(data);
  },

  async get(idkey) {
    return await ApiKey.findByPk(idkey, { include: [{ model: ApiClient, as: "client" }] });
  },

  async findByKeyHash(keyHash) {
    return await ApiKey.findOne({ where: { apikey: keyHash } });
  },

  async list(filter = {}) {
    const where = {};
    if (filter.idclient) where.idclient = filter.idclient;
    if (filter.enabled !== undefined) where.enabled = filter.enabled;
    return await ApiKey.findAll({ where, limit: filter.limit || 100, order: [["createdAt", "DESC"]] });
  },

  async update(idkey, data) {
    const rec = await ApiKey.findByPk(idkey);
    if (!rec) return null;
    return await rec.update(data);
  },

  async delete(idkey) {
    return await ApiKey.destroy({ where: { idkey } });
  },

  async revoke(idkey) {
    const rec = await ApiKey.findByPk(idkey);
    if (!rec) return null;
    rec.enabled = false;
    rec.revokedAt = new Date();
    await rec.save();
    return rec;
  },
};

// -----------------------------
// ClientWallet CRUD + helpers (transaccionales)
// -----------------------------
export const ClientWalletCRUD = {
  async create(idclient, initial = 0) {
    return await ClientWallet.create({ idclient, balance: initial });
  },

  async getByClient(idclient) {
    return await ClientWallet.findOne({ where: { idclient } });
  },

  async getById(idwallet) {
    return await ClientWallet.findByPk(idwallet);
  },

  async list(filter = {}) {
    const where = {};
    if (filter.idclient) where.idclient = filter.idclient;
    return await ClientWallet.findAll({ where, limit: filter.limit || 100, order: [["createdAt", "DESC"]] });
  },

  // Creditar saldo (transaccional) => crea WalletMovement
  async credit(idclient, amount, { description = "credit", tx: externalTx = null } = {}) {
    if (amount <= 0) throw new Error("amount must be positive");
    const autoTx = !externalTx;
    const tx = externalTx || (await dbsequelize.transaction());
    try {
      let wallet = await ClientWallet.findOne({ where: { idclient }, transaction: tx, lock: tx.LOCK.UPDATE });
      if (!wallet) {
        wallet = await ClientWallet.create({ idclient, balance: 0 }, { transaction: tx });
      }
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      await wallet.update({ balance: newBalance }, { transaction: tx });

      await WalletMovement.create(
        { idwallet: wallet.idwallet, type: "credit", amount, description },
        { transaction: tx }
      );

      if (autoTx) await tx.commit();
      return { wallet, movement: true };
    } catch (err) {
      if (autoTx) await tx.rollback();
      throw err;
    }
  },

  // Debitar saldo (transaccional) => crea WalletMovement; no permite saldo negativo por defecto
  async debit(idclient, amount, { description = "debit", allowNegative = false, tx: externalTx = null } = {}) {
    if (amount <= 0) throw new Error("amount must be positive");
    const autoTx = !externalTx;
    const tx = externalTx || (await dbsequelize.transaction());
    try {
      const wallet = await ClientWallet.findOne({ where: { idclient }, transaction: tx, lock: tx.LOCK.UPDATE });
      if (!wallet) throw new Error("wallet_not_found");

      const current = parseFloat(wallet.balance);
      const newBalance = current - parseFloat(amount);
      if (!allowNegative && newBalance < 0) {
        throw new Error("insufficient_funds");
      }

      await wallet.update({ balance: newBalance }, { transaction: tx });

      await WalletMovement.create(
        { idwallet: wallet.idwallet, type: "debit", amount, description },
        { transaction: tx }
      );

      if (autoTx) await tx.commit();
      return { wallet, movement: true };
    } catch (err) {
      if (autoTx) await tx.rollback();
      throw err;
    }
  },

  async deleteByClient(idclient) {
    // elimina wallet y movimientos (si lo desea)
    const wallet = await ClientWallet.findOne({ where: { idclient } });
    if (!wallet) return 0;
    await WalletMovement.destroy({ where: { idwallet: wallet.idwallet } });
    return await wallet.destroy();
  },
};

// -----------------------------
// WalletMovement CRUD
// -----------------------------
export const WalletMovementCRUD = {
  async create(data) {
    // data must include idwallet, type, amount
    return await WalletMovement.create(data);
  },

  async get(idmovement) {
    return await WalletMovement.findByPk(idmovement);
  },

  async list(filter = {}) {
    const where = {};
    if (filter.idwallet) where.idwallet = filter.idwallet;
    if (filter.type) where.type = filter.type;
    return await WalletMovement.findAll({ where, limit: filter.limit || 200, order: [["createdAt", "DESC"]] });
  },

  async delete(idmovement) {
    return await WalletMovement.destroy({ where: { idmovement } });
  },
};

// -----------------------------
// ApiKeyEndpoint CRUD
// -----------------------------
export const ApiKeyEndpointCRUD = {
  async create(data) {
    // data should include idkey and idendpoint and startAt
    return await ApiKeyEndpoint.create(data);
  },

  async get(idkeyendpoint) {
    return await ApiKeyEndpoint.findByPk(idkeyendpoint);
  },

  async find(idkey, idendpoint) {
    return await ApiKeyEndpoint.findOne({ where: { idkey, idendpoint } });
  },

  async listByKey(idkey) {
    return await ApiKeyEndpoint.findAll({ where: { idkey } });
  },

  async listByEndpoint(idendpoint) {
    return await ApiKeyEndpoint.findAll({ where: { idendpoint } });
  },

  async update(idkeyendpoint, data) {
    const rec = await ApiKeyEndpoint.findByPk(idkeyendpoint);
    if (!rec) return null;
    return await rec.update(data);
  },

  async delete(idkeyendpoint) {
    return await ApiKeyEndpoint.destroy({ where: { idkeyendpoint } });
  },

  async assignKeyToEndpoint(idkey, idendpoint, opts = {}) {
    // crea o actualiza asignación
    const [rec, created] = await ApiKeyEndpoint.findOrCreate({
      where: { idkey, idendpoint },
      defaults: { ...opts },
    });
    if (!created && Object.keys(opts).length) {
      await rec.update(opts);
    }
    return rec;
  },

  async removeAssignment(idkey, idendpoint) {
    return await ApiKeyEndpoint.destroy({ where: { idkey, idendpoint } });
  },
};

// -----------------------------
// ApiUsageLog CRUD (ultra ligero)
// -----------------------------
export const ApiUsageLogCRUD = {
  // Inserción ligera (no transacciones pesadas aquí)
  async create(data) {
    // data: { idclient, idkey, idendpoint, cost, balance_after, success, error_message }
    // Mantener campos mínimos para alto rendimiento
    return await ApiUsageLog.create(data);
  },

  // Consulta básica para reporte (no recomendamos joins pesados)
  async list(filter = {}) {
    const where = {};
    if (filter.idclient) where.idclient = filter.idclient;
    if (filter.idkey) where.idkey = filter.idkey;
    if (filter.idendpoint) where.idendpoint = filter.idendpoint;
    if (filter.since) where.createdAt = { [Op.gte]: filter.since };
    return await ApiUsageLog.findAll({ where, limit: filter.limit || 1000, order: [["createdAt", "DESC"]] });
  },

  // Borrar logs antiguos por retention policy
  async deleteOlderThan(date) {
    return await ApiUsageLog.destroy({ where: { createdAt: { [Op.lt]: date } } });
  },
};

// -----------------------------
// Función utilitaria rápida:
// consumeCredits: valida acceso y descuenta créditos del wallet
// (usa Endpoint.cost para determinar el costo)
// -----------------------------
export async function consumeCreditsForRequest({ keyHash, idendpoint, requestMeta = {} }) {
  const tx = await dbsequelize.transaction();
  try {
    // 1) localizar ApiKey
    const apikey = await ApiKey.findOne({ where: { apikey: keyHash }, transaction: tx, lock: tx.LOCK.UPDATE });
    if (!apikey) throw new Error("apikey_not_found");
    if (!apikey.enabled || (apikey.startAt && apikey.startAt > new Date()) || (apikey.endAt && apikey.endAt < new Date())) {
      throw new Error("apikey_inactive");
    }

    // 2) verificar permiso ApiKeyEndpoint
    const assignment = await ApiKeyEndpoint.findOne({
      where: { idkey: apikey.idkey, idendpoint },
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });
    if (!assignment || !assignment.enabled || (assignment.startAt && assignment.startAt > new Date()) || (assignment.endAt && assignment.endAt < new Date())) {
      throw new Error("endpoint_not_allowed");
    }

    // 3) obtener costo del endpoint (campo cost del modelo Endpoint)
    const ep = await Endpoint.findByPk(idendpoint, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!ep) throw new Error("endpoint_not_found");
    const cost = parseFloat(ep.cost || 0);

    // 4) obtener wallet del cliente
    const client = await ApiClient.findByPk(apikey.idclient, { transaction: tx, lock: tx.LOCK.UPDATE });
    if (!client || !client.enabled || (client.startAt && client.startAt > new Date()) || (client.endAt && client.endAt < new Date())) {
      throw new Error("client_inactive");
    }

    let wallet = await ClientWallet.findOne({ where: { idclient: client.idclient }, transaction: tx, lock: tx.LOCK.UPDATE });
    if (!wallet) {
      // crear wallet con balance 0 si no existe
      wallet = await ClientWallet.create({ idclient: client.idclient, balance: 0 }, { transaction: tx });
    }

    // 5) verificar saldo
    const currentBalance = parseFloat(wallet.balance);
    if (currentBalance < cost) {
      throw new Error("insufficient_credits");
    }

    // 6) restar saldo y crear movimiento
    const newBalance = currentBalance - cost;
    await wallet.update({ balance: newBalance }, { transaction: tx });

    await WalletMovement.create(
      {
        idwallet: wallet.idwallet,
        type: "debit",
        amount: cost,
        description: `consumption endpoint ${idendpoint}`,
      },
      { transaction: tx }
    );

    // 7) insertar log ligero
    const log = await ApiUsageLog.create(
      {
        idclient: client.idclient,
        idkey: apikey.idkey,
        idendpoint,
        cost,
        balance_after: newBalance,
        success: true,
      },
      { transaction: tx }
    );

    // 8) commit
    await tx.commit();

    return { allowed: true, cost, balance_after: newBalance, logId: log.idlog };
  } catch (err) {
    await tx.rollback();

    // intentar loguear fallo sin interferir (no block)
    try {
      await ApiUsageLog.create({
        idclient: null,
        idkey: null,
        idendpoint,
        cost: 0,
        balance_after: null,
        success: false,
        error_message: err.message,
      });
    } catch (_) {
      // swallow
    }

    throw err;
  }
}
