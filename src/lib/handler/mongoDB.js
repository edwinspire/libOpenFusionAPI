import { functionsVars } from "../server/functionVars.js";
import mongoose from "mongoose";

export const getMongoDBHandlerParams = (code) => {
  let paramsMongo = {};
  try {
    paramsMongo = JSON.parse(code);
  } catch (error) {
    console.error(
      "getMongoDBHandlerParams: Error al parsear el código JSON: " + code
    );
  }

  if (!paramsMongo.config) {
    // Configuración de la conexión
    paramsMongo.config = {
      host: "localhost", // Dirección del servidor MongoDB
      port: 27017, // Puerto por defecto de MongoDB
      dbName: "my_db", // Nombre de la base de datos
      user: "", // Usuario (opcional, si la autenticación está habilitada)
      pass: "", // Contraseña (opcional)
    };
  }

  if (!paramsMongo.config.options) {
    // Opciones adicionales de configuración
    paramsMongo.config.options = {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    };
  }

  return paramsMongo;
};


let currentConfigHash = "";

export const mongodbFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    if (!method.jsFn) {
      throw new Error("Function 'jsFn' is not defined in the method configuration.");
    }

    let paramsMongo = getMongoDBHandlerParams(method.code);

    const newConfigHash = JSON.stringify({
      host: paramsMongo.config.host,
      port: paramsMongo.config.port,
      dbName: paramsMongo.config.dbName,
      user: paramsMongo.config.user,
    });

    if (mongoose.connection.readyState === 1) {
      if (currentConfigHash !== newConfigHash) {
        console.log("Switching MongoDB connection...");
        await mongoose.disconnect();
      }
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(
        `mongodb://${paramsMongo.config.host}:${paramsMongo.config.port}`,
        {
          dbName: paramsMongo.config.dbName,
          user: paramsMongo.config.user || undefined,
          pass: paramsMongo.config.pass || undefined,
          ...paramsMongo.config.options, // Esto ahora tomará las opciones por defecto si config.options estaba vacío
        }
      );
      currentConfigHash = newConfigHash;
    }

    let f = method.jsFn;

    let result_fn = await f(
      functionsVars($_REQUEST_, response, method.environment)
    );

    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi?.lastResponse?.hash_request
    ) {
      response.openfusionapi.lastResponse.data = result_fn.data;
    }

    if (result_fn.headers && result_fn.headers.size > 0) {
      for (const [key, value] of result_fn.headers) {
        //console.log(`${key}: ${value}`);
        response.header(key, value);
      }
    }

    response.code(200).send(result_fn.data);
  } catch (error) {
    //setCacheReply(response, error);
    console.trace(error);
    response
      .code(error.statusCode == null ? 500 : error.statusCode)
      .send(error);
  }
};
