export const system_app = {
  "vars": {},
  "params": {
    "users": [],
  },
  "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
  "app": "system",
  "rowkey": 133,
  "iduser": null,
  "enabled": true,
  "description": "App System",
  "createdAt": "2025-11-21T22:04:52.650Z",
  "updatedAt": "2025-11-22T00:11:41.979Z",
  "vrs": [],
  "endpoints": [
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbff4",
      "rowkey": 658,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/app",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnAppGetById",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbff3",
      "rowkey": 340,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/app",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnAppUpsert",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.111Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "15034cf9-4c94-43ba-bc7a-3d762f62d7de",
      "rowkey": 448,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/app/0.01",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetAppById",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.106Z"
    },
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbff1",
      "rowkey": 17,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/app/endpoints",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnEndpointGetByIdApp",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "55bdde78-051e-4844-a4b2-089f122f6160",
      "rowkey": 461,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/apps",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetApps",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.725Z",
      "updatedAt": "2025-11-22T00:11:42.110Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "55bdde78-051e-4844-a4b2-089f122f616e",
      "rowkey": 998,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/apps/0.01",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetApps",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.725Z",
      "updatedAt": "2025-11-22T00:11:42.110Z"
    },
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbf02",
      "rowkey": 368,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/endpoint",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnEndpointGetById",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbf01",
      "rowkey": 30,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/endpoint",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnEndpointUpsert",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
      "ctrl": {
        "admin": true,
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3
        }
      },
      "cors": {},
      "mcp": {
        "enabled": false,
        "name": "",
        "title": "",
        "description": ""
      },
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": true,
            "key": "idendpoint",
            "value": "cfdf4ac3-bd98-463e-ae57-d331193ed416",
            "internal_hash_row": "",
            "type": 1
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
            "internal_hash_row": "",
            "type": 1
          }
        ],
        "auth": {
          "selection": 0,
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          }
        },
        "last_response": {
          "data": "",
          "sizeKBResponse": -1
        }
      },
      "idendpoint": "cfdf4ac3-bd98-463e-ae57-d331193ed416",
      "rowkey": 188,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/endpoint/backup",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "Endpoint Get Backup",
      "description": "Obtiene los respaldos de cambios realizados en endpoint",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetEndpointBackupByIdEndpoint",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
      "ctrl": {
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "13f94d7d-6612-4c30-8202-286cbbe3da3e",
      "rowkey": 793,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/function_names",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnFunctionNames",
      "cache_time": 999,
      "createdAt": "2025-11-21T22:04:52.725Z",
      "updatedAt": "2025-11-22T00:11:42.108Z"
    },
    {
      "ctrl": {
        "admin": true,
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3
        }
      },
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
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
          "selection": 0,
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          }
        },
        "last_response": {
          "data": "",
          "sizeKBResponse": -1,
          "MimeType": ""
        }
      },
      "idendpoint": "25ca7819-8823-4835-87c5-04b792bc594d",
      "rowkey": 339,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/api/handler/documentation",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "Get documentation of a specific handler",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetHandlerDocs",
      "cache_time": 3600,
      "createdAt": "2025-11-21T22:04:52.722Z",
      "updatedAt": "2025-11-22T00:11:42.101Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "a71cd2ed-8456-4e5e-8ab5-b7724a908194",
      "rowkey": 96,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/apiclient",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "Create user external",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnCreateApiClient",
      "cache_time": 0,
      "createdAt": "2025-12-02T00:16:24.771Z",
      "updatedAt": "2025-12-03T16:27:48.432Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "ed1c2a5c-69dd-44bb-bbef-fd90b66d6f5f",
      "rowkey": 960,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/apiclient/changepassword",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Update API Client password",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnUpdateAPIClientPassword",
      "cache_time": 0,
      "createdAt": "2025-11-30T04:19:03.270Z",
      "updatedAt": "2025-12-03T16:27:48.432Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "89b6d2c3-5d9e-4c18-9221-5f2673c17bb3",
      "rowkey": 745,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/apiclient/login",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnLoginApiClient",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.727Z",
      "updatedAt": "2025-11-22T00:11:42.114Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "00034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      "rowkey": 440,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/backup",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Get App data to backup by idapp",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetAppBackupById",
      "cache_time": 30,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.105Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "01034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      "rowkey": 560,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/backup",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Restore App data from backup by idapp",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnRestoreAppFromBackup",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.105Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "15034cf9-4c94-43ba-bc7a-3d762f62d7ee",
      "rowkey": 802,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/documentation",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Get documentation to endpoints by app id",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetAppDocById",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.106Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
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
      "idendpoint": "38d64e6e-e3a2-4664-abb9-cc9b1abeaf31",
      "rowkey": 436,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/internal/metrics",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Return internal metrics",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetInternalAppMetrics",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.725Z",
      "updatedAt": "2025-11-22T00:11:42.109Z"
    },
    {
      "ctrl": {
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
            "value": ""
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
      "idendpoint": "305b4de6-c6c4-42d5-b148-c5fc6ded51bb",
      "rowkey": 649,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/tree/by/filters",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "Get apps",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetApplicationsTreeByFilters",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "caa8b54a-eb5e-4134-8ae2-a3946a428ec7",
      "rowkey": 141,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/var",
      "method": "DELETE",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Delete app var",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnDeleteAppVar",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.106Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "20354d7a-e4fe-47af-8ff6-187bca92f3f9",
      "rowkey": 850,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/var",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "UPSERT app var",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnUpsertAppVar",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.106Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "15034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      "rowkey": 399,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/app/variables/idapp",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Get application variables by idapp",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetAppVarsByIdApp",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.106Z"
    },
    {
      "ctrl": {
        "admin": true,
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3
        }
      },
      "cors": {},
      "mcp": {
        "enabled": false,
        "name": "",
        "title": "",
        "description": ""
      },
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "type": 1
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
        "headers": {},
        "auth": {
          "selection": 0,
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          }
        },
        "last_response": {
          "data": "",
          "sizeKBResponse": -1
        }
      },
      "idendpoint": "b6bac685-f5ba-430f-b123-3d4a3c9c1dcd",
      "rowkey": 472,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/bot",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "title": "Save Bot",
      "description": "Save Bot.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "bot",
      "code": "fnUpsertBot",
      "cache_time": 0,
      "createdAt": "2026-02-01T08:27:04.233Z",
      "updatedAt": "2026-02-01T08:27:04.233Z"
    },
    {
      "ctrl": {
        "admin": true,
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3
        }
      },
      "cors": {},
      "mcp": {
        "enabled": false,
        "name": "",
        "title": "",
        "description": ""
      },
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
      "headers_test": {},
      "data_test": {
        "query": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "type": 1
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
        "headers": {},
        "auth": {
          "selection": 0,
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          }
        },
        "last_response": {
          "data": "",
          "sizeKBResponse": -1
        }
      },
      "idendpoint": "51316993-907c-4fd0-859f-7d2a0bc90dd3",
      "rowkey": 806,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/bot/all",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "title": "Get all Bots",
      "description": "Get all bots",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "bot",
      "code": "fnGetAllBots",
      "cache_time": 0,
      "createdAt": "2026-02-01T08:21:49.670Z",
      "updatedAt": "2026-02-01T08:21:49.670Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "3ead2170-283d-4c6a-abc1-eddd217b6d01",
      "rowkey": 396,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/cache/clear",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnClearCache",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.105Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "047845ac-5367-48ed-9465-8e36ba6c7bae",
      "rowkey": 578,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/cache/response/size",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetCacheSize",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.104Z"
    },
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "2cf4eecc-1bbe-433a-b8eb-347a7de52d4d",
      "rowkey": 465,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/database/hooks",
      "method": "POST",
      "handler": "JS",
      "access": 0,
      "title": "",
      "description": "Receiver of hooks issued from the database, these events will be forwarded via websocket to be consumed by clients.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "ofapi.server.checkwebHookDB(request);\n",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.725Z",
      "updatedAt": "2025-11-22T00:11:42.108Z"
    },
    {
      "ctrl": {
        "admin": true,
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3
        }
      },
      "cors": {},
      "mcp": {
        "enabled": false,
        "name": "",
        "title": "",
        "description": ""
      },
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {
              "from": {
                "type": "string",
                "format": "email",
                "description": "Email del remitente (ej: onboarding@resend.dev). Debe ser verificado/authenticado.",
                "examples": [
                  "onboarding@resend.dev"
                ]
              },
              "to": {
                "type": "string",
                "format": "email",
                "description": "Email del destinatario (string simple; extender a array si necesario).",
                "examples": [
                  "delivered@resend.dev"
                ]
              },
              "subject": {
                "type": "string",
                "minLength": 1,
                "maxLength": 998,
                "description": "Asunto del email.",
                "examples": [
                  "Hello World"
                ]
              },
              "html": {
                "type": "string",
                "description": "Cuerpo del email en HTML.",
                "examples": [
                  "<strong>it works!</strong>"
                ]
              }
            },
            "additionalProperties": false,
            "title": "Email Request Schema (Resend-like)",
            "description": "Esquema para enviar un email con from, to, subject y html body.",
            "required": [
              "from",
              "to",
              "subject",
              "html"
            ]
          }
        }
      },
      "custom_data": {},
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
              "from": "onboarding@resend.dev",
              "to": "delivered@resend.dev",
              "subject": "Hello World",
              "html": "<strong>it works!</strong>"
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
          "selection": 0,
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          }
        },
        "last_response": {
          "data": "",
          "sizeKBResponse": -1,
          "MimeType": ""
        }
      },
      "idendpoint": "cff35b3a-7ca0-4ef8-882d-d39815d55616",
      "rowkey": 417,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/email/smtp",
      "method": "POST",
      "handler": "JS",
      "access": 2,
      "title": "",
      "description": "Send emails using SMTP.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "const transporter = nodemailer.createTransport($_VAR_SMTP_TRANSPORT);\n// TODO: Create $_VAR_SMTP_TRANSPORT always\n\n/*\nOn Body\n{\n  from: \"onboarding@resend.dev\",\n  to: \"delivered@resend.dev\",\n  subject: \"Hello World\",\n  html: \"<strong>it works!</strong>\",\n}\n*/\nconst info = await transporter.sendMail(request.body);\n\n$_RETURN_DATA_ = info;",
      "cache_time": 0,
      "createdAt": "2025-12-03T16:55:58.599Z",
      "updatedAt": "2025-12-03T16:55:58.599Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
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
      "idendpoint": "bcf0e362-a454-4e47-85a0-772c4ddd3538",
      "rowkey": 903,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/information/dynamic",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetSystemInfoDynamic",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.722Z",
      "updatedAt": "2025-11-22T00:11:42.102Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
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
      "idendpoint": "0b48cd44-09fe-40e7-b0a7-59fe01e054cc",
      "rowkey": 91,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/information/static",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetSystemInfoStatic",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.103Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "71cfbad5-cf5f-4d64-a952-1a52af0bf26b",
      "rowkey": 195,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/interval_tasks/byidapp",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetIntervalTasksByIdApp",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.111Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "e753e2db-ca20-4607-82b7-34b70e435a0c",
      "rowkey": 435,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/interval_tasks/delete",
      "method": "DELETE",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fndeleteIntervalTask",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.113Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "34987a43-63e4-4926-824b-5254155b5c80",
      "rowkey": 902,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/interval_tasks/upsert",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnUpsertIntervalTask",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.107Z"
    },
    {
      "ctrl": {
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
            "value": ""
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
      "idendpoint": "34870b00-beb1-45d3-ada6-c164fc22cd7a",
      "rowkey": 100,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/log/app/summary",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Get summary by idapp from logs",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetLogSummaryByAppStatusCode",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "4c2516ec-d7c4-4783-8ee5-f7dac5b68a91",
      "rowkey": 941,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/responses/status_code/count",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetResponseCountStatus",
      "cache_time": 2,
      "createdAt": "2025-11-21T22:04:52.727Z",
      "updatedAt": "2025-11-22T00:11:42.114Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "12fb738c-7d1f-4eba-afb4-508a9fa9d06a",
      "rowkey": 622,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/restore",
      "method": "PUT",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "Check and restore default endpoints",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "restore",
      "code": "fnCheckSystemApp",
      "cache_time": 0,
      "createdAt": "2025-12-04T19:48:28.390Z",
      "updatedAt": "2025-12-05T04:40:40.564Z"
    },
    {
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
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {}
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "b9bc8e9a-54ab-4496-bf65-bbe374d03d84",
      "rowkey": 834,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/server/version",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Get version API server",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetServerVersion",
      "cache_time": 9999,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.112Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "d7737d40-5cd8-45f2-a60a-1014272a2fa0",
      "rowkey": 50,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/environment",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetEnvironment",
      "cache_time": 90,
      "createdAt": "2025-11-21T22:04:52.722Z",
      "updatedAt": "2025-11-22T00:11:42.102Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "d7737d40-5cd8-45f2-a60a-1014272a2faf",
      "rowkey": 78,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/environment/0.01",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetEnvironment",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.722Z",
      "updatedAt": "2025-11-22T00:11:42.102Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "17c211d6-8c81-4274-b5c4-604126454ab0",
      "rowkey": 929,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/handler/0.01",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetHandler",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.727Z",
      "updatedAt": "2025-11-22T00:11:42.114Z"
    },
    {
      "ctrl": {
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "3d3de358-681d-4b61-98dc-c1663db0c02c",
      "rowkey": 943,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/handler/js/funtions",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnListFnVarsHandlerJS",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.113Z"
    },
    {
      "ctrl": {
        "admin": true,
        "users": [],
        "log": {
          "status_info": 1,
          "status_success": 1,
          "status_redirect": 1,
          "status_client_error": 2,
          "status_server_error": 3,
          "level": 0
        }
      },
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
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
          "selection": 0,
          "basic": {
            "username": "",
            "password": ""
          },
          "bearer": {
            "token": ""
          }
        },
        "last_response": {
          "data": "",
          "sizeKBResponse": -1,
          "MimeType": ""
        }
      },
      "idendpoint": "c10b1812-8b25-4b16-adb9-bf7ac8134f76",
      "rowkey": 256,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/log",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetLogs",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.722Z",
      "updatedAt": "2025-11-22T00:11:42.101Z"
    },
    {
      "ctrl": {
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
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
      "idendpoint": "18731c87-9d59-44b6-8871-ecaa493008e5",
      "rowkey": 739,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/log",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnInsertLog",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.104Z"
    },
    {
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
      "cors": {},
      "mcp": {
        "enabled": false,
        "name": "",
        "title": "",
        "description": ""
      },
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {}
      },
      "custom_data": {},
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
      "idendpoint": "c6d6c431-aa5a-4e76-b89c-fe91e0537de4",
      "rowkey": 645,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/log/recordsperminute",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetLogsRecordsPerMinute",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.107Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "871cd2ed-8456-4e5e-8ab5-b7724a908191",
      "rowkey": 735,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/login",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnLogin",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.104Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "131cca3e-f835-4414-89ca-5ddbbec5ab89",
      "rowkey": 941,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/logout/0.01",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnLogout",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.724Z",
      "updatedAt": "2025-11-22T00:11:42.107Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "0144753a-61a6-4ee1-8ae5-1d871dd21d24",
      "rowkey": 792,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/system/method/0.01",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetMethod",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.725Z",
      "updatedAt": "2025-11-22T00:11:42.109Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "a71cd2ed-8456-4e5e-8ab5-b7724a908191",
      "rowkey": 114,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/user/changepassword",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Update user password",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnUpdateUserPassword",
      "cache_time": 0,
      "createdAt": "2025-11-30T04:19:03.270Z",
      "updatedAt": "2025-12-03T16:27:48.432Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "a71cd2ed-8456-4e5e-8ab5-b7724a908193",
      "rowkey": 367,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/user/create",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Create user admin",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnCreateUser",
      "cache_time": 0,
      "createdAt": "2025-12-02T00:16:24.771Z",
      "updatedAt": "2025-12-03T16:27:48.432Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "071cd2ed-8456-4e5e-8ab5-b7724a908191",
      "rowkey": 835,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/user/profile",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "Get data user profile full",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetUserProfileEndpointData",
      "cache_time": 5,
      "createdAt": "2025-11-29T13:56:01.799Z",
      "updatedAt": "2025-12-03T16:27:48.432Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "2c6d77b7-d8e2-49e2-9c63-a98a873b389c",
      "rowkey": 185,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/users/list",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetUsersList",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.113Z"
    },
    {
      "ctrl": {
        "admin": true
      },
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "3eb8b6c8-e001-43e6-9ace-517a05d33e6b",
      "rowkey": 401,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/websocket/hooks",
      "method": "WS",
      "handler": "NA",
      "access": 0,
      "title": "",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.723Z",
      "updatedAt": "2025-11-22T00:11:42.103Z"
    },
    {
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {
        "in": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        },
        "out": {
          "enabled": false,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": true
          }
        }
      },
      "custom_data": {},
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
      "idendpoint": "a0130d77-b779-4dea-a87f-6841520ffade",
      "rowkey": 277,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "resource": "/websocket/server",
      "method": "WS",
      "handler": "NA",
      "access": 0,
      "title": "",
      "description": "Send events from server",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "",
      "cache_time": 0,
      "createdAt": "2025-11-21T22:04:52.726Z",
      "updatedAt": "2025-11-22T00:11:42.111Z"
    }
  ]
}