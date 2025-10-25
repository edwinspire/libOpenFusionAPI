import { setCacheReply } from "./utils.js";

export const textFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let textConfig = JSON.parse(method.code);

    let mimeType = "text/plain";

    if (textConfig.mimeType) {
      mimeType =
        textConfig.mimeType.length > 0 ? textConfig.mimeType : "text/plain";
    }

    //  console.log("\n\n", mimeType, getExtensionFromMimeType(mimeType));

    let filename = Date.now() + "." + getExtensionFromMimeType(mimeType);

    setCacheReply(response, textConfig.payload);

    response
      .code(200)
      .type(mimeType)
      .header("Content-Disposition", `attachment; filename="${filename}"`)
      .send(textConfig.payload);
  } catch (error) {
    //    console.log(error);
    setCacheReply(response, { error: error });
    // @ts-ignore
    response.code(500).send(error);
  }
};

function getExtensionFromMimeType(mimeType) {
  const mimeTypes = {
    "text/plain": "txt",
    "text/html": "html",
    "text/css": "css",
    "text/javascript": "js",
    "text/xml": "xml",
    "application/wsdl+xml": "wsdl",
    "text/csv": "csv",
    "text/markdown": "md",
    "text/cache-manifest": "appcache",
    "text/calendar": "ics",
    "text/vnd.sun.j2me.app-descriptor": "jad",
    "text/vnd.wap.wml": "wml",
    "text/vnd.wap.wmlscript": "wmls",
    "text/x-asm": "asm",
    "text/x-c": "c",
    "text/x-fortran": "f",
    "text/x-java-source": "java",
    "text/x-markdown": "md",
    "text/x-nfo": "nfo",
    "text/x-opml": "opml",
    "text/x-pascal": "p",
    "text/x-script": "script",
    "text/x-script.perl": "pl",
    "text/x-script.python": "py",
    "text/x-server-parsed-html": "shtml",
    "text/x-setext": "etx",
    "text/x-sfv": "sfv",
    "text/x-uuencode": "uu",
    "text/x-vcalendar": "vcs",
    "text/x-vcard": "vcf",
    "text/troff": "tr",
    "text/x-component": "htc",
  };

  return mimeTypes[mimeType] || "txt"; // Devuelve la extensión o null si no se encuentra
}
