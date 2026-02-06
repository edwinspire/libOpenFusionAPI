// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";

export const fetchFunction = async (
  /** @type {{
	  url(url, init): unknown method?: any; headers: any; body: any; query: any; 
}} */ $_REQUEST_,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method,
) => {
  //console.log(uFetch);
  try {
    // Removed unused req_headers block

    /** ------------------------------
     *  SANITIZAR HEADERS
     * ------------------------------*/
    const forwardedHeaders = { ...$_REQUEST_.headers };

    delete forwardedHeaders["content-length"];
    delete forwardedHeaders["host"];
    delete forwardedHeaders["connection"];
    delete forwardedHeaders["x-forwarded-for"];

    /** ------------------------------
     *  VALIDAR URL DESTINO
     * ------------------------------*/
    if (
      !method.code ||
      typeof method.code !== "string" ||
      method.code.length == 0
    ) {
      response
        .code(500)
        .send({ error: `The destination URL ${method.code} is invalid.` });
      return;
    }

    let init = {
      headers: forwardedHeaders, // Usar los headers de la peticion
      body: $_REQUEST_.body, // Usar los body de la peticion
      query: $_REQUEST_.query, // Usar los query de la peticion,
      url: method.code,
    };

    const FData = new uFetch();
    const httpMethod = $_REQUEST_.method.toUpperCase();

    // @ts-ignore
    if (typeof FData[httpMethod] !== "function") {
      response.code(405).send({ error: `Method ${httpMethod} not allowed/supported` });
      return;
    }

    // @ts-ignore
    let resp = await FData[httpMethod](init);

    let r;
    const contentType = resp.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        r = await resp.json();
      } catch (e) {
        r = await resp.text(); // Fallback to text if JSON parse fails
      }
    } else {
      r = await resp.text();
    }

    // @ts-ignore
    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      // @ts-ignore
      response.openfusionapi.lastResponse.data = r;
    }

    response.code(resp.status).send(r);
  } catch (error) {
    //setCacheReply(response, error);
    // @ts-ignore
    console.trace(error);
    response.code(500).send({ error: error.message });
  }
};
