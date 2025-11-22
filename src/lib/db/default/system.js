export const system_app = {
  vars: {
    dev: {},
    qa: {},
    prd: {},
  },
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
      endpoint: "/api/system/api/token/0.01/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 185,
      description: "",
      idendpoint: "15ca7819-8823-4835-87c5-04b792bc594d",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "2bc65eb76a6276ffdb037f2ea4b97a4449b9aa65690fde804aa6228f7b0f1c9b",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/handler/documentation/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 3600,
      ctrl: {},
      resource: "/api/handler/documentation",
      code: "fnGetHandlerDocs",
      rowkey: 757,
      description: "Get documentation of a specific handler",
      idendpoint: "25ca7819-8823-4835-87c5-04b792bc594d",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {
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
      },
      internal_hash_row:
        "d39cba183777c742245039df12cb257b66d115be6f751253fc8a58872fe3e917",
    },

    {
      enabled: true,
      endpoint: "/api/system/system/log/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 5,
      ctrl: {
        users: [],
        log: {
          level: 0,
        },
      },
      resource: "/system/log",
      code: "fnGetLogs",
      rowkey: 761,
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
      json_schema: {},
      internal_hash_row:
        "0dbc08869684c790d6f3924b88c7d1c166820b63ccaf074c882eea8d5ec5131d",
    },

    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/qa",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 472,
      description: "",
      idendpoint: "65cdde4c-8000-4248-bd77-157257b6d9c2",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      json_schema: {},
      internal_hash_row:
        "0e445464ecfed16705529ba38801cc962201ea1e160c5c7a2d1de7667f650e57",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/environment/0.01/prd",
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/environment/0.01",
      code: "fnGetEnvironment",
      rowkey: 354,
      description: "",
      idendpoint: "d7737d40-5cd8-45f2-a60a-1014272a2faf",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "4d58d1143678ec64574098c6f8aaee7635b4e285a8f7f550f77a8e26f2207b0f",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/environment/prd",
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 90,
      ctrl: {
        admin: true,
      },
      resource: "/system/environment",
      code: "fnGetEnvironment",
      rowkey: 354,
      description: "",
      idendpoint: "d7737d40-5cd8-45f2-a60a-1014272a2fa0",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "4d58d1143678ec64574098c6f8aaee7635b4e285a8f7f550f77a8e26f2207b0f",
    },
    {
      enabled: true,
      endpoint: "/api/system/information/dynamic/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/information/dynamic",
      code: "fnGetSystemInfoDynamic",
      rowkey: 914,
      description: "",
      idendpoint: "bcf0e362-a454-4e47-85a0-772c4ddd3538",
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
      json_schema: {
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
      },
      internal_hash_row:
        "98b72dbb8d6111a63a65f5d95ed6d3d1a0ad2b3553e3329646268e69b68a8149",
    },
    {
      enabled: true,
      endpoint: "/ws/system/websocket/hooks/prd",
      access: 0,
      method: "WS",
      handler: "NA",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/websocket/hooks",
      code: "",
      rowkey: 321,
      description: "",
      idendpoint: "3eb8b6c8-e001-43e6-9ace-517a05d33e6b",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "7e71559cf84f0ae69eb8e40f1d4f1049c5178197ebecab9a12a3e747c6a5946c",
    },
    {
      enabled: true,
      endpoint: "/api/system/information/static/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/information/static",
      code: "fnGetSystemInfoStatic",
      rowkey: 801,
      description: "",
      idendpoint: "0b48cd44-09fe-40e7-b0a7-59fe01e054cc",
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
      json_schema: {
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
      },
      internal_hash_row:
        "b260b99fb39a08b8dff8fd07c9a4b938b00af18f72c73da76ab04c6fc4ef1b79",
    },

    {
      enabled: true,
      endpoint: "/api/system/system/login/0.01/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/login/0.01",
      code: "fnLogin",
      rowkey: 682,
      description: "",
      idendpoint: "871cd2ed-8456-4e5e-8ab5-b7724a908191",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "e0b6ed1dc8c23994c9f9a72e7ecbfa9502537034fa8992e1cef6fcaa7c443d61",
    },
    {
      enabled: true,
      endpoint: "/api/system/cache/response/size/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/cache/response/size",
      code: "fnGetCacheSize",
      rowkey: 677,
      description: "",
      idendpoint: "047845ac-5367-48ed-9465-8e36ba6c7bae",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "226526f3c2fab841fc10769ca1e5a8aad354b140402b2df736a4ca45bcfd00e0",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/system/log",
      code: "fnInsertLog",
      rowkey: 584,
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
      json_schema: {},
      internal_hash_row:
        "6876e84c31c8bf477d2adcdfa5ce3443a4166d44616145eff298e49f89fc21b8",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/token/api/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/token/api",
      code: "fnToken",
      rowkey: 444,
      description: "",
      idendpoint: "b5141492-3ad1-4ea6-a85d-ceb23ba26244",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "a9a8ab2dfdbd31c39090e88ee9ac8683d10d91adf570c833ea75db33a1d438d9",
    },
    {
      enabled: true,
      endpoint: "/api/system/cache/clear/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/cache/clear",
      code: "fnClearCache",
      rowkey: 290,
      description: "",
      idendpoint: "3ead2170-283d-4c6a-abc1-eddd217b6d01",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "0e006fd2d70737b128125c6f0d3d8ddd2ef7e9443fb5df03b732a1e1f756799b",
    },


{
      enabled: true,
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 30,
      ctrl: {
        admin: true,
      },
      resource: "/app/backup",
      code: "fnGetAppBackupById",

      description: "Get App data to backup by idapp",
      idendpoint: "00034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
    },

{
      enabled: true,
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/app/backup",
      code: "fnRestoreAppFromBackup",

      description: "Restore App data from backup by idapp",
      idendpoint: "01034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
    },


    {
      enabled: true,
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/app/variables/idapp",
      code: "fnGetAppVarsByIdApp",

      description: "Get application variables by idapp",
      idendpoint: "15034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
    },





    {
      enabled: true,
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/app/documentation",
      code: "fnGetAppDocById",
      rowkey: 407,
      description: "Get documentation to endpoints by app id",
      idendpoint: "15034cf9-4c94-43ba-bc7a-3d762f62d7ee",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
    },

    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/prd",
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 407,
      description: "",
      idendpoint: "15034cf9-4c94-43ba-bc7a-3d762f62d7de",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "e0f8e6f6c9053074521afaefca263f2ec85c7faac2bf2d718270ff72258dd95b",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/recordsperminute/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {
        enabled: false,
        name: "",
        title: "",
        description: "",
      },
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/system/log/recordsperminute",
      code: "fnGetLogsRecordsPerMinute",
      rowkey: 60,
      description: "",
      idendpoint: "c6d6c431-aa5a-4e76-b89c-fe91e0537de4",
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
      json_schema: {
        in: {
          enabled: false,
          schema: {
            type: "object",
            properties: {},
            additionalProperties: true,
          },
        },
        out: {},
      },
      internal_hash_row:
        "15917e98107f26466f968d72d0908664fe0aa2fe0c65532b9ab2565d2be6846d",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/upsert/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/upsert",
      code: "fnUpsertIntervalTask",
      rowkey: 517,
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
      json_schema: {},
      internal_hash_row:
        "9c0084dbfd4762cf09fcea8ef74b49cec34d0fb4bf069ae9397e68dfc5246bd6",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/logout/0.01/prd",
      access: 2,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/logout/0.01",
      code: "fnLogout",
      rowkey: 263,
      description: "",
      idendpoint: "131cca3e-f835-4414-89ca-5ddbbec5ab89",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "57ef1f157db63e86fe327d8a3f641dfc679a9ab8a6c2f76c6e46359a7ee013a7",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/telegram/sendphoto/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/api/telegram/sendphoto",
      code: "fnTelegramsendPhoto",
      rowkey: 44,
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
                "https://www.demo.com/wp-content/uploads/2024/11/MAPA1.jpg",
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
      json_schema: {},
      internal_hash_row:
        "f1a9a8bf847c3ba433223be1dff07a91e3a24c39ef5d732dcae5fda66765a6e8",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/prd",
      access: 2,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 622,
      description: "",
      idendpoint: "d9086725-367f-4383-8b43-c23071bc8fcc",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "0ebcc6f409cc018195606c6937edd944f15f63eda3a475bd9d01fc3b1b52ae2c",
    },
    {
      enabled: true,
      endpoint: "/api/system/database/hooks/prd",
      access: 0,
      method: "POST",
      handler: "JS",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/database/hooks",
      code: "$_SERVER_.checkwebHookDB($_REQUEST_);\n",
      rowkey: 705,
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
      json_schema: {},
      internal_hash_row:
        "0c0c65a36f45175f8405c1395071969b3b36cf005098cae4b37a9e9229701370",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/function_names/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 999,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/api/function_names",
      code: "fnFunctionNames",
      rowkey: 191,
      description: "",
      idendpoint: "13f94d7d-6612-4c30-8202-286cbbe3da3e",
      cors: {},
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: true,
            key: "env",
            value: "prd",
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
      json_schema: {},
      internal_hash_row:
        "137b99a4812ecc07f896ab1e8f599e52db2841a40fb5650be3d99c246f973499",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/dev",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 957,
      description: "",
      idendpoint: "52fb738c-7d1f-4eba-afb4-508a9fa9d06a",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      json_schema: {},
      internal_hash_row:
        "f4466f4c8f20dd3916bf6d872e00501ee5ec6aa06a1ba8adb1ea520cb0641a19",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/method/0.01/prd",
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/method/0.01",
      code: "fnGetMethod",
      rowkey: 466,
      description: "",
      idendpoint: "0144753a-61a6-4ee1-8ae5-1d871dd21d24",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "25201f8405431cd93b65db461669ea2b5c5009fd860f724abfae537268a54358",
    },
    {
      enabled: true,
      endpoint: "/api/system/app/internal/metrics/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/app/internal/metrics",
      code: "fnGetInternalAppMetrics",
      rowkey: 185,
      description: "Return internal metrics",
      idendpoint: "38d64e6e-e3a2-4664-abb9-cc9b1abeaf31",
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
      json_schema: {
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
      },
      internal_hash_row:
        "79c379ba39c1fe031e8498434b58885f628681639fc00e40da1d828463d45562",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps",
      code: "fnGetApps",
      rowkey: 98,
      description: "",
      idendpoint: "55bdde78-051e-4844-a4b2-089f122f6160",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/prd",
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 908,
      description: "",
      idendpoint: "55bdde78-051e-4844-a4b2-089f122f616e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "86388f30425b57a4a7ea64ffba98050bfc8fa76c425181867669af94719b2cd1",
    },
    {
      enabled: true,
      endpoint: "/ws/system/websocket/server/prd",
      access: 0,
      method: "WS",
      handler: "NA",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/websocket/server",
      code: "",
      rowkey: 835,
      description: "Send events from server",
      idendpoint: "a0130d77-b779-4dea-a87f-6841520ffade",
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
      json_schema: {
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
      },
      internal_hash_row:
        "9913699719b032d0009488fe0ac74c1702c44bd2ac1ca4203ced770643e8f5b4",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/byidapp/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/byidapp",
      code: "fnGetIntervalTasksByIdApp",
      rowkey: 546,
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
      json_schema: {},
      internal_hash_row:
        "96e91076d193b22d81027f3637a37a9365b64e22a67ee5446585c0ed1963856d",
    },

    {
      enabled: true,
      endpoint: "/api/system/api/app/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/api/app",
      code: "fnAppUpsert",
      rowkey: 350,
      description: "",
      idendpoint: "410321a2-3930-4545-963d-b47f90fdbff3",
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
      json_schema: {
        in: {
          enabled: false,
          schema: {},
        },
        out: {},
      },
      internal_hash_row:
        "a3080592b4eb3be7fea40feb586b492958a558e65c0141a79dbf76eb8879895e",
    },

    {
      enabled: true,
      endpoint: "/api/system/api/endpoint/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/api/endpoint",
      code: "fnEndpointUpsert",
      rowkey: 350,
      description: "",
      idendpoint: "410321a2-3930-4545-963d-b47f90fdbf01",
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
      json_schema: {
        in: {
          enabled: false,
          schema: {},
        },
        out: {},
      },
      internal_hash_row:
        "a3080592b4eb3be7fea40feb586b492958a558e65c0141a79dbf76eb8879895e",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/endpoint/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/api/endpoint",
      code: "fnEndpointGetById",
      rowkey: 350,
      description: "",
      idendpoint: "410321a2-3930-4545-963d-b47f90fdbf02",
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
      json_schema: {
        in: {
          enabled: false,
          schema: {},
        },
        out: {},
      },
      internal_hash_row:
        "a3080592b4eb3be7fea40feb586b492958a558e65c0141a79dbf76eb8879895e",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/endpoints/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/api/app/endpoints",
      code: "fnEndpointGetByIdApp",
      rowkey: 350,
      description: "",
      idendpoint: "410321a2-3930-4545-963d-b47f90fdbff1",
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
      json_schema: {
        in: {
          enabled: false,
          schema: {},
        },
        out: {},
      },
      internal_hash_row:
        "a3080592b4eb3be7fea40feb586b492958a558e65c0141a79dbf76eb8879895e",
    },

    {
      enabled: true,
      endpoint: "/api/system/api/app/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      resource: "/api/app",
      code: "fnAppGetById",
      rowkey: 351,
      description: "",
      idendpoint: "410321a2-3930-4545-963d-b47f90fdbff4",
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
      json_schema: {
        in: {
          enabled: false,
          schema: {},
        },
        out: {},
      },
    },

    {
      enabled: true,
      endpoint: "/api/system/api/telegram/sendmsg/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
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
      rowkey: 175,
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
      json_schema: {},
      internal_hash_row:
        "626f14017037ad8852c9988264a1f9bced851caa6627dffaeb1b146ce3a7e28a",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/delete/prd",
      access: 0,
      method: "DELETE",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/delete",
      code: "fndeleteIntervalTask",
      rowkey: 902,
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
      json_schema: {},
      internal_hash_row:
        "c65e6c47be9c636079bd692c14043745c06db74a7d015c6b4f4cccbd6f9c61db",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/handler/js/funtions/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/system/handler/js/funtions",
      code: "fnListFnVarsHandlerJS",
      rowkey: 530,
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
      json_schema: {},
      internal_hash_row:
        "ca77debdecca703370af55aad95302d719a1b7ec05354ee19d66e6e62eba0757",
    },
    {
      enabled: true,
      endpoint: "/api/system/users/list/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {},
      resource: "/users/list",
      code: "fnGetUsersList",
      rowkey: 599,
      description: "",
      idendpoint: "2c6d77b7-d8e2-49e2-9c63-a98a873b389c",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "8ac0fa8c7421bfd58574feb9deb59b5039f5be35bb47ff2451d971237c46d927",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/handler/0.01/prd",
      access: 2,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/handler/0.01",
      code: "fnGetHandler",
      rowkey: 702,
      description: "",
      idendpoint: "17c211d6-8c81-4274-b5c4-604126454ab0",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "d2108cd31d67da2ee875df824c636c0ea2b548a29884a8d67af15a8d8c2ea3dd",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/api/token/prd",
      access: 0,
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/api/token",
      code: "fnAPIToken",
      rowkey: 95,
      description: "",
      idendpoint: "89b6d2c3-5d9e-4c18-9221-5f2673c17bb3",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "59bd0f3dd9756b63f0317d3048c21c742565c24b992a2a462f46b695ad8a63c7",
    },
    {
      enabled: true,
      endpoint: "/api/system/responses/status_code/count/prd",
      access: 0,
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      cache_time: 2,
      ctrl: {},
      resource: "/responses/status_code/count",
      code: "fnGetResponseCountStatus",
      rowkey: 157,
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
      json_schema: {},
      internal_hash_row:
        "03aab40f2db8122efb443e28e319e7f5c75bc9024c91398b11b04d998354cd67",
    },
  ],
  environment: "dev",
};
