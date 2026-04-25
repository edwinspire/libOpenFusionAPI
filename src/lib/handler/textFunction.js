import { Buffer } from "node:buffer";
import {
  getHandlerExecutionContext,
  replyException,
  sendHandlerResponse,
} from "./utils.js";

export const textFunction = async (
  /** @type {{ request: { method?: any; headers: any; body: any; query: any; }; reply: { code: (arg0: number) => { (): any; new (): any; send: { (arg0: { error: any; }): void; new (): any; }; type: { (arg0: string): { (): any; new (): any; header: { (arg0: string, arg1: string): { (): any; new (): any; send: { (arg0: any): void; new (): any; }; }; }; }; }; }; }; endpoint: { handler?: string; code: any; custom_data?: any; }; }} */ context
) => {
  const { request, reply, endpoint } = getHandlerExecutionContext(context);

  try {
    const textConfig =
      typeof endpoint.custom_data === "string"
        ? JSON.parse(endpoint.custom_data)
        : endpoint.custom_data && typeof endpoint.custom_data === "object"
          ? endpoint.custom_data
          : {};

    const mimeType =
      typeof textConfig.mimeType === "string" && textConfig.mimeType.length > 0
        ? textConfig.mimeType
        : "text/plain";

    const payload = typeof endpoint.code === "string" ? endpoint.code : undefined;

    if (payload === undefined) {
      reply.code(400).send({ error: "No payload provided" });
      return;
    }

    let finalPayload = payload;
    if (textConfig.isBase64) {
      finalPayload = Buffer.from(payload, "base64");
    }

    const responseOptions = {
      statusCode: 200,
      data: finalPayload,
      contentType: mimeType,
    };

    if (typeof textConfig.fileName === "string" && textConfig.fileName.length > 0) {
      responseOptions.headers = {
        "Content-Disposition": `attachment; filename="${textConfig.fileName}"`,
      };
    }

    sendHandlerResponse(reply, responseOptions);
  } catch (error) {
    replyException(request, reply, error);
  }
};
