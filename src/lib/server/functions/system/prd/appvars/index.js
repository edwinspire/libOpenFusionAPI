import {
  upsertAppVar,
  deleteAppVar,
  getAppVarsByIdApp,
} from "../../../../../db/appvars.js";

export async function fnUpsertAppVar(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await upsertAppVar(params.request.body);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

//
export async function fnDeleteAppVar(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await deleteAppVar(params.request.query.idvar);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetAppVarsByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getAppVarsByIdApp(params.request.query.idapp);
    r.code = 200;
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
  }
  return r;
}
