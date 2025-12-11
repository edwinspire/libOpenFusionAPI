import { EventEmitter } from "events";

export class TimedCache extends EventEmitter {
  constructor() {
    super();
    this.root = new Map(); // app → resource → env → method → hash → payload
    this.timeouts = new Map(); // key → timeoutId
  }

  // ---------------------------------------------------------------------
  // Keys estandarizadas
  // ---------------------------------------------------------------------
  #buildKey({ app, resource, env, method, hash }) {
    let base = `/${app}${resource}/${env}`;
    let extra = [];

    if (method) extra.push(method);
    if (hash) extra.push(hash);

    return extra.length ? `${base}|${extra.join("|")}` : base;
  }

  // ---------------------------------------------------------------------
  // Crear nodos si no existen
  // ---------------------------------------------------------------------
  #ensure(parent, key) {
    if (!parent.has(key)) {
      parent.set(key, new Map());
    }
    return parent.get(key);
  }

  // ---------------------------------------------------------------------
  // Limpieza de timeout
  // ---------------------------------------------------------------------
  #cleanTimeout(key) {
    const t = this.timeouts.get(key);
    if (t) {
      clearTimeout(t);
      this.timeouts.delete(key);
    }
  }

  // ---------------------------------------------------------------------
  // Emitir expiración de un hash
  // ---------------------------------------------------------------------
  #emitExpired({ app, resource, env, method, hash, payload }) {
    const key = this.#buildKey({ app, resource, env, method, hash });

    this.#cleanTimeout(key);

    this.emit("expired", {
      app,
      resource,
      env,
      method,
      hash,
      payload,
      key,
    });
  }

  // ---------------------------------------------------------------------
  // Emitir expiración en cascada (cuando se elimina method/env/resource/app)
  // ---------------------------------------------------------------------
  // Método #emitCascade corregido
  #emitCascade(app, resource, env, method, node) {
    for (const [key, value] of node.entries()) {
      if (value instanceof Map) {
        if (env === null) {
          this.#emitCascade(app, resource, key, null, value);
        } else if (method === null) {
          this.#emitCascade(app, resource, env, key, value);
        } else {
          this.#emitCascade(app, resource, env, method, value);
        }
      } else {
        // ✅ Removida limpieza redundante
        this.#emitExpired({
          app,
          resource,
          env,
          method,
          hash: key,
          payload: value,
        });
      }
    }
  }

  // ---------------------------------------------------------------------
  // Limpieza de ramas vacías
  // ---------------------------------------------------------------------
  #cleanup(app, resource, env, method) {
    const appNode = this.root.get(app);
    if (!appNode) return;

    if (resource && env && method) {
      const envNode = appNode.get(resource)?.get(env);
      if (envNode?.get(method)?.size === 0) envNode.delete(method);
    }

    if (resource && env) {
      const resNode = appNode.get(resource);
      if (resNode?.get(env)?.size === 0) resNode.delete(env);
    }

    if (resource) {
      if (appNode.get(resource)?.size === 0) {
        appNode.delete(resource);
      }
    }

    if (this.root.get(app)?.size === 0) {
      this.root.delete(app);
    }
  }

  // ---------------------------------------------------------------------
  // AGREGAR
  // ---------------------------------------------------------------------
  // Método add() corregido
  add({ app, resource, env, method, hash, payload, timeout = 10 } = {}) {
    if (!app || !resource || !env || !method || !hash) {
      throw new Error("app, resource, env, method y hash son obligatorios");
    }

    if (this.get({ app, resource, env, method, hash }) === null) {
      const appNode = this.#ensure(this.root, app);
      const resNode = this.#ensure(appNode, resource);
      const envNode = this.#ensure(resNode, env);
      const methodNode = this.#ensure(envNode, method);

      methodNode.set(hash, payload);

      const key = this.#buildKey({ app, resource, env, method, hash });

      this.emit("added", {
        app,
        resource,
        env,
        method,
        hash,
        payload,
        key,
      });

      const t = setTimeout(() => {
        this.delete({ app, resource, env, method, hash }); // ✅ Simplificado
      }, timeout * 1000);

      this.timeouts.set(key, t);
    }

    return payload;
  }

  // ---------------------------------------------------------------------
  // OBTENER (cualquier nivel)
  // ---------------------------------------------------------------------
  get({ app, resource, env, method, hash } = {}) {
    let node = this.root;

    if (app) node = node.get(app);
    else return node;

    if (!node) return null;

    if (resource) node = node.get(resource);
    else return node;

    if (!node) return null;

    if (env) node = node.get(env);
    else return node;

    if (!node) return null;

    if (method) node = node.get(method);
    else return node;

    if (!node) return null;

    if (hash) return node.get(hash) ?? null;

    return node;
  }

  /**
   * getPayload
   * Devuelve únicamente el payload del nodo final.
   * TODOS los parámetros son obligatorios.
   */
  getPayload({ app, resource, env, method, hash }) {
    if (!app || !resource || !env || !method || !hash) {
      throw new Error("getPayload: application, resource, environment, method, and hash are required");
    }

    const appNode = this.root.get(app);
    if (!appNode) return null;

    const resNode = appNode.get(resource);
    if (!resNode) return null;

    const envNode = resNode.get(env);
    if (!envNode) return null;

    const methodNode = envNode.get(method);
    if (!methodNode) return null;

    return methodNode.get(hash) ?? null;
  }


  // ---------------------------------------------------------------------
  // LISTAR (normalizado)
  // ---------------------------------------------------------------------
  list({ app, resource, env, method, hash } = {}) {
    const results = [];

    const walk = (node, path) => {
      for (const [key, value] of node.entries()) {
        const newPath = [...path, key];

        if (value instanceof Map) {
          walk(value, newPath);
        } else {
          const [app, resource, env, method] = path;
          const hash = key;

          results.push({
            app,
            resource,
            env,
            method,
            hash,
            payload: value,
            key: this.#buildKey({ app, resource, env, method, hash }),
          });
        }
      }
    };

    let node = this.root;

    if (app) node = node.get(app);
    else {
      walk(node, []);
      return results;
    }

    if (!node) return [];

    if (resource) node = node.get(resource);
    else {
      walk(node, [app]);
      return results;
    }

    if (!node) return [];

    if (env) node = node.get(env);
    else {
      walk(node, [app, resource]);
      return results;
    }

    if (!node) return [];

    if (method) node = node.get(method);
    else {
      walk(node, [app, resource, env]);
      return results;
    }

    if (!node) return [];

    if (hash) {
      const payload = node.get(hash);
      return payload
        ? [
            {
              app,
              resource,
              env,
              method,
              hash,
              payload,
              key: this.#buildKey({ app, resource, env, method, hash }),
            },
          ]
        : [];
    }

    walk(node, [app, resource, env, method]);
    return results;
  }

  // ---------------------------------------------------------------------
  // DELETE (soporta cascada completa)
  // ---------------------------------------------------------------------
  delete({ app, resource, env, method, hash } = {}) {
    if (!app) return false;

    const appNode = this.root.get(app);
    if (!appNode) return false;

    // HASH
    if (resource && env && method && hash) {
      const methodNode = appNode.get(resource)?.get(env)?.get(method);
      if (!methodNode) return false;

      const payload = methodNode.get(hash);
      const result = methodNode.delete(hash);

      if (result) {
        this.#emitExpired({ app, resource, env, method, hash, payload });
        this.#cleanup(app, resource, env, method);
      }

      return result;
    }

    // METHOD
    if (resource && env && method) {
      const envNode = appNode.get(resource)?.get(env);
      if (!envNode) return false;

      const methodNode = envNode.get(method);
      if (!methodNode) return false;

      this.#emitCascade(app, resource, env, method, methodNode);

      const result = envNode.delete(method);
      if (result) this.#cleanup(app, resource, env);

      return result;
    }

    // ENV
    if (resource && env) {
      const resNode = appNode.get(resource);
      if (!resNode) return false;

      const envNode = resNode.get(env);
      if (!envNode) return false;

      this.#emitCascade(app, resource, env, null, envNode);

      const result = resNode.delete(env);
      if (result) this.#cleanup(app, resource);

      return result;
    }

    // RESOURCE
    if (resource) {
      const resNode = appNode.get(resource);
      if (!resNode) return false;

      this.#emitCascade(app, resource, null, null, resNode);

      const result = appNode.delete(resource);
      if (result) this.#cleanup(app);

      return result;
    }

    // APP (borrado total)
    for (const [resKey, resNode] of appNode.entries()) {
      this.#emitCascade(app, resKey, null, null, resNode);
    }

    return this.root.delete(app);
  }
}
