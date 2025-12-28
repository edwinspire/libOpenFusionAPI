import { Op } from "sequelize";
import { ApiClient, ApiKey, ApiKeyEndpoint } from "./models.js";
import { EncryptPwd, GenToken, CreateRandomPassword } from "../server/utils.js";
import { validatePasswordSecurity } from "./utils.js";


export const AuthorizedEnpointsClient = [];

// Agregar este método estático al modelo ApiClient (después de define)
export const ApiClientfindByIdOrUsername = async (filters = {}) => {
  const { idclient, username } = filters;
  // Validación: al menos uno de los parámetros debe estar presente
  if (!idclient && !username) {
    throw new Error('Debe proporcionar al menos "idclient" o "username"');
  }

  const where = {};

  if (idclient && username) {
    // Si se pasan ambos, usar OR (busca por cualquiera de los dos)
    where[Op.or] = [{ idclient }, { username }];
  } else if (idclient) {
    // Solo idclient
    where.idclient = idclient;
  } else {
    // Solo username
    where.username = username;
  }

  // Buscar el registro (incluye timestamps por defecto del modelo)
  const registro = await ApiClient.findOne({
    where,
    // Opcional: incluir campos relacionados si los tienes
    // include: [ /* otros modelos */ ]
  });

  return registro;
};

/**
 * Inserta un nuevo cliente externo (ApiClient).
 * @param {object} data - Datos del cliente.
 * @returns {Promise<object>} - Resultado de la operación.
 */
export async function createApiClient(data, random_password = true) {
  try {
    let randompwd = CreateRandomPassword();
    let pwd;
    if (random_password) {
      pwd = randompwd.password;
      data.password = randompwd.encrypted;
    } else {
      pwd = data.password || randompwd.password;
      data.password = EncryptPwd(pwd);
    }

    const newClient = await ApiClient.create(data);
    let result = newClient.toJSON();
    result.password = undefined;

    return { client: result, password: pwd };
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Finds a valid API client by username and password.
 * Applies the following constraints:
 *  - enabled = true
 *  - current date is between startAt and endAt
 *  - excludes the "password" field from the result
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object|null>} ApiClient data without password
 */
export async function loginApiClient(username, password) {
  const now = new Date();
  
  // 1. Buscar usuario con filtros
  const client = await ApiClient.findOne({
    where: {
      username,
      password: EncryptPwd(password),
      status: ["active", "initial"],
      // startAt: { [Op.lte]: now },
      //   [Op.or]: [{ endAt: null }, { endAt: { [Op.gte]: now } }],
    },
    attributes: {
      exclude: ["password"],
    },
  });

  if (client) {
    let u = client.toJSON();
    const validity = 60 * 60; // Una hora
    // Aqui se asigan los endpoints a los que el cliente tiene acceso (Son definidos desde el sistema y son fijos)
    u.Authorized = AuthorizedEnpointsClient;
    let token = GenToken({ api: u }, validity); // Valido por una hora
    let refresh_token = GenToken(
      {
        api: {
          username: u.username,
          status: u.status,
          email: u.email,
          now: Date.now(),
        },
      },
      validity
    ); // Valido por una hora

    await client.update({ last_login: new Date() });
    await client.save();

    return {
      login: true,
      user: u,
      token: token,
      refresh_token: refresh_token,
    };
  }

  return client;
}

/**
 * Actualiza la contraseña de un usuario con validación de la clave anterior
 * @param {string} username - Nombre de usuario
 * @param {string} oldPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function updateAPIClientPassword({
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
    const user = await ApiClient.findOne({
      where: {
        username,
        status: ["active", "initial"],
        startAt: { [Op.lte]: new Date() },
        endAt: { [Op.gte]: new Date() },
      },
      transaction,
    });

    if (!user) {
      throw new Error("APIClient not found or inactive");
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

// Obtiene los datos del cliente y sus endpoints a los que tiene acceso.
export async function findApiClientTree(filters = {}) {
  const { username, status, email, enabled } = filters;

  const now = new Date();

  // ---------------------------
  // 1. Construcción de filtros dinámicos
  // ---------------------------
  const whereClient = {
    // Fechas válidas
    startAt: { [Op.lte]: now },
    [Op.or]: [{ endAt: { [Op.gte]: now } }, { endAt: null }],
  };

  if (username) whereClient.username = username;
  if (status) whereClient.status = status;
  if (email) whereClient.email = email;

  const whereKey = {
    // Fechas válidas
    startAt: { [Op.lte]: now },
    [Op.or]: [{ endAt: { [Op.gte]: now } }, { endAt: null }],
  };

  if (enabled !== undefined) whereKey.enabled = enabled;

  // ---------------------------
  // 2. Query con JOIN en árbol
  // ---------------------------
  const result = await ApiClient.findAll({
    where: whereClient,
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: ApiKey,
        required: false,
        where: whereKey,
        attributes: ["idkey", "enabled", "startAt", "endAt", "description"],
        include: [
          {
            model: ApiKeyEndpoint,
            required: false,
            attributes: ["idendpoint"],
          },
        ],
      },
    ],
    order: [
      ["username", "ASC"],
      [ApiKey, "startAt", "ASC"],
    ],
  });

  return result;
}
