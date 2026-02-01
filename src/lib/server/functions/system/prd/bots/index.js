import {
  upsertBot,
  deleteBot,
  getAllBots,
} from "../../../../../db/bot.js";

export async function fnUpsertBot(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await upsertBot(params.request.body);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetAllBots(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await getAllBots();
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}


//
export async function fnDeleteBot(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await deleteBot(params.request.query.idbot);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}


