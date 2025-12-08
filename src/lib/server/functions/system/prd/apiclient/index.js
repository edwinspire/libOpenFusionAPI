import { getUserPasswordTokenFromRequest } from "../../../../utils.js";
import { createApiClient } from "../../../../../db/apiclient.js";

export async function fnAPIToken(params) {
  //TODO:  Esta Funcíon debe generar el Token para los usuarios externos - Token para las API
  let r = { code: 200, data: undefined };
  try {
    let auth_data = getUserPasswordTokenFromRequest(params.request);

    r.data = false;
    r.code = 200;
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnCreateApiClient(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await createApiClient(params?.request?.body);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}
