import { getAllMethods } from "../../../../../db/method.js";

export async function fnGetMethod(params) {
  let r = { code: 204, data: undefined };
  try {
    const methods = await getAllMethods();

    r.data = methods;
    r.code = 200;
  } catch (error) {
    res.code(500).json({ error: error.message });
  }
  return r;
}
