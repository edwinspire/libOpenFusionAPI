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
    const [result, created] = await APIUserMapping.upsert(data, {
      returning: true,
    });
    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};


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
