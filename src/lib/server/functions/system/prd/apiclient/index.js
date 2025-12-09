import { getUserPasswordTokenFromRequest } from "../../../../utils.js";
import { GetSystemPaths } from "../../../../utils_path.js";
import uFetch from "@edwinspire/universal-fetch";

import {
  createApiClient,
  ApiClientfindByIdOrUsername,
  loginApiClient,
  updateAPIClientPassword,
} from "../../../../../db/apiclient.js";
import { userRegister } from "../../../../templates/email/user_register.js";

const SYSTEM_PATHS = GetSystemPaths();

export async function fnUpdateAPIClientPassword(params) {
  let r = { data: undefined, code: 204 };
  // TODO: controlar que solo el usuario pueda cambiar su propia clave y no la de otros usuarios.
  try {
    let data = await updateAPIClientPassword(params?.request?.body);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnCreateApiClient(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await createApiClient(params?.request?.body);

    if (data && data.client) {
      let mail = {
        from: "noreply@openfusionapi.com",
        to: "edwinspire@gmail.com",
        subject: `Welcome ${data.client.username}`,
        html: userRegister(data.client.username, data.password),
      };

      // Enviar por email la clave al usuario
      const uF = new uFetch(SYSTEM_PATHS.SEND_EMAIL.PATH);
      uF.setBearerAuthorization(process.env.USER_OPENFUSIONAPI_TOKEN);
      const req = await uF[SYSTEM_PATHS.SEND_EMAIL.METHOD]({ data: mail });
      const res = await req.json();

      let token = GenToken({ api: u }, 10 * 60); // Valido por 10 minutos

      // TODO: Si falla el envio al correo guardar en log
      r.data = { client: data.client, sendto: res.accepted, token: token };
      r.code = 200;
    } else {
      r.data = { error: "Client not saved." };
      r.code = 500;
    }
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnGetApiClientfindByIdOrUsername(params) {
  let r = { data: undefined, code: 204 };

  try {
    let data = await ApiClientfindByIdOrUsername(params?.request?.query);

    r.data = data;
    r.code = 200;
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}

export async function fnLoginApiClient(params) {
  let r = { data: undefined, code: 204 };

  let auth_data = getUserPasswordTokenFromRequest(params.request);

  try {
    let data = await loginApiClient(
      auth_data.Basic.username,
      auth_data.Basic.password
    );

    // Establecer una cookie básica
    params.reply.setCookie("OFAPI_TOKEN", "", {
      path: "/", // Ruta para la que es válida la cookie
      httpOnly: true, // La cookie no es accesible desde JavaScript
      //secure: true,       // Solo se envía en conexiones HTTPS
      sameSite: "Strict", // Protección CSRF (opciones: 'Strict', 'Lax', 'None')
      maxAge: 5, //  (en segundos)
      //domain: 'tudominio.com' // Dominio para el que es válida
    });

    if (data.login) {

      let aut = `Bearer ${data.token}`;
      params.reply.header("Authorization", aut);

      params.reply.setCookie("OFAPI_TOKEN", data.token, {
        path: "/", // Ruta para la que es válida la cookie
        httpOnly: true, // La cookie no es accesible desde JavaScript
        //secure: true,       // Solo se envía en conexiones HTTPS
        sameSite: "Lax", // Protección CSRF (opciones: 'Strict', 'Lax', 'None')
        maxAge: 60 * 60, // (en segundos)
        //domain: 'tudominio.com' // Dominio para el que es válida
      });

      r.data = data;
      r.code = 200;
    } else {
      r.data = user;
      r.code = 401;
    }
  } catch (error) {
    r.data = error;
    r.code = 500;
  }
  return r;
}
