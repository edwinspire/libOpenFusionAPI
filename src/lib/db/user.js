import { EncryptPwd, GenToken, customError } from "../server/utils.js";
import { validatePasswordSecurity } from "./utils.js";
import { UserProfile, User, UserProfileEndpoint } from "./models.js";
import dbsequelize from "./sequelize.js";
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

/**
 * Actualiza la contraseña de un usuario con validación de la clave anterior
 * @param {string} username - Nombre de usuario
 * @param {string} oldPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function updateUserPassword({
  username,
  oldPassword,
  newPassword,
}) {
  const transaction = await dbsequelize.transaction();

  try {
    // 1. Validar parámetros de entrada
    if (!username || !oldPassword || !newPassword) {
      throw new Error(
        "All parameters are required: username, oldPassword, newPassword"
      );
    }

    if (oldPassword === newPassword) {
      throw new Error("The new password must be different from the old one.");
    }

    let validationSecurity = validatePasswordSecurity(newPassword);
    if (!validationSecurity.isValid) {
      throw new Error(validationSecurity.errors[0]);
    }

    // 2. Buscar usuario y verificar contraseña actual
    const user = await User.findOne({
      where: {
        username,
        enabled: true,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gte]: new Date() },
      },
      transaction,
    });

    if (!user) {
      throw new Error("User not found or inactive");
    }

    const oldPasswordHash = EncryptPwd(oldPassword || "");
    // 3. Verificar contraseña actual
    const isCurrentPasswordValid = oldPasswordHash == user.password;

    if (!isCurrentPasswordValid) {
      throw new Error("The current password is incorrect.");
    }

    // 4. Hashear nueva contraseña
    const hashedNewPassword = EncryptPwd(newPassword);

    // 5. Actualizar contraseña
    const [affectedRows] = await User.update(
      {
        password: hashedNewPassword,
      },
      {
        where: { username },
        transaction,
      }
    );

    if (affectedRows === 0) {
      throw new Error("The password could not be updated.");
    }

    // 6. Confirmar transacción
    await transaction.commit();

    return {
      success: true,
      message: "Password successfully updated",
      username: user.username,
      updatedAt: new Date(),
    };
  } catch (error) {
    // 7. Revertir transacción en caso de error
    await transaction.rollback();

    console.error("Password update error:", error.message);

    return {
      success: false,
      error: error.message,
      username,
    };
  }
}
