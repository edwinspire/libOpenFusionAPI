import { login } from "../../../../db/user.js";
//import { getAPIToken } from "../../../../db/api_user.js";
import { getAllHandlers } from "../../../../db/handler.js";
import { getAllMethods } from "../../../../db/method.js";
import { getAllApps, getAppById, upsertApp } from "../../../../db/app.js";
import { v4 as uuidv4 } from "uuid";
import { upsertEndpoint } from "../../../../db/endpoint.js";

export async function fnDemo(
  // @ts-ignore
  /** @type {any} */ params
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

export async function fnLogin(params) {
  let r = { code: 204, data: undefined };
  try {
    let user = await login(
      params.request.body.username,
      params.request.body.password
    );

    //res.header("OFAPI-TOKEN", '');
    params.reply.cookie("OFAPI-TOKEN", "");

    if (user.login) {
      //res.header("OFAPI-TOKEN", user.token);

      let aut = `Bearer ${user.token}`;
      params.reply.header("Authorization", aut);
      params.reply.cookie("OFAPI-TOKEN", user.token);

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

export async function fnToken(params) {
  return fnLogin(params.request, params.data_user, params.reply);
}

export async function fnLogout(params) {
  let r = { data: undefined, code: 204 };
  try {
    // TODO: ver la forma de hacer un logout correctamente e invalide el token
    params.reply.set("OFAPI-TOKEN", undefined);

    /*
		res.code(200).json({
			logout: true
		});
		*/
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

export async function fnGetHandler(params) {
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

export async function fnGetMethod(params) {
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

export async function fnGetEnvironment(params) {
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

export async function fnGetApps(params) {
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

export async function fnGetAppById(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    //console.log(req.params, req.query, raw);

    // @ts-ignore
    r.data = await getAppById(params.request.query.idapp, raw);
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

export async function fnSaveApp(params) {
  let r = { data: undefined, code: 204 };
  try {
    //		console.log(req.params, req.body);

    // Agrega primero los datos de la app
    // @ts-ignore
    let data = await upsertApp(params.request.body);

    //		console.log('upsertApp:::::: ', data);

    if (data.idapp) {
      // Inserta / Actualiza los endpoints
      let promises_upsert = params.request.body.endpoints.map(
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

export async function fnFunctionNames(params) {
  let r = { data: undefined, code: 204 };
  try {
    console.log("\n\n\n", params.server_data);

    // req.query && req.query.appName && req.query.environment
    /*
    for (const clave in this._fnEnvironment) {
      if (typeof this._fnEnvironment[clave] === "object") {
        this._fnEnvironmentNames[clave] = [];
        Object.keys(this._fnEnvironment[clave]).forEach((llave) => {
          // if (llave !== "public") {
          this._fnEnvironmentNames[clave][llave] = Object.keys(
            this._fnEnvironment[clave][llave]
          );
          //          }
        });
      } else {
        this._fnEnvironmentNames[clave] = this._fnEnvironment[clave];
      }
    }

    console.log("Llega", this._fnEnvironment);
*/

    //		res.code(200).json(data);
    r.data = [];
    r.code = 200;

    if (!params.request.query.environment || !params.request.query.appName) {
      r.code = 400;
    } else if (
      params &&
      params.server_data &&
      params.request.query.appName &&
      params.request.query.environment
    ) {
      if (
        params.server_data.env_function_names &&
        params.server_data.env_function_names[params.request.query.environment]
      ) {
        let public_fns =
          params.server_data.env_function_names[
            params.request.query.environment
          ]["public"]  || [];
        let app_fns =
          params.server_data.env_function_names[
            params.request.query.environment
          ][params.request.query.appName] || [];

          // Une las dos matrices eliminando duplicados
        r.data = [...new Set([...public_fns, ...app_fns])];
      }
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
