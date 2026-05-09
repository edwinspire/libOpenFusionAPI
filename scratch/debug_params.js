import { get_url_params } from "../src/lib/server/utils_path.js";

const url = "/api/system/api/endpoint/source/summary/prd";
const method = "POST";

console.log(`Testing get_url_params with url: ${url}`);
const params = get_url_params(url, method);

console.log("Resulting params:", JSON.stringify(params, null, 2));
