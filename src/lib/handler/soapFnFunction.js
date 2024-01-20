//import { uFetch } from "@edwinspire/universal-fetch";
import { SOAPGenericClient } from './soapFunction.js';

export const soapFnFunction = async (
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
