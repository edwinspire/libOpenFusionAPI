import {
  validateEndpointContext,
  validateEndpointRuntimeDependencies,
} from "./contracts.js";
import { defaultAuthPolicy } from "./policies.js";
import { mapOperationalError } from "./ErrorMapper.js";

export class EndpointRuntimeService {
  constructor({
    serverApi,
    endpoints,
    getUUID,
    getURLParams,
    authService,
    runHandler,
    getIPFromRequest,
    emitEndpointEvent,
    authPolicy = defaultAuthPolicy,
    errorMapper = mapOperationalError,
  }) {
    validateEndpointRuntimeDependencies({
      serverApi,
      endpoints,
      getUUID,
      getURLParams,
      authService,
      runHandler,
      getIPFromRequest,
      emitEndpointEvent,
      authPolicy,
      errorMapper,
    });

    this.serverApi = serverApi;
    this.endpoints = endpoints;
    this.getUUID = getUUID;
    this.getURLParams = getURLParams;
    this.authService = authService;
    this.runHandler = runHandler;
    this.getIPFromRequest = getIPFromRequest;
    this.emitEndpointEvent = emitEndpointEvent;
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

      if (request_path_params && request_path_params.url_key) {
        let cache_endpoint = await this.endpoints.getEndpoint(request_path_params);

        if (cache_endpoint && cache_endpoint.handler) {
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
        }
      } else {
        reply.code(404).send({ error: "Endpoint Not Found", url: request.url });
      }
    } catch (error) {
      this.replyMappedError(error, request, reply);
    }
  }

  onRequest(request) {
    request.startTime = process.hrtime();
  }

  onResponse(request, reply) {
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

      this.endpoints.saveLog(request, reply);

      let handler_param = request?.openfusionapi?.handler?.params || {};
      if (handler_param?.idendpoint) {
        this.endpoints.setCache(handler_param?.url_key, request, reply);
      }
      handler_param.statusCode = reply.statusCode;
      this.emitEndpointEvent("request_completed", handler_param);
    }
  }

  async handleApiRequest(request, reply) {
    try {
      let handlerEndpoint = validateEndpointContext(request, reply);
      request.openfusionapi.ip_request = this.getIPFromRequest(request);

      if (!reply.openfusionapi) {
        reply.openfusionapi = {};
      }

      if (handlerEndpoint.params.handler == "JS") {
        reply.openfusionapi.server = this.serverApi;
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
          server_data.endpoint_class = this.endpoints;
        }
      }

      this.emitEndpointEvent("request_start", {
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
        let hash_request = this.endpoints.hash_request(
          request,
          handlerEndpoint.params.url_key,
        );

        reply.openfusionapi.lastResponse.hash_request = hash_request;
        request.openfusionapi.hash_request = hash_request;

        let data_cache = this.endpoints.cache.getPayload({
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
          await this.runHandler(request, reply, handlerEndpoint.params, server_data);
        }
      } else {
        await this.runHandler(request, reply, handlerEndpoint.params, server_data);
      }
    } catch (error) {
      this.replyMappedError(error, request, reply);
    }
  }
}
