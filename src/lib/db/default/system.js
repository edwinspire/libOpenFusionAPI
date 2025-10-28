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
      endpoint: "/api/system/api/handler/documentation/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 3600,
      ctrl: {},
      resource: "/api/handler/documentation",
      code: "fnGetHandlerDocs",
      rowkey: 816,
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
        "a22b32ec6b14479dc26bdd4f958504c7f84f5a73fd929d5c2d1ba82766328e88",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 306,
      description: "",
      idendpoint: "15ca7819-8823-4835-87c5-04b792bc594d",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "d083c08840e8731a9f8b5942cc7aacea29341a19c04e516a7c682474ab76aa4c",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/dev",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 833,
      description: "",
      idendpoint: "48f6c75d-285c-420d-b6d7-9471bf052c1e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      json_schema: {},
      internal_hash_row:
        "b736e7adb7c67056e6195d34419f1adb46a0defbcb4051bc0924da765d8faf2b",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/qa",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 106,
      description: "",
      idendpoint: "9dcc9e25-1238-411e-87f8-78f318455c7e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      json_schema: {},
      internal_hash_row:
        "575407c2af5b68f16018cba600acb4bb704b5c90ac877dce2bac5f18defb4d16",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/qa",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 318,
      description: "",
      idendpoint: "65cdde4c-8000-4248-bd77-157257b6d9c2",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      json_schema: {},
      internal_hash_row:
        "f10eb0f064a21f5685b76860c33e37b6472683f10917fcffb8918286475d303b",
    },
    {
      enabled: true,
      endpoint: "/api/system/information/dynamic/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/information/dynamic",
      code: "fnGetSystemInfoDynamic",
      rowkey: 729,
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
        "1896649fb3b1bfa66cb3c316d426dcba4ca4426a7559864af89c45624bd28a99",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/environment/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/environment/0.01",
      code: "fnGetEnvironment",
      rowkey: 519,
      description: "",
      idendpoint: "d7737d40-5cd8-45f2-a60a-1014272a2faf",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "cdd6189023efdee049ec6d8bfb7d7de5d11c17345a92b0125375099cc9b96b09",
    },
    {
      enabled: true,
      endpoint: "/ws/system/websocket/server/prd",
      method: "WS",
      handler: "NA",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/websocket/server",
      code: "",
      rowkey: 741,
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
        "984a9271f09fac1c075d954395348a71cb42140759e7f08a87340a6cd8c9fffb",
    },
    {
      enabled: true,
      endpoint: "/api/system/information/static/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/information/static",
      code: "fnGetSystemInfoStatic",
      rowkey: 376,
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
        "4dd379af60c10e445a6b7e1744fa31cf5acb6c799af9a9ed74046079f138ae57",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/login/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/login/0.01",
      code: "fnLogin",
      rowkey: 967,
      description: "",
      idendpoint: "871cd2ed-8456-4e5e-8ab5-b7724a908191",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "132d053a556385707bf1aa091310e859a290ea78f721e406ac14250542f218f5",
    },
    {
      enabled: true,
      endpoint: "/ws/system/websocket/hooks/prd",
      method: "WS",
      handler: "NA",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/websocket/hooks",
      code: "",
      rowkey: 908,
      description: "",
      idendpoint: "3eb8b6c8-e001-43e6-9ace-517a05d33e6b",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "8425e9374758e29b07515c7d954bdb11ec0fe720a4e332ad572dd19459088811",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/qa",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 157,
      description: "",
      idendpoint: "dae4d3ff-6782-4fd3-8837-d169cf1aded8",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      json_schema: {},
      internal_hash_row:
        "1abd480100ba3e2191d2198ec698b6e973605d15e491e8cb1859a9459ee5758c",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/byidapp/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/byidapp",
      code: "fnGetIntervalTasksByIdApp",
      rowkey: 33,
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
        "b022ef1884cd3c98af6ffec6eda5dec5b10dbc6d7820112268e9f38505d8d6dc",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/recordsperminute/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {
        enabled: false,
        name: "",
        title: "",
        description: "",
      },
      access: 0,
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
      rowkey: 133,
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
        "7438dbb8cdd6ecb7e268d3977c78bbca4470ad000266444b34725b3e0bc9c889",
    },
    {
      enabled: true,
      endpoint: "/api/system/cache/response/size/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/cache/response/size",
      code: "fnGetCacheSize",
      rowkey: 697,
      description: "",
      idendpoint: "047845ac-5367-48ed-9465-8e36ba6c7bae",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "7ce1584abd5851c5438921069d21160a201003efff36227ba944a27b2210e3a7",
    },
    {
      enabled: true,
      endpoint: "/api/system/cache/clear/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/cache/clear",
      code: "fnClearCache",
      rowkey: 787,
      description: "",
      idendpoint: "3ead2170-283d-4c6a-abc1-eddd217b6d01",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "21f89935fd73e2e75ed3020f238bfd76698a47619dfc6640c0ad9b7d55c65f58",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/system/log",
      code: "fnInsertLog",
      rowkey: 248,
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
        "3d6f484e91fff5e08d9cc259e35339b0635df18e4120f13dc82990356e2947f8",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 137,
      description: "",
      idendpoint: "15034cf9-4c94-43ba-bc7a-3d762f62d7de",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "769c37d48dd09de0a105619f7607fed2f0d61276f96c5cba29ebb56e5db2ccea",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/token/api/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/token/api",
      code: "fnToken",
      rowkey: 275,
      description: "",
      idendpoint: "b5141492-3ad1-4ea6-a85d-ceb23ba26244",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "379ac92004f13187bf033e97f948ff4eaa32db0593333dddd2d9859f9b1f4397",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/function_names/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 999,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/api/function_names",
      code: "fnFunctionNames",
      rowkey: 75,
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
        "8f17c0119abadd5d2bb0d4d3e738b308ffaa14f13f7c95d7efe5ceda65801fa7",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/upsert/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/upsert",
      code: "fnUpsertIntervalTask",
      rowkey: 116,
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
        "2ce095825d987139b537224a7415d9ed15c155800a4cb3a0dbdca0ccfb956918",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/logout/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/logout/0.01",
      code: "fnLogout",
      rowkey: 904,
      description: "",
      idendpoint: "131cca3e-f835-4414-89ca-5ddbbec5ab89",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "f27947b3926cc8d8334021171a6aa6be8a587807d94dddbd6404ab2b93403255",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/telegram/sendphoto/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/api/telegram/sendphoto",
      code: "fnTelegramsendPhoto",
      rowkey: 672,
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
        "0ccfe577621c6c896ac8078c9fe8e4e168987f5567aed8edb85f07b2270c7dfa",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/qa",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 951,
      description: "",
      idendpoint: "6f1358ae-a638-47f8-a5d1-57818f17426b",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "qa",
      json_schema: {},
      internal_hash_row:
        "c4da50da96029b3021b5240707f74d95a4fed3500ed091f0427410759568d0f4",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 105,
      description: "",
      idendpoint: "d9086725-367f-4383-8b43-c23071bc8fcc",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "43cb2601a5be8588b5bf1a3920e8a4bf505b872f3418bc2aa5ba2116d9d0a6e2",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/token/0.01/dev",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/token/0.01",
      code: "fnToken",
      rowkey: 664,
      description: "",
      idendpoint: "52fb738c-7d1f-4eba-afb4-508a9fa9d06a",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      json_schema: {},
      internal_hash_row:
        "f7472cd2d7645a8a2ba959bd44b97714ce5f31d3e1ae16c8d85a1c9b352a0a93",
    },
    {
      enabled: true,
      endpoint: "/api/system/database/hooks/prd",
      method: "POST",
      handler: "JS",
      mcp: {},
      access: 0,
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
      rowkey: 858,
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
        "2ef70e9d3aa02ed824f243bdeb67aaa8d255851b2c28603c7da473b4f56b7f92",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/log/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 5,
      ctrl: {
        users: [],
        log: {
          level: 0,
        },
      },
      resource: "/system/log",
      code: "fnGetLogs",
      rowkey: 144,
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
        "36dc031e1bb476fd8636fd689330284d103a78a4ed6a0d4c8e33a81bac2ff52f",
    },
    {
      enabled: true,
      endpoint: "/api/system/app/internal/metrics/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/app/internal/metrics",
      code: "fnGetInternalAppMetrics",
      rowkey: 995,
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
        "a2089adb7635cda05251b04cf762325bf692a19a78c8616fde4626019c68c3c6",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/method/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/method/0.01",
      code: "fnGetMethod",
      rowkey: 506,
      description: "",
      idendpoint: "0144753a-61a6-4ee1-8ae5-1d871dd21d24",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "6a65ceb808d7f79f85789887109c89257f79d036b78f48895d337f3903da0d60",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/apps/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/apps/0.01",
      code: "fnGetApps",
      rowkey: 528,
      description: "",
      idendpoint: "55bdde78-051e-4844-a4b2-089f122f616e",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "2398ae8d332510811aba6c796aec91b755e7d60ce21c7998d2af28739f674329",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/telegram/sendmsg/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
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
      rowkey: 581,
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
        "030f7f935369616a2b3a22080f3d21d92de7e08e4e4e13d7c3ab40e240f7455f",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/dev",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnSaveApp",
      rowkey: 392,
      description: "",
      idendpoint: "bc07e60d-d608-4763-b712-8ae01156fea7",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      json_schema: {},
      internal_hash_row:
        "e945db70bf3203962eb9b6e96115f57f453e8fcc94d9ed47cd3ee5aee1cf830b",
    },
    {
      enabled: true,
      endpoint: "/api/system/api/app/0.01/dev",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/api/app/0.01",
      code: "fnGetAppById",
      rowkey: 353,
      description: "",
      idendpoint: "82a678a2-04ef-4231-8091-7ea3432515f4",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      json_schema: {},
      internal_hash_row:
        "3306ca28ba8667762073c530297ab7a55be3dc87dc7e6cf8778d53164d6aef56",
    },
    {
      enabled: true,
      endpoint: "/api/system/interval_tasks/delete/prd",
      method: "DELETE",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/interval_tasks/delete",
      code: "fndeleteIntervalTask",
      rowkey: 52,
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
        "e26c2d97a13866156c705a4fee0e93af91ea337116c463621a5754220f849452",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/handler/js/funtions/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/system/handler/js/funtions",
      code: "fnListFnVarsHandlerJS",
      rowkey: 863,
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
        "83185bb2daf6c5feddde2c53325f2131a76df789e7499e8952e258f61fef142a",
    },
    {
      enabled: true,
      endpoint: "/api/system/users/list/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/users/list",
      code: "fnGetUsersList",
      rowkey: 172,
      description: "",
      idendpoint: "2c6d77b7-d8e2-49e2-9c63-a98a873b389c",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "c810f305b91002746d2bc45285aab389ac0354d7f2ddd1dec0be625c3fe147a3",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/handler/0.01/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/handler/0.01",
      code: "fnGetHandler",
      rowkey: 305,
      description: "",
      idendpoint: "17c211d6-8c81-4274-b5c4-604126454ab0",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "9dde0f8625e046d99ad19a388fbc436034602e256056d36583ce989e29aa8c0a",
    },
    {
      enabled: true,
      endpoint: "/api/system/system/api/token/prd",
      method: "POST",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/system/api/token",
      code: "fnAPIToken",
      rowkey: 450,
      description: "",
      idendpoint: "89b6d2c3-5d9e-4c18-9221-5f2673c17bb3",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "prd",
      json_schema: {},
      internal_hash_row:
        "7b6b69f959e0cf83d4b102ced441d878744021da0d5a11d4f9b65c08910c98ea",
    },
    {
      enabled: true,
      endpoint: "/api/system/responses/status_code/count/prd",
      method: "GET",
      handler: "FUNCTION",
      mcp: {},
      access: 0,
      cache_time: 2,
      ctrl: {},
      resource: "/responses/status_code/count",
      code: "fnGetResponseCountStatus",
      rowkey: 767,
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
        "d65cdc499600a4ee9c9b1ab0d0644430a007a6536b535aefabac8fc30daa3a8b",
    },
  ],
  environment: "dev",
};
