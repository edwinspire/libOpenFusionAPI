import { getUserPasswordTokenFromRequest } from "../../../../auth.js";
import { GenTokenJWT } from "../../../../functionVars.js";

import {
  upsertApiKey,
  getApiKeyById,
  getAllApiKeys,
  deleteApiKey,
  getApiKeyByFilters,
} from "../../../../../db/apikey.js";


export async function fnUpsertApiKey(params) {
  let r = { data: undefined, code: 204 };
  // TODO: controlar que solo el usuario pueda cambiar su propia clave y no la de otros usuarios.
  try {
    let ak = params?.request?.body;
    if (!ak) {
      r.data = "No se proporcionaron datos para la ApiKey";
      r.code = 400;
      return r;
    }

    if (!ak.idapp) {
      r.data = "No se proporcionaron datos para la ApiKey";
      r.code = 400;
      return r;
    }

    if (!ak.idclient) {
      r.data = "No se proporcionaron datos para la ApiKey";
      r.code = 400;
      return r;
    }


    ak.enabled = true;
    ak.startAt = new Date(ak.startAt || new Date());
    ak.endAt = new Date(ak.endAt || new Date(ak.startAt.getTime() + 30 * 24 * 60 * 60 * 1000)); // 1 month

    const raw_key = params?.request?.openfusionapi?.handler?.params?.jwt_key;

    if (!raw_key) {
      r.data = "Application jwt_key is not created.";
      r.code = 400;
      return r;
    }

    const key = raw_key;

    ak.token = 'OFAPI_KEY@' + GenTokenJWT({ apikey: { idapp: ak.idapp, idclient: ak.idclient } }, ak.startAt, ak.endAt, key);

    let data = await upsertApiKey(ak);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetApiKeyById(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await getApiKeyById(params?.request?.query?.idkey);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetAllApiKeys(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await getAllApiKeys();

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnDeleteApiKey(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await deleteApiKey(params?.request?.query?.idkey);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetApiKeyByFilters(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await getApiKeyByFilters(
      params?.request?.query?.idapp,
      params?.request?.query?.idclient,
      params?.request?.query?.endAt,
      params?.request?.query?.startAt,
      params?.request?.query?.enabled,
      params?.request?.query?.token
    );

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}



