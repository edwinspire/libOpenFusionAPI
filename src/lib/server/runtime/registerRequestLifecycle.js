export function registerRequestLifecycle({
  fastify,
  structApiPath,
  endpointRuntimeService,
}) {
  if (!endpointRuntimeService) {
    throw new TypeError("Contract error: endpointRuntimeService is required.");
  }

  const requiredMethods = [
    "preValidation",
    "onRequest",
    "onResponse",
    "handleApiRequest",
  ];

  for (const methodName of requiredMethods) {
    if (typeof endpointRuntimeService[methodName] !== "function") {
      throw new TypeError(
        `Contract error: endpointRuntimeService.${methodName} must be a function.`,
      );
    }
  }

  fastify.addHook("preValidation", async (request, reply) => {
    await endpointRuntimeService.preValidation(request, reply);
  });

  fastify.addHook("onRequest", async (request) => {
    endpointRuntimeService.onRequest(request);
  });

  fastify.addHook("onResponse", async (request, reply) => {
    endpointRuntimeService.onResponse(request, reply);
  });

  fastify.all(structApiPath, async (request, reply) => {
    await endpointRuntimeService.handleApiRequest(request, reply);
  });
}
