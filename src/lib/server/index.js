//import "dotenv/config";
import { EventEmitter } from "node:events";
import dns from "dns";
import Fastify from "fastify";
import websocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import fastifyEnv from "@fastify/env";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

//import { url } from 'node:inspector';
dns.setDefaultResultOrder("ipv4first");

// Opciones para obtener las variables de enntorno
const schema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
  },
};

const options = {
  confKey: "config", // optional, default: 'config'
  schema: schema,
  // data: data, // optional, default: process.env
};

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

    this.fastify.register(fastifyEnv, options).ready((err) => {
      if (err) console.error(err);

      console.log(this.fastify.config); // or fastify[options.confKey]
      // output: { PORT: 3000 }
    });

    this.fastify.register(websocket).then(() => {
      this.fastify.addHook("preHandler", (request, reply, done) => {
        console.log(">>>>>>> preHandler");

        // Cargar la aplicación

        //

        // some code
        done();
      });

      this.fastify.register(fastifyStatic, {
        root: join(__dirname, "www"),
        prefix: "/", // opcional: por defecto '/'
      });

      this.fastify.get(
        "/ws/*",
        { websocket: true },
        (connection, req) =>{
          console.log("sssssss");

          connection.socket.on("message", (message) => {
            // message.toString() === 'hi from client'
            connection.socket.send("hi from server");
          });
        }
      );

      // Declare a route
      this.fastify.all("/api/:animal/:cosa", (request, reply) => {
        reply.send({ hello: "world" });
      });
    });
  }

  async listen() {
    await this.fastify.listen({ port: 3000 });
    console.log("Listen on port 3000");
  }
}
