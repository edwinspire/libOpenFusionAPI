import { login } from "../../../../db/user.js";
import { getAllHandlers } from "../../../../db/handler.js";
import { getAllMethods } from "../../../../db/method.js";
import { getAllApps, getAppById, upsertApp } from "../../../../db/app.js";
import { v4 as uuidv4 } from "uuid";
import { upsertEndpoint } from "../../../../db/endpoint.js";

export async function fnDemo(
  // @ts-ignore
  /** @type {any} */ req,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  let r = { code: 204, data: undefined };
  try {
    // @ts-ignore
    r.data = { demo: "demo" };
    r.code = 200;
    //res.code(200).json({ demo: 'demo' });
  } catch (error) {
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}


/**
 * @param {{ body: { username: string; password: string; }; }} req
 * @param {{ set: (arg0: string, arg1: any) => void; code: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} res
 */
export async function fnLogin(req, data, res) {
  let r = { code: 204, data: undefined };
  try {
    let user = await login(req.body.username, req.body.password);

    res.header("OFAPI_TOKEN", '');

    if (user.login) {
      res.header("OFAPI_TOKEN", user.token);
      //res.code(200).json(user);
      r.data = user;
      r.code = 200;
    } else {
      //			res.code(401).json(user);
      r.data = user;
      r.code = 401;
    }
  } catch (error) {
    //console.log(error);
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

/**
 * @param {{ body: { appname: string; username: string; password: string; }; }} req
 * @param {{ set: (arg0: string, arg1: string) => void; code: (arg0: number) => { (): any; new (): any; json: { (arg0: { token?: string; error?: any; }): void; new (): any; }; }; }} res
 */
export async function fnToken(req, data, res) {
return fnLogin(req, data, res);
}

/**
 * @param {any} req
 * @param {{ set: (arg0: string, arg1: undefined) => void; code: (arg0: number) => { (): any; new (): any; json: { (arg0: { logout?: boolean; error?: any; }): void; new (): any; }; }; }} res
 */
export async function fnLogout(req, res) {
  let r = { data: undefined, code: 204 };
  try {
    // TODO: ver la forma de hacer un logout correctamente e invalide el token
    res.set("OFAPI_TOKEN", undefined);

    
    // @ts-ignore
    r.data = {
      logout: true,
    };
    r.code = 200;
  } catch (error) {
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

/**
 * @param {any} req
 * @param {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} res
 */
export async function fnGetHandler(req, res) {
  let r = { code: 204, data: undefined };
  try {
    const hs = await getAllHandlers();

    //res.code(200).json(hs);
    // @ts-ignore
    r.data = hs;
    r.code = 200;
  } catch (error) {
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

/**
 * @param {any} req
 * @param {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} res
 */
export async function fnGetMethod(req, res) {
  let r = { code: 204, data: undefined };
  try {
    const methods = await getAllMethods();

    //res.code(200).json(methods);
    // @ts-ignore
    r.data = methods;
    r.code = 200;
  } catch (error) {
    // @ts-ignore
    res.code(500).json({ error: error.message });
  }
  return r;
}

/**
 * @param {any} req
 * @param {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnGetEnvironment(req, res) {
  let r = { code: 204, data: undefined };
  try {
    let env = [
      { id: "dev", text: `Development` },
      { id: "qa", text: `Quality` },
      { id: "prd", text: `Production` },
    ];

    //res.code(200).json(env);
    r.code = 200;
    // @ts-ignore
    r.data = env;
  } catch (error) {
    // @ts-ignore
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
}

/**
 * @param {any} req
 * @param {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnGetApps(req, res) {
  let r = { code: 204, data: undefined };
  try {
    const apps = await getAllApps();

    //res.code(200).json(apps);
    // @ts-ignore
    r.data = apps;
    r.code = 200;
  } catch (error) {
    // @ts-ignore
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
}

/**
 * @param {any} req
 * @param {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnGetAppById(req, res) {
  let r = { code: 200, data: undefined };
  try {
    let raw = !req.query.raw || req.query.raw == "false" ? false : true;

    //console.log(req.params, req.query, raw);

    // @ts-ignore
    r.data = await getAppById(req.query.idapp, raw);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

/**
 * @param {any} req
 * @param {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: { id: string; text: string; }[]): void; new (): any; }; }; }} res
 */
export async function fnSaveApp(req, res) {
  let r = { data: undefined, code: 204 };
  try {
    //		console.log(req.params, req.body);

    // Agrega primero los datos de la app
    // @ts-ignore
    let data = await upsertApp(req.body);

    //		console.log('upsertApp:::::: ', data);

    if (data.idapp) {
      // Inserta / Actualiza los endpoints
      let promises_upsert = req.body.endpoints.map(
        (/** @type {import("sequelize").Optional<any, string>} */ ep) => {
          ep.idapp = data.idapp;
          if (!ep.idendpoint) {
            ep.idendpoint = uuidv4();
          }
          if (!ep.handler) {
            ep.handler = "";
          }

          return upsertEndpoint(ep);
        }
      );

      let result_endpoints = await Promise.allSettled(promises_upsert);
      console.log("result_endpoints ==>>>", result_endpoints);
      //TODO: mejorar el retorno del upsert de lo endpoints
    }

    //		res.code(200).json(data);
    r.data = data;
    r.code = 200;
  } catch (error) {
    //console.log(error);
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}
