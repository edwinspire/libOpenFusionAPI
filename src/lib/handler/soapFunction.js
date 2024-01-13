//import { uFetch } from "@edwinspire/universal-fetch";
import soap from 'soap';
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

		if (!SOAPParameters.RequestArgs) {
			if ($_REQUEST_.method == 'GET') {
				// Obtiene los datos del query
				SOAPParameters.RequestArgs = $_REQUEST_.query;
			} else if ($_REQUEST_.method == 'POST') {
				// Obtiene los datos del body
				SOAPParameters.RequestArgs = $_REQUEST_.body;
			}
		}

		let soap_response = await SOAPGenericClient(SOAPParameters);
		
		if (response.openfusionapi.lastResponse && response.openfusionapi.lastResponse.hash_request) {
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

const SOAPGenericClient = async (
	/** @type {{ wsdl: string; FunctionName: string | any[]; BasicAuthSecurity: { User: any; Password: any; }; RequestArgs: any; }} */ SOAPParameters
) => {
	// console.log("SOAPGenericClient", SOAPParameters);

	try {
		if (SOAPParameters && SOAPParameters.wsdl && SOAPParameters.wsdl.length > 0) {
			if (SOAPParameters.FunctionName && SOAPParameters.FunctionName.length > 0) {
				//      console.log("SOAPGenericClient createClient", wsdl);
				//         console.log("SOAPGenericClient createClient", wsdl);

				let client = await soap.createClientAsync(SOAPParameters.wsdl);

				// console.log('Client >>>>>> SOAP: ', client);

				if (SOAPParameters.BasicAuthSecurity && SOAPParameters.BasicAuthSecurity.User) {
					client.setSecurity(
						new soap.BasicAuthSecurity(
							SOAPParameters.BasicAuthSecurity.User,
							SOAPParameters.BasicAuthSecurity.Password
						)
					);
				}

				//console.log("SOAPGenericClient createClient", client);
				let result = await client[SOAPParameters.FunctionName + 'Async'](
					SOAPParameters.RequestArgs
				);
				let r = await result;

				//     console.log("SOAPGenericClient result", r);
				return r[0];
			} else {
				return { error: 'No se ha definido la funcion SOAP' };
			}
		} else {
			return { error: 'No se ha definido la URL del WSDL' };
		}
	} catch (error) {
		console.trace(error);
		// @ts-ignore
		return error;
	}
};
