import { EncryptPwd, GenToken, customError } from "../server/utils.js";
import { UserProfile, User, UserProfileEndpoint } from "./models.js";
import { Op } from "sequelize";

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
      "ctrl",
      "exp_time",
    ],
  });

  return dataUser;
};

export const defaultUser = async () => {
  try {
    // Verificar si el usuario "admin" ya existe
    const existingUser = await User.findOne({
      where: { username: "superuser" },
    });

    if (!existingUser) {
      // El usuario "superuser" no existe, se realiza la inserción
      await User.create({
        username: "superuser",
        password: EncryptPwd("superuser"),
        first_name: "super",
        last_name: "user",
        email: "superuser@example.com",
        ctrl: {},
      });
    }

    const existingClient = await User.findOne({
      where: { username: "client_api" },
    });

    if (!existingClient) {
      // El usuario "superuser" no existe, se realiza la inserción
      await User.create({
        username: "client_api",
        password: EncryptPwd("1234567890"),
        first_name: "client",
        last_name: "api",
        email: "superuser@example.com",
        ctrl: {},
      });
    }

    // Verificar si el usuario "admin" ya existe
    const existingUserAdmin = await User.findOne({
      where: { username: "admin" },
    });

    if (!existingUserAdmin) {
      // El usuario "demouser" no existe, se realiza la inserción
      await User.create({
        username: "admin",
        password: EncryptPwd("admin@admin"),
        first_name: "admin",
        last_name: "user",
        email: "admin@example.com",
        ctrl: {
          as_admin: true,
          env: {
            dev: {
              app: {
                create: true,
                delete: true,
                edit: true,
                read: true,
              },
            },
            qa: {
              app: {
                create: true,
                delete: true,
                edit: true,
                read: true,
              },
            },
            prd: {
              app: {
                create: true,
                delete: true,
                edit: true,
                read: true,
              },
            },
          },
        },
      });
    }

    // Verificar si el usuario "demo" ya existe
    const existingUserDemo = await User.findOne({
      where: { username: "demo" },
    });

    if (!existingUserDemo) {
      // El usuario "demo" no existe, se realiza la inserción
      await User.create({
        username: "demo",
        password: EncryptPwd("demo1234"),
        first_name: "demo",
        last_name: "user",
        email: "demo@example.com",
        ctrl: {
          as_admin: true,
          env: {
            dev: {
              app: {
                create: true,
                delete: true,
                edit: true,
                read: true,
              },
            },
            qa: {
              app: {},
            },
            prd: {
              app: {},
            },
          },
        },
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

export async function getUserProfileEndpointData({
  username = null,
  userEnabled = null,
  profileName = null,
  profileEnabled = null,
  idendpoint = null,
  only_date_valid = false,
  raw = false,
} = {}) {
  const now = new Date();

  // ===============================
  // WHERE dinámico del usuario
  // ===============================
  const userWhere = {};
  if (username) userWhere.username = username;
  if (userEnabled !== null) userWhere.enabled = userEnabled;

  // ===============================
  // WHERE dinámico del perfil
  // ===============================
  const profileWhere = {};
  if (profileName) profileWhere.name = profileName;
  if (profileEnabled !== null) profileWhere.enabled = profileEnabled;

  // ===============================
  // WHERE dinámico de la relación user ↔ profile
  // ===============================
  const profileRelationWhere = {};

  if (only_date_valid) {
    profileRelationWhere.startAt = {
      [Op.or]: [{ [Op.lte]: now }, { [Op.is]: null }],
    };
    profileRelationWhere.endAt = {
      [Op.or]: [{ [Op.gte]: now }, { [Op.is]: null }],
    };
  }

  // ===============================
  // WHERE dinámico de la vigencia del perfil
  // ===============================
  if (only_date_valid) {
    profileWhere.startAt = { [Op.or]: [{ [Op.lte]: now }, { [Op.is]: null }] };
    profileWhere.endAt = { [Op.or]: [{ [Op.gte]: now }, { [Op.is]: null }] };
  }

  // ===============================
  // Consulta principal: usuarios + perfiles
  // ===============================
  let users = await User.findAll({
    where: userWhere,
    include: [
      {
        model: UserProfile,
        as: "profiles",
        where: Object.keys(profileWhere).length ? profileWhere : undefined,
        through: {
          attributes: [],
          where: Object.keys(profileRelationWhere).length
            ? profileRelationWhere
            : undefined,
        },
      },
    ],
    raw: raw,
    nest: !raw,
  });

  if (raw) return users;

  users = users.map((u) => {
    return u.toJSON();
  });

  // ===============================
  // Obtener endpoints desde UserProfileEndpoint
  // ===============================
  const profileIds = [
    ...new Set(users.flatMap((u) => u.profiles?.map((p) => p.idprofile) || [])),
  ];

  if (profileIds.length === 0) {
    return users.map((u) => ({ ...u, profiles: [] }));
  }

  // WHERE dinámico for UserProfileEndpoint
  const endpointWhere = { idprofile: profileIds };

  if (idendpoint) {
    endpointWhere.idendpoint = idendpoint;
  }

  if (only_date_valid) {
    endpointWhere.startAt = { [Op.or]: [{ [Op.lte]: now }, { [Op.is]: null }] };
    endpointWhere.endAt = { [Op.or]: [{ [Op.gte]: now }, { [Op.is]: null }] };
  }

  const profileEndpoints = await UserProfileEndpoint.findAll({
    where: endpointWhere,
    raw: true,
  });

  // Agrupación por idprofile
  const endpointsGrouped = {};
  for (const row of profileEndpoints) {
    if (!endpointsGrouped[row.idprofile]) {
      endpointsGrouped[row.idprofile] = [];
    }
    endpointsGrouped[row.idprofile].push({
      idendpoint: row.idendpoint,
      enabled: row.enabled,
      startAt: row.startAt,
      endAt: row.endAt,
    });
  }

  // ===============================
  // Construcción del árbol JSON final
  // ===============================
  const result = users.map((item) => {
    let u = item.toJSON();

    return {
      iduser: u.iduser,
      username: u.username,
      fullname: u.fullname,
      email: u.email,
      enabled: u.enabled,
      profiles: u.profiles.map((pr) => {
        let p = pr.toJSON();
        return {
          idprofile: p.idprofile,
          name: p.name,
          description: p.description,
          enabled: p.enabled,
          startAt: p.startAt,
          endAt: p.endAt,
          endpoints: endpointsGrouped[p.idprofile] || [],
        };
      }),
    };
  });

  return result.toJSON();
}
