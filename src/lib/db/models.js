import { DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
// @ts-ignore
//import uFetch from '@edwinspire/universal-fetch';
//import {EncryptPwd} from "../server/utils.js"
import { v4 as uuidv4 } from "uuid";
//import { internal_url_hooks } from '../server/utils_path.js';
import { emitHook } from "../server/utils.js";

const { TABLE_NAME_PREFIX_API } = process.env;

/**
 * @param {string} table_name
 */
export function prefixTableName(table_name) {
  return (TABLE_NAME_PREFIX_API || "ofapi") + "_" + table_name;
}

async function HooksDB(data) {
  await emitHook({ env: "prd", app: "system", data: { db: data } });
}

// Definir el modelo de la tabla 'User'
export const PathRequest = dbsequelize.define(
  prefixTableName("path_request"),
  {
    idpath: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    path: { type: DataTypes.STRING, allowNull: false, unique: true },
    idapp: { type: DataTypes.UUID, allowNull: true },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ip_create: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    headers_create: { type: DataTypes.TEXT, allowNull: true },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["path"],
      },
    ],
    hooks: {
      afterUpsert: async () => {
        // @ts-ignore
        await HooksDB({
          model: prefixTableName("path_request"),
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeValidate: (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
        instance.headers_create =
          typeof instance.headers_create == "object" ||
          Array.isArray(instance.headers_create)
            ? JSON.stringify(instance.headers_create)
            : instance.headers_create;
      },
    },
  }
);

// Definir el modelo de la tabla 'User'
export const User = dbsequelize.define(
  prefixTableName("user"),
  {
    iduser: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    idrole: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    /*
		token: {
			type: DataTypes.STRING
		},
		*/
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["username"],
      },
    ],
    hooks: {
      afterUpsert: async () => {
        // @ts-ignore

        await HooksDB({
          model: prefixTableName("user"),
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ user) => {
        // @ts-ignore
        //			user.ts = new Date();
        // @ts-ignore
        //user.password = EncryptPwd(user.password);
        // @ts-ignore
        user.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

// Definir el modelo de la tabla 'Role'
export const Role = dbsequelize.define(
  prefixTableName("role"),
  {
    idrole: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: uuidv4(),
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    create_app: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read_app: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_app: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete_app: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["role"],
      },
    ],
    hooks: {
      afterUpsert: async () => {
        // @ts-ignore
        await HooksDB({
          model: prefixTableName("role"),
          action: "afterUpsert",
        });
      },
      beforeValidate: () => {
        //	console.log('>>> beforeValidate >>>> ', instance);
        /*
				instance.attrs =
					dbsequelize.getDialect() === 'mssql' && typeof instance.attrs === 'object'
						? JSON.stringify(instance.attrs)
						: instance.attrs;
						*/
      },
    },
  }
);

// Definir el modelo de la tabla 'Method'
export const Method = dbsequelize.define(
  prefixTableName("methods"),
  {
    method: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    label: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [],
    hooks: {
      afterUpsert: async () => {
        // @ts-ignore
        await HooksDB({
          model: prefixTableName("method"),
          action: "afterUpsert",
        });
      },
    },
  }
);

// Definir el modelo de la tabla 'Handler'
export const Handler = dbsequelize.define(
  prefixTableName("handler"),
  {
    handler: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    label: {
      type: DataTypes.STRING(25),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [],
    hooks: {
      afterUpsert: async () => {
        // @ts-ignore
        await HooksDB({
          model: prefixTableName("handler"),
          action: "afterUpsert",
        });
      },
    },
  }
);

// Definir el modelo de la tabla 'App'
// @ts-ignore
export const Application = dbsequelize.define(
  prefixTableName("application"),
  {
    idapp: {
      type: DataTypes.UUID,
      primaryKey: true,
      //autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    app: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    iduser: { type: DataTypes.BIGINT },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    description: {
      type: DataTypes.TEXT,
    },
    vars: {
      type:
        dbsequelize.getDialect() === "mssql" ? DataTypes.TEXT : DataTypes.JSON,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [],
    hooks: {
      afterBulkCreate: async (intance) => {
        /*
        await HooksDB({
          model: prefixTableName("application"),
          action: "afterBulkCreate",
          row: instance.app,
        });
		*/
      },
      afterUpsert: async (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = 999;
        // @ts-ignore
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        await HooksDB({
          model: prefixTableName("application"),
          action: "afterUpsert",
          row: instance.app,
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (instance) => {
        // @ts-ignore
        //				instance.rowkey = Math.floor(Math.random() * 1000);
        /*
								if (!instance.idapp || instance.idapp == null) {
									//console.log('beforeUpsert IDAPP es nulo o no está definido');
									instance.idapp = uuidv4();
								}
								*/

        if (!instance.idapp || instance.idapp == null) {
          //console.log('IDAPP es nulo o no está definido');
          instance.idapp = uuidv4();
        }

        //console.log(">>>>>>>>>>>>>> Se lanza el beforeUpsert", instance);
        //await hookUpsert(prefixTableName('application'), 'beforeUpsert');
      },
      beforeSave: (/** @type {{ rowkey: number; }} */ instance) => {
        // Acciones a realizar antes de guardar el modelo
        //console.log('Antes de guardar:', instance.fieldName);
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeValidate: (instance) => {
        //console.log('>>> beforeValidate >>>> ', instance);

        if (!instance.idapp || instance.idapp == null) {
          console.log("IDAPP es nulo o no está definido");
          instance.idapp = uuidv4();
        }

        instance.vars =
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.vars === "object"
            ? JSON.stringify(instance.vars)
            : instance.vars;
        //	console.log(">>>>>>>>>>>>>>>>>>>>>>", instance);
      },
      beforeCreate: (instance) => {
        //console.log('>>> beforeValidate >>>> ', instance);

        if (!instance.idapp || instance.idapp == null) {
          //	console.log('beforeCreate IDAPP es nulo o no está definido');
          instance.idapp = uuidv4();
        }

        instance.vars =
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.vars === "object"
            ? JSON.stringify(instance.vars)
            : instance.vars;
        //	console.log(">>>>>>>>>>>>>>>>>>>>>>", instance);
      },
      beforeBulkCreate: (instance) => {
        if (instance && Array.isArray(instance)) {
          instance.forEach((ins, i) => {
            //	console.log("++++++++>>>>>>>>>>>>>>>>>>>>>>", ins.vars);

            instance[i].vars =
              dbsequelize.getDialect() === "mssql" &&
              typeof instance[i].vars === "object"
                ? JSON.stringify(instance[i].vars)
                : instance[i].vars;
            //	console.log(">>>>>>>>>>>>>>>>>>>>>>", instance[i].vars);
          });
        }
      },
    },
  }
);

User.belongsTo(Role, {
  foreignKey: "idrole",
  targetKey: "idrole",
  as: "role",
});

export const ApiUser = dbsequelize.define(
  prefixTableName("api_user"),
  {
    idau: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    } /*
		jwt: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: ''
			},*/,
    idapp: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    env_dev: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    env_qa: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    env_prd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    validity_time: {
      type: DataTypes.BIGINT,
      defaultValue: 60,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["idapp", "username"],
      },
    ],
    hooks: {
      afterUpsert: async (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = 999;
        // @ts-ignore
        //   console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        await HooksDB({
          model: prefixTableName("api_user"),
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (/** @type {{ rowkey: number; }} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
        //   console.log(">>>>>>>>>>>>>> Se lanza el beforeUpsert", instance);
        await HooksDB({
          model: prefixTableName("api_user"),
          action: "beforeUpsert",
        });
      },
      beforeSave: (/** @type {{ rowkey: number; }} */ instance) => {
        // Acciones a realizar antes de guardar el modelo
        //console.log('******* Antes de guardar:', instance.jwt);
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeValidate: (/** @type {{ rowkey: number; }} */ instance) => {
        // Acciones a realizar antes de guardar el modelo
        //console.log('******* Antes de beforeValidate:', instance.jwt);
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
    },
  }
);

Application.hasMany(ApiUser, { foreignKey: "idapp" });
ApiUser.belongsTo(Application, { foreignKey: "idapp" });

export const Endpoint = dbsequelize.define(
  prefixTableName("endpoint"),
  {
    idendpoint: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      //			defaultValue: uuidv4()
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    for_user: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    for_api: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: true },
    idapp: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    environment: {
      type: DataTypes.STRING(4),
      allowNull: false,
      defaultValue: "dev",
    },

    resource: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    handler: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    cors: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    headers_test: {
      type:
        dbsequelize.getDialect() === "mssql" ? DataTypes.TEXT : DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    data_test: {
      type:
        dbsequelize.getDialect() === "mssql" ? DataTypes.TEXT : DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    latest_updater: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    cache_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["idapp", "environment", "resource", "method"],
      },
    ],
    hooks: {
      afterUpsert: async (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = 999;
        // @ts-ignore
        //   console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        await HooksDB({
          model: prefixTableName("endpoint"),
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (
        /** @type {{ rowkey: number; idendpoint: string}} */ instance
      ) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);

        //	console.log('>>>>>>>>>>>>>> Se lanza el beforeUpsert', instance);
        if (!instance.idendpoint) {
          //console.log('##################----> beforeValidate: ');
          // @ts-ignore
          instance.idendpoint = uuidv4();
        }

        await HooksDB({
          model: prefixTableName("endpoint"),
          action: "beforeUpsert",
        });
      },
      beforeValidate: (instance) => {
        instance.rowkey = Math.floor(Math.random() * 1000);
        if (!instance.idendpoint) {
          //console.log('##################----> beforeValidate: ');
          // @ts-ignore
          instance.idendpoint = uuidv4();
        }

        instance.data_test =
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.data_test === "object"
            ? JSON.stringify(instance.data_test)
            : instance.data_test;

        instance.headers_test =
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.headers_test === "object"
            ? JSON.stringify(instance.headers_test)
            : instance.headers_test;
      },
      beforeBulkCreate: (instance) => {
        /*
				// @ts-ignore
				if (!instance.idendpoint) {
					// @ts-ignore
					instance.idendpoint = uuidv4();
				}
				*/

        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeCreate: (instance) => {
        if (!instance.idendpoint) {
          //console.log('##################----> beforeCreate: ');
          // @ts-ignore
          instance.idendpoint = uuidv4();
        }
      },
    },
  }
);

Application.hasMany(Endpoint, { foreignKey: "idapp", as: "endpoints" });
Endpoint.belongsTo(Application, { foreignKey: "idapp" });
