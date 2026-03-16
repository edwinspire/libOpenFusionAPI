export class DbHookCacheInvalidationService {
  constructor({
    endpoints,
    deleteEndpointsByAppName,
    applicationModel,
    appvarsModel,
    endpointModel,
    appInvalidateDelayMs = 5000,
  }) {
    this.endpoints = endpoints;
    this.deleteEndpointsByAppName = deleteEndpointsByAppName;
    this.applicationModel = applicationModel;
    this.appvarsModel = appvarsModel;
    this.endpointModel = endpointModel;
    this.appInvalidateDelayMs = appInvalidateDelayMs;
  }

  handleHookData(data) {
    if (!data) return;

    if (data.model == this.applicationModel && data.action === "afterUpsert") {
      if (data.data?.app) {
        setTimeout(() => {
          this.deleteEndpointsByAppName(data.data?.app);
        }, this.appInvalidateDelayMs);
      }
      return;
    }

    if (
      data.model == this.appvarsModel &&
      (data.action === "afterUpsert" || data.action === "afterDestroy")
    ) {
      this.endpoints.deleteEndpointsByIdApp(data.data?.idapp, data.data?.environment);
      return;
    }

    if (data.model == this.endpointModel && data.action === "afterUpsert") {
      this.endpoints.deleteEndpointByidEndpoint(
        data?.data?.idendpoint,
        data?.data?.environment,
      );
    }
  }
}
