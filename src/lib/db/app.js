import { Application, Endpoint } from "./models.js";
import { createAppLog } from "./app_backup.js";
import { deleteEndpoint } from "./endpoint.js";
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
    if (app.idapp) {
      // Obtener la app actual
      let array_current_app = await getAppById(app.idapp, false);

      if (array_current_app.length > 0) {
        let current_app = array_current_app[0];

        // Crear el backup de la app
        await createAppLog({ idapp: app.idapp, data: current_app });

        // Buscar los endpoints que no están en la app actual
        let endpoints_to_delete = current_app.endpoints.filter(
          (ep) => !app.endpoints.find((e) => e.idendpoint === ep.idendpoint)
        );

        // Eliminar los endpoints que no están en la app actual
        let promises_delete = endpoints_to_delete.map((ep) => {
          return deleteEndpoint(ep.idendpoint);
        });
        await Promise.allSettled(promises_delete);
      }
    }
  } catch (error) {
    console.error("Error creating backup app:", error);
  }

  try {
    // Actualizar la app y sus endpoints
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

        return Endpoint.upsert(ep, { returning: true });
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
