import soap from "soap";
import Ajv from "ajv";
import { schema_input_genericSOAP } from "./json_schemas.js";
import { mergeObjects } from "../server/utils.js";
import { replyException } from "./utils.js";
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const ajv = new Ajv();
const validate_schema_input_genericSOAP = ajv.compile(schema_input_genericSOAP);

/*
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
*/

const soapClients = new Map();
const MAX_CLIENTS = 50;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

/**
 * Obtiene un cliente SOAP del caché o crea uno nuevo.
 * Implementa LRU (Least Recently Used) y TTL (Time To Live).
 */
const getSoapClient = async (wsdl, options) => {
  const cacheKey = JSON.stringify({ wsdl, options });
  const now = Date.now();

  // 1. Verificar Caché
  if (soapClients.has(cacheKey)) {
    const entry = soapClients.get(cacheKey);

    // Verificar TTL
    if (now - entry.created > CACHE_TTL) {
      console.log(`SOAP Client expired: ${wsdl}`);
      soapClients.delete(cacheKey);
    } else {
      // Actualizar uso (LRU) y retornar
      entry.lastUsed = now;
      return entry.client;
    }
  }

  // 2. Limpieza LRU si está lleno
  if (soapClients.size >= MAX_CLIENTS) {
    let oldestKey = null;
    let oldestTime = Infinity;

    for (const [key, entry] of soapClients.entries()) {
      if (entry.lastUsed < oldestTime) {
        oldestTime = entry.lastUsed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      soapClients.delete(oldestKey);
    }
  }

  // 3. Crear nuevo cliente
  console.log(`Creating new SOAP Client: ${wsdl}`);
  const client = await soap.createClientAsync(wsdl, options || {});

  // 4. Guardar en caché
  soapClients.set(cacheKey, {
    client,
    created: now,
    lastUsed: now,
  });

  return client;
};

export const soapFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    // console.log(">>>>>>>>>>>>> method.code -----> ", method.code);

    let SOAPParameters = JSON.parse(method.code);

    //    console.log(SOAPParameters);
    let dataRequest = {};

    if ($_REQUEST_.method == "GET") {
      // Obtiene los datos del query
      SOAPParameters.RequestArgs = $_REQUEST_.query;
      dataRequest = SOAPParameters;
    } else if ($_REQUEST_.method == "POST") {
      // Obtiene los datos del body
      //console.log('>>>>>>>>>>>>>>>>' , $_REQUEST_.body);
      dataRequest = $_REQUEST_.body;
      //dataRequest = joinObj(SOAPParameters, dataRequest);
      dataRequest = mergeObjects(dataRequest, SOAPParameters);
    }

    dataRequest.HTTPHeaders = $_REQUEST_.headers;

    //console.log('dataRequest>>>>>', dataRequest);

    let soap_response = await SOAPGenericClient(dataRequest);

    if (soap_response.error && Array.isArray(soap_response.error)) {
      response.code(400).send(soap_response);
      return;
    }

    if (response.openfusionapi?.lastResponse?.hash_request) {
      // @ts-ignore
      response.openfusionapi.lastResponse.data = soap_response;
    }

    response.code(200).send(soap_response);
  } catch (error) {
    replyException($_REQUEST_, response, error);
  }

  ////
};

export const SOAPGenericClient = async (
  /** @type {{ wsdl: string; functionName: string | any[]; BasicAuthSecurity: { User: any; Password: any; }; RequestArgs: any; }} */ SOAPParameters
) => {
  //console.log("\n\n\nSOAPGenericClient", SOAPParameters);

  let describe = false;
  /*
  let options = {
    wsdl_options: {
      strictSSL: true,
      rejectUnauthorized: false,
      //secureOptions: constants.SSL_OP_NO_TLSv1_2,
    },
  };
  */

  if (
    SOAPParameters["describe()"] ||
    (SOAPParameters.RequestArgs && SOAPParameters.RequestArgs["describe()"])
  ) {
    describe = true;
    SOAPParameters.functionName = SOAPParameters.functionName || "undefined";
  }

  if (describe || validate_schema_input_genericSOAP(SOAPParameters)) {
    let client = await getSoapClient(
      SOAPParameters.wsdl,
      SOAPParameters.options
    );

    // Pasar todos los headers del Request al cliente SOAP
    for (const [key, value] of Object.entries(SOAPParameters.HTTPHeaders)) {
      // Evitamos headers que puedan causar conflicto
      if (
        key.toLowerCase() !== "content-type" &&
        key.toLowerCase() !== "content-length" &&
        key.toLowerCase() !== "host" &&
        key.toLowerCase() !== "server" &&
        key.toLowerCase() !== "referer" &&
        key.toLowerCase().includes("sec-ch-ua") &&
        key.toLowerCase().includes("sec-fetch") &&
        key.toLowerCase().includes("x-forwarded")
      ) {
        client.addHttpHeader(key, value);
      }
    }

    //     console.log('\n\nClient >>>>>> SOAP: ', describe, SOAPParameters);

    if (
      SOAPParameters.BasicAuthSecurity &&
      SOAPParameters.BasicAuthSecurity.User
    ) {
      client.setSecurity(
        new soap.BasicAuthSecurity(
          SOAPParameters.BasicAuthSecurity.User,
          SOAPParameters.BasicAuthSecurity.Password
        )
      );
    } else if (SOAPParameters.BearerSecurity) {
      client.setSecurity(
        new soap.BearerSecurity(SOAPParameters.BearerSecurity)
      );
    }

    let r;

    if (describe) {
      r = client.describe();
    } else {
      let fnName = SOAPParameters.functionName + "Async";

      if (SOAPParameters.endpoint) {
        client.setEndpoint(SOAPParameters.endpoint);
      }

      if (client[fnName]) {
        let result = await client[fnName](SOAPParameters.RequestArgs);
        let r1 = await result;
        r = r1[0];
      } else {
        throw new Error(fnName + " not exists.");
      }
    }

    //     console.log("SOAPGenericClient result", r);
    return r;
  } else {
    return { error: validate_schema_input_genericSOAP.errors };
  }
};
