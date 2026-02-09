// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";
import { replyException } from "./utils.js";

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

    // Forward Headers from Upstream
    const headersToForward = [
      "content-type",
      "content-disposition",
      "content-length",
      "cache-control",
      "etag",
      "last-modified",
    ];

    resp.headers.forEach((value, key) => {
      if (headersToForward.includes(key.toLowerCase())) {
        response.header(key, value);
      }
    });

    let r;
    const contentType = resp.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        r = await resp.json();
      } catch (e) {
        // Fallback if content-type lies
        const buffer = await resp.arrayBuffer();
        r = Buffer.from(buffer);
      }
    } else if (contentType.includes("text/") || contentType.includes("xml")) {
      r = await resp.text();
    } else {
      // Binary / Other (Images, PDF, Zip, etc)
      const buffer = await resp.arrayBuffer();
      r = Buffer.from(buffer);
    }

    // @ts-ignore
    if (
      response.openfusionapi.lastResponse &&
      response.openfusionapi.lastResponse.hash_request
    ) {
      // @ts-ignore
      // Limit caching size to avoid memory issues with large binaries
      if (Buffer.isBuffer(r)) {
        // TODO: Verificar si este limite en la cache puede dar problemas con el cliente si no se lo cachea
        if (r.length < 50 * 1024 * 1024) { // 50MB limit for cache
          //          response.openfusionapi.lastResponse.data = r.toString('base64'); // Cache as base64? Or just skip?
          // Storing large binary in JSON cache might be bad.
          // For now, let's skip checking or store metadata.
          //response.openfusionapi.lastResponse.data = { info: "Binary data", size: r.length, type: contentType };
          response.openfusionapi.lastResponse.data = r;
        }
      } else {
        response.openfusionapi.lastResponse.data = r;
      }
    }

    response.code(resp.status).send(r);
  } catch (error) {
    replyException($_REQUEST_, response, error);
  }
};
