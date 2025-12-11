import { TimedCache } from "../src/lib/server/endpoint/TimedCache.js";

let cache = new TimedCache();

cache.on("expired", (entry) => {
  console.log("Expired Cache Entry:", entry);
});


cache.add({
  app: "system",
  resource: "/rrrr",
  env: "prd",
  method: "GET",
  hash: "sssssssssssssssssssss",
  payload: "sdadadasddd",
  timeout: 12,
});


cache.add({
  app: "system",
  resource: "/rrrr",
  env: "prd",
  method: "GET",
  hash: "oooooooooooooooo",
  payload: "opopopopopop",
  timeout: 2,
});

cache.add({
  app: "system",
  resource: "/xxxx",
  env: "dev",
  method: "POST",
  hash: "EEEEEEEEEEEEE",
  payload: "MMMMMMMMMMMMMMM",
  timeout: 19,
});
cache.add({
  app: "system",
  resource: "/xxxx",
  env: "dev",
  method: "POST",
  hash: "EEEEEEEEEEEEE",
  payload: "YTYTYTYTYTYT",
  timeout: 9,
});
cache.add({
  app: "system",
  resource: "/xxxx",
  env: "dev",
  method: "GET",
  hash: "QQQQQQQQ",
  payload: "ZZZZZZZZ",
  timeout: 7,
});
cache.add({
  app: "system",
  resource: "/xxxx",
  env: "dev",
  method: "GET",
  hash: "QQQXQQQQQ",
  payload: "ZZZZnZZZZ",
  timeout: 9,
});

let  x = cache.get({
  app: "system",
  resource: "/xxxx",
  env: "dev",
  method: "POST",
  hash: "EEEEEEEEEEEEE",
  payload: "MMMMMMMMMMMMMMM",
  timeout: 19,
});
console.log("Get Cache Entry:", x);

//cache.delete({ app: "system" });
console.log("Fin", cache.root, cache.timeouts);

