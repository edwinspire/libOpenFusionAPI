const data = require('C:/Users/edelacruz/AppData/Roaming/Code/User/workspaceStorage/6649269cc0399a69278f4be3179fa9ae/GitHub.copilot-chat/chat-session-resources/67fcb7ee-aff7-403b-aac2-a7f50594480c/toolu_bdrk_01W4PT3h8m7hM1jk6mQhnrPR__vscode-1774898283012/content.json');

data.forEach(e => {
  const hascode = e.code ? true : false;
  const hasresp = (e.data_test && e.data_test.last_response && e.data_test.last_response.data && e.data_test.last_response.data.length > 50) ? true : false;
  const hasschema = (e.json_schema && e.json_schema.in && e.json_schema.in.enabled) ? true : false;
  const mcp_on = (e.mcp && e.mcp.enabled) ? true : false;
  const r = {
    handler: e.handler,
    method: e.method,
    resource: e.resource,
    title: e.title,
    desc: (e.description || '').substring(0, 120),
    mcp_enabled: mcp_on,
    mcp_name: e.mcp && e.mcp.name,
    mcp_desc: e.mcp && e.mcp.description ? e.mcp.description.substring(0, 100) : '',
    has_schema_in: hasschema,
    has_code: hascode,
    has_response: hasresp,
    cache_time: e.cache_time,
    params_count: (e.data_test && e.data_test.query ? e.data_test.query.filter(q => q.enabled).length : 0)
  };
  console.log(JSON.stringify(r));
});
