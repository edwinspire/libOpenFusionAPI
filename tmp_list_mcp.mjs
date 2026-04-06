
import { listMcpTools } from './src/lib/server/runtime/IAChat.js';
try {
  const result = await listMcpTools({ mcpServers:[{ url:'https://dmcp-server.deno.dev/sse' }] });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('LIST_ERROR:', error?.stack || error);
  process.exitCode = 1;
}
