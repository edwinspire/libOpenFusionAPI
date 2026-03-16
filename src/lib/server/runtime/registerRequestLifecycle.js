export function registerRequestLifecycle({
  fastify,
  structApiPath,
  serverApi,
  endpoints,
  getUUID,
  getURLParams,
  authService,
  runHandler,
  getIPFromRequest,
  emitEndpointEvent,
}) {
  fastify.addHook("preValidation", async (request, reply) => {
    const user_agent = request.headers["user-agent"];

    if (!request.ws && (!user_agent || user_agent.length === 0)) {
      reply.code(403).send({ error: "Fail" });
      return;
    }

    let request_path_params = getURLParams(request.url, request.method);

    if (!request.headers["ofapi-trace-id"]) {
      let trace_id = getUUID();
      request.headers["ofapi-trace-id"] = trace_id;
      reply.header("ofapi-trace-id", trace_id);
    } else {
      reply.header("ofapi-trace-id", request.headers["ofapi-trace-id"]);
    }

    if (request_path_params && request_path_params.url_key) {
      let cache_endpoint = await endpoints.getEndpoint(request_path_params);

      if (cache_endpoint && cache_endpoint.handler) {
        let handlerEndpoint = cache_endpoint.handler;

        if (handlerEndpoint?.params?.enabled) {
          request.openfusionapi = { handler: handlerEndpoint };
          await authService.check_auth(handlerEndpoint, request, reply);
        } else {
          reply.code(410).send({ message: "Endpoint unabled.", url: request.url });
        }
      } else {
        reply.code(404).send({ error: "Endpoint Not Found", url: request.url });
      }
    }
  });

  fastify.addHook("onRequest", async (request) => {
    request.startTime = process.hrtime();
  });

  fastify.addHook("onResponse", async (request, reply) => {
    if (request.method !== "OPTIONS") {
      const diff = process.hrtime(request.startTime);
      const timeTaken = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);

      if (!reply.openfusionapi) {
        reply.openfusionapi = { lastResponse: { responseTime: timeTaken } };
      }

      if (!reply.openfusionapi.lastResponse) {
        reply.openfusionapi.lastResponse = { responseTime: timeTaken };
      }

      if (!reply.openfusionapi.lastResponse.responseTime) {
        reply.openfusionapi.lastResponse.responseTime = timeTaken;
      }

      endpoints.saveLog(request, reply);

      let handler_param = request?.openfusionapi?.handler?.params || {};
      if (handler_param?.idendpoint) {
        endpoints.setCache(handler_param?.url_key, request, reply);
      }
      handler_param.statusCode = reply.statusCode;
      emitEndpointEvent("request_completed", handler_param);
    }
  });

  fastify.all(structApiPath, async (request, reply) => {
    let handlerEndpoint = request.openfusionapi.handler;
    request.openfusionapi.ip_request = getIPFromRequest(request);

    if (!reply.openfusionapi) {
      reply.openfusionapi = {};
    }

    if (handlerEndpoint.params.handler == "JS") {
      reply.openfusionapi.server = serverApi;
    }

    let server_data = {};

    reply.openfusionapi.lastResponse = {
      hash_request: "0A0",
      data: undefined,
    };

    if (
      handlerEndpoint.params &&
      handlerEndpoint.params.app &&
      handlerEndpoint.params.app == "system"
    ) {
      if (handlerEndpoint.params.handler == "FUNCTION") {
        server_data.endpoint_class = endpoints;
      }
    }

    emitEndpointEvent("request_start", {
      idendpoint: handlerEndpoint.params?.idendpoint,
      idapp: handlerEndpoint.params?.idapp,
      url: request.url,
      method: request.method,
      app: handlerEndpoint.params?.app,
      environment: handlerEndpoint.params?.environment,
      endpoint: handlerEndpoint.params?.url_method,
    });

    if (
      handlerEndpoint.params &&
      handlerEndpoint.params.cache_time &&
      handlerEndpoint.params.cache_time > 0
    ) {
      let hash_request = endpoints.hash_request(
        request,
        handlerEndpoint.params.url_key,
      );

      reply.openfusionapi.lastResponse.hash_request = hash_request;
      request.openfusionapi.hash_request = hash_request;

      let data_cache = endpoints.cache.getPayload({
        app: handlerEndpoint.params.app,
        resource: handlerEndpoint.params.resource,
        env: handlerEndpoint.params.environment,
        method: request.method,
        hash: hash_request,
      });

      if (data_cache && data_cache.data) {
        reply.header("X-Cache", "HIT");
        reply.openfusionapi.lastResponse[hash_request] = data_cache.data;
        reply.code(200).send(data_cache.data);
      } else {
        reply.header("X-Cache", "MISS");
        await runHandler(request, reply, handlerEndpoint.params, server_data);
      }
    } else {
      await runHandler(request, reply, handlerEndpoint.params, server_data);
    }
  });
}
