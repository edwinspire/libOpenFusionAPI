import { UserProfile } from "./models.js";
import { getEndpointByIdApp } from "./endpoint.js";

//
export const defaultUserProfile = async () => {
  try {
    // Verificar si el usuario "admin" ya existe
    const existingUser = await UserProfile.findOne({
      where: { name: "superuser" },
    });

    if (!existingUser) {
      // Obtener la lista de endpoints del sistema
      const list_endoints = await getEndpointByIdApp(
        "cfcd2084-95d5-65ef-66e7-dff9f98764da"
      );

      // El usuario "superuser" no existe, se realiza la inserción
      await UserProfile.create({
        idprofile: "1768784ca4f5be1d24eafe05ce8183a4",
        name: "superuser",
        description: "Super user",
        enabled: true,
        environment: { dev: true, qa: true, prd: true },
        sys_endpoints: list_endoints.map((item) => {
          return item.idendpoint;
        }),
        startAt: Date.now(), // Mejorar esta linea con algo nativo de sequelize
        endAt: "9999-12-31", // Cambiar y colocar la fecha actual mas 5 años
      });
    }

    return true;
    //console.log(' defaultUser >>>>>> ', super_role);
  } catch (error) {
    console.error("Example error:", error);
    return false;
  }
};
