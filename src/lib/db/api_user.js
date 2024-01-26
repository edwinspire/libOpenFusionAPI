import { ApiUser, Application, APIUserMapping } from "./models.js";
import { GenToken, EncryptPwd, customError } from "../server/utils.js";
import { Op, Sequelize } from "sequelize";

// Usage examples
export const defaultAPIUser = async () => {
  try {
    // Verificar si el usuario "admin" ya existe
    const existingUser = await ApiUser.findOne({
      where: { username: "demouser" },
    });
    if (existingUser) {
      // El usuario "admin" ya existe, no se realiza la inserción
      return;
    }

    await ApiUser.create({
      enabled: true,
      username: "demouser",
      password: EncryptPwd("demouser"),
      idapp: "c4ca4238a0b923820dcc509a6f75849b",
      env_dev: true,
      env_qa: true,
      env_prd: true,
      notes: "User for demo App",
    });
  } catch (error) {
    console.error("Example error:", error);
    return;
  }
};

/**
 * @param {string} username
 * @param {string} password
 */
export async function getAPIToken(username, password) {
  try {
    let user = await getAPIUserByCredentials(username, password);

    if (user) {
      
      // Envía el Token en el Header
        let token = GenToken(
          {
            for: "api",
            user: user.username,
            //app: '',
            attr: user.api_user_map,
          },
          user.exp_time * 1000 + Date.now()
        );

        return token;
     
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * @param {string} username
 * @param {string} password
 */
export async function getAPIUserByCredentials(username, password) {
  try {
    let user = await ApiUser.findAll({
      attributes: [
        "idau",
        "username",
        "env_dev",
        "env_qa",
        "env_prd",
        "exp_time",
      ],
      include: [
        {
          model: APIUserMapping,
          attributes: ["idapp"],
          as: "api_user_map",
          required: true,
          include: [
            {
              model: Application,
              required: true,
              as: "application",
              attributes: ["app"],
              where: { enabled: true },
            },
          ],
        },
      ],
      where: {
        username: username,
        password: EncryptPwd(password),
        enabled: true,
        start_date: { [Sequelize.Op.lte]: Sequelize.literal("CURRENT_DATE") },
        end_date: { [Sequelize.Op.gte]: Sequelize.literal("CURRENT_DATE") },
      },
      raw: false,
      nest: true,
    });

    let data_user;
    if (user && Array.isArray(user) && user.length > 0) {
      let u0 = user[0];
      data_user = {};

//      data_user.idau = u0.idau;
      data_user.username = u0.username;
      data_user.env_dev = u0.env_dev;
      data_user.env_qa = u0.env_qa;
      data_user.env_prd = u0.env_prd;
      data_user.exp_time = u0.exp_time;

      data_user.attr = u0.api_user_map.map((um) => {
        return um.application.dataValues.app;
      });
    }

    return data_user;
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
