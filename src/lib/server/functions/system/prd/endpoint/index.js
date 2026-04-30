import {
  upsertEndpoint,
  getEndpointById,
  getEndpointByIdApp,
  getEndpointCatalogByIdApp,
  getEndpointSourceSummaryById,
  searchEndpoints,
  getEndpointCode,
  restoreEndpointFromBackup,
} from "../../../../../db/endpoint.js";

import { getEndpointBackupByIdEndpoint, getEndpointBackupByIdEndpointLightweight } from "../../../../../db/endpoint_backup.js";
import { Endpoint } from "../../../../../db/models.js";
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

        const existing = await Endpoint.findOne({
          where: {
            idapp: data.idapp,
            environment: target_env,
            resource: data.resource,
            method: data.method
          }
        });

        if (existing) {
          results.push({ idendpoint, target_env, status: "success", message: "Endpoint already exists in target environment. Ok." });
          continue;
        }

        delete data.idendpoint;
        delete data.createdAt;
        delete data.updatedAt;
        
        data.environment = target_env;

        const upsertResult = await upsertEndpoint(data);
        
        results.push({ 
          idendpoint, 
          target_env, 
          status: "success", 
          new_idendpoint: upsertResult.result.idendpoint,
          message: "Migrated successfully" 
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

    if (idendpoint && (!resolvedResource || !resolvedApp)) {
      const ep = await getEndpointById(idendpoint);
      if (!ep) {
        r.code = 404;
        r.data = { error: `Endpoint ${idendpoint} not found.` };
        return r;
      }
      const epData = ep.toJSON ? ep.toJSON() : ep;
      resolvedResource = resolvedResource || epData.resource;
      resolvedMethod = epData.method || resolvedMethod;

      // Obtener el nombre de la app desde idapp si no se provee
      if (!resolvedApp) {
        const { App } = await import("../../../../../db/models.js");
        const appRecord = await App.findByPk(epData.idapp, { attributes: ["app"] });
        resolvedApp = appRecord ? appRecord.app : null;
      }
    }

    if (!resolvedResource || !resolvedApp) {
      r.code = 400;
      r.data = { error: "Provide 'idendpoint' (auto-resolves app/resource) or explicit 'app' + 'resource' + 'method'." };
      return r;
    }

    // Construir URL interna: http://localhost:PORT/api/{app}{resource}/{environment}
    const internalPath = `/api/${resolvedApp.toLowerCase()}${resolvedResource.toLowerCase()}/${environment.toLowerCase()}`;
    let url = internal_url_http(internalPath);

    // Añadir query params para GET
    if (query_params && typeof query_params === "object" && Object.keys(query_params).length > 0) {
      const qs = new URLSearchParams(
        Object.entries(query_params).map(([k, v]) => [k, String(v)])
      ).toString();
      url = `${url}?${qs}`;
    }

    const httpMethod = (resolvedMethod || "GET").toUpperCase();

    const headers = { "Content-Type": "application/json" };
    if (bearer_token) {
      headers["Authorization"] = `Bearer ${bearer_token}`;
    }

    const fetchOptions = {
      method: httpMethod,
      headers,
      signal: AbortSignal.timeout(timeout_ms),
    };

    if (payload !== null && ["POST", "PUT", "PATCH"].includes(httpMethod)) {
      fetchOptions.body = JSON.stringify(payload);
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
      response: responseData,
    };
  } catch (error) {
    console.log(error);
    const isTimeout = error?.name === "TimeoutError" || error?.code === "ABORT_ERR";
    r.code = isTimeout ? 504 : 500;
    r.data = { error: isTimeout ? "Request timed out." : error.message };
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

