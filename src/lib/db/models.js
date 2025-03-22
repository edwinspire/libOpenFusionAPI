import { DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
import { v4 as uuidv4 } from "uuid";
import { emitHook } from "../server/utils.js";
//import { TasksInterval } from "../timer/tasks.js";

const { TABLE_NAME_PREFIX_API } = process.env;
const JSON_TYPE =
  dbsequelize.getDialect() === "mssql" ? DataTypes.TEXT : DataTypes.JSON;

class JSON_ADAPTER {
  constructor() {}

  static getData(instance, fieldName, defaulValue = {}) {
    const data = instance.getDataValue(fieldName) ?? defaulValue;
    return JSON_ADAPTER._isMsSql() && JSON_ADAPTER._isString(data)
      ? JSON.parse(data)
      : data;
  }

  static setData(instance, fieldName, value, defaulValue = {}) {
    const data = value ?? defaulValue;
    const new_data =
      JSON_ADAPTER._isMsSql() && !JSON_ADAPTER._isString(data)
        ? JSON.stringify(data)
        : data;
    instance.setDataValue(fieldName, new_data);
  }

  static _isMsSql() {
    return dbsequelize.getDialect() === "mssql";
  }

  static _isString(data) {
    //console.log(typeof data);
    return typeof data === "string";
  }
}

/*
function JSON_TYPE_Adapter(instance, fieldName) {
  if (instance[fieldName]) {
    console.log("JSON_TYPE_Adapter: ", fieldName, typeof instance[fieldName]);

    return dbsequelize.getDialect() === "mssql" &&
      typeof instance[fieldName] === "object"
      ? JSON.stringify(instance[fieldName])
      : instance[fieldName];
  } else {
    return undefined;
  }
}
*/

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
      get() {
        return JSON_ADAPTER.getData(this, "ctrl");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "ctrl", value);
      },
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
        await HooksDB({
          model: prefixTableName("user"),
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ user) => {
        //			user.ts = new Date();

        //user.password = EncryptPwd(user.password);

        user.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeValidate: (instance) => {
        //  instance.ctrl = JSON_TYPE_Adapter(instance, "ctrl");
      },
      beforeUpsert: (instance) => {
        //  instance.ctrl = JSON_TYPE_Adapter(instance, "ctrl");
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
        await HooksDB({
          model: prefixTableName("handler"),
          action: "afterUpsert",
        });
      },
    },
  }
);

// Definir el modelo de la tabla 'App'

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
      get() {
        return JSON_ADAPTER.getData(this, "vars");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "vars", value);
      },
    },
    params: {
      type: JSON_TYPE,
      get() {
        return JSON_ADAPTER.getData(this, "params");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "params", value);
      },
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
        instance.rowkey = 999;

        //    console.log(">>>>>>>>>>>>>>>> afterUpsert xxxxxxxxxxxxxxxxxxxxxxxxxx");
        await HooksDB({
          model: prefixTableName("application"),
          action: "afterUpsert",
          row: instance,
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
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

        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeValidate: (instance) => {
        //console.log('>>> beforeValidate >>>> ', instance);

        if (!instance.idapp || instance.idapp == null) {
          console.log("IDAPP es nulo o no está definido");
          instance.idapp = uuidv4();
        }

        //instance.vars = JSON_TYPE_Adapter(instance, "vars");
        //instance.params = JSON_TYPE_Adapter(instance, "params");

        // Esta función si se ejecuta al momento de crear una nueva APP, poniendo en minuscula el nombre de la app
        instance.app = instance.app.toLowerCase();
      },
      beforeCreate: (instance) => {
        //console.log('>>> beforeValidate >>>> ', instance);

        if (!instance.idapp || instance.idapp == null) {
          //	console.log('beforeCreate IDAPP es nulo o no está definido');
          instance.idapp = uuidv4();
        }

        //instance.vars = JSON_TYPE_Adapter(instance, "vars");
        //instance.params = JSON_TYPE_Adapter(instance, "params");
      },
      beforeBulkCreate: (instance) => {
        if (instance && Array.isArray(instance)) {
          instance.forEach((ins, i) => {
            //	console.log("++++++++>>>>>>>>>>>>>>>>>>>>>>", ins.vars);
            //instance[i].vars = JSON_TYPE_Adapter(instance[i], "vars");
            // instance[i].params = JSON_TYPE_Adapter(instance[i], "params");
          });
        }
      },
    },
  }
);

export const ApplicationBackup = dbsequelize.define(
  prefixTableName("application_backup"),
  {
    idbackup: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      //unique: true,
    },
    idapp: {
      type: DataTypes.UUID,
      //primaryKey: true,
      //autoIncrement: true,
      allowNull: false,
      //unique: true,
    },
    iduser: { type: DataTypes.BIGINT, comment: "User editor" },
    data: {
      type: JSON_TYPE,
      get() {
        return JSON_ADAPTER.getData(this, "data");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "data", value);
      },
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
        //    console.log(">>>>>>>>>>>>>>>> afterUpsert xxxxxxxxxxxxxxxxxxxxxxxxxx");
        await HooksDB({
          model: prefixTableName("application_backup"),
          action: "afterUpsert",
          row: instance,
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        //instance.rowkey = Math.floor(Math.random() * 1000);
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
        //instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeValidate: (instance) => {
        //instance.data = JSON_TYPE_Adapter(instance, "data");
      },
      beforeCreate: (instance) => {
        // instance.data = JSON_TYPE_Adapter(instance, "data");
      },
      beforeBulkCreate: (instance) => {
        if (instance && Array.isArray(instance)) {
          instance.forEach((ins, i) => {
            //   instance[i].data = JSON_TYPE_Adapter(instance[i], "data");
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
      get() {
        return JSON_ADAPTER.getData(this, "ctrl");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "ctrl", value);
      },
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    cors: {
      type: JSON_TYPE,
      allowNull: true,
      get() {
        return JSON_ADAPTER.getData(this, "cors");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "cors", value);
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    headers_test: {
      type: JSON_TYPE,
      allowNull: true,
      get() {
        return JSON_ADAPTER.getData(this, "headers_test");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "headers_test", value);
      },
    },
    data_test: {
      type: JSON_TYPE,
      allowNull: true,
      get() {
        return JSON_ADAPTER.getData(this, "data_test");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "data_test", value);
      },
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
        instance.rowkey = 999;

        //   console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        await HooksDB({
          model: prefixTableName("endpoint"),
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeUpsert: async (
        /** @type {{ rowkey: number; idendpoint: string}} */ instance
      ) => {
        instance.rowkey = Math.floor(Math.random() * 1000);

        //	console.log('>>>>>>>>>>>>>> Se lanza el beforeUpsert', instance);
        if (!instance.idendpoint) {
          //console.log('##################----> beforeValidate: ');

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

          instance.idendpoint = uuidv4();
        }
        //  instance.ctrl = JSON_TYPE_Adapter(instance, "ctrl");
        //  instance.data_test = JSON_TYPE_Adapter(instance, "data_test");
        //  instance.cors = JSON_TYPE_Adapter(instance, "cors");
        /*
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.data_test === "object"
            ? JSON.stringify(instance.data_test)
            : instance.data_test;
            */

        //  instance.headers_test = JSON_TYPE_Adapter(instance, "headers_test");
        /*
          dbsequelize.getDialect() === "mssql" &&
          typeof instance.headers_test === "object"
            ? JSON.stringify(instance.headers_test)
            : instance.headers_test;
            */
      },
      beforeBulkCreate: (instance) => {
        /*
        
        if (!instance.idendpoint) {
          
          instance.idendpoint = uuidv4();
        }
        */

        instance.rowkey = Math.floor(Math.random() * 1000);
      },
      beforeCreate: (instance) => {
        if (!instance.idendpoint) {
          //console.log('##################----> beforeCreate: ');

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
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "url request",
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
      get() {
        return JSON_ADAPTER.getData(this, "req_headers");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "req_headers", value);
      },
    },
    res_headers: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "Response Headers",
      get() {
        return JSON_ADAPTER.getData(this, "res_headers");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "res_headers", value);
      },
    },
    query: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
      get() {
        return JSON_ADAPTER.getData(this, "query");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "query", value);
      },
    },
    body: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
      get() {
        return JSON_ADAPTER.getData(this, "body");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "body", value);
      },
    },
    params: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
      get() {
        return JSON_ADAPTER.getData(this, "params");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "params", value);
      },
    },
    response_time: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: -1,
      comment: "",
    },
    response_data: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "data",
      get() {
        return JSON_ADAPTER.getData(this, "response_data");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "response_data", value);
      },
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
          //  instance.req_headers = JSON_TYPE_Adapter(instance, "req_headers");
        }
        if (instance.res_headers) {
          // instance.res_headers = JSON_TYPE_Adapter(instance, "res_headers");
        }
        if (instance.query) {
          //  instance.query = JSON_TYPE_Adapter(instance, "query");
        }
        if (instance.body) {
          // instance.body = JSON_TYPE_Adapter(instance, "body");
        }
        if (instance.params) {
          // instance.params = JSON_TYPE_Adapter(instance, "params");
        }
        if (instance.response_data) {
          // instance.response_data = JSON_TYPE_Adapter(instance, "response_data");
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

export const IntervalTask = dbsequelize.define(
  prefixTableName("intervaltask"),
  {
    idtask: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Registration date",
    },
    iduser: {
      type: DataTypes.BIGINT,
      primaryKey: false,
      autoIncrement: false,
      allowNull: true,
      unique: false,
    },
    idapp: {
      type: DataTypes.UUID,
      //primaryKey: true,
      //autoIncrement: true,
      allowNull: false,
      unique: false,
    },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    interval: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 300,
      comment: "Seconds interval",
    },
    datestart: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      comment: "Start date",
    },
    dateend: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "End date",
    },
    last_run: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Last run",
    },
    next_run: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Next run",
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "url request",
    },
    method: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: "Method request",
    },
    params: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
      get() {
        return JSON_ADAPTER.getData(this, "params");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "params", value);
      },
    },
    exec_time_limit: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 30,
      comment: "Execution time limit in seconds",
    },
    failed_attempts: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      comment: "Consecutive failed attempts. Max 3.",
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      comment: "Status of the task",
    },
    last_exec_time: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "Last time executed in miliseconds",
    },
    last_response: {
      type: JSON_TYPE,
      allowNull: true,
      comment: "",
      get() {
        return JSON_ADAPTER.getData(this, "last_response");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "last_response", value);
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // No necesitamos createdAt ni updatedAt para este caso
    paranoid: false, // Evita el soft delete
    comment: "App Intervals",
    hooks: {
      beforeValidate: (instance) => {
        //
      },
    },
    indexes: [
      {
        fields: ["idapp"],
        name: "idx_interval_idapp", // Nombre del índice
        unique: false, // Índice no único
      },
    ],
  }
);

// Relación: Un Application tiene muchos Interval
Application.hasMany(IntervalTask, { foreignKey: "idapp", as: "tasks" });

// Relación: Un Interval pertenece a un Application
IntervalTask.belongsTo(Application, { foreignKey: "idapp" });

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
      get() {
        return JSON_ADAPTER.getData(this, "json_data");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "json_data", value);
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    indexes: [],
    hooks: {
      beforeValidate: (instance) => {
        if (instance.json_data) {
          //   instance.json_data = JSON_TYPE_Adapter(instance, "json_data");
        }
      },
    },
  }
);
