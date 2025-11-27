import { login } from "../../../../db/user.js";
import { getAllHandlers } from "../../../../db/handler.js";
import { getAllMethods } from "../../../../db/method.js";
import { getAllUsers } from "../../../../db/user.js";
import {
  upsertEndpoint,
  getEndpointById,
  getEndpointByIdApp,
} from "../../../../db/endpoint.js";
import {
  getAllApps,
  getAppById,
  getAppFullById,
  upsertApp,
  saveAppWithEndpoints,
  restoreAppFromBackup,
  getAppBackupById,
} from "../../../../db/app.js";
import {
  createLog,
  getLogs,
  getLogsRecordsPerMinute,
} from "../../../../db/log.js";
import {
  upsertAppVar,
  deleteAppVar,
  getAppVarsByIdApp,
} from "../../../../db/appvars.js";
import {
  getIntervalTask,
  upsertIntervalTask,
  deleteIntervalTask,
} from "../../../../db/interval_task.js";
import { listFunctionsVars } from "../../../utils.js";
import { generateDocumentation } from "../../../doc_generator.js";
import { version } from "../../../version.js";
import { getHandlerDoc } from "../../../../handler/handler.js";
import {
  getSystemInfoDynamic,
  getSystemInfoStatic,
} from "../../../systeminformation.js";

export async function fnListFnVarsHandlerJS(params) {
  let r = { code: 204, data: undefined };
  try {
    let fnVars = listFunctionsVars();
    let fnResult = {};
    let keys = Object.keys(fnVars).sort();

    for (let index = 0; index < keys.length; index++) {
      const k = keys[index];
      fnResult[k] = fnVars[k];
    }

    r.data = fnResult;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnDemo(/** @type {any} */ params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = { demo: "demo" };
    r.code = 200;
    //res.code(200).json({ demo: 'demo' });
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnLogin(params) {
  let r = { code: 204, data: undefined };
  try {
    let user = await login(
      params.request.body.username,
      params.request.body.password
    );

    //res.header("OFAPI-TOKEN", '');
    params.reply.cookie("OFAPI-TOKEN", "");

    if (user.login) {
      //res.header("OFAPI-TOKEN", user.token);

      let aut = `Bearer ${user.token}`;
      params.reply.header("Authorization", aut);
      params.reply.cookie("OFAPI-TOKEN", user.token);

      //res.code(200).json(user);
      r.data = user;
      r.code = 200;
    } else {
      //			res.code(401).json(user);
      r.data = user;
      r.code = 401;
    }
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnToken(params) {
  return fnLogin(params.request, params.data_user, params.reply);
}

export async function fnLogout(params) {
  let r = { data: undefined, code: 204 };
  try {
    // TODO: ver la forma de hacer un logout correctamente e invalide el token
    params.reply.set("OFAPI-TOKEN", undefined);

    /*
		res.code(200).json({
			logout: true
		});
		*/

    r.data = {
      logout: true,
    };
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetHandler(params) {
  let r = { code: 204, data: undefined };
  try {
    const hs = await getAllHandlers();

    //res.code(200).json(hs);

    r.data = hs;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
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
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetUsersList(params) {
  let r = { code: 204, data: undefined };
  try {
    let us = await getAllUsers();

    us = us.map((u) => {
      return {
        iduser: u.iduser,
        enabled: u.enabled,
        username: u.username,
        name: u.last_name + " " + u.first_name,
        email: u.email,
      };
    });

    r.data = us;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetMethod(params) {
  let r = { code: 204, data: undefined };
  try {
    const methods = await getAllMethods();

    //res.code(200).json(methods);

    r.data = methods;
    r.code = 200;
  } catch (error) {
    res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetEnvironment(params) {
  let r = { code: 204, data: undefined };
  try {
    let env = [
      { id: "dev", text: `Development` },
      { id: "qa", text: `Quality` },
      { id: "prd", text: `Production` },
    ];

    //res.code(200).json(env);
    r.code = 200;

    r.data = env;
  } catch (error) {
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetApps(params) {
  let r = { code: 204, data: undefined };
  try {
    const apps = await getAllApps();

    //res.code(200).json(apps);

    r.data = apps;
    r.code = 200;
  } catch (error) {
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnEndpointGetById(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    //console.log(req.params, req.query, raw);

    r.data = await getEndpointById(params.request.query.idapp, raw);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnEndpointGetByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    //console.log(req.params, req.query, raw);

    r.data = await getEndpointByIdApp(params.request.query.idapp, raw);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnEndpointUpsert(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await upsertEndpoint(params.request.body);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetAppById(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    //console.log(req.params, req.query, raw);

    r.data = await getAppFullById(params.request.query.idapp, raw);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetAppDocById(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getAppFullById(params.request.body.idapp, false);

    if (r.data && Array.isArray(r.data) && r.data.length > 0) {
      r.data = {
        html: generateDocumentation(
          r.data[0],
          version,
          params.request.body.endpoints
        ),
      };
      r.code = 200;
    } else {
      r.data = { error: "App not found" };
      r.code = 404;
    }

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnAppGetById(params) {
  let r = { code: 200, data: undefined };
  try {
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;

    //console.log(req.params, req.query, raw);

    r.data = await getAppById(params.request.query.idapp, raw);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnAppUpsert(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await upsertApp(params.request.body);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fndeleteIntervalTask(params) {
  let r = { code: 204, data: undefined };
  try {
    //		res.code(200).json(data);
    r.data = await deleteIntervalTask(params.request.body);
    r.code = 200;
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetIntervalTasksByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    /*
    let raw =
      !params.request.query.raw || params.request.query.raw == "false"
        ? false
        : true;
        */

    //console.log(req.params, req.query, raw);

    r.data = await getIntervalTask({
      app: { idapp: params.request.query.idapp },
    });
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnSaveApp(params) {
  let r = { data: undefined, code: 204 };
  try {
    //		res.code(200).json(data);
    r.data = await saveAppWithEndpoints(params.request.body);
    r.code = 200;
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnUpsertIntervalTask(params) {
  let r = { data: undefined, code: 204 };
  try {
    //		res.code(200).json(data);
    r.data = await upsertIntervalTask(params.request.body);
    r.code = 200;
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnFunctionNames(params) {
  let r = { data: undefined, code: 204 };
  try {
    //  console.log("\n\n\n", params.server_data);

    r.data = [];
    r.code = 200;

    if (!params.request.query.environment || !params.request.query.appName) {
      r.code = 400;
    } else if (
      params &&
      params.server_data &&
      params.request.query.appName &&
      params.request.query.environment
    ) {
      let fnNames = params.server_data.endpoint_class.getFnNames();

      if (fnNames && fnNames[params?.request?.query?.environment]) {
        let public_fns =
          fnNames[params.request.query.environment]["public"] || [];
        let app_fns =
          fnNames[params.request.query.environment][
            params.request.query.appName
          ] || [];

        // Une las dos matrices eliminando duplicados
        r.data = [...new Set([...public_fns, ...app_fns])];
      }
    }
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetCacheSize(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    r = params.server_data.endpoint_class.getCacheSize(
      params?.request?.query?.appName
    );
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetResponseCountStatus(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    r = params.server_data.endpoint_class.getResponseCountStatusCode(
      params?.request?.query?.appName
    );
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetInternalAppMetrics(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    r = params.server_data.endpoint_class.getInternalAppMetrics(
      params?.request?.query?.appName
    );
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnClearCache(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = [];
    r.code = 200;

    let data = params.request.body;
    let clear_cache = [];

    if (data && Array.isArray(data) && data.length > 0) {
      clear_cache = data.map((u) => {
        return {
          url: u,
          clear: params.server_data.endpoint_class.clearCache(u),
        };
      });
    }

    r.data = clear_cache;
  } catch (error) {
    //console.log(error);

    r.data = error;
    r.code = 500;
    //res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnTelegramsendMessage(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = {};
    r.code = 200;

    let data = params.request.body;

    if (!data) {
      r.code = 400;
      r.data = { error: "No data" };
    }

    if (r.code == 200 && !data.chatId) {
      r.code = 400;
      r.data = { error: "chatId is required" };
    }

    if (r.code == 200 && !data.message) {
      r.code = 400;
      r.data = { error: "message is required" };
    }

    if (r.code == 200 && params?.reply?.openfusionapi?.telegram) {
      r.data = await params.reply.openfusionapi.telegram.sendMessage(
        data.chatId,
        data.message,
        data.extra,
        data.autoscape
      );
    }
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnTelegramsendPhoto(params) {
  let r = { data: undefined, code: 204 };
  try {
    r.data = {};
    r.code = 200;

    let data = params.request.body;

    if (!data) {
      r.code = 400;
      r.data = { error: "No data" };
    }

    if (r.code == 200 && !data.chatId) {
      r.code = 400;
      r.data = { error: "chatId is required" };
    }

    if (r.code == 200 && !data.url_photo) {
      r.code = 400;
      r.data = { error: "url_photo is required" };
    }

    if (r.code == 200 && params?.reply?.openfusionapi?.telegram) {
      r.data = await params.reply.openfusionapi.telegram.sendPhoto(
        data.chatId,
        data.url_photo,
        data.extra,
        data.autoscape
      );
    }
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnRestoreAppFromBackup(params) {
  let r = { data: undefined, code: 204 };
  try {
    let data = await restoreAppFromBackup(params.request.body);
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

export async function fnGetHandlerDocs(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await getHandlerDoc(params.request.query.handler);
    r.code = 200;
  } catch (error) {
    //res.code(500).json({ error: error.message });
    r.data = error;
    r.code = 500;
  }
  return r;
}

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

export async function fnGetAppVarsByIdApp(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getAppVarsByIdApp(params.request.query.idapp);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

export async function fnGetAppBackupById(params) {
  let r = { code: 200, data: undefined };
  try {
    r.data = await getAppBackupById(params.request.query.idapp);
    r.code = 200;

    //res.code(200).json(data);
  } catch (error) {
    console.log(error);

    r.data = error;
    r.code = 500;
    //		res.code(500).json({ error: error.message });
  }
  return r;
}

//
export async function fnDeleteAppVar(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await deleteAppVar(params.request.query.idvar);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnUpsertAppVar(params) {
  let r = { code: 204, data: undefined };
  try {
    r.data = await upsertAppVar(params.request.body);
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}
