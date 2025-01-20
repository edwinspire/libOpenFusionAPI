import { Application, Endpoint } from "./models.js";
import { createFunction } from "../handler/utils.js";
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

    return app;
  } catch (error) {
    console.error("Error performing UPSERT on app:", error);
    throw error;
  }
};


export const saveAppWithEndpoints = async (app) => {
  try {
    let data = await upsertApp(app);

    if (data.idapp) {
      // Inserta / Actualiza los endpoints
      let promises_upsert = app.endpoints.map((ep) => {
        ep.idapp = data.idapp;
        if (!ep.idendpoint) {
          ep.idendpoint = uuidv4();
        }
        if (!ep.handler) {
          ep.handler = "";
        }

        return upsertEndpoint(ep);
      });

      let result_endpoints = await Promise.allSettled(promises_upsert);
      // console.log("result_endpoints ==>>>", result_endpoints);
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
