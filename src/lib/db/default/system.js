export const system_app = {
  "vars": {},
  "params": {
    "users": [],
    "telegram": {
      "idgroup": ""
    }
  },
  "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
  "app": "system",
  "enabled": true,
  "description": "App System",
  "rowkey": 0,
  "endpoints": [
    {
      "enabled": true,
      "endpoint": "/api/system/database/hooks/prd",
      "method": "POST",
      "handler": "JS",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3
        }
      },
      "resource": "/database/hooks",
      "code": "$_SERVER_.checkwebHookDB($_REQUEST_);\n",
      "rowkey": 167,
      "description": "Receiver of hooks issued from the database, these events will be forwarded via websocket to be consumed by clients.",
      "idendpoint": "2cf4eecc-1bbe-433a-b8eb-347a7de52d4d",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0,
          "json": {
            "code": {}
          },
          "xml": {
            "code": ""
          },
          "text": {
            "value": ""
          },
          "form": {}
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "auth": {
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          },
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "0c5fe1ea4d897b7fed85ced7950878af87d081b77685d4cb062baf1568cfec05"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/token/0.01/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/token/0.01",
      "code": "fnToken",
      "rowkey": 919,
      "description": "",
      "idendpoint": "15ca7819-8823-4835-87c5-04b792bc594d",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "f87242de3eacc8115e401bc194029b108083b33465b1dcf8b5ba4eacbe015711"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/interval_tasks/upsert/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {},
      "resource": "/interval_tasks/upsert",
      "code": "fnUpsertIntervalTask",
      "rowkey": 619,
      "description": "",
      "idendpoint": "34987a43-63e4-4926-824b-5254155b5c80",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0,
          "json": {
            "code": {}
          },
          "xml": {
            "code": ""
          },
          "text": {
            "value": ""
          },
          "form": {}
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "auth": {
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          },
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "9723ac43d7c8ea96c73dd7312e41e2b796cbec9e2fe5762dd5e6b8288fd3ff0d"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/interval_tasks/byidapp/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {},
      "resource": "/interval_tasks/byidapp",
      "code": "fnGetIntervalTasksByIdApp",
      "rowkey": 422,
      "description": "",
      "idendpoint": "71cfbad5-cf5f-4d64-a952-1a52af0bf26b",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0,
          "json": {
            "code": {}
          },
          "xml": {
            "code": ""
          },
          "text": {
            "value": ""
          },
          "form": {}
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "auth": {
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          },
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "2ebc882d30c92cdea100a94466c2276d7be7dd7d0bf3fd2abac9727bbb916482"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/app/0.01/qa",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/app/0.01",
      "code": "fnGetAppById",
      "rowkey": 943,
      "description": "",
      "idendpoint": "9dcc9e25-1238-411e-87f8-78f318455c7e",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "qa",
      "internal_hash_row": "1cd5b99c2e897a686bfe1a987b3792c45d46d240e989e6d0c217d0aca27a6921"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/environment/0.01/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/environment/0.01",
      "code": "fnGetEnvironment",
      "rowkey": 50,
      "description": "",
      "idendpoint": "d7737d40-5cd8-45f2-a60a-1014272a2faf",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "13467a47f97e25100ce0fc310a76070f4ff6308b8c6d1d363d61bf8b687800e3"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/token/0.01/qa",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/token/0.01",
      "code": "fnToken",
      "rowkey": 330,
      "description": "",
      "idendpoint": "65cdde4c-8000-4248-bd77-157257b6d9c2",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "qa",
      "internal_hash_row": "105de1a1231c34e289d607ef1603e0e153f3957b263da5cb2f7825f23c0b79b2"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/apps/0.01/qa",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/apps/0.01",
      "code": "fnGetApps",
      "rowkey": 925,
      "description": "",
      "idendpoint": "dae4d3ff-6782-4fd3-8837-d169cf1aded8",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "qa",
      "internal_hash_row": "5510259debcc6d3f8ec36409046345c5221ac83c58350a3b2b1e6edf89b649a9"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/apps/0.01/dev",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/apps/0.01",
      "code": "fnGetApps",
      "rowkey": 14,
      "description": "",
      "idendpoint": "48f6c75d-285c-420d-b6d7-9471bf052c1e",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "dev",
      "internal_hash_row": "5b0c81e65afde3c5338cb1c19d1752d913789d5e611b2095a4daedf2b4b8442c"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/login/0.01/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/login/0.01",
      "code": "fnLogin",
      "rowkey": 308,
      "description": "",
      "idendpoint": "871cd2ed-8456-4e5e-8ab5-b7724a908191",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "490bce0e4356b951ba8891bc3bee956452b4e775bea72b3b6f329874293c754b"
    },
    {
      "enabled": true,
      "endpoint": "/ws/system/websocket/hooks/prd",
      "method": "WS",
      "handler": "NA",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/websocket/hooks",
      "code": "",
      "rowkey": 293,
      "description": "",
      "idendpoint": "3eb8b6c8-e001-43e6-9ace-517a05d33e6b",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "405b41324d6b26f43e339f846b6d07852fb7578daf8d47d85ab77f96df923167"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/app/0.01/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/app/0.01",
      "code": "fnGetAppById",
      "rowkey": 5,
      "description": "",
      "idendpoint": "15034cf9-4c94-43ba-bc7a-3d762f62d7de",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "19d71b38424b2ed70ee86f1748bfb5770d02ae868c841845bee4599515991499"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/token/api/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/token/api",
      "code": "fnToken",
      "rowkey": 913,
      "description": "",
      "idendpoint": "b5141492-3ad1-4ea6-a85d-ceb23ba26244",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "7e41473f1a65044bb1c2752c08c8f548050110a815caf0999b92c30279be4330"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/cache/clear/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {},
      "resource": "/cache/clear",
      "code": "fnClearCache",
      "rowkey": 937,
      "description": "",
      "idendpoint": "3ead2170-283d-4c6a-abc1-eddd217b6d01",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "0d9bee7696c0f82f235a6e130962b10b1f5abf1e391e804b2e8575bc74800c8b"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/function_names/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 999,
      "ctrl": {
        "users": [],
        "log": {}
      },
      "resource": "/api/function_names",
      "code": "fnFunctionNames",
      "rowkey": 419,
      "description": "",
      "idendpoint": "13f94d7d-6612-4c30-8202-286cbbe3da3e",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": true,
            "key": "env",
            "value": "prd",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0,
          "json": {
            "code": {}
          },
          "xml": {
            "code": ""
          },
          "text": {
            "value": ""
          },
          "form": {}
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "auth": {
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          },
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "17e3558712c9d51844e0c39313f856c99dc098a650665a12a62740f47612693c"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/cache/response/size/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {},
      "resource": "/cache/response/size",
      "code": "fnGetCacheSize",
      "rowkey": 566,
      "description": "",
      "idendpoint": "047845ac-5367-48ed-9465-8e36ba6c7bae",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "9ffc79c6500f04f60d8ddb183cab80d7a48090917793ac8302369b515ecfa38d"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/log/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 60,
      "ctrl": {
        "users": [],
        "log": {
          "level": 0
        }
      },
      "resource": "/system/log",
      "code": "fnGetLogs",
      "rowkey": 629,
      "description": "",
      "idendpoint": "c10b1812-8b25-4b16-adb9-bf7ac8134f76",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "body": {
          "json": {
            "code": ""
          },
          "xml": {
            "code": ""
          },
          "text": {},
          "selection": 0
        },
        "auth": {
          "basic": {},
          "bearer": {},
          "selection": 0
        },
        "headers": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ],
        "query": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ]
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "df403ddd8a9820f0be07fdaa2f595d46a758e2a0254dfda8caa11de4113201dc"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/handler/0.01/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/handler/0.01",
      "code": "fnGetHandler",
      "rowkey": 233,
      "description": "",
      "idendpoint": "17c211d6-8c81-4274-b5c4-604126454ab0",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "1430e1c8261b05e53699ddb3cce2b78fe863870db199de65f0ae1d4dbeeffd08"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/api/token/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/api/token",
      "code": "fnAPIToken",
      "rowkey": 12,
      "description": "",
      "idendpoint": "89b6d2c3-5d9e-4c18-9221-5f2673c17bb3",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "2651d2ac3b508f1708dfad6bc5a3856b410afdb3929e21dc50f2e2240d699625"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/logout/0.01/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/logout/0.01",
      "code": "fnLogout",
      "rowkey": 644,
      "description": "",
      "idendpoint": "131cca3e-f835-4414-89ca-5ddbbec5ab89",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "98d586ee9ff6a650a4a142a75d2f208d22ef8df7e240ce636fe1cce617e6c038"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/app/0.01/qa",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/app/0.01",
      "code": "fnSaveApp",
      "rowkey": 976,
      "description": "",
      "idendpoint": "6f1358ae-a638-47f8-a5d1-57818f17426b",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "qa",
      "internal_hash_row": "1d019777649fd602ff059f1f292be450e964694c513fef518f20c58dbc77dcdc"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/log/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "users": [],
        "log": {}
      },
      "resource": "/system/log",
      "code": "fnInsertLog",
      "rowkey": 969,
      "description": "",
      "idendpoint": "18731c87-9d59-44b6-8871-ecaa493008e5",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "body": {
          "js": {
            "code": "{}"
          },
          "xml": {
            "code": ""
          },
          "text": {},
          "selection": 0
        },
        "auth": {
          "basic": {},
          "bearer": {},
          "selection": 0
        },
        "headers": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ],
        "query": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ]
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "7118b34a62a4586e77b074eb9d8f29ecdfbb1a5db9f3b81481cac46e446726bf"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/telegram/sendphoto/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "users": [],
        "log": {}
      },
      "resource": "/api/telegram/sendphoto",
      "code": "fnTelegramsendPhoto",
      "rowkey": 165,
      "description": "",
      "idendpoint": "db9cff16-81b8-438e-b5fb-6ceb4d6a0a60",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0,
          "json": {
            "code": {
              "chatId": -1001790805365,
              "url_photo": "https://www.farmaenlace.com/wp-content/uploads/2024/11/MAPA1.jpg",
              "extra": {
                "message_thread_id": 16964,
                "parse_mode": "MarkdownV2",
                "caption": "Farma Foto"
              },
              "autoscape": false
            }
          },
          "xml": {
            "code": ""
          },
          "text": {
            "value": ""
          },
          "form": {}
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "auth": {
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          },
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "cb5676d2a6b871367c00d6095fde8d6da7cff7a2c3e2a2e5c3563eeeed204f17"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/telegram/sendmsg/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "users": [],
        "log": {
          "infor": true,
          "success": true,
          "redirection": true,
          "clientError": true,
          "serverError": true,
          "full": true
        }
      },
      "resource": "/api/telegram/sendmsg",
      "code": "fnTelegramsendMessage",
      "rowkey": 8,
      "description": "",
      "idendpoint": "9c4c5630-f1da-4885-b845-7b2e03eab215",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "body": {
          "json": {
            "code": {
              "chatId": -1001790805365,
              "message": "*bold \\*text*",
              "extra": {
                "message_thread_id": 16964,
                "parse_mode": "MarkdownV2"
              },
              "autoscape": false
            }
          },
          "xml": {
            "code": ""
          },
          "text": {},
          "selection": 0,
          "form": {}
        },
        "auth": {
          "basic": {},
          "bearer": {},
          "selection": 0
        },
        "headers": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ],
        "query": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ]
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "81d1da43ef3db4084dc82ae99a88fa3863d5f296d72d2b30b4ca3ecd88e95d5a"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/app/0.01/prd",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/app/0.01",
      "code": "fnSaveApp",
      "rowkey": 588,
      "description": "",
      "idendpoint": "d9086725-367f-4383-8b43-c23071bc8fcc",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "e138e1261a7be6be030dd5cc0559ef51544b5beecec79a23fb3c2cbc1e45bb3d"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/token/0.01/dev",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/token/0.01",
      "code": "fnToken",
      "rowkey": 69,
      "description": "",
      "idendpoint": "52fb738c-7d1f-4eba-afb4-508a9fa9d06a",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "dev",
      "internal_hash_row": "81f7cf6a161efb10726270b724762a150fbc30aaafdddf4a3eab4ffadf733917"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/method/0.01/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/system/method/0.01",
      "code": "fnGetMethod",
      "rowkey": 671,
      "description": "",
      "idendpoint": "0144753a-61a6-4ee1-8ae5-1d871dd21d24",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "f79a223ce41fd0bf02c66c0507c1c2ac814ad6b94810466c34e37a384f7ce0a1"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/apps/0.01/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/apps/0.01",
      "code": "fnGetApps",
      "rowkey": 642,
      "description": "",
      "idendpoint": "55bdde78-051e-4844-a4b2-089f122f616e",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "603016c9607d9d202ea063eb3419203301cc63d99d0bd2f86db89c08fb202f7b"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/app/0.01/dev",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/app/0.01",
      "code": "fnGetAppById",
      "rowkey": 426,
      "description": "",
      "idendpoint": "82a678a2-04ef-4231-8091-7ea3432515f4",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "dev",
      "internal_hash_row": "1034d27ddce81b7510272c8d085b109b40d9ec2f7c60fb3749ff3a2a819f7776"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/api/app/0.01/dev",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "cache_time": 0,
      "ctrl": {
        "admin": true
      },
      "resource": "/api/app/0.01",
      "code": "fnSaveApp",
      "rowkey": 501,
      "description": "",
      "idendpoint": "bc07e60d-d608-4763-b712-8ae01156fea7",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "dev",
      "internal_hash_row": "e8dd77b05197ee9319623d3b92af7ab577d76d2c21deee526cbd0eac52c6c216"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/interval_tasks/delete/prd",
      "method": "DELETE",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {},
      "resource": "/interval_tasks/delete",
      "code": "fndeleteIntervalTask",
      "rowkey": 892,
      "description": "",
      "idendpoint": "e753e2db-ca20-4607-82b7-34b70e435a0c",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0,
          "json": {
            "code": {}
          },
          "xml": {
            "code": ""
          },
          "text": {
            "value": ""
          },
          "form": {}
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "auth": {
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          },
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "e22572e58e2103cfc3f70c54a277cd827c7fa3aeda3f95cc12e9f1e7bd367db9"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/system/handler/js/funtions/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {
        "users": [],
        "log": {}
      },
      "resource": "/system/handler/js/funtions",
      "code": "fnListFnVarsHandlerJS",
      "rowkey": 945,
      "description": "",
      "idendpoint": "3d3de358-681d-4b61-98dc-c1663db0c02c",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368"
          }
        ],
        "body": {
          "selection": 0
        },
        "headers": {},
        "auth": {
          "selection": 0
        }
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "b7858feb3958bc5f610941bdd9964c28958bf6d4c89eff7d7db8c14a3a55d839"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/users/list/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 0,
      "ctrl": {},
      "resource": "/users/list",
      "code": "fnGetUsersList",
      "rowkey": 239,
      "description": "",
      "idendpoint": "2c6d77b7-d8e2-49e2-9c63-a98a873b389c",
      "cors": {},
      "headers_test": {},
      "data_test": {},
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "f8b199837c5e6b736af4debf8a7a7c1a3fa8745578aefc6a3e0e9dff8cd74f92"
    },
    {
      "enabled": true,
      "endpoint": "/api/system/responses/status_code/count/prd",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "cache_time": 2,
      "ctrl": {},
      "resource": "/responses/status_code/count",
      "code": "fnGetResponseCountStatus",
      "rowkey": 277,
      "description": "",
      "idendpoint": "4c2516ec-d7c4-4783-8ee5-f7dac5b68a91",
      "cors": {},
      "headers_test": {},
      "data_test": {
        "body": {
          "json": {
            "code": ""
          },
          "xml": {
            "code": ""
          },
          "text": {},
          "selection": 0
        },
        "auth": {
          "basic": {},
          "bearer": {},
          "selection": 0
        },
        "headers": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ],
        "query": [
          {
            "enabled": true,
            "key": "",
            "value": "",
            "internal_hash_row": "b9427bedda283d6b3c25ad634983b8bfbfc32d5a3006a5a9d6c541a332f1d983"
          }
        ]
      },
      "latest_updater": null,
      "environment": "prd",
      "internal_hash_row": "c501b625d43b0426072e3098e5aca98d209bf40de4f640b19205fdd680ddc0c7"
    }
  ],
  "environment": "dev"
}