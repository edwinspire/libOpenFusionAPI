export const demo_app = {
  vars: {
    dev: {
      $_VAR_DEMO_1: 10,
      $_VAR_DEMO_2: {
        host: "google.com",
        var1: {
          a: 10,
          b: {
            casti: 3,
          },
        },
      },
      $_VAR_FETCH: "https://fakestoreapi.com/carts",
      $_VAR_SQLITE: {
        database: "memory",
        username: "",
        password: "",
        options: {
          host: "localhost",
          dialect: "sqlite",
        },
      },
      $_VAR_SOAP_TEST: {
        wsdl: "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",
        functionName: "NumberToDollars",
        BasicAuthSecurity: {
          User: "any",
          Password: "any",
        },
      },
      $_VAR_$_VAR_CNX_OMS: {
        database: "ofapi",
        username: "postgres",
        password: "pg9999",
        options: {
          host: "192.168.100.100",
          port: 5432,
          dialect: "postgres",
        },
      },
    },
    qa: {
      $_VAR_DEMO_1: 10,
      $_VAR_DEMO_2: {
        host: "google.com",
        var1: {
          a: 10,
          b: {
            casti: 3,
          },
        },
      },
      $_VAR_FETCH: "https://fakestoreapi.com/carts",
      $_VAR_SQLITE: {
        database: "memory",
        username: "",
        password: "",
        options: {
          host: "localhost",
          dialect: "sqlite",
        },
      },
      $_VAR_SOAP_TEST: {
        wsdl: "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",
        functionName: "NumberToDollars",
        BasicAuthSecurity: {
          User: "any",
          Password: "any",
        },
      },
    },
    prd: {
      $_VAR_DEMO_1: 10,
      $_VAR_DEMO_2: {
        host: "google.com",
        var1: {
          a: 10,
          b: {
            casti: 3,
          },
        },
      },
      $_VAR_FETCH: "https://fakestoreapi.com/carts",
      $_VAR_SQLITE: {
        database: "memory",
        username: "",
        password: "",
        options: {
          host: "localhost",
          dialect: "sqlite",
        },
      },
      $_VAR_SOAP_TEST: {
        wsdl: "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",
        functionName: "NumberToDollars",
        BasicAuthSecurity: {
          User: "any",
          Password: "any",
        },
      },
    },
  },
  params: {
    telegram: {
      idgroup: "",
    },
  },
  idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
  app: "demo",
  rowkey: 0,
  iduser: null,
  enabled: true,
  description: "App DEMO",
  createdAt: "2024-01-30T03:33:10.835Z",
  updatedAt: "2025-11-22T05:07:07.329Z",
   
  endpoints: [
    {
      ctrl: {
        admin: true,
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "82fdbae6-5180-4ddd-ae75-c31dc60cf641",
      rowkey: 542,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_ws/0.02",
      method: "WS",
      handler: "NA",
      access: 0,
      description: "",
      code: '{"userAuthentication":true,"tokenAuthentication":false,"broadcast":false}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.274Z",
    },
    {
      ctrl: {
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "9b7200b4-c77c-42a4-a8c0-85bb963b4644",
      rowkey: 692,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/test/fetch/new",
      method: "GET",
      handler: "JS",
      access: 0,
      description: "ok",
      code: "",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.273Z",
    },
    {
      ctrl: {
        users: [],
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        body: {
          js: {
            code: "",
          },
          xml: {},
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "name",
            value: "jjjj",
            internal_hash_row:
              "3c04334487c6d549210a23ff3ddf28262185b9b64e4a0dfbbe6f6d1aa44fa2d2",
          },
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: [
          {
            enabled: false,
            key: "name",
            value: "test",
            internal_hash_row:
              "117f0f0e9757a93edda86ae4e9e1122baeb22b529a595c3ffd91904e67545423",
          },
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
      },
      idendpoint: "bb87e424-4ef3-4e5a-83ea-b5c719a34288",
      rowkey: 171,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_sql/0.02",
      method: "GET",
      handler: "SQL",
      access: 0,
      description: "",
      code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT :name as nombre;"\n}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.277Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        body: {
          js: {
            code: "",
          },
          xml: {},
          text: {},
          selection: 0,
        },
      },
      idendpoint: "82b0a799-21b0-4b95-8d58-43cfa44f7c47",
      rowkey: 350,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_sql/0.04",
      method: "GET",
      handler: "SQL",
      access: 0,
      description: "",
      code: '{\n  "config": "",\n  "query": "SELECT\\n    job_id AS [Job ID],\\n    name AS [Job Name],\\n    enabled AS [Is Enabled]\\nFROM\\n    msdb.dbo.sysjobs;"\n}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.274Z",
    },
    {
      ctrl: {
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        body: {
          js: {},
          xml: {},
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
      },
      idendpoint: "87ec2f9a-64fc-4818-9a93-e47bf3d8b0dd",
      rowkey: 693,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/text/plain_text",
      method: "GET",
      handler: "TEXT",
      access: 0,
      description:
        "Returns plain text. You can define a MIMETYPE according to your needs.",
      code: '{\n  "mimeType": "text/plain",\n  "payload": "Hello edwinspire with Open Fusion API"\n}',
      cache_time: 30,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.275Z",
    },
    {
      ctrl: {
        admin: true,
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "fda286e7-d51f-40ec-a239-35edcbf364eb",
      rowkey: 483,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_ws/0.03",
      method: "WS",
      handler: "NA",
      access: 2,
      description: "",
      code: '{"userAuthentication":false,"tokenAuthentication":true,"broadcast":false}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.276Z",
    },
    {
      ctrl: {
        admin: true,
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "0d488251-6e49-4239-8c85-be101619aa1f",
      rowkey: 655,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_ws/0.01",
      method: "WS",
      handler: "NA",
      access: 2,
      description: "",
      code: '{"userAuthentication":false,"tokenAuthentication":false,"broadcast":true}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.275Z",
    },
    {
      ctrl: {
        admin: true,
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        body: {
          js: {
            code: "",
          },
          xml: {},
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
      },
      idendpoint: "ae8726f7-36ec-4c70-8183-85837b783698",
      rowkey: 190,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_sql/0.03",
      method: "GET",
      handler: "SQL",
      access: 0,
      description: "",
      code: '{\n  "config": {\n    "database": "memory",\n    "username": "",\n    "password": "",\n    "options": {\n      "host": "localhost",\n      "dialect": "sqlite"\n    }\n  },\n  "query": "SELECT 1097 AS test_sql;"\n}',
      cache_time: 120,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.276Z",
    },
    {
      ctrl: {
        admin: true,
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "dedb3546-3bf8-4973-8c8a-5c7308338ba5",
      rowkey: 869,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/main/test_sql/0.05",
      method: "GET",
      handler: "SQL",
      access: 0,
      description: "",
      code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT $name as nombre, strftime(\'%Y-%m-%d %H-%M-%S\',\'now\') AS dt;"\n}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.276Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: true,
            key: "dNum",
            value: "3.65",
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
      idendpoint: "134b1b86-ee20-4210-9948-5ecac5c6d7d6",
      rowkey: 885,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/soap/example01",
      method: "GET",
      handler: "SOAP",
      access: 0,
      description: "Holaddddd.\nok",
      code: "$_VAR_SOAP_TEST",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.275Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {
          clientError: true,
          full: true,
        },
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        body: {
          js: {},
          xml: {},
          text: {},
          selection: 0,
        },
        query: {},
        headers: {},
      },
      idendpoint: "73ade868-1616-42e4-bd6e-0de1a55b4e9b",
      rowkey: 423,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/javascript/example02",
      method: "GET",
      handler: "JS",
      access: 3,
      description: "This example returns the value of an application variable.",
      code: "$_RETURN_DATA_ = $_VARS_APP;",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.274Z",
    },
    {
      ctrl: {
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      idendpoint: "20c6fb54-f048-44ad-88e4-6aca76a62aec",
      rowkey: 506,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/text/xml",
      method: "GET",
      handler: "TEXT",
      access: 0,
      description: "Returns plain XML text.",
      code: '{\n  "mimeType": "text/xml",\n  "payload": "<hello>edwinspire</hello>"\n}',
      cache_time: 30,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.276Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
        headers: {},
        auth: {
          selection: 0,
        },
      },
      idendpoint: "e909e080-35e2-4250-b799-da4770589e3f",
      rowkey: 93,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/javascript/two_fetch_ByBlocks",
      method: "GET",
      handler: "JS",
      access: 0,
      description: "",
      code: 'let uf = $_URL_AUTO_ENV_.create("/api/demo/ofapi/javascript/example03/auto");\nlet uf2 = $_URL_AUTO_ENV_.create("/api/demo/ofapi/soap/example01/auto");\n\nlet r1 = await uf.GET();\nlet r1j = await r1.json();\n\n// Second fetch with Secuential Promise\nlet rblock = await $_SECUENTIAL_PROMISES_.ByBlocks(\n  async (data) => {\n    let val = data.value1 + data.value2;\n\n    let r2 = await uf2.GET({ data: { dNum: val } });\n    let r2j = await r2.json();\n\n    return r2j;\n  },\n\n  2,\n  r1j,\n);\n\n$_RETURN_DATA_ = await rblock;\n',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.275Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        body: {
          js: {},
          xml: {},
          text: {},
          selection: 0,
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
      },
      idendpoint: "45cf84b5-d82f-4aca-ad16-85a25ed6f387",
      rowkey: 326,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/function/call_function/example01",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      description:
        "Calls a custom function created on the server. Functions can be created when the process is highly complex or requires external libraries that are not pre-installed in the OpenFusion API.",
      code: "fnPublicAdd",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.274Z",
    },
    {
      ctrl: {},
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "9e461698-df3c-4420-ad5b-1811c9937c2c",
      rowkey: 836,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/rueba/base",
      method: "GET",
      handler: "NA",
      access: 0,
      description: "",
      code: "",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.277Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      idendpoint: "28c0bf52-57d6-4974-bd74-d58fec8c205f",
      rowkey: 968,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/javascript/example03",
      method: "GET",
      handler: "JS",
      access: 0,
      description:
        "In this example the javascript code creates an array and returns it to the user.",
      code: "$_RETURN_DATA_ = [];\n\nwhile ($_RETURN_DATA_.length < 30) {\n  const objeto = { value1: Math.floor(Math.random() * 1000), value2: Math.floor(Math.random() * 1000) };\n  $_RETURN_DATA_.push(objeto);\n}\n",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.275Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {
          status_info: 1,
          status_success: 1,
          status_redirect: 1,
          status_client_error: 2,
          status_server_error: 3,
        },
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        body: {
          js: {},
          xml: {
            code: "",
          },
          text: {},
          selection: 0,
          json: {
            code: {},
          },
          form: {},
        },
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
      },
      idendpoint: "bb7d57e9-3efe-4c6b-92c9-6c586ba7e177",
      rowkey: 466,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/function/call_function/example01",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      description:
        "Calls a custom function created on the server. Functions can be created when the process is highly complex or requires external libraries that are not pre-installed in the OpenFusion API.",
      code: "fnPublicAdd",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.275Z",
    },
    {
      ctrl: {
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        body: {
          js: {
            code: '{\n  "replacements": {\n    "methods": ["POST", "GET"]\n  }\n}',
          },
          xml: {},
          text: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: [
          {
            enabled: false,
            key: "",
            value: "",
            internal_hash_row:
              "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
          },
        ],
      },
      idendpoint: "f5f42a0a-d2f1-4356-bb51-323014fbc9fb",
      rowkey: 270,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/sql/bind_list",
      method: "POST",
      handler: "SQL",
      access: 0,
      description:
        'They use "replacements" to pass a list of values ​​to an SQL query, for example in an "IN" statement.',
      code: '{\n  "config": "$_VAR_$_VAR_CNX_OMS",\n  "query": "SELECT * FROM ofapi_method WHERE method IN (:methods);"\n}',
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.791Z",
      updatedAt: "2025-11-22T00:11:42.274Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        auth: {
          basic: {},
          bearer: {},
          selection: 0,
        },
        body: {
          js: {},
          xml: {},
          text: {},
          selection: 0,
        },
        query: [
          {
            enabled: true,
            key: "name",
            value: "edwinspire",
            internal_hash_row:
              "50076f7909932ca8e738b2b26856113c2533105b08085976945bdeffb2a3e14d",
          },
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
          },
        ],
        headers: {},
      },
      idendpoint: "01ca8730-091d-4dce-b2bf-b0325df4dcef",
      rowkey: 497,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/javascript/example01",
      method: "GET",
      handler: "JS",
      access: 0,
      description:
        'It receives as a parameter the variable "name" passed in the GET method and returns it in the response.\nThis is achieved using javascript code whose logic can be modified directly in the endpoint configuration.',
      code: "$_RETURN_DATA_ = {name: $_REQUEST_.query.name};",
      cache_time: 120,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.277Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
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
          selection: 0,
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
        },
      },
      idendpoint: "f1143955-f3e5-4127-b764-8cabe3c0c105",
      rowkey: 263,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/fetch/using_url",
      method: "GET",
      handler: "FETCH",
      access: 0,
      description:
        "Make an HTTP request using Fetch. It works similarly to a proxy. ",
      code: "https://api.github.com/users/edwinspire",
      cache_time: 9999,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.790Z",
      updatedAt: "2025-11-22T00:11:42.273Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        query: {},
        body: {},
        headers: {},
        auth: {},
      },
      idendpoint: "5509b6b9-5d52-4b33-a20f-c372c739575d",
      rowkey: 210,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/javascript/example04",
      method: "GET",
      handler: "JS",
      access: 0,
      description: "",
      code: "let uf = $_URL_AUTO_ENV_.create('/api/demo/ofapi/javascript/example03/auto');\nlet r1 = await uf.GET();\n\n$_RETURN_DATA_ = await r1.json();\n",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.792Z",
      updatedAt: "2025-11-22T00:11:42.278Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {},
      idendpoint: "90879480-8348-44e8-9985-b91e05b32041",
      rowkey: 60,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/soap/all_functions",
      method: "POST",
      handler: "SOAP",
      access: 0,
      description:
        "This example consumes a SOAP service and exposes all its methods, therefore the function name and parameters must be sent in the Body of the POST method.",
      code: "",
      cache_time: 0,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.790Z",
      updatedAt: "2025-11-22T00:11:42.273Z",
    },
    {
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      cors: {},
      mcp: {},
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
      headers_test: {},
      data_test: {
        query: [
          {
            enabled: true,
            key: "",
            value: "",
            internal_hash_row:
              "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983",
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
          selection: 0,
          basic: {
            username: "",
            password: "",
          },
          bearer: {
            token: "",
          },
        },
      },
      idendpoint: "5c874c8c-36dd-467b-8935-6776c5a6b595",
      rowkey: 627,
      enabled: true,
      idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
      environment: "dev",
      resource: "/ofapi/fetch/using_app_vars",
      method: "GET",
      handler: "FETCH",
      access: 0,
      description:
        "Make an HTTP request using Fetch. It works similarly to a proxy. \nUse the value of an application variable as the URL.",
      code: "https://api.github.com/users/edwinspire",
      cache_time: 60,
      latest_updater: null,
      createdAt: "2025-11-21T22:04:52.790Z",
      updatedAt: "2025-11-22T00:11:42.273Z",
    },
  ],
};
