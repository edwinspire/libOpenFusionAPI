import { listFunctionsVars } from "../../../functionVars.js";
import { version } from "../../../version.js";
import  dbsequelize  from "../../../../db/sequelize.js";

export * from "./user/index.js";
export * from "./logs/index.js";
export * from "./method/index.js";
export * from "./app/index.js";
export * from "./apiclient/index.js";
export * from "./appvars/index.js";
export * from "./endpoint/index.js";
export * from "./interval_tasks/index.js";
export * from "./bots/index.js";
export * from "./apikey/index.js";
export * from "./handler/index.js";

export async function fnListFnVarsHandlerJS(params) {
  let r = { code: 204, data: undefined };
  try {
    let fnVars = listFunctionsVars();
    let fnResult = {};
    let keys = Object.keys(fnVars).sort();

    for (let index = 0; index < keys.length; index++) {
      const k = keys[index];
      fnResult[k] = fnVars[k];
    }

    r.data = fnResult;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnDemo(/** @type {any} */ params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = { demo: "demo" };
    r.code = 200;
    //res.code(200).json({ demo: 'demo' });
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetEnvironment(params) {
  let r = { code: 204, data: undefined };
  try {
    let env = [
      { id: "dev", text: `Development` },
      { id: "qa", text: `Quality` },
      { id: "prd", text: `Production` },
    ];

    r.code = 200;

    r.data = env;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetServerVersion(params) {
  let r = { code: 204, data: undefined };
  try {
    r.code = 200;
    r.data = { version: version, ddbb: dbsequelize.getDialect() };
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnFunctionNames(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    const environment = params?.request?.query?.environment;
    const appName = params?.request?.query?.appName;

    if (!environment || !appName) {
      r.code = 400;
    } else if (
      params &&
      params.server_data &&
      environment &&
      appName
    ) {
      const endpointClass = params.server_data.endpoint_class;
      const fnRegistry = endpointClass?.fnLocal || endpointClass?.getFnNames?.() || {};
      const envRegistry = fnRegistry?.[environment] || {};

      const publicFns = Object.keys(envRegistry.public || {});
      const appFns = Object.keys(envRegistry[appName] || {});

      r.data = [...new Set([...publicFns, ...appFns])];
    }
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}


