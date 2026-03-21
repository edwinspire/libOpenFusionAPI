export class EndpointPreValidationService {
  constructor({
    endpoints,
    getUUID,
    getURLParams,
    authService,
    authPolicy,
    errorMapper,
  }) {
    this.endpoints = endpoints;
    this.getUUID = getUUID;
    this.getURLParams = getURLParams;
    this.authService = authService;
    this.authPolicy = authPolicy;
    this.errorMapper = errorMapper;
  }

  ensureTraceId(request, reply) {
    if (!request.headers["ofapi-trace-id"]) {
      let trace_id = this.getUUID();
      request.headers["ofapi-trace-id"] = trace_id;
      reply.header("ofapi-trace-id", trace_id);
      return trace_id;
    }

    reply.header("ofapi-trace-id", request.headers["ofapi-trace-id"]);
    return request.headers["ofapi-trace-id"];
  }

  replyMappedError(error, request, reply) {
    const mapped = this.errorMapper(error, request);
    if (!reply.sent) {
      reply.code(mapped.statusCode).send(mapped.payload);
    }
  }

  async preValidation(request, reply) {
    try {
      const user_agent = request.headers["user-agent"];

      if (!request.ws && (!user_agent || user_agent.length === 0)) {
        reply.code(403).send({ error: "Fail" });
        return;
      }

      this.ensureTraceId(request, reply);

      let request_path_params = this.getURLParams(request.url, request.method);

      // Si la solicitud NO es una ruta de API, permite que continúe el procesamiento normal
      if (!request_path_params || !request_path_params.url_key) {
        return;
      }

      let cache_endpoint = await this.endpoints.getEndpoint(request_path_params);

      if (!cache_endpoint || !cache_endpoint.handler) {
        reply.code(404).send({ error: "Endpoint not found", url: request.url });
        return;
      }

      let handlerEndpoint = cache_endpoint.handler;

      if (handlerEndpoint?.params?.enabled) {
        if (!this.authPolicy({ request, reply, handlerEndpoint })) {
          reply.code(403).send({ error: "Auth policy denied", url: request.url });
          return;
        }

        request.openfusionapi = { handler: handlerEndpoint };
        await this.authService.check_auth(handlerEndpoint, request, reply);
      } else {
        reply.code(410).send({ message: "Endpoint unabled.", url: request.url });
      }
    } catch (error) {
      this.replyMappedError(error, request, reply);
    }
  }
}
