import { validateEndpointRuntimeDependencies } from "./contracts.js";
import { defaultAuthPolicy } from "./policies.js";
import { mapOperationalError } from "./ErrorMapper.js";
import { EndpointPreValidationService } from "./EndpointPreValidationService.js";
import { EndpointRequestFlowService } from "./EndpointRequestFlowService.js";

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

    this.preValidationService = new EndpointPreValidationService({
      endpoints: this.endpoints,
      getUUID: this.getUUID,
      getURLParams: this.getURLParams,
      authService: this.authService,
      authPolicy: this.authPolicy,
      errorMapper: this.errorMapper,
    });

    this.requestFlowService = new EndpointRequestFlowService({
      serverApi: this.serverApi,
      endpoints: this.endpoints,
      runHandler: this.runHandler,
      getIPFromRequest: this.getIPFromRequest,
      emitEndpointEvent: this.emitEndpointEvent,
      errorMapper: this.errorMapper,
    });
  }

  ensureTraceId(request, reply) {
    return this.preValidationService.ensureTraceId(request, reply);
  }

  replyMappedError(error, request, reply) {
    return this.requestFlowService.replyMappedError(error, request, reply);
  }

  async preValidation(request, reply) {
    return this.preValidationService.preValidation(request, reply);
  }

  onRequest(request) {
    return this.requestFlowService.onRequest(request);
  }

  onResponse(request, reply) {
    return this.requestFlowService.onResponse(request, reply);
  }

  async handleApiRequest(request, reply) {
    return this.requestFlowService.handleApiRequest(request, reply);
  }
}
