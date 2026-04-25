import {
  upsertEndpoint,
  getEndpointById,
  getEndpointByIdApp,
  getEndpointCatalogByIdApp,
  getEndpointSourceSummaryById,
} from "../../../../../db/endpoint.js";

import { getEndpointBackupByIdEndpoint } from "../../../../../db/endpoint_backup.js";

export async function fnGetEndpointBackupByIdEndpoint(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getEndpointBackupByIdEndpoint(params.request.query.idendpoint);
    r.code = 200;
  } catch (error) {
    console.log(error);
    r.data = error;
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

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointGetById(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    r.data = await getEndpointById(params.request.query.idendpoint, raw);
    r.code = 200;
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointGetByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    r.data = await getEndpointByIdApp(params.request.query.idapp, raw);
    r.code = 200;
  } catch (error) {
    console.log(error);

    r.data = error;
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
