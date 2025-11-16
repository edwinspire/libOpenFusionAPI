function createHtmlDocument(header, endpoints) {
  let html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>OpenFusionAPI Documentation</title>
    <style>
      /* Base reset */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      :root {
        --bg: #f9fafb;
        --card: #ffffff;
        --muted: #6b7280;
        --text: #111827;
        --border: #e5e7eb;
        --accent-green: #16a34a;
        --accent-dark: #065f46;
        --accent-qa: #92400e;
        --accent-dev: #1e40af;
        --shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        --radius: 0.5rem;
        --mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        font-synthesis: none;
      }
      html,
      body {
        height: 100%;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Arial, sans-serif;
        background-color: var(--bg);
        color: var(--text);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        padding: 2rem;
        line-height: 1.45;
      }

      /* Layout */
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 1.25rem;
        margin-bottom: 1.5rem;
        page-break-inside: avoid;
      }

      /* Header */
      .header {
        display: flex;
        gap: 1.25rem;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      .header-left {
        flex: 1 1 520px;
        min-width: 280px;
      }
      .header-title {
        font-size: 2.25rem;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 0.25rem;
      }
      .header-meta {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .header-subtitle {
        font-size: 1rem;
        font-weight: 600;
        color: var(--muted);
        display: inline-block;
        margin-right: 0.5rem;
      }
      .badge-enabled {
        background-color: #d1fae5;
        color: var(--accent-dark);
        font-weight: 600;
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        display: inline-block;
      }
      .badge-disabled {
        background-color: #fee2e2;
        color: #991b1b;
        font-weight: 600;
        font-size: 0.75rem;
        padding: 0.25rem 0.6rem;
        border-radius: 9999px;
        display: inline-block;
      }
      /* Header info row */
      .header-info {
        display: flex;
        gap: 1.25rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
      .info-item {
        font-size: 0.95rem;
        color: var(--muted);
      }
      .info-item strong {
        color: var(--text);
        font-weight: 600;
        margin-right: 0.25rem;
      }

      /* Section titles */
      .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        border-bottom: 2px solid var(--border);
        padding-bottom: 0.25rem;
      }

      /* Environments grid */
      .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }
      .env-card {
        border-radius: var(--radius);
        padding: 1rem;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03);
      }
      .env-card.production {
        background: #d1fae5;
      }
      .env-card.qa {
        background: #fef3c7;
      }
      .env-card.development {
        background: #dbeafe;
      }
      .env-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        gap: 0.5rem;
      }
      .env-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .env-dot.production {
        background: var(--accent-dark);
      }
      .env-dot.qa {
        background: var(--accent-qa);
      }
      .env-dot.development {
        background: var(--accent-dev);
      }
      .env-title {
        font-weight: 600;
        font-size: 1.05rem;
        color: var(--text);
      }

      /* Labels & monospace */
      .label {
        font-size: 0.8rem;
        color: var(--muted);
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 0.25rem;
        display: block;
      }
      .mono-text {
        font-family: var(--mono);
        font-size: 0.9rem;
        color: var(--text);
        background: var(--bg);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        display: inline-block;
      }

      /* Code blocks */
      .code-block {
        background: #ddeeed;
        color: #1d2745;
        font-family: var(--mono);
        font-size: 0.9rem;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
         .code-block-response {
        background: #ffdc3352;
        color: #1d2745;
        font-family: var(--mono);
        font-size: 0.9rem;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
         .key-value-block {
        background: #bddae896;
        color: #1d2745;
        font-size: 0.9rem;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow: auto;
        
        word-wrap: break-word;
      }
      .code-light {
        background: #f3f4f6;
        padding: 0.75rem;
        border-radius: 0.375rem;
        overflow: auto;
        font-family: var(--mono);
        font-size: 0.9rem;
        white-space: pre-wrap;
      }

      /* Endpoint summary / details */
      .endpoint-container {
        margin-bottom: 1rem;
      }
      details {
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
        background: var(--card);
      }
      summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        background: #f3f4f6;
        padding: 1rem 1.25rem;
        list-style: none;
      }
      summary:hover {
        background: #eaeef2;
      }
      .endpoint-header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .method-badge {
        background: var(--accent-green);
        color: #fff;
        font-weight: 700;
        font-size: 0.8rem;
        padding: 0.25rem 0.65rem;
        border-radius: 0.375rem;
        font-family: var(--mono);
      }
      .endpoint-url {
        font-family: var(--mono);
        font-size: 1.05rem;
        color: var(--text);
        margin-right: 0.5rem;
      }
      .status-badge {
        font-weight: 600;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
      }
      .status-badge.enabled {
        background: #bbf7d0;
        color: #000;
      }
      .status-badge.disabled {
        background: #fecaca;
        color: #000;
      }
      .status-badge.public {
        background: #bfdbfe;
        color: #000;
      }
      .status-badge.bearer {
        background: #fde68a;
        color: #000;
      }
      .status-badge.mcp {
        background: #ddd6fe;
        color: #000;
      }

      /* Details content */
      .endpoint-details {
        padding: 1.25rem;
        background: var(--card);
        display: block;
      }
      .config-grid {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .config-section {
        flex: 1 1 260px;
      }
      .section-subtitle {
        font-size: 1rem;
        font-weight: 600;
        color: var(--muted);
        margin-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.25rem;
      }
    .config-item-key-value {
        width: 25%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }
      .config-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .config-value {
        font-weight: 600;
      }
      .config-value.yes {
        color: var(--accent-green);
      }
      .config-value.no {
        color: #dc2626;
      }
      .config-value.na {
        color: var(--muted);
      }

      /* Example blocks */
      .example-header {
        font-weight: 700;
        font-size: 1.05rem;
        margin-bottom: 0.75rem;
        margin-top: 1rem;
      }
      .example-subtitle {
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
        margin-top: 0.75rem;
      }

      /* Chevron */
      .chevron {
        width: 20px;
        height: 20px;
        transition: transform 0.25s ease;
      }
      details[open] .chevron {
        transform: rotate(180deg);
      }

      /* Responsive tweaks */
      @media (max-width: 720px) {
        .header {
          align-items: flex-start;
        }
        .endpoint-header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .header-title {
          font-size: 1.6rem;
        }
      }

      /* Print */
      @media print {
        body {
          background: white;
          padding: 1rem;
          color: #000;
        }
        .card {
          box-shadow: none;
          border: 1px solid #fff;
          break-inside: avoid;
        }
        details {
          break-inside: avoid;
        }
        summary {
          background: transparent !important;
        }
        .code-block {
          background: #f3f4f6;
          color: #000;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      ${header}

      <!-- Endpoints -->
      <section class="card" aria-labelledby="endpoints-title">
        <h2 id="endpoints-title" class="section-title">Available Endpoints</h2>

       
        ${endpoints}


      </section>

      <footer
        style="
          text-align: center;
          font-size: 0.9rem;
          color: var(--muted);
          margin-top: 1.5rem;
        "
      >
        © 2025 OpenFusionAPI Documentation - all rights reserved.
      </footer>
    </div>
  </body>
</html>
`;
  return html;
}

function createHeader(app, serverVersion) {
  let html = `      <header class="card header" role="banner">
        <div class="header-left">
          <h1 class="header-title">OpenFusionAPI Documentation</h1>
          <div class="header-meta">
            <span class="header-subtitle">${app.app}</span>
            <span class="badge-${app.enabled ? "enabled" : "disabled"}">${
    app.enabled ? "Enabled" : "Disabled"
  }</span>
          </div>
          <div class="header-info" style="margin-top: 0.75rem">
            <div class="info-item">
              <strong>Creation:</strong> <span>${app.createdAt}</span>
            </div>
            <div class="info-item">
              <strong>User Creation:</strong> <span>${app.iduser}</span>
            </div>
            <div class="info-item">
              <strong>Server Version:</strong>
              <span style="font-family: var(--mono)">${serverVersion}</span>
            </div>
          </div>
          <p style="margin-top: 0.9rem; max-width: 80%"> ${app.description}
          </p>
        </div>
      </header>
`;
  return html;
}

function createItemConfigEndpoint(label, value) {
  let html = `<div class="config-item">
                    <span>${label}:</span><span class="config-value">${value}</span>
                  </div>
`;
  return html;
}

function createEndpointJsonSchemaInput(json_schema) {
  let html = ` <div class="description-section">
                <h4 class="section-subtitle">Input Schema (JSON Schema)</h4>
                <pre class="code-block">
${JSON.stringify(json_schema?.in?.schema, null, 2)}</pre
                >
              </div>`;

  return json_schema?.in?.schema ? html : "";
}

function createBlockJsonCode(label, array_json) {
  let html = "";
  if (Array.isArray(array_json) && array_json.length > 0) {
    let enabled_list = array_json.filter((item) => {
      return item.enabled === true;
    });

    if (enabled_list.length > 0) {
      let new_data = enabled_list.map((item) => {
        let result = {};
        result[item.key] = item.value;
        return result;
      });

      let code = JSON.stringify(new_data, null, 2);

      html = ` <h4 class="section-subtitle">${label}</h4>
                <pre class="code-light">
${code}</pre
                >`;
    }
  }

  return html;
}

function createBlockArrayKeyValue(label, array_json) {
  let html = "";
  if (Array.isArray(array_json) && array_json.length > 0) {
    let enabled_list = array_json.filter((item) => {
      return item.enabled === true && item.key && item.key.length > 0;
    });

    if (enabled_list.length > 0) {
      let new_data = enabled_list.map((item) => {
        return `<div class="config-item-key-value">
                    <strong>${item.key}</strong><span class="config-value">${item.value}</span>
                  </div>`;
      });

      html = `<h4 class="section-subtitle">${label}</h4>
                 <div class="key-value-block"> ${new_data.join("\n")} </div>`;
    }
  }

  return html;
}

function createBlockRequestBody(json_data_body) {
  let html = "";
  if (json_data_body?.js?.code) {
    let code;
    try {
      code = JSON.parse(JSON.stringify(json_data_body.js.code, null, 2));
      html = ` <h4 class="section-subtitle">Body</h4>
                <pre class="code-light">
${code}</pre
                >`;
    } catch (error) {
      console.error("Error parsing JSON body:", error);
    }
  }

  return html;
}

function createResponseExampleBlock(response_example) {
  let html = "";

  if (response_example?.last_response?.data) {
    html = `
              <div>
                <h4 class="example-header">Response Example</h4>

                <h5 class="example-subtitle">Response</h5>
                <pre class="code-block-response">
${response_example?.last_response?.data}
                </pre
                >
              </div>`;
  }

  return html;
}

function createEndpointSection(appname, endpoint) {
  let html = `<div class="endpoint-container">
          <details open>
            <summary>
${endpoint_label(
  endpoint.method,
  endpoint,
  `/${appname}${endpoint.resource}/${endpoint.environment}`,
  endpoint.mcp.enabled
)}
              <svg
                class="chevron"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <div class="endpoint-details">
              <div class="config-grid">
                <div class="config-section">
                  <h4 class="section-subtitle">Configuration</h4>
                  ${createItemConfigEndpoint("Creation", endpoint.createdAt)}
                  ${createItemConfigEndpoint("Last update", endpoint.updatedAt)}
                  ${createItemConfigEndpoint("Handler", endpoint.handler)}
                  ${createItemConfigEndpoint(
                    "Cache",
                    endpoint.cache_time + " seconds"
                  )}
                </div>

                <div class="config-section">
                  <h4 class="section-subtitle">MCP Tool</h4>
                   ${createItemConfigEndpoint(
                     "Enabled",
                     endpoint.mcp?.enabled ? "Yes" : "No"
                   )}
                   ${createItemConfigEndpoint("Name", endpoint.mcp?.name)}
                     ${createItemConfigEndpoint("Title", endpoint.mcp?.title)}
                  <div style="margin-top: 0.5rem">
                    <span class="label">Description</span>
                    <div style="color: var(--muted); font-size: 0.95rem">
                        ${endpoint.mcp?.description}
                    </div>
                  </div>
                </div>
              </div>

              <div class="description-section" style="margin-bottom: 1rem">
                <h4 class="section-subtitle">Description</h4>
                <p>${endpoint.description}</p>
              </div>

              ${createEndpointJsonSchemaInput(endpoint?.json_schema)}

              <!-- New structured sections: Headers, Query, Body -->
              <div style="margin-top: 1rem">
                ${createBlockArrayKeyValue(
                  "Headers (key/value)",
                  endpoint.data_test.headers
                )}
                ${createBlockArrayKeyValue(
                  "Query (key/value)",
                  endpoint.data_test.query
                )} 
                ${createBlockRequestBody(endpoint.data_test.body)}
              </div>

                ${createResponseExampleBlock(
                  endpoint?.data_test
                )}
            </div>
          </details>
        </div>
`;
  return html;
}

function endpoint_label(method, endpoint, url, mcp_enabled) {
  let html = ` <div class="endpoint-header-content">
                <span class="method-badge">${method}</span>
                <code class="endpoint-url">${url}</code>
                <span class="status-badge ${
                  endpoint.enabled ? "enabled" : "disabled"
                }">${endpoint.enabled ? "Enabled" : "Disabled"}</span>
                <span class="status-badge ${
                  endpoint.access == 0 ? "public" : "bearer"
                }">${endpoint.access == 0 ? "Public" : "Private"}</span>
${mcp_enabled ? `<span class="status-badge mcp">MCP Tool</span>` : ``}
              </div>`;
  return html;
}

export const generateDocumentation = (
  app,
  serverVersion,
  endpoints_to_document
) => {
  const headerHtml = createHeader(app, serverVersion);
  let appEndpoints = app.endpoints;
  if (
    Array.isArray(endpoints_to_document) &&
    endpoints_to_document.length > 0
  ) {
    appEndpoints = app.endpoints.filter((endpoint) => {
      return endpoints_to_document.includes(endpoint.idendpoint);
    });
  }

  const endpointsHtml = appEndpoints
    .map((item) => {
      return createEndpointSection(app.app, item);
    })
    .join("\n");
  const documentHtml = createHtmlDocument(headerHtml, endpointsHtml);
  return documentHtml;
};
