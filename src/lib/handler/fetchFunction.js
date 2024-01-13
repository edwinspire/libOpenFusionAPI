// @ts-ignore
import uFetch from '@edwinspire/universal-fetch';

export const fetchFunction = async (
	/** @type {{
	  url(url, init): unknown method?: any; headers: any; body: any; query: any; 
}} */ $_REQUEST_,
	/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
	/** @type {{ handler?: string; code: any; }} */ method
) => {
	//console.log(uFetch);
	try {
		let req_headers = { ...$_REQUEST_.headers };
		delete req_headers['content-length'];
		delete req_headers['host'];
		delete req_headers['connection'];

		let init = {
			headers: req_headers, // Usar los headers de la peticion
			body: $_REQUEST_.body, // Usar los body de la peticion
			query: $_REQUEST_.query, // Usar los query de la peticion,
			url: method.code
		};

		// console.log($_REQUEST_);

		const FData = new uFetch();
		// @ts-ignore
		let resp = await FData[$_REQUEST_.method.toUpperCase()](init);

		let r = await resp.json();
		
		// @ts-ignore
		if (response.openfusionapi.lastResponse && response.openfusionapi.lastResponse.hash_request) {
			// @ts-ignore
			response.openfusionapi.lastResponse.data = r;
		}
		
		
		response.code(resp.status).send(r);
	} catch (error) {
		// @ts-ignore
		response.code(500).send(error);
	}
};
