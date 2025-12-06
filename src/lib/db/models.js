import { DataTypes } from "sequelize";
import dbsequelize from "./sequelize.js";
import { v4 as uuidv4 } from "uuid";
import { emitHook, validateAppName } from "../server/utils.js";

const { TABLE_NAME_PREFIX_API } = process.env;
const JSON_TYPE = ["mssql", "sqlite"].includes(dbsequelize.getDialect())
  ? DataTypes.TEXT
  : DataTypes.JSON;

export const ModelNames = {
  LogEntry: prefixTableName("log"),
  User: prefixTableName("user"),
  Application: prefixTableName("application"),
  Endpoint: prefixTableName("endpoint"),
  IntervalTask: prefixTableName("intervaltask"),
  Method: prefixTableName("method"),
  Handler: prefixTableName("handler"),
  Demo: prefixTableName("demo"),
  AppVars: prefixTableName("appvars"),
  UserProfile: prefixTableName("user_profile"),
  SystemUserProfile: prefixTableName("system_user_profiles"),
  UserProfileEndpoint: prefixTableName("user_profile_endpoints"),
  ApiClient: prefixTableName("api_client"),
  ApiKey: prefixTableName("api_key"),
  ClientWallet: prefixTableName("client_wallet"),
  WalletMovement: prefixTableName("wallet_movement"),
  ApiKeyEndpoint: prefixTableName("apiKey_endpoint"),
  ApiUsageLog: prefixTableName("api_usageLog"),
};

const default_json_schema = {
  in: {
    enabled: false,
    schema: {
      type: "object",
      properties: {},
      additionalProperties: true,
    },
  },
  out: {
    enabled: false,
    schema: {
      type: "object",
      properties: {},
      additionalProperties: true,
    },
  },
};

class JSON_ADAPTER {
  constructor() {}

  static getData(instance, fieldName, defaulValue = {}) {
    let data = instance.getDataValue(fieldName) ?? defaulValue;

    if (JSON_ADAPTER._isMsSql() && JSON_ADAPTER._isString(data)) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        data = JSON.stringify(data);
      }
    }

    return data;
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
    return ["mssql", "sqlite"].includes(dbsequelize.getDialect());
  }

  static _isString(data) {
    //console.log(typeof data);
    return typeof data === "string";
  }
  static _isObject(data) {
    //console.log(typeof data);
    return typeof data === "object";
  }
}

function ensureUUID(instance, field) {
  if (!instance[field]) instance[field] = uuidv4();
}

function randomRowKey(instance) {
  instance.rowkey = Math.floor(Math.random() * 1000);
}

/**
 * @param {string} table_name
 */
export function prefixTableName(table_name) {
  return (TABLE_NAME_PREFIX_API || "ofapi") + "_" + table_name;
}

async function HooksDB(data) {
  let instance = {};

  if (Array.isArray(data.instance)) {
    instance = data.instance[0];
  } else {
    instance = data.instance;
  }

  let dataHook = {};

  try {
    dataHook = {
      host: instance.sequelize.config.host,
      database: instance.sequelize.config.database,
      schema: data.schema || "",
      model: data.table,
      action: data.action,
      data: instance,
    };
  } catch (error) {
    confirm.log("Error en HooksDB:", error);
  }

  return await emitHook(dataHook);
}

// Definir el modelo de la tabla 'User'
export const User = dbsequelize.define(
  ModelNames.User,
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
      afterUpsert: async (instance) => {
        await HooksDB({
          instance: instance,
          table: ModelNames.User,
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ user) => {
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
  ModelNames.Method,
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
      afterUpsert: async (instance) => {
        await HooksDB({
          instance: instance,
          table: ModelNames.Method,
          action: "afterUpsert",
        });
      },
    },
  }
);

// Definir el modelo de la tabla 'Handler'
export const Handler = dbsequelize.define(
  ModelNames.Handler,
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
      afterUpsert: async (instance) => {
        await HooksDB({
          instance: instance,
          table: ModelNames.Handler,
          action: "upsert",
        });
      },
    },
  }
);

// Definir el modelo de la tabla 'App'

export const Application = dbsequelize.define(
  ModelNames.Application,
  {
    idapp: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
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
        //        instance.rowkey = 999;

        //    console.log(">>>>>>>>>>>>>>>> afterUpsert xxxxxxxxxxxxxxxxxxxxxxxxxx");
        await HooksDB({
          instance: instance,
          table: ModelNames.Application,
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        randomRowKey(instance);
      },
      beforeUpsert: (instance) => {
        if (instance.app && !validateAppName(instance.app)) {
          throw new Error("The application name cannot be empty.");
        }
        ensureUUID(instance, "idapp");
        randomRowKey(instance);
      },
      beforeSave: (/** @type {{ rowkey: number; }} */ instance) => {
        ensureUUID(instance, "idapp");
        randomRowKey(instance);
      },
      beforeValidate: (instance) => {
        ensureUUID(instance, "idapp");
        randomRowKey(instance);
        // Esta función si se ejecuta al momento de crear una nueva APP, poniendo en minuscula el nombre de la app
        instance.app = instance.app.toLowerCase();
      },
      beforeCreate: (instance) => {
        ensureUUID(instance, "idapp");
      },
      beforeBulkCreate: (instance) => {
        if (instance && Array.isArray(instance)) {
          //
        }
      },
    },
  }
);

// ============================================
// MODELO AppVars
// ============================================
export const AppVars = dbsequelize.define(
  ModelNames.AppVars,
  {
    idvar: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idapp: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ModelNames.Application,
        key: "idapp",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: "json",
    },
    environment: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    value: {
      type: JSON_TYPE,
      allowNull: true,
      get() {
        return JSON_ADAPTER.getData(this, "value");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "value", value);
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,

    // ✔ Necesario para que Sequelize reconozca correctamente el índice único
    uniqueKeys: {
      unique_av_combo: {
        fields: ["idapp", "name", "environment"],
      },
    },

    indexes: [
      {
        fields: ["idapp", "name", "environment"],
        name: "idx_av_id_n_e",
        //  unique: true,
      },
      {
        fields: ["idapp"],
        name: "idx_av_idapp",
      },
    ],

    hooks: {
      beforeValidate: (instance) => {
        // Si hay que adaptar JSON, se hace aquí
      },
      afterUpsert: async (/** @type {any} */ instance) => {
        await HooksDB({
          instance: instance,
          table: ModelNames.AppVars,
          action: "afterUpsert",
        });
      },
      afterDestroy: async (/** @type {any} */ instance) => {
        await HooksDB({
          instance: instance,
          table: ModelNames.AppVars,
          action: "afterDestroy",
        });
      },
    },
  }
);

export const Endpoint = dbsequelize.define(
  ModelNames.Endpoint,
  {
    idendpoint: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    rowkey: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    idapp: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Application,
        key: "idapp",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    cost: {
      type: DataTypes.DECIMAL(6, 6),
      allowNull: false,
      defaultValue: 0.000001,
    },
    keywords: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
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
      comment: "Code and parameters",
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
    cache_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment:
        "Time in which the data will be kept in cache. Zero to disable the cache.",
    },
    mcp: {
      type: JSON_TYPE,
      allowNull: true,
      get() {
        return JSON_ADAPTER.getData(this, "mcp");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "mcp", value);
      },
    },
    json_schema: {
      type: JSON_TYPE,
      allowNull: true,
      defaultValue: JSON_ADAPTER._isMsSql()
        ? JSON.stringify(default_json_schema)
        : default_json_schema,
      get() {
        return JSON_ADAPTER.getData(this, "json_schema");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "json_schema", value);
      },
    },
    custom_data: {
      type: JSON_TYPE,
      allowNull: true,
      defaultValue: JSON_ADAPTER._isMsSql()
        ? JSON.stringify({})
        : {},
      get() {
        return JSON_ADAPTER.getData(this, "custom_data");
      },
      set(value) {
        JSON_ADAPTER.setData(this, "custom_data", value);
      },
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
  },
  {
    freezeTableName: true,
    timestamps: true,
    // ✔ Necesario para que Sequelize reconozca correctamente el índice único
    uniqueKeys: {
      unique_av_combo: {
        fields: ["idapp", "environment", "resource", "method"],
      },
    },
    indexes: [
      {
        //  unique: true,
        fields: ["idapp", "environment", "resource", "method"],
      },
    ],
    hooks: {
      afterUpsert: async (instance) => {
        // instance.rowkey = 999;

        await HooksDB({
          instance: instance,
          table: ModelNames.Endpoint,
          action: "afterUpsert",
        });
      },
      beforeUpdate: (/** @type {any} */ instance) => {
        randomRowKey(instance);
      },
      beforeUpsert: async (
        /** @type {{ rowkey: number; idendpoint: string}} */ instance
      ) => {
        randomRowKey(instance);
        ensureUUID(instance, "idendpoint");
      },
      beforeValidate: (instance) => {
        randomRowKey(instance);
        ensureUUID(instance, "idendpoint");
        if (
          instance.handler == "FUNCTION" &&
          (!instance.code || instance.code.length < 1)
        ) {
          throw Error(
            "The handle FUNCTION must be associated with a function; it cannot be empty."
          );
        }
        
        if (typeof instance.code == "object") {
          instance.code = JSON.stringify(instance.code);
        }
        
        
      },
      beforeBulkCreate: (instance) => {
        randomRowKey(instance);
      },
      beforeCreate: (instance) => {
        ensureUUID(instance, "idendpoint");
      },
    },
  }
);

export const LogEntry = dbsequelize.define(
  ModelNames.LogEntry,
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
      afterCreate: async (/** @type {any} */ instance, options) => {
        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);
        /*
        await HooksDB({
          instance: instance,
          table: ModelNames.LogEntry,
          action: "afterCreate",
        });
        */
      },
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
      // ÍNDICE COMPUESTO PARA TIMESTAMP Y IDENDPOINT
      {
        fields: ["timestamp", "idendpoint"], // Orden importante: timestamp primero
        name: "idx_logentry_timestamp_idendpoint", // Nombre único
        unique: false,
      },
    ],
  }
);

export const IntervalTask = dbsequelize.define(
  ModelNames.IntervalTask,
  {
    idtask: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    iduser: {
      type: DataTypes.BIGINT,
      primaryKey: false,
      autoIncrement: false,
      allowNull: true,
      unique: false,
    },
    idendpoint: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Endpoint,
        key: "idendpoint",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes",
    },
  },
  {
    freezeTableName: true,
    timestamps: true, //
    paranoid: false, // Evita el soft delete
    comment: "App Intervals",
    hooks: {
      beforeValidate: (instance) => {
        //
      },
      afterUpsert: async (/** @type {any} */ instance, options) => {
        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx", instance);

        await HooksDB({
          instance: instance,
          table: ModelNames.IntervalTask,
          action: "afterUpsert",
        });
      },
    },
    indexes: [
      {
        fields: ["idendpoint"],
        name: "idx_interval_idendpoint", // Nombre del índice
        unique: false, // Índice no único
      },
    ],
  }
);

// Definir el modelo de la tabla 'demo'
export const tblDemo = dbsequelize.define(
  ModelNames.Demo,
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

///////////
export const UserProfile = dbsequelize.define(
  ModelNames.UserProfile,
  {
    idprofile: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const SystemUserProfile = dbsequelize.define(
  ModelNames.SystemUserProfile,
  {
    idrelation: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    iduser: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    idprofile: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { timestamps: true, freezeTableName: true }
);

export const UserProfileEndpoint = dbsequelize.define(
  ModelNames.UserProfileEndpoint,
  {
    idrelation: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idprofile: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    idendpoint: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { timestamps: true, freezeTableName: true }
);

// ApiClient (usuario externo) - Con vigencia, enabled y datos básicos de facturación.
export const ApiClient = dbsequelize.define(
  ModelNames.ApiClient,
  {
    idclient: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(150), allowNull: true },
    document: { type: DataTypes.STRING(50), allowNull: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },

    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE, allowNull: true },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { timestamps: true, freezeTableName: true }
);

// ApiKey (varias APIKeys por usuario)
export const ApiKey = dbsequelize.define(
  ModelNames.ApiKey,
  {
    idkey: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idclient: { type: DataTypes.UUID, allowNull: false },
    apikey: { type: DataTypes.STRING(200), allowNull: false, unique: true },

    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { timestamps: true, freezeTableName: true }
);

// ClientWallet (saldo de créditos) - Un solo registro por cliente.
export const ClientWallet = dbsequelize.define(
  ModelNames.ClientWallet,
  {
    idwallet: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idclient: { type: DataTypes.UUID, allowNull: false },

    balance: { type: DataTypes.DECIMAL(18, 6), defaultValue: 0 },
    currency: { type: DataTypes.STRING(10), defaultValue: "CREDITS" },
  },
  { timestamps: true, freezeTableName: true }
);

// WalletMovement (historial de movimientos)
export const WalletMovement = dbsequelize.define(
  ModelNames.WalletMovement,
  {
    idmovement: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    idwallet: { type: DataTypes.UUID, allowNull: false },

    type: {
      type: DataTypes.ENUM("credit", "debit", "refund"),
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    description: { type: DataTypes.STRING(255) },
  },
  { timestamps: true, freezeTableName: true }
);

// ApiKeyEndpoint (qué endpoints puede usar cada APIKey)
export const ApiKeyEndpoint = dbsequelize.define(
  ModelNames.ApiKeyEndpoint,
  {
    idkeyendpoint: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    idkey: { type: DataTypes.UUID, allowNull: false },
    idendpoint: { type: DataTypes.UUID, allowNull: false },

    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { timestamps: true, freezeTableName: true }
);

// ApiUsageLog (tabla super liviana) - ⚠ Sin asociaciones, sin foreign keys, sin índices complejos → Para rendimiento máximo en inserciones
export const ApiUsageLog = dbsequelize.define(
  ModelNames.ApiUsageLog,
  {
    idlog: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    idclient: { type: DataTypes.UUID, allowNull: false },
    idkey: { type: DataTypes.UUID, allowNull: false },
    idendpoint: { type: DataTypes.UUID, allowNull: false },

    cost: { type: DataTypes.DECIMAL(18, 6), allowNull: false },
    balance_after: { type: DataTypes.DECIMAL(18, 6), allowNull: false },

    success: { type: DataTypes.BOOLEAN, defaultValue: true },
    error_message: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    timestamps: true,
    freezeTableName: true,
    indexes: [
      // Únicamente un índice moderado para análisis temporal
      { fields: ["createdAt"] },
    ],
  }
);

//////////////////////////////////////////////////////
// ✅ Relación: Una Application tiene muchas variables
Application.hasMany(AppVars, {
  foreignKey: "idapp", // FK en AppVars
  sourceKey: "idapp", // ✅ AGREGAR: PK en Application
  as: "vrs", // Alias para incluir en queries
  onDelete: "CASCADE", // ✅ AGREGAR: Al eliminar app, elimina sus vars
  onUpdate: "CASCADE", // ✅ AGREGAR: Al actualizar idapp, actualiza en vars
});

// ✅ Relación inversa: Una Variable pertenece a una Application
AppVars.belongsTo(Application, {
  foreignKey: "idapp", // FK en AppVars
  targetKey: "idapp", // PK en Application
  as: "app", // ✅ AGREGAR: Alias para incluir en queries
});

Application.hasMany(Endpoint, { foreignKey: "idapp", as: "endpoints" });
Endpoint.belongsTo(Application, { foreignKey: "idapp" });

// Relación: Un Application tiene muchos Interval
Endpoint.hasMany(IntervalTask, { foreignKey: "idendpoint", as: "tasks" });

// Relación: Un Interval pertenece a un Endpoint
IntervalTask.belongsTo(Endpoint, {
  foreignKey: "idendpoint", // campo FK en IntervalTask
  targetKey: "idendpoint", // campo PK en Endpoint
});

User.belongsToMany(Endpoint, {
  through: UserProfileEndpoint,
  foreignKey: "idprofile",
  as: "endpoints",
});

Endpoint.belongsToMany(User, {
  through: UserProfileEndpoint,
  foreignKey: "idendpoint",
  as: "profiles",
});

/////////////////////

User.belongsToMany(UserProfile, {
  through: SystemUserProfile,
  foreignKey: "iduser",
  otherKey: "idprofile",
  as: "profiles",
});

UserProfile.belongsToMany(User, {
  through: SystemUserProfile,
  foreignKey: "idprofile",
  otherKey: "iduser",
  as: "users",
});

//////////////////////
UserProfile.hasMany(UserProfileEndpoint, {
  foreignKey: "idprofile",
  as: "profile_endpoints",
});

UserProfileEndpoint.belongsTo(UserProfile, {
  foreignKey: "idprofile",
  as: "profile",
});

ApiClient.hasMany(ApiKey, { foreignKey: "idclient", as: "apikeys" });
ApiKey.belongsTo(ApiClient, { foreignKey: "idclient", as: "client" });

ApiClient.hasOne(ClientWallet, { foreignKey: "idclient", as: "wallet" });
ClientWallet.belongsTo(ApiClient, { foreignKey: "idclient", as: "client" });

ClientWallet.hasMany(WalletMovement, {
  foreignKey: "idwallet",
  as: "movements",
});
WalletMovement.belongsTo(ClientWallet, {
  foreignKey: "idwallet",
  as: "wallet",
});

ApiKey.hasMany(ApiKeyEndpoint, {
  foreignKey: "idkey",
  as: "allowed_endpoints",
});
ApiKeyEndpoint.belongsTo(ApiKey, { foreignKey: "idkey", as: "apikey" });
