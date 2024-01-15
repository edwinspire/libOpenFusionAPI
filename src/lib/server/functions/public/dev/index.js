export async function fnPublicDemo(
	/** @type {any} */ req,
	/** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
	let r = { code: 204, data: undefined };
	try {
		// @ts-ignore
		//  res.code(200).json({ function: "Demo function" });
		r = { code: 200, data: { function: 'Demo function' } };
	} catch (error) {
		// @ts-ignore
		r = { code: 500, data: error };
	}
	return r;
}

export async function fnPublicDemoDev(
	/** @type {any} */ req,
	/** @type {{ code: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
	try {
		// @ts-ignore
		res.code(200).json({ function: 'Demo function' });
	} catch (error) {
		// @ts-ignore
		res.code(500).json({ error: error.message });
	}
}

export async function fnPublicAdd(
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
