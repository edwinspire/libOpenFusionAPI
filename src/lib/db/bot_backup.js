import { BotBackup } from "./models.js";
import crypto from "crypto";

function hashObjectSync(obj) {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

/**
 * Inserta backup SOLO si la combinación (idbot + hash) no existe
 * @param {string} idbot - UUID del bot
 * @param {string} hash - Hash SHA-512 en hexadecimal (128 caracteres)
 * @param {object} data - Datos a respaldar (objeto plano)
 * @returns {Promise<{ created: boolean, instance: BotBackup | null }>}
 */
export async function createBotBackup({ idbot, data }) {
  // Validación temprana (evita llamadas innecesarias a BD)
  if (!idbot || typeof idbot !== "string") {
    throw new Error("idbot debe ser un string UUID válido");
  }

  if (!data || typeof data !== "object") {
    throw new Error("data debe ser un objeto válido");
  }
  data.rowkey = 0; // Evita que cambios en rowkey afecten al hash
  data.createdAt = null; // Evita que cambios en createdAt afecten al hash
  data.updatedAt = null; // Evita que cambios en updatedAt afecten al hash
  data.internal_hash_row = null; // Evita que cambios en internal_hash_row afecten al hash
  const hash = hashObjectSync(data);

  try {
    const instance = await BotBackup.create(
      { idbot, hash, data },
      {
        logging: false, // Opcional: desactiva logs para mejor rendimiento
        //raw: true, // Opcional: mejora rendimiento en inserciones masivas
      },
    );
    return { created: true, instance };
  } catch (error) {
    // ✅ Manejo específico de duplicados (funciona en PostgreSQL, MySQL, SQL Server)
    console.error("Error creating bot backup:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return { created: false, instance: null };
    }
  }
}

export const upsertBotBackup = async (
  /** @type {import("sequelize").Optional<any, string>} */ data,
) => {
  try {
    const [result, created] = await BotBackup.upsert(data, {
      returning: true,
    });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getBotBackupById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idbackup,
) => {
  try {
    const bot = await BotBackup.findByPk(idbackup);
    return bot;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

// READ
export const getBotBackupByIdBot = async (
  /** @type {import("sequelize").Identifier | undefined} */ idbot,
) => {
  try {
    //const endpoints = await Endpoint.findAll({attributes: list_fields, where: { appname: appname } });
    const bots = await BotBackup.findAll({
      where: { idbot: idbot },
      order: [["idbackup", "DESC"]],
    });
    return bots;
  } catch (error) {
   // console.error("Error retrieving user:", error);
    throw error;
  }
};
