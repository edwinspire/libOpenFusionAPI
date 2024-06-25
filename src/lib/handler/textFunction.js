export const textFunction = async (
  /** @type {{ method?: any; headers: any; body: any; query: any; }} */ request,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
  /** @type {{ handler?: string; code: any; }} */ method
) => {
  try {
    let textConfig = JSON.parse(method.code);

    if (textConfig.mimeType) {
      let mimeType = textConfig.mimeType.length > 0 ? textConfig.mimeType : "text/plain"; 
      response.code(200).type(mimeType).send(textConfig.payload);
    } else {
      response.code(200).type("text/plain").send(textConfig.payload);
    }
  } catch (error) {
    //console.log(error);
    // @ts-ignore
    response.code(500).send(error);
  }
};
