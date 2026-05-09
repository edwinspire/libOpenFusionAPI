import { Endpoint } from "../src/lib/db/models.js";
const e = await Endpoint.findOne({ where: { idendpoint: '0f9b28e3-5412-45dd-82f6-c5bf1778d104' } });
console.log(JSON.stringify(e.resource));
process.exit(0);
