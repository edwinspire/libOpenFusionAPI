import "dotenv/config";
import { EventEmitter } from "node:events";
import dns from "dns";
import Fastify from "fastify";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { defaultApps, getAppByName, getAppWithEndpoints } from "./db/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

//import { url } from 'node:inspector';
dns.setDefaultResultOrder("ipv4first");

// Este bloque permite convertir un error a String con JSON.stringify
var config = {
  configurable: true,
  value: function () {
    var alt = {};
    var storeKey = function (/** @type {string | number} */ key) {
      // @ts-ignore
      alt[key] = this[key];
    };
    Object.getOwnPropertyNames(this).forEach(storeKey, this);
    return alt;
  },
};
Object.defineProperty(Error.prototype, "toJSON", config);

export default class ServerAPI extends EventEmitter {
  constructor({ buildDB = false } = {}) {
    super();

    this.fastify = Fastify({
      logger: true,
    });

    this._build();
  }

  async _build() {
    await this.fastify.register(websocket);
    await this.fastify.register(fastifyStatic, {
      root: join(__dirname, "www"),
      prefix: "/", // opcional: por defecto '/'
    });

    this.buildDB();

    this.fastify.addHook("preValidation", (request, reply, done) => {
      console.log(">>>>>>> preValidation");

      if (!request.url.startsWith('/api')) {
					console.log(' ::: req.path >>>>', request.url);
				
			}


      // Cargar la aplicación

      //

      // some code
      done();
    });

    this.fastify.get("/ws/*", { websocket: true }, (connection, req) => {
      console.log("sssssss");

      connection.socket.on("message", (message) => {
        // message.toString() === 'hi from client'
        connection.socket.send("hi from server");
      });
    });

    // Declare a route
    this.fastify.all("/api/:animal/:cosa", (request, reply) => {
      reply.send({ hello: "world" });
    });

    const port = process.env.PORT || 3000;
    console.log("Listen on PORT " + port);
    await this.fastify.listen({ port: port });
  }

  /**
   * @param {boolean} buildDB
   */
  buildDB() {
    let buildDB = process.env.BUILD_DB ?? false;

    if (buildDB) {
      console.log("Crea la base de datos");

      (async () => {
        try {
          await dbRestAPI.sync({ alter: true });
          await defaultUser();
          await defaultMethods();
          await defaultHandlers();
          await defaultApps();
          await defaultEndpoints();
        } catch (error) {
          console.log(error);
        }
      })();
    }
    return true;
  }
}
