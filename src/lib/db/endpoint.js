import { Endpoint } from "./models.js";
//import { endpoins_default } from "./default_values.js";
//import PromiseSequence from "@edwinspire/sequential-promises";
//import { defaults } from "./default/index.js";

export const upsertEndpoint = async (
  /** @type {import("sequelize").Optional<any, string>} */ data
) => {
  try {
    const [result, created] = await Endpoint.upsert(data, { returning: true });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getEndpointById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint
) => {
  try {
    const endpoint = await Endpoint.findByPk(idendpoint);
    return endpoint;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const getAllEndpoints = async () => {
  try {
    const endpoints = await Endpoint.findAll();
    return endpoints;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

// DELETE
export const deleteEndpoint = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint
) => {
  try {
    const ep = await Endpoint.findByPk(idendpoint);
    if (ep) {
      await ep.destroy();
      return true; // Deletion successful
    }
    return false; // User not found
  } catch (error) {
    console.error("Error deleting idendpoint:", error);
    throw error;
  }
};

// READ
export const getEndpointByApp = async (
  /** @type {import("sequelize").Identifier | undefined} */ appname
) => {
  let list_fields = [
    "idendpoint",
    "enabled",
    "access",
    "method",
    "handler",
    "cache_time",
    "code",
    "environment",
    "resource",
    "cors",
    "description",
    "headers_test",
    "data_test",
    "ctrl",
    "latest_updater",
    "rowkey",
  ];

  try {
    //const endpoints = await Endpoint.findAll({attributes: list_fields, where: { appname: appname } });
    const endpoints = await Endpoint.findAll({ where: { appname: appname } });
    return endpoints;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

/*
export const defaultEndpoints = async () => {
  try {
    let app_endpoints = defaults.map((app) => {
      return app.endpoints.map((endpoint) => {
        endpoint.idapp = app.idapp;
        return endpoint;
      });
    });

    let endpoints = app_endpoints.flat();

    //console.log(app_endpoints, endpoints);

    await PromiseSequence.ByBlocks(
      async (
         element
      ) => {
        let o;
        try {
          o = await Endpoint.findOrCreate({
            where: {
              idapp: element.idapp,
              environment: element.environment,
              resource: element.resource,
              method: element.method,
            }, // Campos para la cláusula WHERE
            // @ts-ignore
            defaults: {
              code: element.code,
              handler: element.handler,
              access: element.access,
              ctrl: element.ctrl,
              cors: element.cors,
              cache_time: element.cache_time,
              data_test: element.data_test,
              enabled: element.enabled,
            }, // Campos para actualizar si se encuentra
          });
        } catch (error) {
          o = error;
        }
        return o;
      },
      endpoints,
      1
    );

    //	console.log('=====>>>> demoEndpoints >>==', out);
  } catch (error) {
    console.error("Error durante el demoEndpoints:", error);
  }
};
*/

export const bulkCreateEndpoints = (
  /** @type {readonly import("sequelize").Optional<any, string>[]} */ list_endpoints
) => {
  // Campos que se utilizarán para verificar duplicados (en este caso, todos excepto 'rowkey' y 'idendpoint')
  //const uniqueFields = ['idapp', 'namespace', 'name', 'version', 'environment', 'method'];
  // OJO: No se pudo tener un bulk upsert
  return Endpoint.bulkCreate(list_endpoints, {
    ignoreDuplicates: true,
    //updateOnDuplicate: uniqueFields
  });
};
