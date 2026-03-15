import { login } from "../db/user.js";
import { getUserPasswordTokenFromRequest } from "./utils.js";

export class AuthService {
  static check_auth_Bearer(handler, data_aut) {
    let check = false;

    if (data_aut?.Bearer?.data?.apikey?.idapp == handler.params.idapp) {
      check = true; 
    } else if (data_aut?.Bearer?.data?.admin && handler.params) {
      let user = data_aut.Bearer.data.admin;

      if (user.username == "superuser" && user.enabled) {
        check = true;
      } else if (handler.params.app == "system" && user.ctrl.as_admin) {
        check = true;
      } else if (handler.params.app == "system" && !user.ctrl.as_admin) {
        check = false;
      }
    }

    return check;
  }

  static async check_auth_Basic(handler, data_aut) {
    let user = await login(data_aut.Basic.username, data_aut.Basic.password);

    if (user.login) {
      data_aut.Bearer.data = user;
      return AuthService.check_auth_Bearer(handler, data_aut) ? user : null;
    } else {
      return false;
    }
  }

  static async check_auth(handler, request, reply) {
    if (handler.params.access > 0) {
      let data_aut = getUserPasswordTokenFromRequest(request);

      if (handler.params.app == "system") {
        if (AuthService.check_auth_Bearer(handler, data_aut)) {
          request.openfusionapi.user = data_aut.Bearer.data;
        } else {
          reply.code(401).send({
            error: "The System API requires a valid Token.",
            url: request.url,
          });
          return;
        }
      } else {
        switch (handler.params.access) {
          case 1: // Basic
            if (data_aut.Basic.username && data_aut.Basic.password) {
              let checkbasic = await AuthService.check_auth_Basic(handler, data_aut);
              if (checkbasic) {
                request.openfusionapi.user = checkbasic;
              }
            } else {
              reply.code(401).send({
                error: "The API requires a valid Username y Password",
                url: request.url,
              });
            }
            break;

          case 3:
            if (AuthService.check_auth_Bearer(handler, data_aut)) {
              request.openfusionapi.user = data_aut.Bearer.data;
            } else if (data_aut.Basic.username && data_aut.Basic.password) {
              let checkbasic = await AuthService.check_auth_Basic(handler, data_aut);
              if (checkbasic) {
                request.openfusionapi.user = checkbasic;
              }
            } else {
              reply.code(401).send({
                error: "The API requires a Token or Username and Password",
                url: request.url,
              });
            }
            break;
            
          default:
            if (AuthService.check_auth_Bearer(handler, data_aut)) {
              request.openfusionapi.user = data_aut.Bearer.data;
            } else {
              reply.code(401).send({
                error: "The API requires a valid Token.",
                url: request.url,
              });
              return;
            }
            break;
        }
      }
    }
  }
}
