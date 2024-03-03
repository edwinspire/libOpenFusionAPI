import { User } from "./models.js";
//import { getRoleById } from "./role.js";
import { EncryptPwd, GenToken, customError, md5 } from "../server/utils.js";

export const upsertUser = async (
  /** @type {import("sequelize").Optional<any, string>} */ userData
) => {
  try {
    const [user, created] = await User.upsert(userData);
    return { user, created };
  } catch (error) {
    console.error("Error performing UPSERT on user:", error);
    throw error;
  }
};

// READ
export const getUserById = async (
  /** @type {import("sequelize").Identifier | undefined} */ userId
) => {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

// DELETE
export const deleteUser = async (
  /** @type {import("sequelize").Identifier | undefined} */ userId
) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.destroy();
      return true; // Deletion successful
    }
    return false; // User not found
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * @param {string} username
 * @param {string} password
 */
export const getUserByCredentials = async (username, password) => {
  let dataUser = await User.findOne({
    where: { username: username, password: password },
    attributes: [
      "iduser",
      "enabled",
      "username",
      "first_name",
      "last_name",
      "email",
      "attrs",
      "exp_time",
    ],
  });

  return dataUser;
};

// Usage examples
export const defaultUser = async () => {
  try {
    // Verificar si el usuario "admin" ya existe
    const existingUser = await User.findOne({
      where: { username: "superuser" },
    });

    if (!existingUser) {
      // El usuario "admin" no existe, se realiza la inserción
      await User.create({
        username: "superuser",
        password: EncryptPwd("superuser"),
        first_name: "super",
        last_name: "user",
        email: "superuser@example.com",
        attrs: { dev: { admin: true }, qa: { admin: true }, prd: { admin: true } },
      });
    }

    // Verificar si el usuario "admin" ya existe
    const existingUserDemo = await User.findOne({
      where: { username: "demouser" },
    });

    if (!existingUserDemo) {
      // El usuario "admin" no existe, se realiza la inserción
      await User.create({
        username: "demouser",
        password: EncryptPwd("demouser"),
        first_name: "demo",
        last_name: "user",
        email: "demo@example.com",
        attrs: { dev: { demo: true }, qa: { demo: true }, prd: { demo: true } },
      });
    }

    return true;
    //console.log(' defaultUser >>>>>> ', super_role);
  } catch (error) {
    console.error("Example error:", error);
    return false;
  }
};

/**
 * @param {string} username
 * @param {string} password
 */
export async function login(username, password) {
  try {
    let user = await getUserByCredentials(
      username || "",
      EncryptPwd(password || "")
    );

    if (user) {
      let u = user.toJSON();

      /*
      // Get data role
      let role_result = await getRoleById(user.idrole);

      if (role_result.enabled) {
        u.role = {
          admin: role_result.admin,
          attrs: role_result.attrs,
          name: role_result.name,
        };
      }
      */

      let token = GenToken(u, u.exp_time);

      await user.update({ last_login: new Date() });
      await user.save();

      return {
        login: true,
        user: u,
        token: token,
      };
    } else {
      return customError(2);
    }
  } catch (error) {
    return error;
  }
}
