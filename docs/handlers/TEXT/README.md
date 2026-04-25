# TEXT Handler – Static Content Response

The **TEXT handler** allows OpenFusionAPI to serve static text content, such as configuration files, scripts, HTML snippets, or downloadable files, directly from the endpoint configuration. This handler can be used to expose text with a mimetype, but also for other types of files like a PDF converted to base64 or other files up to 1Mega. Optionally, add `custom_data.fileName` if it requires to be downloadable.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint is configured with the **TEXT** handler:
1.  It reads the raw text content from the `code` field.
2.  It reads MIME metadata from `custom_data`, typically `custom_data.mimeType`.
3.  If `custom_data.fileName` is provided, it serves the content with a `Content-Disposition: attachment` header, forcing the browser or client to download it as a file with that name. Otherwise, it is served inline.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

Current configuration:

-   `code`: **(Required)** Raw text content to return.
-   `custom_data.mimeType`: **(Required)** MIME type of the content (default: `text/plain`).
-   `custom_data.fileName`: **(Optional)** If provided, it will set the `Content-Disposition` header to download the file with this name.

**Example CSV endpoint**:
```json
{
  "code": "id,name,role\n1,Admin,SuperOFAPI\n2,User,Guest",
  "custom_data": {
    "mimeType": "text/csv"
  }
}
```

**Example HTML Snippet**:
```json
{
  "code": "<h1>Maintenance Mode</h1><p>We will be back shortly.</p>",
  "custom_data": {
    "mimeType": "text/html"
  }
}
```

Older backups that stored JSON inside `code` should be adapted by the migration parser during restore. Runtime execution no longer interprets JSON configuration stored inside `code`.

</details>

---

<details>
<summary>🌐 Supported MIME Types</summary>

The handler automatically maps MIME types to file extensions for the download filename. Supported types include:

-   `text/plain` → `.txt`
-   `text/html` → `.html`
-   `text/csv` → `.csv`
-   `text/xml` → `.xml`
-   `text/javascript` → `.js`
-   `text/css` → `.css`
-   `text/markdown` → `.md`
-   `application/wsdl+xml` → `.wsdl`
-   ...and many more common code and text formats.

</details>

---

<details>
<summary>📤 Example Requests</summary>

**Downloading a CSV**

If configured with the CSV example above:

```bash
curl -v https://your-server.com/api/static/data.csv
```

**Response Headers**:
```http
HTTP/1.1 200 OK
Content-Type: text/csv
Content-Disposition: attachment; filename="1715091234567.csv"
```

**Body**:
```csv
id,name,role
1,Admin,SuperOFAPI
2,User,Guest
```

</details>

---

<details>
<summary>📊 Capability Summary</summary>

| Feature | Supported |
|---|---:|
| Static content serving | ✅ |
| Custom MIME types | ✅ |
| Forced File Download | ✅ (Content-Disposition) |
| Caching | ✅ |
| Dynamic content | ❌ (Static only) |

</details>

---

<details>
<summary>💡 Typical Use Cases</summary>

-   **Configuration Files**: Serving static `config.json` or `.env` templates.
-   **Scripts**: Hosting install scripts (e.g., `install.sh` or `setup.ps1`).
-   **Mock Data**: Returning fixed responses for testing without a database.
-   **Documentation**: Serving static Markdown or WSDL files.
-   **Local WSDL Publishing**: Hosting a WSDL XML document so another SOAP endpoint can consume it from a stable local URL.
</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
