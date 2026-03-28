const fs = require('fs');
const docs = fs.readFileSync('.tmp_docs_estado.txt', 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const reportPath = 'c:/Users/edelacruz/AppData/Roaming/Code/User/workspaceStorage/6649269cc0399a69278f4be3179fa9ae/GitHub.copilot-chat/chat-session-resources/f6476fbc-7004-4f84-949c-3866d9b94774/call_Gkwgz8Foh2KmvAcphXS22Dql__vscode-1774667861429/content.json';
const rep = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const pendingSet = new Set(rep.map(r => String(r.Serie_Factura || '').trim()).filter(Boolean));
const pending = [];
const notPending = [];
for (const d of docs) {
  (pendingSet.has(d) ? pending : notPending).push(d);
}
console.log('TOTAL_DOCS=' + docs.length);
console.log('PENDIENTES=' + pending.length);
console.log('NO_EN_REPORTE=' + notPending.length);
fs.writeFileSync('.tmp_docs_pendientes.txt', pending.join('\n') + '\n');
fs.writeFileSync('.tmp_docs_no_reporte.txt', notPending.join('\n') + '\n');
