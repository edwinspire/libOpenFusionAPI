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
      rowkey: 521,
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
        "7d9ca48c904385b134f2e9ac1416f589894ccf980d48fdbf2e6977d07c32f976",
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
      rowkey: 304,
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
        "b6bffdd8f7955913927a5e265b004e0f4b6bd08038743478c373ad58512a4ca7",
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
      rowkey: 413,
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
        "b732d141aa31f05407bb7903d8ee0244577f868ed35c3d171c9386590b463437",
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
      rowkey: 989,
      description: "",
      idendpoint: "dedb3546-3bf8-4973-8c8a-5c7308338ba5",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "bcf56c9e4409ada5489dc2bed1ce9c007477ba784e79b35af2f6357b7344ab3d",
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
      rowkey: 698,
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
        "cba5549af101e18000e8b4305eb87800e959d0a0babd9700ef158627aee7b135",
    },
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
      rowkey: 895,
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
        "6d00503a4325e902ddb15f71c9ead5701a29b64ff09901d3f44836f117834df7",
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
      code: "let fetch_url = $_FETCH_OFAPI_('/api/demo/main/test_fetch/0.01/dev');\n\nlet respon = await fetch_url.GET();\n\n$_RETURN_DATA_ = await respon.json();\n",
      rowkey: 635,
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
        "63ce79e2f7396bd340a602c13ee7fb406fccec92ea5c1229c7f3def8ec011b89",
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
        log: {},
      },
      resource: "/ofapi/function/call_function/example01",
      code: "let fetch_url = $_FETCH_OFAPI_('/api/demo/main/test_fetch/0.01/dev');\n\nlet respon = await fetch_url.GET();\n\n$_RETURN_DATA_ = await respon.json();\n",
      rowkey: 325,
      description:
        "Calls a custom function created on the server. Functions can be created when the process is highly complex or requires external libraries that are not pre-installed in the OpenFusion API.",
      idendpoint: "bb7d57e9-3efe-4c6b-92c9-6c586ba7e177",
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
        "fdf8d79bf15856e8781bb80d5e5651b192f67e64bd131151f19ecfb0fc974ac5",
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
      rowkey: 291,
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
        "58d0ffb2d1dbcf58fed9495d27d35e6c5281681854196ce738e94e7df2eaa125",
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
      rowkey: 124,
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
        "dd82243310dd6fa93731c2c175cc7df843f0dee23e031decdb48ce2d762bbc42",
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
      rowkey: 409,
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
        "76d872d30f70dbf26a29e7da5063b94c6ae838dc04397f05f0c6314d25a04dff",
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
      rowkey: 744,
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
        "a9d7881727a2be55f49e14a7490eb4d6ee8bfa676af00f29502f6228d989d55c",
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
      rowkey: 302,
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
        "9b0a631bfbd381ebd1aefa3c45f48bbaf0165bd50551a6d01836ca25e1b99a49",
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
      rowkey: 881,
      description:
        "This example consumes a SOAP service and exposes all its methods, therefore the function name and parameters must be sent in the Body of the POST method.",
      idendpoint: "90879480-8348-44e8-9985-b91e05b32041",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "1105d341f9ea25c14cd456f6360d40d7aeb6f0a07541737be49d08d2a8fd840c",
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
      rowkey: 664,
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
        "53149ea476b0540c35d6f2f21fa96a82098ca1f6a879ef3d8784bd458be2d976",
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
      rowkey: 351,
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
        "ff5ba3a64acf8236f12d70cccf99ea530b7cba40cd0cbb1d8d972426f7be1903",
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
      rowkey: 420,
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
        "16c68f93b41ce84bb66883a3856d7571f034aa3f65b16ec880ccfed1fed4f55b",
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
      rowkey: 186,
      description: "",
      idendpoint: "9e461698-df3c-4420-ad5b-1811c9937c2c",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "2a9beaf77c7f2f52f6f549c9bc29baf2b18a37fbddc9e390919fa6208a022531",
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
      rowkey: 792,
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
        "f52ec1150be7352d9694548656d3af7079ab4dbf4dbb0194400580a1c7a32e02",
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
      rowkey: 834,
      description: "ok",
      idendpoint: "9b7200b4-c77c-42a4-a8c0-85bb963b4644",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "00d9e056d3da42db7c8d9caf5edf812403261eb98b78d6c75ecf93d2c12b2b1e",
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
      rowkey: 867,
      description: "",
      idendpoint: "0d488251-6e49-4239-8c85-be101619aa1f",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "278c4ebaeb97f1717293fa22db4ce774b09a87a0f6504d5394d6c4a4f1d7bf17",
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
      rowkey: 488,
      description: "",
      idendpoint: "82fdbae6-5180-4ddd-ae75-c31dc60cf641",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "b1f3ce5774b58cdad83f95a849432884701f37526ca7717e5bb19001769223a1",
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
      rowkey: 810,
      description: "",
      idendpoint: "fda286e7-d51f-40ec-a239-35edcbf364eb",
      cors: {},
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "511376cd394645ca07de06ad8808c3a8142b12494d680be2f08c624b8390889b",
    },
  ],
  environment: "dev",
};
