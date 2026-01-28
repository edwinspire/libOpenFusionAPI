import { EndpointBackup } from "./models.js";
import crypto from "crypto";

function hashObjectSync(obj) {
  const jsonString = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

/**
 * Inserta backup SOLO si la combinación (idendpoint + hash) no existe
 * @param {string} idendpoint - UUID del endpoint
 * @param {string} hash - Hash SHA-512 en hexadecimal (128 caracteres)
 * @param {object} data - Datos a respaldar (objeto plano)
 * @returns {Promise<{ created: boolean, instance: EndpointBackup | null }>}
 */
export async function createEndpointBackup(idendpoint, data) {
  // Validación temprana (evita llamadas innecesarias a BD)
  if (!idendpoint || typeof idendpoint !== "string") {
    throw new Error("idendpoint debe ser un string UUID válido");
  }

  if (!data || typeof data !== "object") {
    throw new Error("data debe ser un objeto válido");
  }

  const hash = hashObjectSync(data);

  try {
    const instance = await EndpointBackup.create(
      { idendpoint, hash, data },
      {
        logging: false, // Opcional: desactiva logs para mejor rendimiento
        raw: true, // Opcional: mejora rendimiento en inserciones masivas
      },
    );
    return { created: true, instance };
  } catch (error) {
    // ✅ Manejo específico de duplicados (funciona en PostgreSQL, MySQL, SQL Server)
    console.error("Error creating endpoint backup:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return { created: false, instance: null };
    }
  }
}

export const upsertEndpointBackup = async (
  /** @type {import("sequelize").Optional<any, string>} */ data,
) => {
  try {
    const [result, created] = await EndpointBackup.upsert(data, {
      returning: true,
    });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getEndpointBackupById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idbackup,
) => {
  try {
    const endpoint = await EndpointBackup.findByPk(idbackup);
    return endpoint;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

// READ
export const getEndpointBackupByIdEndpoint = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint,
) => {
  try {
    //const endpoints = await Endpoint.findAll({attributes: list_fields, where: { appname: appname } });
    const endpoints = await EndpointBackup.findAll({
      where: { idendpoint: idendpoint },
      order: [["idbackup", "DESC"]],
    });
    return endpoints;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};
