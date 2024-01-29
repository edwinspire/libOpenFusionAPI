import { Role } from "./models.js";

export const defaultRoles = async () => {
  try {
    // Crea los roles de admin y demo
    // Verificar si el usuario "admin" ya existe
    const existingRolAdmin = await Role.findOne({
      where: { idrole: "21232f297a57a5a743894a0e4a801fc3" },
    });

    if (!existingRolAdmin) {
      // El usuario "admin" no existe, se realiza la inserción
      await Role.create({
        idrole: "21232f297a57a5a743894a0e4a801fc3",
        name: "admin",
        admin: true,
        attrs: {},
      });
    }

    const existingRolDemo = await Role.findOne({
      where: { idrole: "fe01ce2a7fbac8fafaed7c982a04e229" },
    });

    if (!existingRolDemo) {
      // El usuario "admin" no existe, se realiza la inserción
      await Role.create({
        idrole: "fe01ce2a7fbac8fafaed7c982a04e229",
        name: "demo",
        admin: false,
        attrs: {
          "demo": { dev: true, qa: true, prd: true },
        },
      });
    }
    return true;
  } catch (error) {
    console.error("Role error:", error);
    return false;
  }
};

export const getRoleById = async (
  /** @type {import("sequelize").Identifier} */ idrole
) => {
  const role = await Role.findByPk(idrole, {
    //	attributes: ['idrole', 'enabled', 'role', 'type', 'attrs']
  });

  return role;
};
