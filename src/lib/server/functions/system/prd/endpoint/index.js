import {
  upsertEndpoint,
  getEndpointById,
  getEndpointByIdApp,
  getEndpointCatalogByIdApp,
  getEndpointSourceSummaryById,
  searchEndpoints,
  getEndpointCode,
  restoreEndpointFromBackup,
  deleteEndpoint,
} from "../../../../../db/endpoint.js";

import { getEndpointBackupByIdEndpoint, getEndpointBackupByIdEndpointLightweight } from "../../../../../db/endpoint_backup.js";
import { Endpoint, Application } from "../../../../../db/models.js";
import { Op } from "sequelize";
import { internal_url_http } from "../../../../utils_path.js";

export async function fnGetEndpointBackupByIdEndpoint(params) {
  let r = { code: 200, data: undefined };
  try {
    const idendpoint = params.request.query.idendpoint;
    const lightweight =
      params.request.query.lightweight === "true" ||
      params.request.query.lightweight === true ||
      params.request.body?.lightweight === true;

    r.data = lightweight
      ? await getEndpointBackupByIdEndpointLightweight(idendpoint)
      : await getEndpointBackupByIdEndpoint(idendpoint);
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

export async function fnEndpointUpsert(params) {
  let r = { code: 200, data: undefined };
  try {
    let body = params.request.body;
    let fileToProcess = null;

    const contentType = params.request.headers?.['content-type'] || '';
    if (contentType.includes("multipart/form-data") && body) {
      let flattenedBody = {};
      
      for (const key in body) {
        let field = body[key];
        let items = Array.isArray(field) ? field : [field];
        
        for (const item of items) {
          if (item && item.type === 'file') {
            if (!fileToProcess) {
              fileToProcess = item;
            }
          } else if (item && item.type === 'field') {
            try {
              flattenedBody[key] = JSON.parse(item.value);
            } catch (e) {
              flattenedBody[key] = item.value;
            }
          }
        }
      }

      if (flattenedBody.json && typeof flattenedBody.json === 'object') {
        body = flattenedBody.json;
      } else if (flattenedBody.data && typeof flattenedBody.data === 'object') {
        body = flattenedBody.data;
      } else if (flattenedBody.endpoint && typeof flattenedBody.endpoint === 'object') {
        body = flattenedBody.endpoint;
      } else {
        body = flattenedBody;
      }
    }

    if (body && body.handler === "TEXT" && fileToProcess) {
      let buffer = await fileToProcess.toBuffer();
      
      if (buffer.length > 1024 * 1024) {
        r.data = { error: "File size exceeds the 1MB limit." };
        r.code = 400;
        return r;
      }
      
      body.code = buffer.toString('base64');
      
      let customData = typeof body.custom_data === 'object' && body.custom_data !== null ? body.custom_data : {};
      if (typeof body.custom_data === 'string') {
        try { customData = JSON.parse(body.custom_data); } catch(e) {}
      }
      
      customData.mimeType = fileToProcess.mimetype;
      customData.fileName = fileToProcess.filename;
      customData.fileSize = buffer.length;
      customData.isBase64 = true;
      
      body.custom_data = customData;
    }

    r.data = await upsertEndpoint(body);
    r.code = 200;
  } catch (error) {
    console.log(error);

    // Structured conflict error — return 400 so agents can detect and fix the name
    if (error?.code === "MCP_NAME_CONFLICT") {
      r.data = {
        error: error.message,
        code: error.code,
        details: error.details,
      };
      r.code = 400;
      return r;
    }

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointGetById(params) {
  let r = { code: 200, data: undefined };
  try {
    const idendpoint = params.request.query.idendpoint || params.request.body?.idendpoint;
    const attributes = params.request.query.attributes || params.request.body?.attributes;

    r.data = await getEndpointById(idendpoint, attributes);
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

export async function fnEndpointGetByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    const idapp = params.request.query.idapp || params.request.body?.idapp;
    const attributes = params.request.query.attributes || params.request.body?.attributes;

    r.data = await getEndpointByIdApp(idapp, attributes);
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

export async function fnEndpointCatalogByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getEndpointCatalogByIdApp(params?.request?.body || {});
    r.code = 200;
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointSourceSummaryById(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getEndpointSourceSummaryById(params?.request?.body || {});
    r.code = r.data ? 200 : 404;
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnClearCache(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    let data = params.request.body;
    let clear_cache = [];

    if (data && Array.isArray(data) && data.length > 0) {
      clear_cache = data.map((u) => {
        return {
          url: u,
          clear: params.server_data.endpoint_class.clearCache(u),
        };
      });
    }

    r.data = clear_cache;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetCacheSize(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    r = params.server_data.endpoint_class.getCacheSize(
      params?.request?.query?.appName,
    );
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnInvalidateEndpointCache(params) {
  let r = { data: undefined, code: 204 };
  try {
    const body = params?.request?.body || {};
    const endpointClass = params?.server_data?.endpoint_class;
    const idapp = body?.idapp;
    const environment = body?.environment;
    const idendpoint = body?.idendpoint;

    if (!endpointClass) {
      r.code = 500;
      r.data = { error: "Endpoint cache service not available." };
      return r;
    }

    if (!idapp && !idendpoint) {
      r.code = 400;
      r.data = { error: "'idapp' or 'idendpoint' is required." };
      return r;
    }

    let removed = 0;

    if (idendpoint) {
      removed += endpointClass.deleteEndpointByidEndpoint(idendpoint) || 0;
    }

    if (idapp) {
      removed += endpointClass.deleteEndpointsByIdApp(idapp, environment) || 0;
    }

    r.code = 200;
    r.data = {
      removed,
      criteria: {
        idapp,
        environment,
        idendpoint,
      },
    };
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointCacheStatus(params) {
  let r = { data: undefined, code: 204 };
  try {
    const query = params?.request?.query || {};
    const endpointClass = params?.server_data?.endpoint_class;
    const idapp = query?.idapp;
    const environment = query?.environment;

    if (!endpointClass) {
      r.code = 500;
      r.data = { error: "Endpoint cache service not available." };
      return r;
    }

    const internal = endpointClass?.internal_endpoint || {};
    const entries = [];

    for (const [urlKey, data] of Object.entries(internal)) {
      const p = data?.handler?.params;
      if (!p) {
        continue;
      }

      if (idapp && p.idapp !== idapp) {
        continue;
      }

      if (environment && p.environment !== environment) {
        continue;
      }

      entries.push({
        url_key: urlKey,
        idapp: p.idapp,
        idendpoint: p.idendpoint,
        app: p.app,
        environment: p.environment,
        resource: p.resource,
        method: p.method,
        handler: p.handler,
      });
    }

    r.code = 200;
    r.data = {
      total: entries.length,
      filters: { idapp, environment },
      entries,
    };
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetResponseCountStatus(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    r = params.server_data.endpoint_class.getResponseCountStatusCode(
      params?.request?.query?.appName,
    );
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointMigrate(params) {
  let r = { code: 200, data: undefined };
  try {
    const migrations = params.request.body;
    
    if (!Array.isArray(migrations)) {
      r.code = 400;
      r.data = { error: "Expected an array of objects." };
      return r;
    }

    const results = [];

    for (const item of migrations) {
      const { idendpoint, target_env } = item;
      
      if (!idendpoint || !target_env) {
        results.push({ idendpoint, target_env, status: "error", message: "Missing idendpoint or target_env" });
        continue;
      }

      try {
        const originalEndpoint = await getEndpointById(idendpoint);
        
        if (!originalEndpoint) {
          results.push({ idendpoint, target_env, status: "error", message: "Endpoint not found" });
          continue;
        }

        const data = originalEndpoint.toJSON ? originalEndpoint.toJSON() : originalEndpoint;

        if (data.environment === target_env) {
          results.push({ idendpoint, target_env, status: "ignored", message: "Already in target environment" });
          continue;
        }

        const upsertData = {
          ...data,
          environment: target_env,
          skipMcpNameUniqueness: true,
        };

        delete upsertData.idendpoint;
        delete upsertData.createdAt;
        delete upsertData.updatedAt;
        delete upsertData.rowkey;

        const upsertResult = await upsertEndpoint(upsertData);
        
        results.push({ 
          idendpoint, 
          target_env, 
          status: "success", 
          new_idendpoint: upsertResult.result.idendpoint,
          message: upsertResult.created
            ? "Migrated successfully"
            : "Endpoint replaced successfully in target environment"
        });

      } catch (err) {
        results.push({ idendpoint, target_env, status: "error", message: err.message });
      }
    }

    r.data = results;
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

/**
 * Búsqueda global de endpoints por texto libre (title, description, resource, keywords, opcionalmente code).
 * MCP tool: search_endpoints
 */
export async function fnEndpointSearch(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await searchEndpoints(params?.request?.body || {});
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

/**
 * Devuelve una matriz de versiones por endpoint (resource+method) y ambiente.
 * MCP tool: endpoint_versions_matrix
 */
export async function fnEndpointVersionsMatrix(params) {
  let r = { code: 200, data: undefined };
  try {
    const body = params?.request?.body || {};
    const {
      idendpoint,
      idapp,
      app,
      include_disabled = false,
      environments = ["dev", "qa", "prd"],
    } = body;

    const normalizedEnvs = Array.isArray(environments) && environments.length > 0
      ? environments.filter((env) => ["dev", "qa", "prd"].includes(env))
      : ["dev", "qa", "prd"];

    if (normalizedEnvs.length === 0) {
      r.code = 400;
      r.data = { error: "At least one valid environment is required (dev, qa, prd)." };
      return r;
    }

    const where = {
      environment: { [Op.in]: normalizedEnvs },
    };

    if (!include_disabled) {
      where.enabled = true;
    }

    let resolvedIdapp = idapp;

    if (!resolvedIdapp && typeof app === "string" && app.trim() !== "") {
      const appName = app.trim().toLowerCase();
      const appRecord = await Application.findOne({
        where: { app: appName },
        attributes: ["idapp", "app"],
      });

      if (!appRecord) {
        r.code = 404;
        r.data = { error: `Application '${appName}' not found.` };
        return r;
      }

      resolvedIdapp = appRecord.idapp;
    }

    if (idendpoint) {
      const selected = await getEndpointById(idendpoint);
      if (!selected) {
        r.code = 404;
        r.data = { error: `Endpoint '${idendpoint}' not found.` };
        return r;
      }

      const selectedRow = selected.toJSON ? selected.toJSON() : selected;
      where.resource = selectedRow.resource;
      where.method = selectedRow.method;

      if (!resolvedIdapp) {
        resolvedIdapp = selectedRow.idapp;
      }
    }

    if (resolvedIdapp) {
      where.idapp = resolvedIdapp;
    }

    const endpoints = await Endpoint.findAll({
      where,
      attributes: [
        "idendpoint",
        "idapp",
        "resource",
        "method",
        "environment",
        "createdAt",
        "updatedAt",
        "enabled",
      ],
      order: [["resource", "ASC"], ["method", "ASC"], ["environment", "ASC"]],
    });

    const idapps = [...new Set(endpoints.map((ep) => ep.idapp).filter(Boolean))];
    const apps = idapps.length > 0
      ? await Application.findAll({
        where: { idapp: { [Op.in]: idapps } },
        attributes: ["idapp", "app"],
      })
      : [];

    const appMap = new Map(apps.map((a) => [a.idapp, a.app]));
    const envOrder = new Map([["dev", 0], ["qa", 1], ["prd", 2]]);
    const grouped = new Map();

    for (const endpoint of endpoints) {
      const row = endpoint.toJSON ? endpoint.toJSON() : endpoint;
      const createdAt = row.createdAt ? new Date(row.createdAt).toISOString() : null;
      const updatedAt = row.updatedAt ? new Date(row.updatedAt).toISOString() : null;
      const groupKey = `${row.idapp}::${row.resource}::${row.method}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          idapp: row.idapp,
          app: appMap.get(row.idapp) || null,
          endpoint: row.resource,
          method: row.method,
          env: [],
          latest: null,
        });
      }

      const group = grouped.get(groupKey);
      group.env.push({
        env: row.environment,
        createdAt,
        updatedAt,
        idendpoint: row.idendpoint,
        enabled: row.enabled,
      });
    }

    const result = [...grouped.values()].map((group) => {
      group.env.sort((a, b) => (envOrder.get(a.env) ?? 99) - (envOrder.get(b.env) ?? 99));

      let latest = null;
      for (const item of group.env) {
        const ts = item.updatedAt || item.createdAt;
        if (!latest) {
          latest = { ...item };
          continue;
        }

        const latestTs = latest.updatedAt || latest.createdAt;
        if ((ts || "") > (latestTs || "")) {
          latest = { ...item };
        }
      }

      group.latest = latest;
      return group;
    });

    r.data = result;
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

/**
 * Devuelve únicamente el campo code (fuente) de un endpoint.
 * MCP tool: endpoint_get_code
 */
export async function fnEndpointGetCode(params) {
  let r = { code: 200, data: undefined };
  try {
    const idendpoint = params?.request?.query?.idendpoint || params?.request?.body?.idendpoint;
    const result = await getEndpointCode(idendpoint);
    r.data = result;
    r.code = result ? 200 : 404;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

/**
 * Ejecuta un endpoint internamente vía HTTP y devuelve el resultado.
 * Permite a agentes probar un endpoint sin construir peticiones HTTP externas.
 *
 * El agente debe proveer:
 *   - idendpoint: UUID del endpoint a ejecutar
 *   - app: nombre de la app (ej: "myapp")
 *   - environment: ambiente (dev / qa / prd)
 *   - payload: body JSON a enviar (para POST/PUT)
 *   - query_params: objeto con query string params (para GET)
 *   - bearer_token: token de autorización opcional
 *   - timeout_ms: timeout en ms (default 10000)
 *
 * MCP tool: execute_endpoint_test
 */
export async function fnEndpointTest(params) {
  let r = { code: 200, data: undefined };
  try {
    const classifyFailure = (statusCode, responseData) => {
      const message =
        typeof responseData === "string"
          ? responseData
          : responseData?.error || responseData?.message || JSON.stringify(responseData || {});
      const msg = String(message || "").toLowerCase();

      if (statusCode === 401 || msg.includes("requires a token") || msg.includes("authorization")) {
        return "auth_required";
      }
      if (statusCode === 406 || msg.includes("text/event-stream") || msg.includes("not acceptable")) {
        return "missing_accept_header";
      }
      if (
        msg.includes("missing parameter") ||
        msg.includes("required") ||
        msg.includes("cannot be empty") ||
        msg.includes("requerido") ||
        msg.includes("obligatorio")
      ) {
        return "missing_params";
      }
      if (msg.includes("not valid json") || msg.includes("unexpected token")) {
        return "invalid_json_or_appvar";
      }
      if (msg.includes("handler") && msg.includes("no es válido")) {
        return "invalid_handler";
      }
      if (statusCode >= 500) {
        return "server_error";
      }
      return "request_error";
    };

    const extractQueryFromDataTest = (data_test) => {
      const result = {};
      const queryRows = data_test?.query;
      if (!Array.isArray(queryRows)) {
        return result;
      }

      for (const row of queryRows) {
        if (!row || row.enabled !== true) {
          continue;
        }
        if (!row.key || String(row.key).trim() === "") {
          continue;
        }
        result[String(row.key)] = row.value == null ? "" : row.value;
      }
      return result;
    };

    const extractHeadersFromDataTest = (data_test, headers_test) => {
      const result = {};

      if (headers_test && typeof headers_test === "object" && !Array.isArray(headers_test)) {
        Object.assign(result, headers_test);
      }

      const headerRows = data_test?.headers;
      if (Array.isArray(headerRows)) {
        for (const row of headerRows) {
          if (!row || row.enabled !== true) {
            continue;
          }
          if (!row.key || String(row.key).trim() === "") {
            continue;
          }
          result[String(row.key)] = row.value == null ? "" : row.value;
        }
      }

      return result;
    };

    const extractPayloadFromDataTest = (data_test) => {
      const bodyCfg = data_test?.body;
      if (!bodyCfg || typeof bodyCfg !== "object") {
        return null;
      }

      const jsonCode = bodyCfg?.json?.code;
      if (jsonCode != null) {
        if (typeof jsonCode === "object") {
          return jsonCode;
        }
        if (typeof jsonCode === "string" && jsonCode.trim() !== "") {
          try {
            return JSON.parse(jsonCode);
          } catch (error) {
            return null;
          }
        }
      }

      return null;
    };

    const body = params?.request?.body || {};
    const {
      idendpoint,
      app,
      environment = "prd",
      resource,
      method = "GET",
      payload = null,
      query_params = {},
      bearer_token = null,
      timeout_ms = 10000,
    } = body;

    // Necesitamos resource y method — los tomamos del endpoint si no se proveen
    let resolvedResource = resource;
    let resolvedMethod = method;
    let resolvedApp = app;
    let endpointData = null;

    if (idendpoint && (!resolvedResource || !resolvedApp)) {
      const ep = await getEndpointById(idendpoint);
      if (!ep) {
        r.code = 404;
        r.data = { error: `Endpoint ${idendpoint} not found.` };
        return r;
      }
      const epData = ep.toJSON ? ep.toJSON() : ep;
      endpointData = epData;
      resolvedResource = resolvedResource || epData.resource;
      resolvedMethod = epData.method || resolvedMethod;

      // Obtener el nombre de la app desde idapp si no se provee
      if (!resolvedApp) {
        const { Application } = await import("../../../../../db/models.js");
        const appRecord = await Application.findByPk(epData.idapp, { attributes: ["app"] });
        resolvedApp = appRecord ? appRecord.app : null;
      }
    }

    // If caller provided app/resource/method without idendpoint, try to load endpoint metadata.
    if (!endpointData && resolvedApp && resolvedResource && resolvedMethod) {
      const found = await Endpoint.findOne({
        where: {
          environment,
          resource: resolvedResource,
          method: resolvedMethod,
        },
      });
      endpointData = found?.toJSON ? found.toJSON() : found;
    }

    if (!resolvedResource || !resolvedApp) {
      r.code = 400;
      r.data = { error: "Provide 'idendpoint' (auto-resolves app/resource) or explicit 'app' + 'resource' + 'method'." };
      return r;
    }

    // Construir URL interna: http://localhost:PORT/api/{app}{resource}/{environment}
    const internalPath = `/api/${String(resolvedApp)}${String(resolvedResource)}/${String(environment)}`;
    let url = internal_url_http(internalPath);

    // Auto-populate inputs from endpoint test metadata if caller omitted them.
    const autoQueryParams =
      query_params && typeof query_params === "object" && Object.keys(query_params).length > 0
        ? query_params
        : extractQueryFromDataTest(endpointData?.data_test);

    const autoPayload =
      payload !== null ? payload : extractPayloadFromDataTest(endpointData?.data_test);

    const autoHeaders = extractHeadersFromDataTest(
      endpointData?.data_test,
      endpointData?.headers_test,
    );

    // Añadir query params para GET
    if (autoQueryParams && typeof autoQueryParams === "object" && Object.keys(autoQueryParams).length > 0) {
      const qs = new URLSearchParams(
        Object.entries(autoQueryParams).map(([k, v]) => [k, String(v)])
      ).toString();
      url = `${url}?${qs}`;
    }

    const httpMethod = (resolvedMethod || "GET").toUpperCase();

    const headers = { ...autoHeaders };
    if (bearer_token) {
      headers["Authorization"] = `Bearer ${bearer_token}`;
    }

    if (
      autoPayload !== null &&
      ["POST", "PUT", "PATCH"].includes(httpMethod) &&
      !Object.keys(headers).some((k) => k.toLowerCase() === "content-type")
    ) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions = {
      method: httpMethod,
      headers,
      signal: AbortSignal.timeout(timeout_ms),
    };

      let serializedBody = null;

    if (autoPayload !== null && ["POST", "PUT", "PATCH"].includes(httpMethod)) {
      const ctKey = Object.keys(headers).find((k) => k.toLowerCase() === "content-type");
      const ct = ctKey ? String(headers[ctKey]).toLowerCase() : "application/json";
        serializedBody = ct.includes("application/json")
        ? JSON.stringify(autoPayload)
        : String(autoPayload);
        fetchOptions.body = serializedBody;
    }

    const t0 = Date.now();
    const response = await fetch(url, fetchOptions);
    const elapsed = Date.now() - t0;

    let responseData;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    r.code = 200;
    r.data = {
      tested_url: url,
      method: httpMethod,
      status_code: response.status,
      response_time_ms: elapsed,
      success: response.status >= 200 && response.status < 300,
      error_type: response.status >= 200 && response.status < 300
        ? null
        : classifyFailure(response.status, responseData),
      resolved_inputs: {
        from_data_test: {
          query_params: !query_params || Object.keys(query_params || {}).length === 0,
          payload: payload === null,
        },
        query_params: autoQueryParams,
        payload: autoPayload,
        headers,
        serialized_body: serializedBody,
      },
      response: responseData,
    };
  } catch (error) {
    console.log(error);
    const isTimeout = error?.name === "TimeoutError" || error?.code === "ABORT_ERR";
    r.code = isTimeout ? 504 : 500;
    r.data = {
      error: isTimeout ? "Request timed out." : error.message,
      error_type: isTimeout ? "timeout" : "tool_runtime_error",
    };
  }
  return r;
}

/**
 * Restaura un endpoint desde un respaldo (backup) específico.
 * MCP tool: endpoint_restore_version
 */
export async function fnEndpointRestoreBackup(params) {
  let r = { code: 200, data: undefined };
  try {
    const idbackup = params?.request?.query?.idbackup || params?.request?.body?.idbackup;
    r.data = await restoreEndpointFromBackup(idbackup);
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

/**
 * Elimina un endpoint por su idendpoint.
 * MCP tool: endpoint_delete
 */
export async function fnEndpointDelete(params) {
  let r = { code: 200, data: undefined };
  try {
    const idendpoint = params?.request?.query?.idendpoint || params?.request?.body?.idendpoint;
    if (!idendpoint) {
      r.code = 400;
      r.data = { error: "idendpoint is required" };
      return r;
    }
    const success = await deleteEndpoint(idendpoint);
    r.data = { success };
    r.code = success ? 200 : 404;
  } catch (error) {
    console.log(error);
    r.data = { error: error.message };
    r.code = 500;
  }
  return r;
}

