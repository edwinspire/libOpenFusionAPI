import { get_url_params } from "../utils_path.js";

/**
 * Tracks HTTP status code counts and provides app-level metrics.
 */
export class MetricsCollector {
  /**
   * @param {object} internalEndpoint - Shared reference to the endpoint registry object.
   * @param {import("./TimedCache.js").TimedCache} cache - Shared TimedCache instance.
   */
  constructor(internalEndpoint, cache) {
    this._ep = internalEndpoint;
    this._cache = cache;
  }

  addCountStatus(url_key, statusCode) {
    if (url_key && statusCode) {
      // Guard: endpoint may not exist if recently deleted
      if (!this._ep[url_key]) return;

      if (!this._ep[url_key].CountStatusCode) {
        this._ep[url_key].CountStatusCode = {};
        this._ep[url_key].CountStatusCode[statusCode] = 0;
      }

      if (!this._ep[url_key].CountStatusCode[statusCode]) {
        this._ep[url_key].CountStatusCode[statusCode] = 0;
      }
      this._ep[url_key].CountStatusCode[statusCode]++;
    }
  }

  getResponseCountStatusCode(app_name) {
    let r = { data: undefined, code: 204 };
    try {
      r.data = [];
      r.code = 200;
      const filteredKeys = Object.keys(this._ep).filter((url_key) => {
        let u = get_url_params(url_key);
        return u.app == app_name && this._ep[url_key].CountStatusCode;
      });

      let statusCodeList = filteredKeys.map((url_key) => {
        let entry = {};
        entry[url_key] = this._ep[url_key].CountStatusCode;
        return entry;
      });

      r.data = statusCodeList;
    } catch (error) {
      r.data = error;
      r.code = 500;
    }
    return r;
  }

  getInternalAppMetrics(app_name) {
    let r = { data: undefined, code: 204 };
    try {
      r.data = [];
      r.code = 200;
      const filteredKeys = Object.keys(this._ep).filter((key) => {
        let u = get_url_params(key);
        return u.app == app_name;
      });

      let data = filteredKeys.map((key) => {
        return {
          idendpoint: this._ep[key]?.handler?.params?.idendpoint,
          cache_size: this._cache.getCacheSizeEndpoint({
            app: app_name,
            resource: this._ep[key]?.handler?.params?.resource,
            env: this._ep[key]?.handler?.params?.environment,
            method: this._ep[key]?.handler?.params?.method,
          }),
          statusCode: this._ep[key].CountStatusCode,
        };
      });

      r.data = data;
    } catch (error) {
      r.data = error;
      r.code = 500;
    }
    return r;
  }
}
