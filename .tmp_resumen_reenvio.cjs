const fs = require('fs');
const base = 'c:/Users/edelacruz/AppData/Roaming/Code/User/workspaceStorage/6649269cc0399a69278f4be3179fa9ae/GitHub.copilot-chat/chat-session-resources/f6476fbc-7004-4f84-949c-3866d9b94774';
const files = [
  'call_8jSiwWZhg5DmTG3fiNrd9HFS__vscode-1774667861441/content.json',
  'call_YLhM0sk6Ep0UWLHL8KckzCOC__vscode-1774667861442/content.json',
  'call_ZWh3IyvoVeNhiLdlSERbw9N8__vscode-1774667861443/content.json',
  'call_WvIWzWa95cuJAof6EE4icZm2__vscode-1774667861444/content.json',
  'call_fmhyV9hmgeQZyho4rHMZNyYt__vscode-1774667861445/content.json',
  'call_VClSe65olqVfVqiUnH3qLzCs__vscode-1774667861446/content.json'
];
let total=0, errors=[];
for (const f of files){
  const arr = JSON.parse(fs.readFileSync(`${base}/${f}`,'utf8'));
  total += arr.length;
  for (const it of arr){
    if (it?.result?.error){
      errors.push({serie: it?.param?.serie_documento || '', error: it.result.error});
    }
  }
}
console.log('TOTAL_PROCESADOS='+total);
console.log('TOTAL_CON_ERROR='+errors.length);
if (errors.length){
  for (const e of errors) console.log(`${e.serie} => ${e.error}`);
}
