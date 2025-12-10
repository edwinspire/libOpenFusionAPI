import { EventEmitter } from "events";

export class TimedCache extends EventEmitter {
  constructor() {
    super();
    this.root = new Map(); // app → resource → env → method → hash → payload
  }

  /**
   * Agregar un elemento a la cache
   */
  add({ app, resource, env, method, hash, payload, timeout = 1 } = {}) {
    if (!app || !resource || !env || !method || !hash) {
      throw new Error("app, resource, env, method y hash son obligatorios");
    }

    const appNode = this.#ensure(this.root, app);
    const resNode = this.#ensure(appNode, resource);
    const envNode = this.#ensure(resNode, env);
    const methodNode = this.#ensure(envNode, method);

    methodNode.set(hash, payload);

    this.emit("added", { app, resource, env, method, hash, payload });

    // Expiración segura
    setTimeout(() => {
      const deleted = this.delete({ app, resource, env, method, hash });
      if (deleted) {
        this.emit("expired", { app, resource, env, method, hash });
      }
    }, timeout * 1000);

    return payload;
  }

  /**
   * Obtiene un nodo por jerarquía.
   * Soporta cualquier nivel: app / resource / env / method / hash
   */
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

    return node; // retorna todos los hashes
  }

  /**
   * Elimina en cascada según los parámetros entregados.
   * Si se entrega "hash" → elimina solo ese hash
   * Si se entrega "method" → elimina todo ese método
   * Si se entrega "env" → elimina todo ese env
   * Etc.
   */
  delete({ app, resource, env, method, hash } = {}) {
    if (!app) return false;

    const appNode = this.root.get(app);
    if (!appNode) return false;

    // ------- HASH -------
    if (resource && env && method && hash) {
      const methodNode = appNode.get(resource)?.get(env)?.get(method);
      if (!methodNode) return false;

      const result = methodNode.delete(hash);
      if (!result) return false;

      // Limpieza de ramas vacías
      this.#cleanup(app, resource, env, method);

      return true;
    }

    // ------- METHOD -------
    if (resource && env && method) {
      const envNode = appNode.get(resource)?.get(env);
      if (!envNode) return false;

      const result = envNode.delete(method);
      if (!result) return false;

      this.#cleanup(app, resource, env);
      return true;
    }

    // ------- ENV -------
    if (resource && env) {
      const resNode = appNode.get(resource);
      if (!resNode) return false;

      const result = resNode.delete(env);
      if (!result) return false;

      this.#cleanup(app, resource);
      return true;
    }

    // ------- RESOURCE -------
    if (resource) {
      const result = appNode.delete(resource);
      if (!result) return false;

      this.#cleanup(app);
      return true;
    }

    // ------- APP -------
    return this.root.delete(app);
  }

  /**
   * Borra ramas vacías después de eliminar un nodo.
   */
  #cleanup(app, resource, env, method) {
    const appNode = this.root.get(app);
    if (!appNode) return;

    // cleanup method
    if (resource && env && method) {
      const envNode = appNode.get(resource)?.get(env);
      if (envNode && envNode.get(method)?.size === 0) {
        envNode.delete(method);
      }
    }

    // cleanup env
    if (resource && env) {
      const resNode = appNode.get(resource);
      if (resNode?.get(env)?.size === 0) {
        resNode.delete(env);
      }
    }

    // cleanup resource
    if (resource) {
      const appNodeUpdated = this.root.get(app);
      if (appNodeUpdated?.get(resource)?.size === 0) {
        appNodeUpdated.delete(resource);
      }
    }

    // cleanup app
    if (this.root.get(app)?.size === 0) {
      this.root.delete(app);
    }
  }

  /**
   * Asegura la existencia de un nodo
   */
  #ensure(parentMap, key) {
    if (!parentMap.has(key)) {
      parentMap.set(key, new Map());
    }
    return parentMap.get(key);
  }
}
