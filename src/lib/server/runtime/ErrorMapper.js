export function mapOperationalError(error, request) {
  const trace_id = request?.headers?.["ofapi-trace-id"] || "";

  if (error?.name === "AbortError") {
    return {
      statusCode: 504,
      payload: { error: "Operation timed out", trace_id },
    };
  }

  if (typeof error === "string") {
    return {
      statusCode: 500,
      payload: { error, trace_id },
    };
  }

  if (error?.statusCode && Number.isInteger(error.statusCode)) {
    return {
      statusCode: error.statusCode,
      payload: {
        error: error.message || "Internal Server Error",
        trace_id,
      },
    };
  }

  return {
    statusCode: 500,
    payload: {
      error: error?.message || "Internal Server Error",
      trace_id,
    },
  };
}
