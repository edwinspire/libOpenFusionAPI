import { login } from "../../../../db/user.js";
import { getAllMethods } from "../../../../db/method.js";
import { getAllApps, getAppById, upsertApp } from "../../../../db/app.js";
import { v4 as uuidv4 } from "uuid";
import { upsertEndpoint } from "../../../../db/endpoint.js";

export async function fnDemo(
  // @ts-ignore
  /** @type {any} */ req,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  let r = { code: 204, data: undefined };
  try {
    // @ts-ignore
    r.data = { demo: "demo" };
    r.code = 200;
    //res.code(200).json({ demo: 'demo' });
  } catch (error) {
    // @ts-ignore
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}
