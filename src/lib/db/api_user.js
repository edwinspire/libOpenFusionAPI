import { ApiUser, Application, prefixTableName } from "./models.js";
import { GenToken, EncryptPwd, customError } from "../server/utils.js";

/**
 * @param {string} app_name
 * @param {string} username
 * @param {string} password
 */
export async function getAPIToken(app_name, username, password) {
  try {
    let user = await Application.findOne({
      where: { app: app_name, enabled: true },
      attributes: ["idapp", "app"],
      include: {
        model: ApiUser,
        required: false, // INNER JOIN
        attributes: ["validity_time", "env_dev", "env_qa", "env_prd"],
        where: {
          enabled: true,
          username: username,
          password: EncryptPwd(password || ""),
        },
      },
      //raw: raw,
      nest: false,
    });

    if (user) {
      let u = user.toJSON();

      if (
        u[prefixTableName("api_users")] &&
        Array.isArray(u[prefixTableName(api_users)]) &&
        u[prefixTableName("api_users")].length > 0
      ) {
        //				console.log('------->>>>>>>>>>>>>>>>> ', u);

        let au = u[prefixTableName("api_users")][0];

        // Envía el Token en el Header
        let token = GenToken(
          {
            for: "api",
            user: username,
            app: app_name,
            attr: au,
          },
          au.validity_time
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
