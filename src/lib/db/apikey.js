import { Application, ApiClient, ApiKey } from "./models.js";


// Hace UPSERT de una ApiKey - Debe devolver la fila insertada o modificada
export const upsertApiKey = async (
  /** @type {import("sequelize").Optional<any, string>} */ data,
) => {
  try {
    const [result, created] = await ApiKey.upsert(data, { returning: true });

    return { result, created };
  } catch (error) {
    console.error("Error performing upsert on ApiKey:", error, data);
    throw error;
  }
};

// Obtiene una ApiKey por su idkey
export const getApiKeyById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idkey,
) => {
  try {
    const apiKey = await ApiKey.findByPk(idkey);
    return apiKey;
  } catch (error) {
    console.error("Error retrieving ApiKey:", error);
    throw error;
  }
};

// Obtiene todas las ApiKeys
export const getAllApiKeys = async () => {
  try {
    const apiKeys = await ApiKey.findAll();
    return apiKeys;
  } catch (error) {
    console.error("Error retrieving ApiKeys:", error);
    throw error;
  }
};

// DELETE de una ApiKey por su idkey
export const deleteApiKey = async (
  /** @type {import("sequelize").Identifier | undefined} */ idkey,
) => {
  try {
    const apiKey = await ApiKey.findByPk(idkey);
    if (apiKey) {
      await apiKey.destroy();
      return true;
    }
    return false;

  } catch (error) {
    console.error("Error deleting ApiKey:", error);
    throw error;
  }
};

// Obtiene todas las ApiKeys usando los filtros: idapp, idclient, endAt, startAt, enabled o token. 
// Todos los filtros son opcionales si no se pasa el valor se omitirá de la consulta
export const getApiKeyByFilters = async (
  /** @type {import("sequelize").Identifier | undefined} */ idapp,
  /** @type {import("sequelize").Identifier | undefined} */ idclient,
  /** @type {import("sequelize").Identifier | undefined} */ endAt,
  /** @type {import("sequelize").Identifier | undefined} */ startAt,
  /** @type {import("sequelize").Identifier | undefined} */ enabled,
  /** @type {import("sequelize").Identifier | undefined} */ token,
) => {
  try {
    const where = {};
    if (idapp) where.idapp = idapp;
    if (idclient) where.idclient = idclient;
    if (endAt) where.endAt = endAt;
    if (startAt) where.startAt = startAt;
    if (enabled !== undefined) where.enabled = enabled;
    if (token) where.token = token;

    const apiKeys = await ApiKey.findAll({ where });
    return apiKeys;
  } catch (error) {
    console.error("Error retrieving ApiKeys by filters:", error);
    throw error;
  }
};
