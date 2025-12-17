import { AppVars } from "./models.js";

export const upsertAppVar = async (
  /** @type {import("sequelize").Optional<any, string>} */ data
) => {
  try {
    const [result] = await AppVars.upsert(data, {
      returning: true,
      //conflictFields: ["idapp", "name", "environment"],
    });
    return result;
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getAppVarsById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idAppVars
) => {
  try {
    const AppVars = await AppVars.findByPk(idAppVars);
    return AppVars;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

// DELETE
export const deleteAppVar = async (
  /** @type {import("sequelize").Identifier | undefined} */ idappvar
) => {
  try {
    const ep = await AppVars.findByPk(idappvar);
    if (ep) {
      await ep.destroy();
      return true; // Deletion successful
    }
    return false; // User not found
  } catch (error) {
    console.error("Error deleting idappvar:", error);
    throw error;
  }
};

// READ
export const getAppVarsByIdApp = async (
  /** @type {import("sequelize").Identifier | undefined} */ idapp
) => {
  try {
    //const AppVarss = await AppVars.findAll({attributes: list_fields, where: { appname: appname } });
    const AppVarss = await AppVars.findAll({ where: { idapp: idapp } });
    return AppVarss;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const bulkCreateAppVars = (
  /** @type {readonly import("sequelize").Optional<any, string>[]} */ list_AppVars
) => {
  // Campos que se utilizarán para verificar duplicados (en este caso, todos excepto 'rowkey' y 'idAppVars')
  //const uniqueFields = ['idapp', 'namespace', 'name', 'version', 'environment', 'method'];
  // OJO: No se pudo tener un bulk upsert
  return AppVars.bulkCreate(list_AppVars, {
    ignoreDuplicates: true,
    //updateOnDuplicate: uniqueFields
  });
};
