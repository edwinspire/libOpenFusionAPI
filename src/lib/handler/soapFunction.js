//import { uFetch } from "@edwinspire/universal-fetch";
import soap from "soap";
import Ajv from "ajv";
import { schema_input_genericSOAP } from "./json_schemas.js";

const ajv = new Ajv();
const validate_schema_input_genericSOAP = ajv.compile(schema_input_genericSOAP);

/*
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
*/

export const soapFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    //console.log('>>>>>>>>>>>>> method.code -----> ', method.code);

    let SOAPParameters = JSON.parse(method.code);

    //    console.log(SOAPParameters);
    let dataRequest = {};

    if ($_REQUEST_.method == "GET") {
      // Obtiene los datos del query
      dataRequest = $_REQUEST_.query;
    } else if ($_REQUEST_.method == "POST") {
      // Obtiene los datos del body
      dataRequest = $_REQUEST_.body;
    }

    dataRequest = joinObj(SOAPParameters, dataRequest);

    let soap_response = await SOAPGenericClient(dataRequest);

    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      // @ts-ignore
      response.openfusionapi.lastResponse.data = soap_response;
    }

    response.code(200).send(soap_response);
  } catch (error) {
    console.trace(error);
    // @ts-ignore
    response.code(500).send(error);
  }

  ////
};

export const SOAPGenericClient = async (
  /** @type {{ wsdl: string; FunctionName: string | any[]; BasicAuthSecurity: { User: any; Password: any; }; RequestArgs: any; }} */ SOAPParameters
) => {
  // console.log("SOAPGenericClient", SOAPParameters);

  try {
    if (validate_schema_input_genericSOAP(SOAPParameters)) {
      let client = await soap.createClientAsync(SOAPParameters.wsdl);

      // console.log('Client >>>>>> SOAP: ', client);

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

      if (SOAPParameters.describe) {
        r = client.describe();
      } else {
        //console.log("SOAPGenericClient createClient", client);
        let result = await client[SOAPParameters.functionName + "Async"](
          SOAPParameters.RequestArgs
        );
        let r1 = await result;
        r = r1[0];
      }

      //     console.log("SOAPGenericClient result", r);
      return r;
    } else {
      return { error: validate_schema_input_genericSOAP.errors };
    }
  } catch (error) {
    console.trace(error);
    // @ts-ignore
    return error;
  }
};

function joinObj(objA, objB) {
  // Crear un nuevo objeto para evitar modificar los objetos originales
  const r = { ...objA };

  // Iterar sobre las propiedades del objB
  for (const propiedad in objB) {
    if (objB.hasOwnProperty(propiedad)) {
      // Si la propiedad ya existe en resultado, reemplazar el valor
      // de lo contrario, agregar la propiedad al resultado
      r[propiedad] = r.hasOwnProperty(propiedad)
        ? objB[propiedad]
        : r[propiedad];
    }
  }

  return r;
}
