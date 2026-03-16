import { setCacheReply, replyException } from "./utils.js";

export const textFunction = async (
  /** @type {{ request: { method?: any; headers: any; body: any; query: any; }; reply: { code: (arg0: number) => { (): any; new (): any; send: { (arg0: { error: any; }): void; new (): any; }; type: { (arg0: string): { (): any; new (): any; header: { (arg0: string, arg1: string): { (): any; new (): any; send: { (arg0: any): void; new (): any; }; }; }; }; }; }; }; endpoint: { handler?: string; code: any; custom_data?: any; }; }} */ context
) => {
  const request = context.request;
  const reply = context.reply;
  const endpoint = context.endpoint;

  try {

  const textConfig = typeof endpoint.custom_data === "string"
      ? JSON.parse(endpoint.custom_data)
      : endpoint.custom_data;
    /*
    let textConfig;
    try {
      textConfig = JSON.parse(method.code);
    } catch (e) {
      response.code(400).send({ error: "Invalid JSON in input code" });
      return;
    }
    */

    let mimeType = "text/plain";

    if (textConfig.mimeType) {
      mimeType =
        textConfig.mimeType.length > 0 ? textConfig.mimeType : "text/plain";
    }

    //  console.log("\n\n", mimeType, getExtensionFromMimeType(mimeType));

    let filename = Date.now() + "." + getExtensionFromMimeType(mimeType);

    if (!endpoint.code) {
      reply.code(400).send({ error: "No payload provided" });
      return;
    }

    setCacheReply(reply, endpoint.code);

    reply
      .code(200)
      .type(mimeType)
      .header("Content-Disposition", `attachment; filename="${filename}"`)
      .send(endpoint.code);
  } catch (error) {
    replyException(request, reply, error);
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
