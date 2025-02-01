import $_UFETCH_ from "@edwinspire/universal-fetch";
import $_SECUENTIAL_PROMISES_ from "@edwinspire/sequential-promises";
import { GenToken, getInternalURL, fetchOFAPI } from "../server/utils.js";
import { setCacheReply, createFunction, jsException } from "./utils.js";
import mongoose from "mongoose";
import { Temporal } from '@js-temporal/polyfill';

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

  if (!paramsMongo.config?.options) {
    // Opciones adicionales de configuración
    paramsMongo.options = {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    };
  }

  return paramsMongo;
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
      `mongodb://${paramsMongo.config.host}:${paramsMongo.config.port}`,
      {
        dbName: paramsMongo.config.dbName,
        user: paramsMongo.config.user || undefined,
        pass: paramsMongo.config.pass || undefined,
        ...paramsMongo.config.options,
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
      $_MONGOOSE_: mongoose,
      $_EXCEPTION_: jsException,
      $JS_TEMPORAL_: Temporal,
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

    response
      .code(error.statusCode == null ? 500 : error.statusCode)
      .send(error);
  }
};
