export async function fnPublicDemo(
  /** @type {any} */ req,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  let r = {status: 204, data: undefined};
  try {
    // @ts-ignore
    //res.status(200).json({ function: "Demo function" });
    r.status = 200;
    // @ts-ignore
    r.data = { function: "Demo function" };
  } catch (error) {
    // @ts-ignore
    r.data = error;
    r.status = 500;
    //res.status(500).json({ error: error.message });
  }
  return r;
}

export function fnPublicAdd(
  /** @type {any} */ req,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  try {
    let a = Number(req.query.a) || Number(req.body.a) || 0;
    let b = Number(req.query.b) || Number(req.body.b) || 0;

    // @ts-ignore
    res.status(200).json({ result: a + b });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
}
