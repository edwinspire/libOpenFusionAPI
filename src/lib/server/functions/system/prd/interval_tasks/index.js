import {
  getIntervalTask,
  upsertIntervalTask,
  deleteIntervalTask,
} from "../../../../../db/interval_task.js";

export async function fnGetIntervalTasksByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getIntervalTask({
      app: { idapp: params.request.query.idapp },
    });
    r.code = 200;
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnUpsertIntervalTask(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = await upsertIntervalTask(params.request.body);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fndeleteIntervalTask(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await deleteIntervalTask(params.request.body);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}
