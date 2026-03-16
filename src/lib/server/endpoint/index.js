import { EventEmitter } from "node:events";
import { get_url_params } from "../utils_path.js";
import { TimedCache } from "./TimedCache.js";
import { EndpointCache } from "./EndpointCache.js";
import { EndpointLoader } from "./EndpointLoader.js";
import { EndpointLogger } from "./EndpointLogger.js";
import { MetricsCollector } from "./MetricsCollector.js";

/**
 * Facade that composes the four specialized endpoint sub-systems.
 * Public API is identical to the original monolithic class.
 *
 *  - EndpointCache    → response caching, hash, cache sizes
 *  - EndpointLoader   → DB loading, handler building, thundering-herd guard
 *  - EndpointLogger   → log assembly, truncation, persistence
 *  - MetricsCollector → status-code counting, app metrics
 */
export default class Endpoint extends EventEmitter {
  /** @type {object} Shared endpoint registry — mutated by loader and delete helpers. */
  internal_endpoint = {};

  /** @type {object} Local function registry — set externally after construction. */
  fnLocal = {};

  /** @type {Map} In-flight loading promises — shared with EndpointLoader. */
  loadingPromises = new Map();

  constructor(dependencies) {
    super();

    const timedCache = new TimedCache();
    /** @deprecated Use sub-class APIs. Kept for backward compatibility. */
    this.cache = timedCache;

    this._cacheManager = new EndpointCache(this.internal_endpoint, timedCache);
    this._loader = new EndpointLoader(
      this.internal_endpoint,
      this.fnLocal,
      this.loadingPromises,
      dependencies
    );
    this._logger = new EndpointLogger((event, data) => this.emit(event, data), dependencies);
    this._metrics = new MetricsCollector(this.internal_endpoint, timedCache);
  }

  // ── EndpointLogger ─────────────────────────────────────────────────────────

  pushLog(log) {
    return this._logger.pushLog(log);
  }

  getDataLog(log_level, request, reply) {
    return this._logger.getDataLog(log_level, request, reply);
  }

  truncateData(data, maxLength) {
    return this._logger.truncateData(data, maxLength);
  }

  saveLog(request, reply) {
    return this._logger.saveLog(request, reply);
  }

  // ── EndpointLoader ─────────────────────────────────────────────────────────

  getFnNames() {
    return this._loader.getFnNames();
  }

  async getEndpoint(request_path_params) {
    return this._loader.getEndpoint(request_path_params);
  }

  // ── EndpointCache ──────────────────────────────────────────────────────────

  getCache(endpoint_key, hash_request) {
    return this._cacheManager.getCache(endpoint_key, hash_request);
  }

  clearCache(endpoint_key) {
    return this._cacheManager.clearCache(endpoint_key);
  }

  hash_request(request, endpoint_key) {
    return this._cacheManager.hash_request(request, endpoint_key);
  }

  setCache(url_key, request, reply) {
    return this._cacheManager.setCache(url_key, request, reply);
  }

  getCacheSize(app_name) {
    return this._cacheManager.getCacheSize(app_name);
  }

  // ── MetricsCollector ───────────────────────────────────────────────────────

  addCountStatus(url_key, statusCode) {
    return this._metrics.addCountStatus(url_key, statusCode);
  }

  getResponseCountStatusCode(app_name) {
    return this._metrics.getResponseCountStatusCode(app_name);
  }

  getInternalAppMetrics(app_name) {
    return this._metrics.getInternalAppMetrics(app_name);
  }

  // ── Endpoint Registry Management ──────────────────────────────────────────
  // These methods mutate internal_endpoint directly and coordinate the cache,
  // so they remain here in the facade rather than being delegated.

  deleteApp(app_name) {
    let ep_list = Object.keys(this.internal_endpoint);

    for (let index = 0; index < ep_list.length; index++) {
      const prms = get_url_params(ep_list[index]);
      if (prms.app == app_name) {
        delete this.internal_endpoint[ep_list[index]];
      }
    }
    this.cache.delete({ app: app_name });
  }

  deleteEndpointByidEndpoint(idendpoint) {
    if (!idendpoint) return;

    try {
      let ep_list = Object.keys(this.internal_endpoint);

      // idendpoint is unique — stop after first match
      for (const key of ep_list) {
        const ep = this.internal_endpoint[key];
        if (ep?.handler?.params?.idendpoint === idendpoint) {
          this.cache.delete({
            app: ep.handler.params.app,
            resource: ep.handler.params.resource,
            env: ep.handler.params.environment,
            method: ep.handler.params.method,
          });
          delete this.internal_endpoint[key];
          break;
        }
      }

      // Also remove all MCP endpoints (they are rebuilt on next request)
      ep_list = Object.keys(this.internal_endpoint);
      for (const key of ep_list) {
        const ep = this.internal_endpoint[key];
        if (ep?.handler?.params?.handler === "MCP") {
          this.cache.delete({
            app: ep.handler.params.app,
            resource: ep.handler.params.resource,
            env: ep.handler.params.environment,
            method: ep.handler.params.method,
          });
          delete this.internal_endpoint[key];
        }
      }
    } catch (error) {
      console.error(
        `deleteEndpointByidEndpoint error [idendpoint=${idendpoint}]:`,
        error
      );
    }
  }

  deleteEndpointsByIdApp(idapp, env) {
    if (idapp) {
      let ep_list = Object.keys(this.internal_endpoint);

      for (let index = 0; index < ep_list.length; index++) {
        let ep = this.internal_endpoint[ep_list[index]];
        if (
          ep &&
          ep.handler.params.idapp == idapp &&
          ep.handler.params.environment == env
        ) {
          this.cache.delete({
            app: ep?.handler?.params?.app,
            resource: ep?.handler?.params?.resource,
            env: ep?.handler?.params?.environment,
            method: ep?.handler?.params?.method,
          });
          delete this.internal_endpoint[ep_list[index]];
        }
      }
    }
  }
}
