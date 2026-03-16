// @ts-ignore
import uFetch from "@edwinspire/universal-fetch";
import { replyException } from "./utils.js";

export const fetchFunction = async (context) => {
  const request = context?.request;
  const reply = context?.reply;
  const method = context?.method || context?.endpoint;
  //console.log(uFetch);
  try {
    // Removed unused req_headers block

    /** ------------------------------
     *  SANITIZAR HEADERS
     * ------------------------------*/
    // console.log('-------> Fetch Function');
    //   console.log('custom_data-------> ', method.custom_data);
    const forwardedHeaders = { ...request.headers };
    try {
      if (forwardedHeaders.host) {
        delete forwardedHeaders.host;
      }

      if (forwardedHeaders.origin) {
        delete forwardedHeaders.origin;
      }
    } catch (error) {}

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
      reply
        .code(500)
        .send({ error: `The destination URL ${method.code} is invalid.` });
      return;
    }

    let req_body = method.custom_data;

    let paramsFetch = {};
    paramsFetch = {
      ...method.custom_data, ...{
        method: method.custom_data?.method || request.method, // Usar el metodo de la configuracion
        headers: forwardedHeaders,
        body: request.body, // Usar los body de la peticion
        query: request.query, // Usar los query de la peticion,
      }
    };

    let init = {
      headers: forwardedHeaders, // Usar los headers de la peticion
      body: request.body, // Usar los body de la peticion
      query: request.query, // Usar los query de la peticion,
      url: method.code,
    };

    const FData = new uFetch();
    //  console.log('method -------> ', paramsFetch.method );
    const httpMethod = request.method.toUpperCase();

    // @ts-ignore
    if (typeof FData[httpMethod] !== "function") {
      reply.code(405).send({ error: `Method ${httpMethod} not allowed/supported` });
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
        reply.header(key, value);
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
    if (reply.openfusionapi?.lastResponse?.hash_request) {
      // @ts-ignore
      // Limit caching size to avoid memory issues with large binaries
      if (Buffer.isBuffer(r)) {
        // TODO: Verificar si este limite en la cache puede dar problemas con el cliente si no se lo cachea
        if (r.length < 50 * 1024 * 1024) { // 50MB limit for cache
          //          reply.openfusionapi.lastResponse.data = r.toString('base64'); // Cache as base64? Or just skip?
          // Storing large binary in JSON cache might be bad.
          // For now, let's skip checking or store metadata.
          //reply.openfusionapi.lastResponse.data = { info: "Binary data", size: r.length, type: contentType };
          reply.openfusionapi.lastResponse.data = r;
        }
      } else {
        reply.openfusionapi.lastResponse.data = r;
      }
    }

    reply.code(resp.status).send(r);
  } catch (error) {
    //  console.log(error);
    replyException(request, reply, error);
  }
};
