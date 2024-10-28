import dbsequelize from "./sequelize.js";
import { Application, Endpoint } from "./models.js";
import { createFunction } from "../handler/jsFunction.js";
import { app_default } from "./default_values.js";
import {defaults} from "./default/index.js";

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

export const defaultApps = async () => {
  let options = {
    updateOnDuplicate: ["idapp"],
  };

  if (dbsequelize.getDialect() == "mssql") {
    options = {
      // @ts-ignore
      onDuplicate: true, // Opción válida para mssql
    };
  }

  let apps = defaults.map((app) => {
    return {
      idapp: app.idapp,
      app: app.app,
      enabled: app.enabled,
      vars: app.vars,
      description: app.description,
      rowkey: 0,
      params: app.params,
    };
  });

  try {
    await Application.bulkCreate(apps, options);

    console.log("Bulk upsert completado con éxito.");
  } catch (error) {
    console.error("Error durante el bulk upsert:", error);
  }
};
