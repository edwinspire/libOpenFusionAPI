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
        users: [],
        log: {},
      },
      resource: "/main/test_fetch/0.01",
      code: "https://api.github.com/users/edwinspire",
      rowkey: 65,
      description: "",
      idendpoint: "f1143955-f3e5-4127-b764-8cabe3c0c105",
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
        "54e7b0a81ef6a5e32853088d30a375870a885aa4d61b1a495adb3352f2c3d310",
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
      rowkey: 959,
      description: "",
      idendpoint: "5c874c8c-36dd-467b-8935-6776c5a6b595",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "64565141200603c58376ea346b8581002bef80fe7179be2d12537ec13bf58b6f",
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
      rowkey: 941,
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
        "e93384d585522823c048ebff53caac9d285af63b58dc0517f3eeeb336c68a861",
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
      rowkey: 711,
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
        "7d802bf2cf3fd90013fe8f4b067b22e5e8ef82dbcea9379960db6b4da62054aa",
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
      rowkey: 752,
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
        "cf9ac0da4080c9f201a9140a95a05cb9e7902ef2d222c5e8b18a56476e787ba6",
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
      rowkey: 984,
      description: "",
      idendpoint: "347af1c3-a2ef-45ca-8afd-22c2d527a1b3",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "e41a452b281665eaf25fd1bfe4511c5fe44b527fc39233bfdf28fd0d9f31f68b",
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
      rowkey: 258,
      description: "",
      idendpoint: "90879480-8348-44e8-9985-b91e05b32041",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "94960c016355d71234f035b6db357795099be828aaf731a637dcdff67e05b15e",
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
      rowkey: 584,
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
        "7f2e8d7eef168f34fa39fc6c3585a2087bc4b9571dd8642f4c353e5fbbfd905c",
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
      rowkey: 260,
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
        "96ae00cd2c84a64143b1ec523ee19262193249e7728f0a656d1db4a165881085",
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
      rowkey: 5,
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
        "ea7c5060ecf3328680075f9e5cde2a703556ecdde05daba04540d8a1fdb74adb",
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
      rowkey: 23,
      description: "",
      idendpoint: "82fdbae6-5180-4ddd-ae75-c31dc60cf641",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "b5b4bf5885b59425c00eba1460fa6858e462f33502b6a741edf3a8bb55f0c711",
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
      rowkey: 884,
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
        "be91b8800b3e4f4474a836c3636e8e2a1e7444b15b04f11ff5f37399cb93b865",
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
      rowkey: 994,
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
        "081ec86859ca4e33311eab0acd0713ef7d7ef1da1653f6987c995d51db016c09",
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
      rowkey: 863,
      description: "",
      idendpoint: "9e461698-df3c-4420-ad5b-1811c9937c2c",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "6a177badadc7a8cec78c796594a4e247b42b1070b264b4ee42dd89fc3a07cf84",
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
      rowkey: 285,
      description: "",
      idendpoint: "45cf84b5-d82f-4aca-ad16-85a25ed6f387",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "22dc5f1563a8a14e9be616a7b4d1875be52e621f1cd1b850d617d9e7d7b848aa",
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
      rowkey: 374,
      description: "",
      idendpoint: "e909e080-35e2-4250-b799-da4770589e3f",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "25cfc363cc807536293b31af8ac7b4c081e3c3db540de95e3e4882c79e822402",
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
      rowkey: 278,
      description: "",
      idendpoint: "134b1b86-ee20-4210-9948-5ecac5c6d7d6",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "e01593f513c67ba94775f690b6a4d06d139c044a06c2d7a7f7c01c7ecd68e914",
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
      rowkey: 959,
      description: "",
      idendpoint: "5509b6b9-5d52-4b33-a20f-c372c739575d",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "f42bd966b81da41353809427260fa9200105be868638498c00386b658e891493",
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
      rowkey: 126,
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
        "81a704adf38047f8adcb40587dc64c47d8f62340aa93d5c93a8f604a38c30916",
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
      rowkey: 163,
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
        "429f78a07c6dfea00f594cd062dd302ae0f1d596fb653d1888057c23917fe2ff",
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
      rowkey: 482,
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
        "218bb72472136ec8c4a80f3180cea45aeacf02d78f96ac845238060e3e157f8d",
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
      rowkey: 532,
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
        "d82942fd346e12f3c1df0c68fabfee81bcfa370b9886b55f8d179cb5d3611445",
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
      rowkey: 414,
      description: "",
      idendpoint: "0d488251-6e49-4239-8c85-be101619aa1f",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "2d5c969a50f2230c0db87402dbe466002093bb839e586d74ce76eb2c29755c7d",
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
      rowkey: 228,
      description: "",
      idendpoint: "fda286e7-d51f-40ec-a239-35edcbf364eb",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "00f202e0199eef9e960ca13cf90471a86a8efbe80e0d9f6c99a759685587a58e",
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
      rowkey: 776,
      description: "",
      idendpoint: "28c0bf52-57d6-4974-bd74-d58fec8c205f",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "e8ff6980cf37969dfe8b28137c23dcac9b4a7ef46d1b78601117c7bb587c8723",
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
      rowkey: 664,
      description: "",
      idendpoint: "dedb3546-3bf8-4973-8c8a-5c7308338ba5",
      cors: null,
      headers_test: {},
      data_test: {},
      latest_updater: null,
      environment: "dev",
      internal_hash_row:
        "b85a5a29795199aaed808f7262312a6ba3e0bdf1fc19267133016de8cb347447",
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
      rowkey: 516,
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
        "c063b855f2e3574ebad4dd3a727bd4cfe9c2967684e9ce43643f2c455ee8e322",
    },
  ],
};
