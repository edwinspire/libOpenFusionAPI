export function fnPublicDemo(
  /** @type {any} */ req,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  try {
    // @ts-ignore
    res.code(200).json({ function: "Demo function" });
  } catch (error) {
    // @ts-ignore
    res.code(500).json({ error: error.message });
  }
}

export function fnPublicAdd(
  /** @type {any} */ req,
  /** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  try {
    let a = Number(req.query.a) || Number(req.body.a) || 0;
    let b = Number(req.query.b) || Number(req.body.b) || 0;

    // @ts-ignore
    res.code(200).json({ result: a + b });
  } catch (error) {
    // @ts-ignore
    res.code(500).json({ error: error.message });
  }
}
