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
  enabled: true,
  description: "App DEMO",
  rowkey: 0,
  endpoints: [
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/fetch/using_url/dev",
      method: "GET",
      handler: "FETCH",
      access: 0,
      cache_time: 9999,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/fetch/using_url",
      code: "https://api.github.com/users/edwinspire",
      rowkey: 124,
      description:
        "Make an HTTP request using Fetch. It works similarly to a proxy. ",
      idendpoint: "f1143955-f3e5-4127-b764-8cabe3c0c105",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "a1b9f4113064f0b6a1162d0040f57dd1e2647647f8702f1f7ee17ef047e573ac",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/soap/all_functions/dev",
      method: "POST",
      handler: "SOAP",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/soap/all_functions",
      code: "",
      rowkey: 348,
      description:
        "This example consumes a SOAP service and exposes all its methods, therefore the function name and parameters must be sent in the Body of the POST method.",
      idendpoint: "90879480-8348-44e8-9985-b91e05b32041",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "dbc2ce7a4e14b44cbfaac6d4266b2375ee992de6b405ed91424b34676789e0c2",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/fetch/using_app_vars/dev",
      method: "GET",
      handler: "FETCH",
      access: 0,
      cache_time: 60,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/fetch/using_app_vars",
      code: "https://api.github.com/users/edwinspire",
      rowkey: 806,
      description:
        "Make an HTTP request using Fetch. It works similarly to a proxy. \nUse the value of an application variable as the URL.",
      idendpoint: "5c874c8c-36dd-467b-8935-6776c5a6b595",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "83087797eb8e4005efe95fed6123f1914e2b3a58467983c74eec4931a859c035",
    },
    {
      enabled: true,
      endpoint: "/api/demo/test/fetch/new/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/test/fetch/new",
      code: "",
      rowkey: 924,
      description: "ok",
      idendpoint: "9b7200b4-c77c-42a4-a8c0-85bb963b4644",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "c4d3ffdfa34684eac32928cc244eec5cb5cd6a8b4a057958ab2d5378af9c7511",
    },
    {
      enabled: true,
      endpoint: "/ws/demo/main/test_ws/0.02/dev",
      method: "WS",
      handler: "NA",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_ws/0.02",
      code: '{"userAuthentication":true,"tokenAuthentication":false,"broadcast":false}',
      rowkey: 662,
      description: "",
      idendpoint: "82fdbae6-5180-4ddd-ae75-c31dc60cf641",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "70a152a2021718846ff6b9079de469acfe12e98ed40618a86a2bc66c5a6b4b19",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/javascript/example02/dev",
      method: "GET",
      handler: "JS",
      access: 3,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {
          clientError: true,
          full: true,
        },
      },
      resource: "/ofapi/javascript/example02",
      code: "$_RETURN_DATA_ = $_VARS_APP;",
      rowkey: 884,
      description: "This example returns the value of an application variable.",
      idendpoint: "73ade868-1616-42e4-bd6e-0de1a55b4e9b",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "e56ba9d0ce8cd4a2f12778416d18f8bbe6aa097f04c5b28e66682fa14e273e45",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_sql/0.04/dev",
      method: "GET",
      handler: "SQL",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/main/test_sql/0.04",
      code: '{\n  "config": "",\n  "query": "SELECT\\n    job_id AS [Job ID],\\n    name AS [Job Name],\\n    enabled AS [Is Enabled]\\nFROM\\n    msdb.dbo.sysjobs;"\n}',
      rowkey: 572,
      description: "",
      idendpoint: "82b0a799-21b0-4b95-8d58-43cfa44f7c47",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "361f55a73de4fe2bd3dd1135ebd69ee3a0f60191e34ab7043d2ae23385e01eb8",
    },
    {
      enabled: true,
      endpoint: "/api/demo/sql/bind_list/dev",
      method: "POST",
      handler: "SQL",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/sql/bind_list",
      code: '{\n  "config": "$_VAR_$_VAR_CNX_OMS",\n  "query": "SELECT * FROM ofapi_method WHERE method IN (:methods);"\n}',
      rowkey: 215,
      description:
        'They use "replacements" to pass a list of values ​​to an SQL query, for example in an "IN" statement.',
      idendpoint: "f5f42a0a-d2f1-4356-bb51-323014fbc9fb",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "ac0c74e991cb1d05aa0a8d7818234a14fe837d4465550b345c8ea41d72c0ecb2",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/function/call_function/example01/dev",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/function/call_function/example01",
      code: "fnPublicAdd",
      rowkey: 583,
      description:
        "Calls a custom function created on the server. Functions can be created when the process is highly complex or requires external libraries that are not pre-installed in the OpenFusion API.",
      idendpoint: "45cf84b5-d82f-4aca-ad16-85a25ed6f387",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "c816acf3ac99a206c465f85355a911c154c144d163286f75c4a428d39eb43e04",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/soap/example01/dev",
      method: "GET",
      handler: "SOAP",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/soap/example01",
      code: "$_VAR_SOAP_TEST",
      rowkey: 91,
      description: "Holaddddd.\nok",
      idendpoint: "134b1b86-ee20-4210-9948-5ecac5c6d7d6",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "715571b4c3dc388963e36ea6c6271a4e91df681a1807d3e98d15f4d1d4ad1c7c",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/javascript/two_fetch_ByBlocks/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/javascript/two_fetch_ByBlocks",
      code: 'let uf = $_URL_AUTO_ENV_.create("/api/demo/ofapi/javascript/example03/auto");\nlet uf2 = $_URL_AUTO_ENV_.create("/api/demo/ofapi/soap/example01/auto");\n\nlet r1 = await uf.GET();\nlet r1j = await r1.json();\n\n// Second fetch with Secuential Promise\nlet rblock = await $_SECUENTIAL_PROMISES_.ByBlocks(\n  async (data) => {\n    let val = data.value1 + data.value2;\n\n    let r2 = await uf2.GET({ data: { dNum: val } });\n    let r2j = await r2.json();\n\n    return r2j;\n  },\n\n  2,\n  r1j,\n);\n\n$_RETURN_DATA_ = await rblock;\n',
      rowkey: 683,
      description: "",
      idendpoint: "e909e080-35e2-4250-b799-da4770589e3f",
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
        headers: {},
        auth: {
          selection: 0,
        },
      },
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "32dd588bcec689845b408501b29e383dba8644100c0b270d8b6226919a93ff6e",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/function/call_function/example01/dev",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
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
      resource: "/ofapi/function/call_function/example01",
      code: "fnPublicAdd",
      rowkey: 435,
      description:
        "Calls a custom function created on the server. Functions can be created when the process is highly complex or requires external libraries that are not pre-installed in the OpenFusion API.",
      idendpoint: "bb7d57e9-3efe-4c6b-92c9-6c586ba7e177",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "0fa2db41f663f976d5adb84e5269d2076ddb2611c14914844e06b8d236aef7d8",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/text/plain_text/dev",
      method: "GET",
      handler: "TEXT",
      access: 0,
      cache_time: 30,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/ofapi/text/plain_text",
      code: '{\n  "mimeType": "text/plain",\n  "payload": "Hello edwinspire with Open Fusion API"\n}',
      rowkey: 612,
      description:
        "Returns plain text. You can define a MIMETYPE according to your needs.",
      idendpoint: "87ec2f9a-64fc-4818-9a93-e47bf3d8b0dd",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "aed267ed449c75e1c7b53da8485617de4e0de0a6ebffd663626d25adf64b6b7a",
    },
    {
      enabled: true,
      endpoint: "/ws/demo/main/test_ws/0.01/dev",
      method: "WS",
      handler: "NA",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_ws/0.01",
      code: '{"userAuthentication":false,"tokenAuthentication":false,"broadcast":true}',
      rowkey: 693,
      description: "",
      idendpoint: "0d488251-6e49-4239-8c85-be101619aa1f",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "72ee6a8703107d07d245b7a34d6c3edd8668726760d425cbf0df85b3b13eb5d9",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/javascript/example03/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/javascript/example03",
      code: "$_RETURN_DATA_ = [];\n\nwhile ($_RETURN_DATA_.length < 30) {\n  const objeto = { value1: Math.floor(Math.random() * 1000), value2: Math.floor(Math.random() * 1000) };\n  $_RETURN_DATA_.push(objeto);\n}\n",
      rowkey: 233,
      description:
        "In this example the javascript code creates an array and returns it to the user.",
      idendpoint: "28c0bf52-57d6-4974-bd74-d58fec8c205f",
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
      environment: "dev",
      internal_hash_row:
        "59137974bf236eaa2cdde89c1d458c6d94e4b243d31fcea110f002df3e747f73",
    },
    {
      enabled: true,
      endpoint: "/ws/demo/main/test_ws/0.03/dev",
      method: "WS",
      handler: "NA",
      access: 2,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_ws/0.03",
      code: '{"userAuthentication":false,"tokenAuthentication":true,"broadcast":false}',
      rowkey: 296,
      description: "",
      idendpoint: "fda286e7-d51f-40ec-a239-35edcbf364eb",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "a70b1415f080f7037caeb4e5b36d20b4dd62fc1cae5198e39acad026a8fdedec",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_sql/0.03/dev",
      method: "GET",
      handler: "SQL",
      access: 0,
      cache_time: 120,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_sql/0.03",
      code: '{\n  "config": {\n    "database": "memory",\n    "username": "",\n    "password": "",\n    "options": {\n      "host": "localhost",\n      "dialect": "sqlite"\n    }\n  },\n  "query": "SELECT 1097 AS test_sql;"\n}',
      rowkey: 316,
      description: "",
      idendpoint: "ae8726f7-36ec-4c70-8183-85837b783698",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "5f6d22d43a94c84e625c3cb2f87f034d59ce725bf0f3d20ae32e69ac939a16ca",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/text/xml/dev",
      method: "GET",
      handler: "TEXT",
      access: 0,
      cache_time: 30,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/ofapi/text/xml",
      code: '{\n  "mimeType": "text/xml",\n  "payload": "<hello>edwinspire</hello>"\n}',
      rowkey: 583,
      description: "Returns plain XML text.",
      idendpoint: "20c6fb54-f048-44ad-88e4-6aca76a62aec",
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
      environment: "dev",
      internal_hash_row:
        "ddd43143ab72c4e88a7b006addab4c6799560a8876ee4e605d015d96a6525ab4",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_sql/0.05/dev",
      method: "GET",
      handler: "SQL",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_sql/0.05",
      code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT $name as nombre, strftime(\'%Y-%m-%d %H-%M-%S\',\'now\') AS dt;"\n}',
      rowkey: 649,
      description: "",
      idendpoint: "dedb3546-3bf8-4973-8c8a-5c7308338ba5",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "0aec7ae33033cd498c00cfb9a52d532267ce0fa148db96486ea3b750e4ca7f07",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/javascript/example01/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 120,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/javascript/example01",
      code: "$_RETURN_DATA_ = {name: $_REQUEST_.query.name};",
      rowkey: 197,
      description:
        'It receives as a parameter the variable "name" passed in the GET method and returns it in the response.\nThis is achieved using javascript code whose logic can be modified directly in the endpoint configuration.',
      idendpoint: "01ca8730-091d-4dce-b2bf-b0325df4dcef",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "a0413a9045c01a61de60a65ad8982312c38e782d74d4c422e8b452e73b64acff",
    },
    {
      enabled: true,
      endpoint: "/api/demo/rueba/base/dev",
      method: "GET",
      handler: "NA",
      access: 0,
      cache_time: 0,
      ctrl: {},
      resource: "/rueba/base",
      code: "",
      rowkey: 560,
      description: "",
      idendpoint: "9e461698-df3c-4420-ad5b-1811c9937c2c",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "ff2b3162fee5f78055ceffca86838e8d8bd07d12bccd3d116f3c22bdd287f4d4",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_sql/0.02/dev",
      method: "GET",
      handler: "SQL",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
      },
      resource: "/main/test_sql/0.02",
      code: '{\n  "config": "$_VAR_SQLITE",\n  "query": "SELECT :name as nombre;"\n}',
      rowkey: 835,
      description: "",
      idendpoint: "bb87e424-4ef3-4e5a-83ea-b5c719a34288",
      cors: {},
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
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "3d954cef3d84852d8065c842b89f10b008e68abea26c0b81705b2e01c7aade98",
    },
    {
      enabled: true,
      endpoint: "/api/demo/ofapi/javascript/example04/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/ofapi/javascript/example04",
      code: "let uf = $_URL_AUTO_ENV_.create('/api/demo/ofapi/javascript/example03/auto');\nlet r1 = await uf.GET();\n\n$_RETURN_DATA_ = await r1.json();\n",
      rowkey: 531,
      description: "",
      idendpoint: "5509b6b9-5d52-4b33-a20f-c372c739575d",
      cors: {},
      headers_test: {},
      data_test: {
        query: {},
        body: {},
        headers: {},
        auth: {},
      },
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "6bc57d378f5d33d53432edf26bfa867718053575e6da3596fc0ba6265d224872",
    },
  ],
  environment: "dev",
};
