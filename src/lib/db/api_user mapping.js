import { ApiUser, Application, APIUserMapping } from "./models.js";
import { GenToken, EncryptPwd, customError } from "../server/utils.js";
import { Op } from "sequelize";

// Usage examples
export const defaultAPIUserMapping = async () => {
  try {
    // Verificar si el usuario "demo" ya existe
    const existingUser = await ApiUser.findOne({
      where: { username: "demouser" },
    });

    if (existingUser) {
      // Obtener el iduser
      let idau = existingUser.idau;

      // Verificar si existe la aplicación "demo"
      const existingApp = await Application.findOne({
        where: { app: "demo" },
      });

      if (existingApp) {
        // Obtiene el idapp
        let idapp = existingApp.idapp;

        // Crea la aplicación
        return await upsertAPIUserMapping({ idapp: idapp, idau: idau });
      } else {
        // La App no existe o ha sido eliminada
        console.log("App demo not found");
        return;
      }
    } else {
      console.log("User demo not found");
      // El usuario no existe, es posible que lo hayan eliminado
      return;
    }

  } catch (error) {
    console.error("Example error:", error);
    return;
  }
};

export const upsertAPIUserMapping = async (
  /** @type {import("sequelize").Optional<any, string>} */ data
) => {
  try {
    const [result, created] = await APIUserMapping.upsert(data, { returning: true });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

/**
 * @param {string} app_name
 * @param {string} username
 * @param {string} password
 */
export async function getAPIToken(app_name, username, password) {
  try {
    let user = await getAPIUser(app_name, username, password);

    if (user) {
      let u = user.toJSON();

      if (u.users && Array.isArray(u.users) && u.users.length > 0) {
        //				console.log('------->>>>>>>>>>>>>>>>> ', u);

        let au = u.users[0];

        // Envía el Token en el Header
        let token = GenToken(
          {
            for: "api",
            user: username,
            app: app_name,
            attr: au,
          },
          au.exp_time * 1000 + Date.now()
        );

        return token;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * @param {string} app_name
 * @param {string} username
 * @param {string} password
 */
export async function getAPIUser(app_name, username, password) {
  try {
    let user = await Application.findOne({
      where: { app: app_name, enabled: true },
      attributes: ["idapp", "app"],
      include: {
        model: ApiUser,
        as: "users",
        required: false, // INNER JOIN
        attributes: [
          "start_date",
          "end_date",
          "exp_time",
          "env_dev",
          "env_qa",
          "env_prd",
        ],
        where: {
          enabled: true,
          username: username,
          password: EncryptPwd(password || ""),
          [Op.and]: [
            {
              start_date: {
                [Op.lte]: new Date(), // Menor o igual a la fecha actual
              },
            },
            {
              end_date: {
                [Op.gte]: new Date(), // Mayor o igual a la fecha actual
              },
            },
          ],
        },
      },
      //raw: raw,
      nest: false,
    });

    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const upsertAPIUser = async (
  /** @type {import("sequelize").Optional<any, string>} */ data
) => {
  try {
    const [result, created] = await ApiUser.upsert(data, { returning: true });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};
