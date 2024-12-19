import { DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
// @ts-ignore
//import uFetch from '@edwinspire/universal-fetch';
//import {EncryptPwd} from "../server/utils.js"
import { v4 as uuidv4 } from "uuid";
//import { internal_url_hooks } from '../server/utils_path.js';
import { emitHook } from "../server/utils.js";
import { endpoins_default } from "./default_values.js";

const { TABLE_NAME_PREFIX_API } = process.env;
const JSON_TYPE =
  dbsequelize.getDialect() === "mssql" ? DataTypes.TEXT : DataTypes.JSON;

function JSON_TYPE_Adapter(instance, fieldName) {
  if (instance[fieldName]) {
    return dbsequelize.getDialect() === "mssql" &&
      typeof instance[fieldName] === "object"
      ? JSON.stringify(instance[fieldName])
      : instance[fieldName];
  } else {
    return undefined;
  }
}

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
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "2000-01-01",
      comment: "User validity start date.",
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "9999-12-31",
      comment: "End of validity date of the user.",
    },
    ctrl: {
      type: JSON_TYPE,
      comment: "Attributes that can be used for access control",
    },
    exp_time: {
      type: DataTypes.BIGINT,
      defaultValue: 3600,
      comment: "Token expiration time",
    },
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
      beforeValidate: (instance) => {
        instance.ctrl = JSON_TYPE_Adapter(instance, "ctrl");
      },
      beforeUpsert: (instance) => {
        instance.ctrl = JSON_TYPE_Adapter(instance, "ctrl");
      },
    },
  }
);

// Definir el modelo de la tabla 'Method'
export const Method = dbsequelize.define(
  prefixTableName("method"),
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
      type: DataTypes.STRING(25),
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

    icon_class: {
      type: DataTypes.STRING(25),
      unique: false,
      allowNull: true,
    },

    color_class: {
      type: DataTypes.STRING(25),
      unique: false,
      allowNull: true,
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
    iduser: { type: DataTypes.BIGINT, comment: "User creator" },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    description: {
      type: DataTypes.TEXT,
    },
    vars: {
      type: JSON_TYPE,
    },
    params: {
      type: JSON_TYPE,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [],
    hooks: {
      afterBulkCreate: async (intance) => {
        //
      },
      afterUpsert: async (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = 999;
        // @ts-ignore
        //    console.log(">>>>>>>>>>>>>>>> afterUpsert xxxxxxxxxxxxxxxxxxxxxxxxxx");
        await HooksDB({
          model: prefixTableName("application"),
          action: "afterUpsert",
          row: instance,
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        // @ts-ignore
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (instance) => {
        instance.app = instance.app.toLowerCase();

        if (!instance.idapp || instance.idapp == null) {
          //console.log('IDAPP es nulo o no está definido');
          instance.idapp = uuidv4();
        }
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

        instance.vars = JSON_TYPE_Adapter(instance, "vars");
        instance.params = JSON_TYPE_Adapter(instance, "params");

        // Esta función si se ejecuta al momento de crear una nueva APP, poniendo en minuscula el nombre de la app
        instance.app = instance.app.toLowerCase();
      },
      beforeCreate: (instance) => {
        //console.log('>>> beforeValidate >>>> ', instance);

        if (!instance.idapp || instance.idapp == null) {
          //	console.log('beforeCreate IDAPP es nulo o no está definido');
          instance.idapp = uuidv4();
        }

        instance.vars = JSON_TYPE_Adapter(instance, "vars");
        instance.params = JSON_TYPE_Adapter(instance, "params");
      },
      beforeBulkCreate: (instance) => {
        if (instance && Array.isArray(instance)) {
          instance.forEach((ins, i) => {
            //	console.log("++++++++>>>>>>>>>>>>>>>>>>>>>>", ins.vars);

            instance[i].vars = JSON_TYPE_Adapter(instance[i], "vars");
            instance[i].params = JSON_TYPE_Adapter(instance[i], "params");
          });
        }
      },
    },
  }
);

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
    idapp: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    environment: {
      type: DataTypes.STRING(4),
      allowNull: false,
      defaultValue: "dev",
      comment: "Environment where it will be available. dev, qa, prd.",
    },

    resource: {
      type: DataTypes.STRING(300),
      allowNull: false,
      comment: "Endpoint path.",
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "HTTP Method",
    },
    handler: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    access: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 2,
      comment:
        "Indicates if access is: 0 - Public, 1 - Basic, 2 - Token, 3 - Basic and Token",
    },
    ctrl: {
      type: JSON_TYPE,
      comment: "Additional controls. Users, Logs, etc.",
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
      type: JSON_TYPE,
      allowNull: true,
      defaultValue: {},
    },
    data_test: {
      type: JSON_TYPE,
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
      comment:
        "Time in which the data will be kept in cache. Zero to disable the cache.",
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
        instance.ctrl = JSON_TYPE_Adapter(instance, "ctrl");
        instance.data_test = JSON_TYPE_Adapter(instance, "data_test");
        /*
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.data_test === "object"
            ? JSON.stringify(instance.data_test)
            : instance.data_test;
            */

        instance.headers_test = JSON_TYPE_Adapter(instance, "headers_test");
        /*
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.headers_test === "object"
            ? JSON.stringify(instance.headers_test)
            : instance.headers_test;
            */
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

export const LogEntry = dbsequelize.define(
  prefixTableName("log"),
  {
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Registration date",
    },
    idendpoint: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: "00000000000000000000000000000000",
    },
    level: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      comment: "Level log",
    },
    method: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: "Method request",
    },
    status_code: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
      comment: "Response Status Code",
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "",
    },
    client: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Host client",
    },
    req_headers: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "Request Headers",
    },
    res_headers: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "Response Headers",
    },
    query: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
    },
    body: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
    },
    params: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
    },
    response_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: -1,
      comment: "",
    },
    response_data: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "data",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Message log",
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No necesitamos createdAt ni updatedAt para este caso
    paranoid: false, // Evita el soft delete
    comment: "Tabla de logs de la aplicación",
    hooks: {
      beforeValidate: (instance) => {
        if (instance.req_headers) {
          instance.req_headers = JSON_TYPE_Adapter(instance, "rep_headers");
        }
        if (instance.res_headers) {
          instance.res_headers = JSON_TYPE_Adapter(instance, "res_headers");
        }
        if (instance.query) {
          instance.query = JSON_TYPE_Adapter(instance, "query");
        }
        if (instance.body) {
          instance.body = JSON_TYPE_Adapter(instance, "body");
        }
        if (instance.params) {
          instance.params = JSON_TYPE_Adapter(instance, "params");
        }
        if (instance.response_data) {
          instance.response_data = JSON_TYPE_Adapter(instance, "response_data");
        }
      },
    },
    indexes: [
      {
        fields: ["idendpoint"],
        name: "idx_logentry_idendpoint", // Nombre del índice
        unique: false, // Índice no único
      },
    ],
  }
);

// Definir el modelo de la tabla 'Handler'
export const tblDemo = dbsequelize.define(
  prefixTableName("demo"),
  {
    name: {
      type: DataTypes.STRING(25),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    label: {
      type: DataTypes.STRING(25),
      unique: true,
      allowNull: false,
    },
    json_data: {
      type: JSON_TYPE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [],
    hooks: {
      beforeValidate: (instance) => {
        if (instance.json_data) {
          instance.json_data = JSON_TYPE_Adapter(instance, "json_data");
        }
      },
    },
  }
);
