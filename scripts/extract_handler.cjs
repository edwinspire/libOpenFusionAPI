const data = require('C:/Users/edelacruz/AppData/Roaming/Code/User/workspaceStorage/6649269cc0399a69278f4be3179fa9ae/GitHub.copilot-chat/chat-session-resources/67fcb7ee-aff7-403b-aac2-a7f50594480c/toolu_bdrk_01W4PT3h8m7hM1jk6mQhnrPR__vscode-1774898283012/content.json');

const handler = process.argv[2] || 'SQL';

const eps = data.filter(e => e.handler === handler);
eps.forEach(e => {
  console.log('--- ENDPOINT ---');
  console.log('resource:', e.resource);
  console.log('method:', e.method);
  console.log('title:', e.title);
  console.log('mcp_enabled:', e.mcp && e.mcp.enabled);
  console.log('mcp_name:', e.mcp && e.mcp.name);
  console.log('mcp_description:', e.mcp && e.mcp.description);
  console.log('custom_data:', JSON.stringify(e.custom_data));
  console.log('json_schema_in:', JSON.stringify(e.json_schema && e.json_schema.in && e.json_schema.in.enabled ? e.json_schema.in.schema : null));
  if (e.code) {
    const code = typeof e.code === 'string' ? e.code.substring(0, 400) : JSON.stringify(e.code).substring(0, 400);
    console.log('code_preview:', code);
  }
  const lr = e.data_test && e.data_test.last_response;
  if (lr && lr.data && lr.data.length > 10) {
    console.log('last_response_preview:', lr.data.substring(0, 300));
  }
  console.log('');
});
