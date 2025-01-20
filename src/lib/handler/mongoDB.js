import $_UFETCH_ from "@edwinspire/universal-fetch";
import $_SECUENTIAL_PROMISES_ from "@edwinspire/sequential-promises";
import { GenToken, getInternalURL, fetchOFAPI } from "../server/utils.js";
import { setCacheReply, createFunction } from "./utils.js";
import mongoose from "mongoose";

export const getMongoDBHandlerParams = (code) => {
  try {
    let paramsMongo = JSON.parse(code);

    if (!paramsMongo.connectionConfig) {
      // Configuración de la conexión
      paramsMongo.connectionConfig = {
        host: "localhost", // Dirección del servidor MongoDB
        port: 27017, // Puerto por defecto de MongoDB
        dbName: "mi_base_de_datos", // Nombre de la base de datos
        user: "", // Usuario (opcional, si la autenticación está habilitada)
        pass: "", // Contraseña (opcional)
      };
    }

    if (!paramsMongo.options) {
      // Opciones adicionales de configuración
      paramsMongo.options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      };
    }
    return paramsMongo;
  } catch (error) {
    return { connectionConfig: {}, options: {}, js: '' };
  }
};

export const mongodbFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; jsFn?: any }} */ method
) => {
  try {
    let f;

    let paramsMongo = getMongoDBHandlerParams(method.code);

    await mongoose.connect(
      `mongodb://${paramsMongo.connectionConfig.host}:${paramsMongo.connectionConfig.port}`,
      {
        dbName: paramsMongo.connectionConfig.dbName,
        user: paramsMongo.connectionConfig.user || undefined,
        pass: paramsMongo.connectionConfig.pass || undefined,
        ...paramsMongo.options,
      }
    );

    if (method.jsFn) {
      f = method.jsFn;
    } else {
      f = createFunction(paramsMongo.js);
    }

    let result_fn = await f({
      $_REPLY_: response,
      $_REQUEST_: $_REQUEST_,
      $_UFETCH_: $_UFETCH_,
      $_SECUENTIAL_PROMISES_: $_SECUENTIAL_PROMISES_,
      $_GEN_TOKEN_: GenToken,
      $_GET_INTERNAL_URL_: getInternalURL,
      $_FETCH_OFAPI_: fetchOFAPI,
      $_MONGODB_: mongoose,
    })();

    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      response.openfusionapi.lastResponse.data = result_fn;
    }
    response.code(200).send(result_fn);
  } catch (error) {
    setCacheReply(response, error);

    response.code(500).send(error);
  }
};
