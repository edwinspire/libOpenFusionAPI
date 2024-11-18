export const demo_app = {
  idapp: "c4ca4238-a0b9-2382-0dcc-509a6f75849b",
  app: "demo",
  enabled: true,
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
  description: "App DEMO",
  rowkey: 0,
  params: {
    telegram: {
      idgroup: "",
    },
  },
  endpoints: [
    {
      enabled: true,
      endpoint: "/api/demo/main/test_fetch/0.01/dev",
      method: "GET",
      handler: "FETCH",
      access: 0,
      cache_time: 9999,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_fetch/0.01",
      code: "https://api.github.com/users/edwinspire",
      rowkey: 623,
      description: "",
      idendpoint: "f1143955-f3e5-4127-b764-8cabe3c0c105",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "964ef838e88e2092f57ecd5ba62bb317ec4f407dbb9e37d58b193e92b75f1615",
    },
    {
      enabled: true,
      endpoint: "/api/demo/test/fetch/new/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: null,
      resource: "/test/fetch/new",
      code: "let fetch_url = $_FETCH_OFAPI_('/api/demo/main/test_fetch/0.01/dev');\n\nlet respon = await fetch_url.GET();\n\n$_RETURN_DATA_ = await respon.json();\n",
      rowkey: 580,
      description: "",
      idendpoint: "9b7200b4-c77c-42a4-a8c0-85bb963b4644",
      cors: null,
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
        "d9d6d4166cc15049330c5650b780d26d994b2e2ca3ad513343016bb676596254",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_fetch/0.02/dev",
      method: "GET",
      handler: "FETCH",
      access: 0,
      cache_time: 8888,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_fetch/0.02",
      code: "$_VAR_FETCH",
      rowkey: 895,
      description: "",
      idendpoint: "5c874c8c-36dd-467b-8935-6776c5a6b595",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "a1de131d56331a1ffd30ca6b2bfc4db2b90a281e2941b6f3c4ea93f2c8f5b956",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_javascript/0.01/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 120,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/main/test_javascript/0.01",
      code: "$_RETURN_DATA_ = {name: $_REQUEST_.query.name};",
      rowkey: 503,
      description:
        'It receives as a parameter the variable "name" passed in the GET method and returns it in the response.\nThis is achieved using javascript code whose logic can be modified directly in the endpoint configuration.',
      idendpoint: "01ca8730-091d-4dce-b2bf-b0325df4dcef",
      cors: null,
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
        ],
      },
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "08b33d4075963029a8b530f4ec7bc85fa3945101d780e9e87b517fbf3e13cb71",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_soap/0.02/dev",
      method: "GET",
      handler: "SOAP",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_soap/0.02",
      code: "$_VAR_SOAP_TEST",
      rowkey: 815,
      description: "",
      idendpoint: "671d449c-41fc-4d23-9762-20c99c35fe74",
      cors: null,
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
            key: "dNum",
            value: "12.433",
            internal_hash_row:
              "ea62990e2daa43b3dbe68077099ce15fb634540b7a3f029879e612bd7756085b",
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
        "a58dc9a96fa4540dcb16bb0d0f106187027bd87bc61e04525407c02ec9ed0802",
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
      rowkey: 583,
      description: "",
      idendpoint: "bb87e424-4ef3-4e5a-83ea-b5c719a34288",
      cors: null,
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
        "1b740e668fdccd852d5b09afdde3feba54a09698146528f258ed75e141a86e92",
    },
    {
      enabled: true,
      endpoint: "/ws/demo/main/test_fetch/0.01/dev",
      method: "WS",
      handler: "NA",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_fetch/0.01",
      code: "https://api.github.com/users/edwinspire",
      rowkey: 990,
      description: "",
      idendpoint: "347af1c3-a2ef-45ca-8afd-22c2d527a1b3",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "925b44b2d99086228ff3d49fdd9d10c3f8df051c7025f89ca10887d539673e9e",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_soap/full_functions/dev",
      method: "POST",
      handler: "SOAP",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_soap/full_functions",
      code: '{\n  "wsdl": "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",\n  "BasicAuthSecurity": {\n    "User": "any",\n    "Password": "any"\n  }\n}',
      rowkey: 235,
      description: "",
      idendpoint: "90879480-8348-44e8-9985-b91e05b32041",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "9cd49ade4d55953284013600aece76527f3d25cd5b9497fd895a1ea9c04f5ff4",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_functions/0.01/dev",
      method: "POST",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
        users: [],
        log: {},
      },
      resource: "/main/test_functions/0.01",
      code: "fnPublicDemo",
      rowkey: 24,
      description:
        "Calls a function written in javascript that is hosted on the server.",
      idendpoint: "bb7d57e9-3efe-4c6b-92c9-6c586ba7e177",
      cors: null,
      headers_test: {},
      data_test: {
        body: {
          js: {
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
      environment: "dev",
      internal_hash_row:
        "f8a1cd0d921e8aebd1590af24f47273192d5546942e7ff833be14bae3c3b0d84",
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
      rowkey: 952,
      description: "",
      idendpoint: "82fdbae6-5180-4ddd-ae75-c31dc60cf641",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "968c4727098bce28b28036f299169ff6383e3c764823b621604f5bf2867774df",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_javascript/0.02/dev",
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
      resource: "/main/test_javascript/0.02",
      code: "$_RETURN_DATA_ = $_VARS_APP;",
      rowkey: 681,
      description: "",
      idendpoint: "73ade868-1616-42e4-bd6e-0de1a55b4e9b",
      cors: null,
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
      },
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "eddb4a395ecd3bb7e788af719c2698df70347e3b079ed26e637bd5ddc3ead86a",
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
      rowkey: 719,
      description: "",
      idendpoint: "82b0a799-21b0-4b95-8d58-43cfa44f7c47",
      cors: null,
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
        "eae289e76085eed2c0875f6222f5ce3ad515e437b21125e07de40aaec39f8de8",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_javascript/two_fetch_ByBlocks/0.01/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_javascript/two_fetch_ByBlocks/0.01",
      code: "let uf = new $_UFETCH_();\n// First fetch\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\nlet r1j = await r1.json();\n\n// Second fetch with Secuential Promise\nlet rblock = await $_SECUENTIAL_PROMISES_.ByBlocks(async(data)=>{\nlet val = data.value1+data.value2; \n\nlet r2 = await uf.get('http://localhost:3000/api/demo/main/test_soap/v0.01/dev', {dNum: val});\nlet r2j = await r2.json();\n  \n  return r2j;  \n}, r1j, 2);\n\n\n\n$_RETURN_DATA_ = await rblock;\n",
      rowkey: 62,
      description: "",
      idendpoint: "e909e080-35e2-4250-b799-da4770589e3f",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "9975c68b751e38368210dd81957d51b6d82d61e99f9d79264f2b9985c13b80b7",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_soap/0.01/dev",
      method: "GET",
      handler: "SOAP",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_soap/0.01",
      code: '{\n  "wsdl": "https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL",\n  "functionName": "NumberToDollars",\n  "BasicAuthSecurity": {\n    "User": "any",\n    "Password": "any"\n  }\n}',
      rowkey: 713,
      description: "",
      idendpoint: "134b1b86-ee20-4210-9948-5ecac5c6d7d6",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "6e83c78c0e758be7522ff54fc1245358bc9de2463ab85c1573ef8a71f36819da",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_javascript/fetch/0.01/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_javascript/fetch/0.01",
      code: "let uf = new $_UFETCH_();\nlet r1 = await uf.get('http://localhost:3000/api/demo/main/test_javascript_return_array_objects/v0.01/dev');\n\n$_RETURN_DATA_ = await r1.json();\n",
      rowkey: 625,
      description: "",
      idendpoint: "5509b6b9-5d52-4b33-a20f-c372c739575d",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "8f55daccd1b610c6894cde14f5e5f69473ffca045e2c62bc11147e17cf67171b",
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
      rowkey: 268,
      description:
        'They use "replacements" to pass a list of values ​​to an SQL query, for example in an "IN" statement.',
      idendpoint: "f5f42a0a-d2f1-4356-bb51-323014fbc9fb",
      cors: null,
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
        "e49b1cb14f7d2de9a153f64256b31b83ea6b751e355515631ab37bdba8a65e17",
    },
    {
      enabled: true,
      endpoint: "/api/demo/rueba/base/dev",
      method: "GET",
      handler: "NA",
      access: 0,
      cache_time: 0,
      ctrl: null,
      resource: "/rueba/base",
      code: "",
      rowkey: 262,
      description: "",
      idendpoint: "9e461698-df3c-4420-ad5b-1811c9937c2c",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "55e262d42dbb368d82b83742044d07756e59009e5ab6ab1679a11f7f624d5090",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_functions/0.01/dev",
      method: "GET",
      handler: "FUNCTION",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_functions/0.01",
      code: "fnPublicAdd",
      rowkey: 256,
      description: "",
      idendpoint: "45cf84b5-d82f-4aca-ad16-85a25ed6f387",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "30ef8c72b2b9fc911bc6c3c02812ff00a4361b763b10c58b506a0675d59f5edf",
    },
    {
      enabled: true,
      endpoint: "/api/demo/abc/tesT/dev",
      method: "GET",
      handler: "TEXT",
      access: 0,
      cache_time: 0,
      ctrl: null,
      resource: "/abc/tesT",
      code: '{\n  "mimeType": "text/plain",\n  "payload": "mama"\n}',
      rowkey: 874,
      description: "",
      idendpoint: "6cdf4d8b-3b14-4668-bc75-1aab3bacac5d",
      cors: null,
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
        query: [],
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
        "8139e7c12075fd000f0feccd9fb2f883d4d4707b7e246647be57489230e6857b",
    },
    {
      enabled: true,
      endpoint: "/api/demo/plain_text/xml/dev",
      method: "GET",
      handler: "TEXT",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/plain_text/xml",
      code: '{\n  "mimeType": "text/xml",\n  "payload": "<xml><data>Hello edwinspire</data></xml>"\n}',
      rowkey: 997,
      description: "Returns plain XML text.",
      idendpoint: "20c6fb54-f048-44ad-88e4-6aca76a62aec",
      cors: null,
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
      },
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "4e942e97b6dcb727ed61699f9de8014454f0b3d878883255f92cf1030c24ab50",
    },
    {
      enabled: true,
      endpoint: "/api/demo/plain_text/dev",
      method: "GET",
      handler: "TEXT",
      access: 0,
      cache_time: 0,
      ctrl: {
        users: [],
        log: {},
      },
      resource: "/plain_text",
      code: '{\n  "mimeType": "text/plain",\n  "payload": "Hello edwinspire."\n}',
      rowkey: 959,
      description:
        "Returns plain text. You can define a MIMETYPE according to your needs.",
      idendpoint: "87ec2f9a-64fc-4818-9a93-e47bf3d8b0dd",
      cors: null,
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
        "560e976ad172b8e46c26ef1ca58e6793ef76c89f871bca039d412d64478e46f5",
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
      rowkey: 422,
      description: "",
      idendpoint: "0d488251-6e49-4239-8c85-be101619aa1f",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "eaf681ef5786ebf372ce840da2e384b4ea5c4cc750ed2eac5ef8223cfde91a72",
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
      rowkey: 512,
      description: "",
      idendpoint: "fda286e7-d51f-40ec-a239-35edcbf364eb",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "226cbecbf988b1f651408a061a55b1e404ce400458845d2c3c6f9ffd6f1bb8dc",
    },
    {
      enabled: true,
      endpoint: "/api/demo/main/test_javascript/array_objects/0.01/dev",
      method: "GET",
      handler: "JS",
      access: 0,
      cache_time: 0,
      ctrl: {
        admin: true,
      },
      resource: "/main/test_javascript/array_objects/0.01",
      code: "$_RETURN_DATA_ = [];\n\nwhile ($_RETURN_DATA_.length < 30) {\n  const objeto = { value1: Math.floor(Math.random() * 1000), value2: Math.floor(Math.random() * 1000) };\n  $_RETURN_DATA_.push(objeto);\n}\n",
      rowkey: 877,
      description: "",
      idendpoint: "28c0bf52-57d6-4974-bd74-d58fec8c205f",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "d2c0ca498feb106b8fa8b31be8cb679aee633ca0c39c7468e119ddd79e9f5ede",
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
      rowkey: 779,
      description: "",
      idendpoint: "dedb3546-3bf8-4973-8c8a-5c7308338ba5",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "5e8eab47f79447ee0f4f5753b49caa861c9fdce8985ba39882c76fd42b2498d4",
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
      rowkey: 573,
      description: "",
      idendpoint: "ae8726f7-36ec-4c70-8183-85837b783698",
      cors: null,
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
        "a67dd411b71df6e6f3b458f1b5577b2dcf877b0cc02bee5c23d6a44d7ce0a8d0",
    },
    {
      enabled: true,
      endpoint: "/api/demo/tipo/xyZ/dev",
      method: "GET",
      handler: "TEXT",
      access: 0,
      cache_time: 0,
      ctrl: null,
      resource: "/tipo/xyZ",
      code: '{\n  "mimeType": "text/plain",\n  "payload": "Chao"\n}',
      rowkey: 958,
      description: "",
      idendpoint: "82dc1de4-640f-4225-bf1d-5c8a9afe8894",
      cors: null,
      headers_test: {},
      data_test: {
        body: {
          js: {
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
        "07827521092d2e1a748242227eb4f3cad190b30ebb1c5376ab11d41fd347c76a",
    },
  ],
};
