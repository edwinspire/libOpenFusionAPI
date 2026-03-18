export const system_app = {
  "vars": {},
  "params": {
    "users": []
  },
  "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
  "app": "system",
  "rowkey": 707,
  "iduser": null,
  "enabled": true,
  "description": "App System",
  "jwt_key": "a6c042e9-5516-484f-a502-051fa8906331",
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
      "rowkey": 891,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "enabled": true,
        "name": "app_create_update",
        "title": "Create Update App",
        "description": "Create or update app data."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "title": "AppConfigUpsert",
            "type": "object",
            "additionalProperties": false,
            "required": [
              "app",
              "enabled"
            ],
            "properties": {
              "idapp": {
                "type": "string",
                "format": "uuid",
                "description": "Si se envía UUID se ejecuta UPDATE"
              },
              "app": {
                "type": "string",
                "maxLength": 50
              },
              "iduser": {
                "type": [
                  "integer",
                  "null"
                ]
              },
              "enabled": {
                "type": "integer",
                "enum": [
                  0,
                  1
                ],
                "default": 1
              },
              "description": {
                "type": [
                  "string",
                  "null"
                ]
              },
              "jwt_key": {
                "type": [
                  "string",
                  "null"
                ],
                "format": "uuid"
              },
              "vars": {
                "type": [
                  "object",
                  "null"
                ],
                "additionalProperties": {
                  "type": [
                    "string",
                    "number",
                    "boolean",
                    "object",
                    "array",
                    "null"
                  ]
                }
              },
              "params": {
                "type": [
                  "object",
                  "null"
                ],
                "additionalProperties": {
                  "type": [
                    "string",
                    "number",
                    "boolean",
                    "object",
                    "array",
                    "null"
                  ]
                }
              }
            },
            "anyOf": [
              {
                "description": "INSERT: idapp no debe existir",
                "not": {
                  "required": [
                    "idapp"
                  ]
                }
              },
              {
                "description": "UPDATE: idapp debe existir y ser UUID",
                "required": [
                  "idapp"
                ]
              }
            ]
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "ji619p4iv",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "u8hnnlexu",
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbff3",
      "rowkey": 519,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 24,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "enabled": true,
        "name": "app_endpoints",
        "title": "app_endpoints",
        "description": "It retrieves the list of all endpoints associated with an application. It receives the idapp as a parameter."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idapp": {
                "type": "string"
              }
            },
            "required": [
              "idapp"
            ],
            "additionalProperties": false
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "3w5spzz6r",
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
          "form": []
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "xxam93qr0",
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbff1",
      "rowkey": 642,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/api/app/endpoints",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "Get Endpoint by App",
      "description": "It retrieves the list of all endpoints associated with an application. It receives the idapp as a parameter.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "endpoint",
      "code": "fnEndpointGetByIdApp",
      "cache_time": 30,
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
        "enabled": true,
        "name": "apps_list",
        "title": "List Apps",
        "description": "It retrieves the list of all applications, with their application variables for each one and their respective endpoints."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {},
            "additionalProperties": false
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
            "_id": "iqg87g0if",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "55bdde78-051e-4844-a4b2-089f122f6160",
      "rowkey": 553,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/api/apps",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "App List",
      "description": "Gets the list of all applications in the OpenFusionAPI system.",
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
      "rowkey": 565,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "enabled": true,
        "name": "get_endpoint_data",
        "title": "get_endpoint_data",
        "description": "Create or update an application variable according to the environment passed as a parameter and to the idapp."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idapp": {
                "type": "string"
              }
            },
            "required": [
              "idapp"
            ],
            "additionalProperties": false
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "fi2s5e1bn",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "g8d18g0mz",
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbf02",
      "rowkey": 719,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/api/endpoint",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "GET Endpoint Data",
      "description": "Create or update an application variable according to the environment passed as a parameter and to the idapp.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "endpoint",
      "code": "fnEndpointGetById",
      "cache_time": 30,
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
        "enabled": true,
        "name": "endpoint_upsert",
        "title": "endpoint_upsert",
        "description": "Creates or updates the parameters of an endpoint according to the selected handler."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idendpoint": {
                "type": "string",
                "format": "uuid",
                "description": "Identificador del endpoint. Si no se envía, el modelo lo genera automáticamente."
              },
              "enabled": {
                "type": "boolean",
                "default": true,
                "description": "Indica si el endpoint está habilitado."
              },
              "idapp": {
                "type": "string",
                "format": "uuid",
                "description": "UUID de la aplicación asociada."
              },
              "environment": {
                "type": "string",
                "enum": [
                  "dev",
                  "qa",
                  "prd"
                ],
                "default": "dev",
                "description": "Ambiente donde estará disponible."
              },
              "timeout": {
                "type": "integer",
                "minimum": 0,
                "default": 30,
                "description": "Tiempo máximo de ejecución del endpoint."
              },
              "resource": {
                "type": "string",
                "minLength": 1,
                "maxLength": 300,
                "description": "Ruta del endpoint."
              },
              "method": {
                "type": "string",
                "enum": [
                  "GET",
                  "POST",
                  "PUT",
                  "PATCH",
                  "DELETE",
                  "OPTIONS",
                  "HEAD"
                ],
                "description": "Método HTTP."
              },
              "handler": {
                "type": "string",
                "minLength": 1,
                "maxLength": 15,
                "description": "Tipo de manejador del endpoint."
              },
              "access": {
                "type": "integer",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4
                ],
                "default": 2,
                "description": "0=Public, 1=Basic, 2=Token, 3=Basic and Token, 4=Local"
              },
              "title": {
                "type": "string",
                "maxLength": 200,
                "default": "",
                "description": "Descripción corta del endpoint."
              },
              "description": {
                "type": "string",
                "default": "",
                "description": "Descripción detallada."
              },
              "price_by_request": {
                "type": "integer",
                "minimum": 0,
                "default": 1,
                "description": "Costo por request en millicents."
              },
              "price_kb_request": {
                "type": "integer",
                "minimum": 0,
                "default": 1,
                "description": "Costo por KB de request en millicents."
              },
              "price_kb_response": {
                "type": "integer",
                "minimum": 0,
                "default": 1,
                "description": "Costo por KB de response en millicents."
              },
              "keywords": {
                "type": "string",
                "default": "",
                "description": "Palabras clave."
              },
              "ctrl": {
                "$ref": "#/$defs/jsonValue",
                "description": "Controles adicionales. Users, Logs, etc."
              },
              "code": {
                "type": "string",
                "default": "",
                "description": "Código y parámetros."
              },
              "cors": {
                "$ref": "#/$defs/jsonValue",
                "description": "Configuración CORS."
              },
              "cache_time": {
                "type": "integer",
                "minimum": 0,
                "default": 0,
                "description": "Tiempo en caché. Cero desactiva caché."
              },
              "mcp": {
                "$ref": "#/$defs/jsonValue",
                "description": "Configuración MCP."
              },
              "json_schema": {
                "$ref": "#/$defs/jsonValue",
                "description": "JSON Schema asociado al endpoint."
              },
              "custom_data": {
                "$ref": "#/$defs/jsonValue",
                "description": "Datos personalizados."
              },
              "headers_test": {
                "$ref": "#/$defs/jsonValue",
                "description": "Headers de prueba."
              },
              "data_test": {
                "$ref": "#/$defs/jsonValue",
                "description": "Payload de prueba."
              }
            },
            "additionalProperties": false,
            "title": "Endpoint",
            "required": [
              "idapp",
              "environment",
              "timeout",
              "resource",
              "method",
              "handler",
              "access",
              "title",
              "description",
              "price_by_request",
              "price_kb_request",
              "price_kb_response",
              "keywords",
              "code",
              "cache_time"
            ],
            "allOf": [
              {
                "if": {
                  "properties": {
                    "handler": {
                      "const": "FUNCTION"
                    }
                  },
                  "required": [
                    "handler"
                  ]
                },
                "then": {
                  "properties": {
                    "code": {
                      "type": "string",
                      "minLength": 1
                    }
                  },
                  "required": [
                    "code"
                  ]
                }
              }
            ],
            "$defs": {
              "jsonValue": {
                "oneOf": [
                  {
                    "type": "object",
                    "additionalProperties": {
                      "$ref": "#/$defs/jsonValue"
                    }
                  },
                  {
                    "type": "array",
                    "items": {
                      "$ref": "#/$defs/jsonValue"
                    }
                  },
                  {
                    "type": "string"
                  },
                  {
                    "type": "number"
                  },
                  {
                    "type": "integer"
                  },
                  {
                    "type": "boolean"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            }
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "d8xh0y1o4",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "x3xaw5ltr",
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
      "idendpoint": "410321a2-3930-4545-963d-b47f90fdbf01",
      "rowkey": 408,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/api/endpoint",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "Upsert Endpoint",
      "description": "Creates or updates the parameters of an endpoint according to the selected handler.",
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
      "rowkey": 824,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 7,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 457,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
            "_id": "068fusy95",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "788e6e35-106d-45db-acb0-839db45c20f6",
      "rowkey": 355,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/api_clients",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 0,
      "title": "Get API Clients",
      "description": "Get list all api clients",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "api",
      "code": "fnGetApiClientfindByIdOrUsername",
      "cache_time": 30,
      "createdAt": "2026-02-21T07:10:26.497Z",
      "updatedAt": "2026-02-21T07:15:54.867Z"
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
      "rowkey": 321,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/apiclient",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "Create user external",
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
      "rowkey": 946,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 472,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
            "_id": "tknoj6ef6",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "3d2fff88-66a6-43b5-9cab-11b5aec1a706",
      "rowkey": 725,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/apikey",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 3,
      "title": "Get API Key",
      "description": "Get API Key",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "",
      "code": "fnGetApiKeyByFilters",
      "cache_time": 30,
      "createdAt": "2026-02-21T07:45:25.852Z",
      "updatedAt": "2026-02-21T07:45:25.852Z"
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
            "_id": "9l4922vfy",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "f57b01dc-a51c-4c23-ab4b-c890ca733e80",
      "rowkey": 395,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/apikey",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "API Key UPSERT",
      "description": "Create or Update API Key Token",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "apikey",
      "code": "fnUpsertApiKey",
      "cache_time": 0,
      "createdAt": "2026-02-21T04:34:49.323Z",
      "updatedAt": "2026-02-21T04:34:49.323Z"
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
      "rowkey": 736,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 972,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 340,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 886,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "admin": true,
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {
        "enabled": true,
        "name": "Get App List Filters",
        "title": "Get App List Filters",
        "description": "It obtains the list of applications using various available filters."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idapp": {
                "type": "string",
                "description": "Identificador único de la aplicación (UUID o string)"
              },
              "app": {
                "type": "string",
                "description": "Nombre de la aplicación (se normaliza a lowercase)"
              },
              "enabled": {
                "type": "boolean",
                "description": "Estado de la aplicación"
              },
              "endpoint": {
                "type": "object",
                "properties": {
                  "idendpoint": {
                    "type": "string",
                    "description": "Identificador del endpoint"
                  },
                  "method": {
                    "type": "string",
                    "enum": [
                      "GET",
                      "POST",
                      "PUT",
                      "DELETE",
                      "PATCH"
                    ],
                    "description": "Método HTTP (se normaliza a uppercase)"
                  },
                  "handler": {
                    "type": "string",
                    "description": "Tipo de handler (se normaliza a uppercase)"
                  },
                  "environment": {
                    "type": "string",
                    "description": "Ambiente (dev, qa, prd, etc.)"
                  },
                  "resource": {
                    "type": "string",
                    "description": "Recurso del endpoint"
                  },
                  "enabled": {
                    "type": "boolean",
                    "description": "Estado del endpoint"
                  }
                },
                "additionalProperties": false
              }
            },
            "additionalProperties": false
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "tm8hswwdc",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "_id": "dpjmrz7sb",
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
      "idendpoint": "305b4de6-c6c4-42d5-b148-c5fc6ded51bb",
      "rowkey": 924,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/app/tree/by/filters",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 3,
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
        "admin": true,
        "users": [],
        "log": {}
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
            "_id": "adbumcb7z",
            "type": 1
          }
        ],
        "body": {
          "selection": 0
        },
        "headers": [],
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
      "idendpoint": "caa8b54a-eb5e-4134-8ae2-a3946a428ec7",
      "rowkey": 320,
      "enabled": false,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "enabled": true,
        "name": "appvar_upsert",
        "title": "appvar_upsert",
        "description": "Create or update an application variable according to the environment passed as a parameter and to the idapp."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idvar": {
                "type": "string",
                "description": "Identificador de la variable (UUID generado automáticamente)"
              },
              "idapp": {
                "type": "string",
                "description": "Identificador de la aplicación"
              },
              "name": {
                "type": "string",
                "maxLength": 50,
                "description": "Nombre de la variable"
              },
              "type": {
                "type": "string",
                "maxLength": 25,
                "default": "json",
                "description": "Tipo de dato de la variable"
              },
              "environment": {
                "type": "string",
                "maxLength": 10,
                "description": "Ambiente (dev, qa, prd, etc.)"
              },
              "value": {
                "description": "Valor de la variable en formato JSON",
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "idapp",
              "name",
              "type",
              "environment"
            ]
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
            "_id": "35x0p27u4",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "20354d7a-e4fe-47af-8ff6-187bca92f3f9",
      "rowkey": 458,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/app/var",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 2,
      "title": "UPSERT App var",
      "description": "Create or update an application variable according to the environment passed as a parameter and to the idapp.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "app,var",
      "code": "fnUpsertAppVar",
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
        "enabled": true,
        "name": "app_vars",
        "title": "app_vars",
        "description": "It obtains the list of application variables by passing the application id as a parameter (iadpp)."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idapp": {
                "type": "string"
              }
            },
            "additionalProperties": false,
            "required": [
              "idapp"
            ]
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
            "_id": "ej7qaujbd",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "15034cf9-4c94-43ba-bc7a-3d762f62d7ff",
      "rowkey": 65,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/app/variables/idapp",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "App vars",
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
      "idendpoint": "51316993-907c-4fd0-859f-7d2a0bc90dd3",
      "rowkey": 993,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 423,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 406,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "admin": true,
        "users": [],
        "log": {
          "status_info": 0,
          "status_success": 0,
          "status_redirect": 0,
          "status_client_error": 0,
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "8bs5sn23b",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [
          {
            "enabled": false,
            "key": "",
            "value": "",
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "cu8ua5yll",
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
      "idendpoint": "2cf4eecc-1bbe-433a-b8eb-347a7de52d4d",
      "rowkey": 637,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 98,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "enabled": true,
        "name": "upsert_sql_endpoint_handler",
        "title": "UPSERT SQL Endpoint",
        "description": "Create or modify in OpenFusion API an endpoint that executes SQL statements (CRUD) on SQL databases supported by Sequelize."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "idendpoint": {
                "type": "string",
                "format": "uuid"
              },
              "enabled": {
                "type": "boolean"
              },
              "idapp": {
                "type": "string",
                "format": "uuid"
              },
              "environment": {
                "type": "string",
                "enum": [
                  "dev",
                  "qa",
                  "prd"
                ]
              },
              "timeout": {
                "type": "integer",
                "minimum": 0
              },
              "resource": {
                "type": "string",
                "minLength": 1,
                "maxLength": 300
              },
              "access": {
                "type": "integer",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4
                ]
              },
              "title": {
                "type": "string",
                "maxLength": 200
              },
              "description": {
                "type": "string"
              },
              "price_by_request": {
                "type": "integer",
                "minimum": 0
              },
              "price_kb_request": {
                "type": "integer",
                "minimum": 0
              },
              "price_kb_response": {
                "type": "integer",
                "minimum": 0
              },
              "keywords": {
                "type": "string"
              },
              "ctrl": {
                "$ref": "#/$defs/jsonValue"
              },
              "code": {
                "type": "string"
              },
              "cors": {
                "$ref": "#/$defs/jsonValue"
              },
              "cache_time": {
                "type": "integer",
                "minimum": 0
              },
              "mcp": {
                "$ref": "#/$defs/jsonValue"
              },
              "json_schema": {
                "$ref": "#/$defs/jsonValue"
              },
              "custom_data": {
                "$ref": "#/$defs/jsonValue"
              },
              "headers_test": {
                "$ref": "#/$defs/jsonValue"
              },
              "data_test": {
                "$ref": "#/$defs/jsonValue"
              }
            },
            "additionalProperties": false,
            "required": [
              "idapp",
              "environment",
              "timeout",
              "resource",
              "access",
              "title",
              "description",
              "price_by_request",
              "price_kb_request",
              "price_kb_response",
              "keywords",
              "code",
              "cache_time"
            ],
            "$defs": {
              "jsonValue": {
                "oneOf": [
                  {
                    "type": "object",
                    "additionalProperties": {
                      "$ref": "#/$defs/jsonValue"
                    }
                  },
                  {
                    "type": "array",
                    "items": {
                      "$ref": "#/$defs/jsonValue"
                    }
                  },
                  {
                    "type": "string"
                  },
                  {
                    "type": "number"
                  },
                  {
                    "type": "integer"
                  },
                  {
                    "type": "boolean"
                  },
                  {
                    "type": "null"
                  }
                ]
              }
            }
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
            "_id": "k6wkj9wea",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "8bb911ac-374c-41c9-b93f-21d037abf330",
      "rowkey": 839,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/endpoint/sql",
      "method": "POST",
      "handler": "JS",
      "access": 3,
      "title": "UPSERT SQL Handler Endpoint",
      "description": "Create or modify in OpenFusion API an endpoint that executes SQL statements (CRUD) on SQL databases supported by Sequelize.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "sql,endpoint",
      "code": "const uF = uFetchAutoEnv.auto('/api/system/api/endpoint/auto', true);\nlet data = request.body;\ndata.handler = 'SQL';\ndata.method = 'POST';\n\nconst req1  = await uF.POST({ data });\nconst resp = await req1.json();\n$_RETURN_DATA_ = resp;",
      "cache_time": 0,
      "createdAt": "2026-03-17T16:03:50.532Z",
      "updatedAt": "2026-03-17T16:03:50.532Z"
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
      "rowkey": 798,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 227,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 504,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 765,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 727,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 51,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
            "_id": "vbe7fffrs",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "787a8ec2-b0d7-44ae-9214-2254f9d9d086",
      "rowkey": 358,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/mcp/server",
      "method": "POST",
      "handler": "MCP",
      "access": 0,
      "title": "OpenFusionAPI MCP",
      "description": "OpenFusionAPI MCP Server.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "mcp,server,OpenFusionAPI",
      "code": "",
      "cache_time": 10,
      "createdAt": "2026-02-17T14:03:38.449Z",
      "updatedAt": "2026-02-17T14:03:38.449Z"
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
      "rowkey": 311,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 939,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 779,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 500,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 501,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 883,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "admin": true,
        "users": [],
        "log": {}
      },
      "cors": {},
      "mcp": {
        "enabled": true,
        "name": "availables_functions_modules",
        "title": "availables_functions_modules",
        "description": "It retrieves the list of all available functions and modules that can be used within an endpoint when using the \"JS\" handler."
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
            "internal_hash_row": "c5c647b00670bea65a11ab75bf3c77407cc89d1e12a5a013b5fa8146d30f9368",
            "_id": "6ufqp2ww4",
            "type": 1
          }
        ],
        "body": {
          "selection": 0
        },
        "headers": [],
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
      "idendpoint": "3d3de358-681d-4b61-98dc-c1663db0c02c",
      "rowkey": 299,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/system/handler/js/funtions",
      "method": "GET",
      "handler": "FUNCTION",
      "access": 2,
      "title": "List JS Functions",
      "description": "",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "js,functions,handler",
      "code": "fnListFnVarsHandlerJS",
      "cache_time": 60,
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
      "rowkey": 152,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 8,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 569,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
        "name": "user_login",
        "title": "User Login",
        "description": "Login for user access.."
      },
      "json_schema": {
        "in": {
          "enabled": true,
          "schema": {
            "type": "object",
            "properties": {
              "username": {
                "type": "string",
                "description": "Nombre de usuario"
              },
              "password": {
                "type": "string",
                "description": "Contraseña del usuario"
              }
            },
            "additionalProperties": true,
            "title": "Login",
            "description": "Schema para validar credenciales de login",
            "required": [
              "username",
              "password"
            ]
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
            "_id": "hl2so8w0j",
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
          "form": [],
          "urlencoded": []
        },
        "headers": [],
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
      "idendpoint": "871cd2ed-8456-4e5e-8ab5-b7724a908191",
      "rowkey": 87,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
      "resource": "/system/login",
      "method": "POST",
      "handler": "FUNCTION",
      "access": 0,
      "title": "System Login",
      "description": "User Login.",
      "price_by_request": 1,
      "price_kb_request": 1,
      "price_kb_response": 1,
      "keywords": "login",
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
      "rowkey": 227,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 29,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 785,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 707,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "ctrl": {},
      "cors": {},
      "mcp": {},
      "json_schema": {},
      "custom_data": {},
      "headers_test": {},
      "data_test": {},
      "idendpoint": "2c6d77b7-d8e2-49e2-9c63-a98a873b389c",
      "rowkey": 338,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 211,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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
      "rowkey": 355,
      "enabled": true,
      "idapp": "cfcd2084-95d5-65ef-66e7-dff9f98764da",
      "environment": "prd",
      "timeout": 30,
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