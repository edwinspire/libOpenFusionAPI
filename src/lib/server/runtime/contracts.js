/**
 * Runtime contracts for service dependencies and request context.
 * These checks are intentionally lightweight and fail fast.
 */

function assertFunction(name, value) {
  if (typeof value !== "function") {
    throw new TypeError(`Contract error: '${name}' must be a function.`);
  }
}

function assertObject(name, value) {
  if (!value || typeof value !== "object") {
    throw new TypeError(`Contract error: '${name}' must be an object.`);
  }
}

export function validateEndpointRuntimeDependencies(deps) {
  assertObject("deps", deps);
  assertObject("deps.serverApi", deps.serverApi);
  assertObject("deps.endpoints", deps.endpoints);

  if (!deps.authService || (typeof deps.authService !== "object" && typeof deps.authService !== "function")) {
    throw new TypeError("Contract error: 'deps.authService' must be an object or function.");
  }

  assertFunction("deps.getUUID", deps.getUUID);
  assertFunction("deps.getURLParams", deps.getURLParams);
  assertFunction("deps.runHandler", deps.runHandler);
  assertFunction("deps.getIPFromRequest", deps.getIPFromRequest);
  assertFunction("deps.emitEndpointEvent", deps.emitEndpointEvent);

  if (deps.authPolicy != null) {
    assertFunction("deps.authPolicy", deps.authPolicy);
  }

  if (deps.errorMapper != null) {
    assertFunction("deps.errorMapper", deps.errorMapper);
  }

  assertFunction("deps.authService.check_auth", deps.authService.check_auth);
  assertFunction("deps.endpoints.getEndpoint", deps.endpoints.getEndpoint);
  assertFunction("deps.endpoints.hash_request", deps.endpoints.hash_request);
  assertFunction("deps.endpoints.saveLog", deps.endpoints.saveLog);
  assertFunction("deps.endpoints.setCache", deps.endpoints.setCache);
}

export function validateFunctionRegistryDependencies(deps) {
  assertObject("deps", deps);
  assertObject("deps.endpoints", deps.endpoints);
  assertObject("deps.fs", deps.fs);

  assertFunction("deps.getFunctionsFiles", deps.getFunctionsFiles);

  if (!deps.dirFn || typeof deps.dirFn !== "string") {
    throw new TypeError("Contract error: 'deps.dirFn' must be a non-empty string.");
  }
}

export function validateEndpointContext(request, reply) {
  assertObject("request", request);
  assertObject("reply", reply);

  const handler = request?.openfusionapi?.handler;
  if (!handler || !handler.params) {
    throw new Error("Contract error: request.openfusionapi.handler.params is required.");
  }

  return handler;
}
