import { Application, Endpoint } from "./models.js";
import { createFunction } from "../handler/jsFunction.js";
import { upsertEndpoint } from "./endpoint.js";
import { default_apps } from "./default/index.js";
import { v4 as uuidv4 } from "uuid";

export const getAppWithEndpoints = async (
  /** @type {any} */ where,
  /** @type {boolean} */ raw
) => {
  return Application.findAll({
    where: where,
    attributes: [
      "idapp",
      "app",
      "enabled",
      "vars",
      "description",
      "rowkey",
      "params",
    ],
    include: {
      model: Endpoint,
      as: "endpoints",
      //required: true, // INNER JOIN
      attributes: [
        "idendpoint",
        "enabled",
        "access",
        "ctrl",
        "environment",
        "resource",
        "method",
        "handler",
        "cors",
        "code",
        "description",
        "headers_test",
        "data_test",
        "rowkey",
        "latest_updater",
        "cache_time",
      ],
      order: [
        ["resource", "ASC"],
        ["environment", "ASC"],
        ["method", "ASC"],
      ],
    },
    raw: raw,
    nest: false,
  });
};

// READ
export const getAppById = async (
  /** @type {import("sequelize").Identifier} */ idapp,
  raw = false
) => {
  try {
    const app = await getAppWithEndpoints({ idapp: idapp }, raw);

    return app;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};

export const getAppByName = async (
  /** @type {String} */ appname,
  raw = false
) => {
  try {
    const app = await getAppWithEndpoints({ app: appname }, raw);
    return app;
  } catch (error) {
    console.error("Error retrieving app:", error);
    throw error;
  }
};

export const getAllApps = async () => {
  try {
    //const apps = await Application.findAll({ attributes: ["idapp", "app"] });
    const apps = await Application.findAll();
    return apps;
  } catch (error) {
    console.error("Error retrieving apps:", error);
    throw error;
  }
};

// UPSERT
export const upsertApp = async (
  /** @type {import("sequelize").Optional<any, string>} */ appData,
  /** @type {undefined} */ transaction
) => {
  try {
    let [app] = await Application.upsert(appData, transaction);

    //console.log('XXXX>>> [app, create] ', app, create);

    //let data = app.dataValues;

    return app;
  } catch (error) {
    console.error("Error performing UPSERT on app:", error);
    throw error;
  }
};

/**
 * @param {any} app_name
 * @param {{enabled: any;environment: any;method: any;}} endpointData
 * @param {any} appVarsEnv
 */
export function getApiHandler(app_name, endpointData, appVarsEnv) {
  let returnHandler = {};
  returnHandler.params = endpointData;

  try {
    appVarsEnv =
      typeof appVarsEnv !== "object"
        ? JSON.parse(appVarsEnv)
        : appVarsEnv ?? {};

    let appVars = appVarsEnv[endpointData.environment];

    if (endpointData.enabled) {
      // @ts-ignore
      returnHandler.params.code = returnHandler.params.code || "";

      if (appVars && typeof appVars === "object") {
        const props = Object.keys(appVars);

        for (let i = 0; i < props.length; i++) {
          const prop = props[i];

          switch (typeof appVars[prop]) {
            case "string":
              // @ts-ignore
              returnHandler.params.code = returnHandler.params.code.replace(
                prop,
                appVars[prop]
              );
              break;
            case "object":
              // @ts-ignore
              returnHandler.params.code = returnHandler.params.code.replace(
                '"' + prop + '"',
                JSON.stringify(appVars[prop])
              );

              // @ts-ignore
              returnHandler.params.code = returnHandler.params.code.replace(
                prop,
                JSON.stringify(appVars[prop])
              );
              break;
          }
        }
      }

      // @ts-ignore
      if (returnHandler.params.handler == "JS") {
        // @ts-ignore
        returnHandler.params.jsFn = createFunction(
          returnHandler.params.code,
          appVars
        );
      }
      returnHandler.message = "";
      returnHandler.status = 200;
    } else {
      returnHandler.message = `Method ${endpointData.method} Unabled`;
      returnHandler.status = 404;
      //console.log(endpointData);
    }
  } catch (error) {
    // @ts-ignore
    returnHandler.message = error.message;
    returnHandler.status = 505;
    console.trace(error);
  }

  return returnHandler;
}

export const saveAppWithEndpoints = async (app) => {
  try {
    let data = await upsertApp(app);

    if (data.idapp) {
      // Inserta / Actualiza los endpoints
      let promises_upsert = app.endpoints.map(
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
      return { app: data, endpoints: result_endpoints };
    } else {
      throw new Error("App could not be saved");
    }
  } catch (error) {
    throw error;
  }
};

export const defaultApps = async () => {
  let result = default_apps.map(async (app) => {
    try {
      return { app: app, result: await saveAppWithEndpoints(app) };
    } catch (error) {
      return { app: app, error: error };
    }
  });

  return result;
};
