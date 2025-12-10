import {TimedCache} from "../src/lib/server/endpoint/HierarchicalCache.js"

let cache = new TimedCache();

cache.add({app: 'system', resource: '/rrrr', env: 'prd', method: 'GET', hash: 'sssssssssssssssssssss', payload: 'sdadadasddd', timeout: 99});
cache.add({app: 'system', resource: '/rrrr', env: 'prd', method: 'GET', hash: 'oooooooooooooooo', payload: 'opopopopopop', timeout: 99});
cache.add({app: 'system', resource: '/xxxx', env: 'dev', method: 'POST', hash: 'EEEEEEEEEEEEE', payload: 'MMMMMMMMMMMMMMM', timeout: 99});
cache.add({app: 'system', resource: '/xxxx', env: 'dev', method: 'POST', hash: 'EEEEEEEEEEEEE', payload: 'YTYTYTYTYTYT', timeout: 99});
cache.add({app: 'system', resource: '/xxxx', env: 'dev', method: 'GET', hash: 'QQQQQQQQ', payload: 'ZZZZZZZZ', timeout: 99});
cache.add({app: 'system', resource: '/xxxx', env: 'dev', method: 'GET', hash: 'QQQQQQQQ', payload: 'ZZZZZZZZ', timeout: 99});
//cache.add({app: 'system', resource: '/xxxx', env: 'qa', method: 'PATH', hash: 'EEEEEEEEEEEEE', payload: 'MMMMMMMMMMMMMMM', timeout: 99});

 let d = cache.get({app: 'system', resource: '/rrrr', env: 'prd', method: 'GET', hash: 'sssssssssssssssssssss'});

console.log('Fin', cache.root);
console.log('>>', d);