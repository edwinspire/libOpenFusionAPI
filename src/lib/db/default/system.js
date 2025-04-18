export const system_app = {
  vars: {},
  params: {
    users: [],
    telegram: {
      idgroup: "",
    },
  },
  idapp: "cfcd2084-95d5-65ef-66e7-dff9f98764da",
  app: "system",
  enabled: true,
  description: "App System",
  rowkey: 0,
  endpoints: [
    {
      enabled: true,
      endpoint: "/api/system/database/hooks/prd",
      method: "POST",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/database/hooks",
      code: "{}",
      rowkey: 271,
      description:
        "Receiver of hooks issued from the database, these events will be forwarded via websocket to be consumed by clients.",
      idendpoint: "2cf4eecc-1bbe-433a-b8eb-347a7de52d4d",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        body: {
          selection: 0,
          json: {
            code: {},
          },
          xml: {
            code: "",
          },
          text: {
            value: "",
          },
          form: {},
        },
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        auth: {
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "8583f4129312c691f307ddc6ed023dca3543a2b2b0abff0acf73a7e0ff349932",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 203,
      description: "",
      idendpoint: "15ca7819-8823-4835-87c5-04b792bc594d",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "42df982136f604a4fb63d1abc49e437bf5362ff3a7b90222216c7ac1ffd6cb28",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/upsert/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/upsert",
      code: "fnUpsertIntervalTask",
      rowkey: 977,
      description: "",
      idendpoint: "34987a43-63e4-4926-824b-5254155b5c80",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        body: {
          selection: 0,
          json: {
            code: {},
          },
          xml: {
            code: "",
          },
          text: {
            value: "",
          },
          form: {},
        },
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        auth: {
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "78bb7c1bfc959d4975b5b2d1d0446a2def9880487a834c6a5772b5169e4232e4",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/byidapp/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/byidapp",
      code: "fnGetIntervalTasksByIdApp",
      rowkey: 309,
      description: "",
      idendpoint: "71cfbad5-cf5f-4d64-a952-1a52af0bf26b",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        body: {
          selection: 0,
          json: {
            code: {},
          },
          xml: {
            code: "",
          },
          text: {
            value: "",
          },
          form: {},
        },
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        auth: {
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "8de0c3a0edf24fe23b38b27217cad10da1763772afe8b19b11594b59b31ffc78",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/qa",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 412,
      description: "",
      idendpoint: "dae4d3ff-6782-4fd3-8837-d169cf1aded8",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      internal_hash_row:
        "ef90c76fc886a7e75390d597653cf2a02c9f8c2d64e2ecc769826bbcc72c95c5",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/dev",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 562,
      description: "",
      idendpoint: "48f6c75d-285c-420d-b6d7-9471bf052c1e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "0fdc6a50221d398b4755a6937d569f1f566b348f7ab17501abbcb44ae042d48c",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/handler/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/handler/0.01",
      code: "fnGetHandler",
      rowkey: 811,
      description: "",
      idendpoint: "17c211d6-8c81-4274-b5c4-604126454ab0",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "a77e19693a3c82b77759727c0182452f2acc4521d265fdbae0c253091664571f",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/environment/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/environment/0.01",
      code: "fnGetEnvironment",
      rowkey: 595,
      description: "",
      idendpoint: "d7737d40-5cd8-45f2-a60a-1014272a2faf",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "f168f27cc2126ab95ee96371c1f75f46ee34cba7e53ce90997abfea3f60f0d73",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/qa",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 685,
      description: "",
      idendpoint: "65cdde4c-8000-4248-bd77-157257b6d9c2",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      internal_hash_row:
        "83776d158a10a5b67e24f9af09d65f7dea148b26994c455ed37279cc28130537",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/qa",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 319,
      description: "",
      idendpoint: "9dcc9e25-1238-411e-87f8-78f318455c7e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      internal_hash_row:
        "eeb7323726e9efc25cf92bfc8e67378571554aa9212679a525f056bd6b38c05f",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/login/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/login/0.01",
      code: "fnLogin",
      rowkey: 864,
      description: "",
      idendpoint: "871cd2ed-8456-4e5e-8ab5-b7724a908191",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "34fbfd04e6ad44abf319d741e47c13261f80bf03421df570d190c7d62a347eb2",
    },
    {
      enabled: true,
      endpoint: "/ws/system/websocket/hooks/prd",
      method: "WS",
      handler: "NA",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/websocket/hooks",
      code: "",
      rowkey: 852,
      description: "",
      idendpoint: "3eb8b6c8-e001-43e6-9ace-517a05d33e6b",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "45d1712066ec317f40977bc4fe8f237cba9c7efbfc4951d8e3d30fb678482636",
    },
    {
      enabled: true,
      endpoint: "/api/system/cache/response/size/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/cache/response/size",
      code: "fnGetCacheSize",
      rowkey: 442,
      description: "",
      idendpoint: "047845ac-5367-48ed-9465-8e36ba6c7bae",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "2a25a15bdd70b50bcda67ee254c5aaf8cfe78b24a165d0f6245f616b65141381",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/token/api/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/token/api",
      code: "fnToken",
      rowkey: 249,
      description: "",
      idendpoint: "b5141492-3ad1-4ea6-a85d-ceb23ba26244",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "9cbf3054713a7a5e0eecd38c4fa6afd03c958343a774178313b39d85f3072ac0",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 406,
      description: "",
      idendpoint: "15034cf9-4c94-43ba-bc7a-3d762f62d7de",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "3f3de65e58eb3479a45f2e52690803f81b8e0872e0b89f2c2b7444eb86ace39b",
    },
    {
      enabled: true,
      endpoint: "/api/system/cache/clear/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/cache/clear",
      code: "fnClearCache",
      rowkey: 912,
      description: "",
      idendpoint: "3ead2170-283d-4c6a-abc1-eddd217b6d01",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "4b3a300d07f65ae9c41110ace058118f1b3f5d9a24a833fef66f782c4125133a",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/function_names/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 999,
      ctrl: {},
      resource: "/api/function_names",
      code: "fnFunctionNames",
      rowkey: 569,
      description: "",
      idendpoint: "13f94d7d-6612-4c30-8202-286cbbe3da3e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "89b17cefe5e0956706c00e5a5421798f2cbcb0c2a51f2729a45dc2fd2870b0b9",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 60,
      ctrl: {
        users: [],
        log: {
          level: 0,
        },
      },
      resource: "/system/log",
      code: "fnGetLogs",
      rowkey: 216,
      description: "",
      idendpoint: "c10b1812-8b25-4b16-adb9-bf7ac8134f76",
      cors: {},
      headers_test: {},
      data_test: {
        body: {
          json: {
            code: "",
          },
          xml: {
            code: "",
          },
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        headers: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "99faa64bbed8ad78faaed5832f569cf43542773572e807b229f163961aa5cef4",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/api/token/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/api/token",
      code: "fnAPIToken",
      rowkey: 491,
      description: "",
      idendpoint: "89b6d2c3-5d9e-4c18-9221-5f2673c17bb3",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "9ffda3cd213ccdcf2ee3ce391af710e84b4ca4f3863909db0f032f255bb7e2d2",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/logout/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/logout/0.01",
      code: "fnLogout",
      rowkey: 265,
      description: "",
      idendpoint: "131cca3e-f835-4414-89ca-5ddbbec5ab89",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "656d3eea66bb1509debf71afa41e0d85c6e0365462a6e4a58eddd0ac7356a5f0",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/telegram/sendphoto/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/api/telegram/sendphoto",
      code: "fnTelegramsendPhoto",
      rowkey: 8,
      description: "",
      idendpoint: "db9cff16-81b8-438e-b5fb-6ceb4d6a0a60",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        body: {
          selection: 0,
          json: {
            code: {
              chatId: -1001790805365,
              url_photo:
                "https://www.farmaenlace.com/wp-content/uploads/2024/11/MAPA1.jpg",
              extra: {
                message_thread_id: 16964,
                parse_mode: "MarkdownV2",
                caption: "Farma Foto",
              },
              autoscape: false,
            },
          },
          xml: {
            code: "",
          },
          text: {
            value: "",
          },
          form: {},
        },
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        auth: {
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "f114a83f913b60c2676fada00317fefb1c45cc446ebdf463c6605bfea4cb1eb6",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/qa",
      method: "POST",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 472,
      description: "",
      idendpoint: "6f1358ae-a638-47f8-a5d1-57818f17426b",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      internal_hash_row:
        "eed12cd9677f79d7267be3ad20ed3c78f9ae461dbf99215e016aebfba8158b49",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/telegram/sendmsg/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          infor: true,
          success: true,
          redirection: true,
          clientError: true,
          serverError: true,
          full: true,
        },
      },
      resource: "/api/telegram/sendmsg",
      code: "fnTelegramsendMessage",
      rowkey: 121,
      description: "",
      idendpoint: "9c4c5630-f1da-4885-b845-7b2e03eab215",
      cors: {},
      headers_test: {},
      data_test: {
        body: {
          json: {
            code: {
              chatId: -1001790805365,
              message: "*bold \\*text*",
              extra: {
                message_thread_id: 16964,
                parse_mode: "MarkdownV2",
              },
              autoscape: false,
            },
          },
          xml: {
            code: "",
          },
          text: {},
          selection: 0,
          form: {},
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        headers: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "3124adca7dd0cea1f59f23a370979d0ea9e4e70b94390b2b84f2d4f06c417c5f",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/system/log",
      code: "fnInsertLog",
      rowkey: 943,
      description: "",
      idendpoint: "18731c87-9d59-44b6-8871-ecaa493008e5",
      cors: {},
      headers_test: {},
      data_test: {
        body: {
          js: {
            code: "{}",
          },
          xml: {
            code: "",
          },
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        headers: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "3a58593cc31e827d0d45f4fe1c45572411e60594805db6143b93613c1f2fb9c0",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/dev",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 327,
      description: "",
      idendpoint: "52fb738c-7d1f-4eba-afb4-508a9fa9d06a",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "618edd198198dba1a458f631e2db81c984cec6fe08592baa434dbc686e9b21da",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 120,
      description: "",
      idendpoint: "d9086725-367f-4383-8b43-c23071bc8fcc",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "f2a096c91d251cde64a13bd8283712510dd7dd6af9d98e57b27d9947a9c6dd1a",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/method/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/method/0.01",
      code: "fnGetMethod",
      rowkey: 145,
      description: "",
      idendpoint: "0144753a-61a6-4ee1-8ae5-1d871dd21d24",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "ce83b554d3cec165f4a4361c1580aa4114393bb0becec03d325a4d393be9015f",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 875,
      description: "",
      idendpoint: "55bdde78-051e-4844-a4b2-089f122f616e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "623f5b679c0803149f05f26bafa6a6ce0e928c5a04990e042936ad364e085ad6",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/dev",
      method: "GET",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 176,
      description: "",
      idendpoint: "82a678a2-04ef-4231-8091-7ea3432515f4",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "20b96e3bd094627086f2303dcfc507a96d2f7868f35b73ac6c0cdd14d1784aac",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/dev",
      method: "POST",
      handler: "FUNCTION",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 440,
      description: "",
      idendpoint: "bc07e60d-d608-4763-b712-8ae01156fea7",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "244df02066197797807efe16069de5dda97d2c69bfa63d7afb8e7873accc41b6",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/delete/prd",
      method: "DELETE",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/delete",
      code: "fndeleteIntervalTask",
      rowkey: 809,
      description: "",
      idendpoint: "e753e2db-ca20-4607-82b7-34b70e435a0c",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        body: {
          selection: 0,
          json: {
            code: {},
          },
          xml: {
            code: "",
          },
          text: {
            value: "",
          },
          form: {},
        },
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        auth: {
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "4e74ec09ac977b07972fa0c21eac9e9034f7ea3135b9c4595036e4e011f0d834",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/handler/js/funtions/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/system/handler/js/funtions",
      code: "fnListFnVarsHandlerJS",
      rowkey: 108,
      description: "",
      idendpoint: "3d3de358-681d-4b61-98dc-c1663db0c02c",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
        body: {
          selection: 0,
        },
        headers: {},
        auth: {
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "067c3a17e4c513891174162c91dc2f144c94160957a76b2911f3c2530dfdd438",
    },
    {
      enabled: true,
      endpoint: "/api/system/users/list/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/users/list",
      code: "fnGetUsersList",
      rowkey: 568,
      description: "",
      idendpoint: "2c6d77b7-d8e2-49e2-9c63-a98a873b389c",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "04883fee13027a6f1ff4a25d2fe7ee20cd4fb6d04cd9bc8dbd61f208a659ec10",
    },
    {
      enabled: true,
      endpoint: "/api/system/responses/status_code/count/prd",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 2,
      ctrl: {},
      resource: "/responses/status_code/count",
      code: "fnGetResponseCountStatus",
      rowkey: 771,
      description: "",
      idendpoint: "4c2516ec-d7c4-4783-8ee5-f7dac5b68a91",
      cors: {},
      headers_test: {},
      data_test: {
        body: {
          json: {
            code: "",
          },
          xml: {
            code: "",
          },
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        headers: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
      },
      latest_updater: null,
      environment: "prd",
      internal_hash_row:
        "579f4bd728ade81052504f66f67f8f4b4c98f2108076f8c3c4b2161fa1db8dfa",
    },
  ],
  environment: "dev",
};
