export async function registerCorePlugins({
  fastify,
  maxBodyBytes,
  jwtKey,
  wwwDirPath,
  plugins,
  corsConfig,
  corsPolicy,
}) {
  const {
    formbody,
    multipart,
    cookie,
    cors,
    websocket,
    fastifyStatic,
    fs,
  } = plugins;

  await fastify.register(formbody, {
    bodyLimit: maxBodyBytes,
  });

  await fastify.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: maxBodyBytes,
    },
  });

  fastify.register(cookie, {
    secret: jwtKey,
    hook: "preValidation",
    parseOptions: {},
  });

  const resolvedCorsConfig =
    typeof corsPolicy === "function" ? corsPolicy(corsConfig) : corsConfig;

  await fastify.register(cors, {
    ...resolvedCorsConfig,
  });

  await fastify.register(websocket);

  if (!fs.existsSync(wwwDirPath)) {
    fs.mkdirSync(wwwDirPath);
  }

  await fastify.register(fastifyStatic, {
    root: wwwDirPath,
    prefix: "/",
  });
}
