import { EndpointBackup } from "./models.js";
import crypto from "crypto";

function sortObjectDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortObjectDeep);
  }

  if (value && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortObjectDeep(value[key]);
    }
    return sorted;
  }

  return value;
}

function hashObjectSync(obj) {
  const jsonString = JSON.stringify(sortObjectDeep(obj));
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

/**
 * Inserta backup SOLO si la combinación (idendpoint + hash) no existe
 * @param {string} idendpoint - UUID del endpoint
 * @param {object} data - Datos a respaldar (objeto plano)
 * @returns {Promise<{ created: boolean, instance: EndpointBackup | null }>}
 */
export async function createEndpointBackup({ idendpoint, data }) {
  // Validación temprana (evita llamadas innecesarias a BD)
  if (!idendpoint || typeof idendpoint !== "string") {
    throw new Error("idendpoint debe ser un string UUID válido");
  }

  if (!data || typeof data !== "object") {
    throw new Error("data debe ser un objeto válido");
  }
  const dataToHash = {
    ...data,
    rowkey: 0,
    createdAt: null,
    updatedAt: null,
    internal_hash_row: null,
  };
  const hash = hashObjectSync(dataToHash);

  try {
    // Upsert is more robust across dialects and avoids race conditions from findOrCreate.
    const [instance, created] = await EndpointBackup.upsert({
      idendpoint,
      hash,
      data: dataToHash,
    }, {
      logging: false,
      returning: true,
    });

    return {
      created: created === true,
      instance: created === true ? instance : null,
    };
  } catch (error) {
    // Duplicado esperado: ya existe backup idéntico
    const parentCode = error?.parent?.code;
    const parentNumber = error?.parent?.number;
    const isDuplicate =
      error?.name === "SequelizeUniqueConstraintError" ||
      parentCode === "SQLITE_CONSTRAINT" || // sqlite
      parentCode === "23505" || // postgres unique_violation
      parentCode === "ER_DUP_ENTRY" || // mysql/mariadb
      parentNumber === 2601 || // mssql duplicate key row
      parentNumber === 2627; // mssql unique constraint

    if (isDuplicate) {
      return { created: false, instance: null };
    }

    console.error("Error creating endpoint backup:", error);
    throw error;
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
    //console.error("Error retrieving:", error, data);
    //throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
    console.log('upsertEndpointBackup Error');
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

/**
 * Lightweight version: returns only idbackup, idendpoint, hash and createdAt.
 * The heavy `data` field (full endpoint snapshot) is excluded.
 * Use this to list the history before fetching a specific version with getEndpointBackupById.
 * @param {string} idendpoint - UUID del endpoint
 * @returns {Promise<Array>}
 */
export const getEndpointBackupByIdEndpointLightweight = async (idendpoint) => {
  try {
    return await EndpointBackup.findAll({
      where: { idendpoint },
      attributes: ["idbackup", "idendpoint", "hash", "createdAt"],
      order: [["idbackup", "DESC"]],
    });
  } catch (error) {
    console.error("Error retrieving lightweight backup history:", error);
    throw error;
  }
};

