import {
  getSystemInfoDynamic,
  getSystemInfoStatic,
} from "../../../../systeminformation.js";
import {
  createLog,
  getLogs,
  getLogsRecordsPerMinute, getLogSummaryByAppStatusCode
} from "../../../../../db/log.js";

export async function fnGetLogSummaryByAppStatusCode(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await getLogSummaryByAppStatusCode(params?.request?.query);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetLogs(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await getLogs(params?.request?.query);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnInsertLog(params) {
  let r = { data: undefined, code: 204 };
  try {
    let data = await createLog(params.request.body);
    r.data = data;
    r.code = 200;
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export const fnGetSystemInfoDynamic = async () => {
  let r = { code: 204, data: undefined };
  try {
    r.data = await getSystemInfoDynamic();
    r.code = 200;
  } catch (error) {
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
};

export async function fnGetLogsRecordsPerMinute(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await getLogsRecordsPerMinute(params?.request?.query);

    r.data = data;
    r.code = 200;
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export const fnGetSystemInfoStatic = async () => {
  let r = { code: 204, data: undefined };
  try {
    r.data = await getSystemInfoStatic();
    r.code = 200;
  } catch (error) {
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
};
