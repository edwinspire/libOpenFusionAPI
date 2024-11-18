export async function fnPublicDemo(params) {
  let r = { code: 204, data: undefined };
  try {
    // @ts-ignore
    //  res.code(200).json({ function: "Demo function" });
    r = { code: 200, data: { function: "Demo function" } };

    params.reply.code(200).send(r);
  } catch (error) {
    // @ts-ignore
    r = { code: 500, data: error };
    params.reply.code(200).send(r);
  }
  //	return r;
}

export async function fnPublicDemoDev(params) {
  try {
    // @ts-ignore
    params.reply.code(200).send({ function: "Demo function" });
  } catch (error) {
    // @ts-ignore
    params.reply.code(500).send({ error: error.message });
  }
}

export async function fnPublicAdd(params) {
  //console.log(params);
  try {
    let a =
      Number(params.request.query.a) || Number(params.request.body.a) || 0;
    let b =
      Number(params.request.query.b) || Number(params.request.body.b) || 0;

    // @ts-ignore
    params.reply.code(200).send({ result: a + b });
  } catch (error) {
    // @ts-ignore
    params.reply.code(500).send({ error: error.message });
  }
}
