import { jsonDeepFilterOptimized } from "../src/lib/server/jsonDeepFilterOptimized.js";
import { demo_app } from "../src/lib/db/default/demo.js";

let res = jsonDeepFilterOptimized(['new'], demo_app);
console.log(res);
