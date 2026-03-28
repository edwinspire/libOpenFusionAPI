const fs = require('fs');
const path = 'c:/Users/edelacruz/AppData/Roaming/Code/User/workspaceStorage/6649269cc0399a69278f4be3179fa9ae/GitHub.copilot-chat/chat-session-resources/f6476fbc-7004-4f84-949c-3866d9b94774/toolu_01CPQUNHPVWeCBkZ7XAzxie6__vscode-1774667861461/content.json';
const arr = JSON.parse(fs.readFileSync(path, 'utf8'));
let autorizado = 0, firmados = 0, error = 0, otros = 0;
const estados = {};
for (const it of arr) {
  const serie = it?.param?.serie_documento || '';
  const estado = it?.result?.autorizacion?.ActualizarDocumento?.estado || 'DESCONOCIDO';
  const sri = it?.result?.autorizacion?.ActualizarDocumento?.autorizacion_sri || '';
  if (it?.result?.error) {
    error++;
  } else if (estado === 'A' || sri) {
    autorizado++;
  } else if (estado === 'DOCUMENTO FIRMADO A INVOICE') {
    firmados++;
  } else {
    otros++;
  }
  if (!estados[estado]) estados[estado] = 0;
  estados[estado]++;
}
console.log('=== RESUMEN ===');
console.log('TOTAL=' + arr.length);
console.log('AUTORIZADOS=' + autorizado);
console.log('FIRMADOS_A_INVOICE=' + firmados);
console.log('CON_ERROR=' + error);
console.log('OTROS=' + otros);
console.log('\n=== ESTADOS ENCONTRADOS ===');
for (const [k, v] of Object.entries(estados)) {
  console.log(`${k}: ${v}`);
}
