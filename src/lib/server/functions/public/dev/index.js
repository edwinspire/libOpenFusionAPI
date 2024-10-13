export async function fnPublicDemo(
params) {
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
	params
) {
	try {
		// @ts-ignore
		params.reply.code(200).json({ function: 'Demo function' });
	} catch (error) {
		// @ts-ignore
		params.reply.code(500).json({ error: error.message });
	}
}

export async function fnPublicAdd(
	params
) {
	try {
		let a = Number(params.request.query.a) || Number(params.request.body.a) || 0;
		let b = Number(params.request.query.b) || Number(params.request.body.b) || 0;

		// @ts-ignore
		params.reply.code(200).json({ result: a + b });
	} catch (error) {
		// @ts-ignore
		params.reply.code(500).json({ error: error.message });
	}
}
