import { Handler } from "./models.js";

export const getAllHandlers = async () => {
  try {
    //const apps = await Application.findAll({ attributes: ["idapp", "app"] });
    const datas = await Handler.findAll();
    return datas;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

export const defaultHandlers = () => {
  try {
    console.log(" defaultHandlers >>>>>> ");

    let handlers = [
      { id: "NA", text: `NOAPPLY`, description:  'Not apply' },
      { id: "FETCH", text: `FETCH`, description:  'Make fetch requests. It works like a proxy.'},
      { id: "JS", text: `JAVASCRIPT`, description:  'Run basic Javascript code.' },
      { id: "SOAP", text: `SOAP`, description:  'Useful for consuming SOAP services.' },
      { id: "TEXT", text: `TEXT`, description:  'Useful for consuming only plain text.' },
      { id: "SQL", text: `SQL`, description:  'Make SQL queries to different databases.' },
      { id: "HANNA", text: `HANNA`, description:  'Make SQL queries to SAP HANNA databases.' },
      { id: "FUNCTION", text: `FUNCTION`, description:  'Calls custom functions written on the server.' }
    ];

    handlers.forEach(async (h) => {
      try {
        await Handler.upsert({
          handler: h.id,
          label: h.text,
          description: h.description,
        });
      } catch (error) {
        console.log(error);
      }
    });
    return;
  } catch (error) {
    console.error("Example error:", error);
    return;
  }
};
