import {
  upsertEndpoint,
  getEndpointById,
  getEndpointByIdApp,
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
    r.data = await upsertEndpoint(params.request.body);
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

    r.data = await getEndpointById(params.request.query.idapp, raw);
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
