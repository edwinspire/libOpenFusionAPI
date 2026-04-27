import { Endpoint } from "./models.js";
import { createEndpointBackup } from "./endpoint_backup.js";

const normalizeMcpConfig = (mcp) => {
  if (!mcp) {
    return undefined;
  }

  if (typeof mcp === "string") {
    try {
      return JSON.parse(mcp);
    } catch {
      return undefined;
    }
  }

  if (typeof mcp === "object") {
    return mcp;
  }

  return undefined;
};

const formatMcpTimestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const ensureUniqueEnabledMcpName = async (data) => {
  if (!data?.idapp) {
    return data;
  }

  const nextMcp = normalizeMcpConfig(data.mcp);
  const nextName = nextMcp?.name?.trim?.();

  if (!nextMcp?.enabled || !nextName) {
    return data;
  }

  const endpoints = await getEndpointByIdApp(data.idapp);
  const hasConflict = endpoints.some((endpoint) => {
    const current = endpoint?.toJSON ? endpoint.toJSON() : endpoint;
    const currentMcp = normalizeMcpConfig(current?.mcp);
    const currentName = currentMcp?.name?.trim?.();

    if (!currentMcp?.enabled || !currentName) {
      return false;
    }

    if (current?.idendpoint === data.idendpoint) {
      return false;
    }

    return currentName === nextName;
  });

  if (!hasConflict) {
    return data;
  }

  data.mcp = {
    ...nextMcp,
    name: `${nextName}_${formatMcpTimestamp()}`,
  };

  return data;
};

export const upsertEndpoint = async (
  /** @type {import("sequelize").Optional<any, string>} */ data,
) => {
  try {
    data = await ensureUniqueEnabledMcpName(data);

    // Prevent unique constraint violation on composite key
    if (data.idapp && data.environment && data.resource && data.method) {
      const existing = await Endpoint.findOne({
        where: {
          idapp: data.idapp,
          environment: String(data.environment).toLowerCase(),
          resource: String(data.resource).toLowerCase(),
          method: String(data.method).toUpperCase(),
        },
      });
      if (existing) {
        data.idendpoint = existing.idendpoint;
      }
    }

    const [result, created] = await Endpoint.upsert(data, { returning: true });
    
    try {
        await createEndpointBackup({ data: data, idendpoint: result.idendpoint });
      } catch (error) {
        console.error("Error creating endpoint backup:", error);
      }
    

    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getEndpointById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint,
) => {
  try {
    const endpoint = await Endpoint.findByPk(idendpoint);
    return endpoint;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const getEndpointSourceSummaryById = async (filters = {}) => {
  const { idendpoint, preview_lines } = filters;

  try {
    const endpoint = await Endpoint.findByPk(idendpoint);

    if (!endpoint) {
      return null;
    }

    const data = endpoint.toJSON ? endpoint.toJSON() : endpoint;
    const source = typeof data.code === "string"
      ? data.code
      : data.code == null
        ? ""
        : JSON.stringify(data.code, null, 2);
    const lines = source.length > 0 ? source.split(/\r?\n/g) : [];
    const previewLines = Number.isFinite(Number(preview_lines)) && Number(preview_lines) > 0
      ? Math.floor(Number(preview_lines))
      : 40;

    return {
      idendpoint: data.idendpoint,
      idapp: data.idapp,
      resource: data.resource,
      method: data.method,
      handler: data.handler,
      environment: data.environment,
      enabled: data.enabled,
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      codeLength: source.length,
      codeLines: lines.length,
      previewLines,
      codePreview: lines.slice(0, previewLines).join("\n"),
      hasMoreCode: lines.length > previewLines,
    };
  } catch (error) {
    console.error("Error retrieving endpoint source summary:", error);
    throw error;
  }
};

export const getAllEndpoints = async () => {
  try {
    const endpoints = await Endpoint.findAll();
    return endpoints;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

// DISABLE — sets enabled=false without deleting the record
export const disableEndpoint = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint,
) => {
  try {
    const [updated] = await Endpoint.update(
      { enabled: false },
      { where: { idendpoint } },
    );
    return updated > 0;
  } catch (error) {
    console.error("Error disabling endpoint:", error);
    throw error;
  }
};

// DELETE
export const deleteEndpoint = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint,
) => {
  try {
    const ep = await Endpoint.findByPk(idendpoint);
    if (ep) {
      await ep.destroy();
      return true; // Deletion successful
    }
    return false; // User not found
  } catch (error) {
    console.error("Error deleting idendpoint:", error);
    throw error;
  }
};

// READ
export const getEndpointByIdApp = async (
  /** @type {import("sequelize").Identifier | undefined} */ idapp,
) => {
  try {
    //const endpoints = await Endpoint.findAll({attributes: list_fields, where: { appname: appname } });
    const endpoints = await Endpoint.findAll({ where: { idapp: idapp } });
    return endpoints;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const getEndpointCatalogByIdApp = async (filters = {}) => {
  const {
    idapp,
    environment,
    method,
    handler,
    enabled,
    include_code,
    limit,
    offset,
  } = filters;

  try {
    const where = {};

    if (idapp) {
      where.idapp = idapp;
    }

    if (typeof environment === "string" && environment.trim() !== "") {
      where.environment = environment;
    }

    if (typeof method === "string" && method.trim() !== "") {
      where.method = method.toUpperCase();
    }

    if (typeof handler === "string" && handler.trim() !== "") {
      where.handler = handler.toUpperCase();
    }

    if (enabled !== null && enabled !== undefined) {
      where.enabled = enabled;
    }

    const attributes = [
      "idendpoint",
      "idapp",
      "enabled",
      "access",
      "environment",
      "resource",
      "method",
      "handler",
      "title",
      "description",
      "keywords",
      "cache_time",
      "mcp",
      "createdAt",
      "updatedAt",
    ];

    if (include_code === true) {
      attributes.push("code");
    }

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);

    return await Endpoint.findAll({
      where,
      attributes,
      order: [
        ["resource", "ASC"],
        ["environment", "ASC"],
        ["method", "ASC"],
      ],
      ...(Number.isFinite(parsedLimit) && parsedLimit > 0 ? { limit: parsedLimit } : {}),
      ...(Number.isFinite(parsedOffset) && parsedOffset >= 0 ? { offset: parsedOffset } : {}),
    });
  } catch (error) {
    console.error("Error retrieving endpoint catalog:", error);
    throw error;
  }
};

// READ
export const getEndpointByApp = async (
  /** @type {import("sequelize").Identifier | undefined} */ appname,
) => {
  try {
    //const endpoints = await Endpoint.findAll({attributes: list_fields, where: { appname: appname } });
    const endpoints = await Endpoint.findAll({ where: { appname: appname } });
    return endpoints;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const bulkCreateEndpoints = (
  /** @type {readonly import("sequelize").Optional<any, string>[]} */ list_endpoints,
) => {
  // Campos que se utilizarán para verificar duplicados (en este caso, todos excepto 'rowkey' y 'idendpoint')
  //const uniqueFields = ['idapp', 'namespace', 'name', 'version', 'environment', 'method'];
  // OJO: No se pudo tener un bulk upsert
  return Endpoint.bulkCreate(list_endpoints, {
    ignoreDuplicates: true,
    //updateOnDuplicate: uniqueFields
  });
};
