import { CreateMCPHandler } from './src/lib/server/endpoint/handlerBuild/mcp.js';

try {
  const factory = await CreateMCPHandler('system', 'prd');
  const server = factory({});
  const own = Object.getOwnPropertyNames(server);
  const proto = Object.getOwnPropertyNames(Object.getPrototypeOf(server));
  console.log('OWN', own.length);
  console.log('PROTO', proto.length);
  console.log([...new Set([...own, ...proto])].sort().join('\n'));
  process.exit(0);
} catch (error) {
  console.error('ERR', error);
  process.exit(1);
}
