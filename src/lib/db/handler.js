import { Handler } from "./models.js";

export const getAllHandlers = async () => {
  try {
    //const apps = await Application.findAll({ attributes: ["idapp", "app"] });
    const datas = await Handler.findAll({
      order: [["label", "ASC"]], // ASC para ascendente, DESC para descendente
    });
    return datas;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

export const defaultHandlers = () => {
  try {
  //  console.log(" defaultHandlers >>>>>> ");

    let handlers = [
      {
        id: "NA",
        text: `NOAPPLY`,
        description: "Not apply",
        icon_class: "",
        color_class: "",
      },
      {
        id: "FETCH",
        text: `FETCH`,
        description: "Make fetch requests. It works like a proxy.",
        icon_class: "fa-solid fa-globe",
        color_class: "primary",
      },
      {
        id: "JS",
        text: `JAVASCRIPT`,
        description: "Run basic Javascript code.",
        icon_class: "fa-brands fa-js",
        color_class: "success",
      },
      {
        id: "SOAP",
        text: `SOAP`,
        description: "Useful for consuming SOAP services.",
        icon_class: "fa-solid fa-soap",
        color_class: "info",
      },
      {
        id: "TEXT",
        text: `TEXT`,
        description: "Useful for consuming only plain text.",
        icon_class: "fa-regular fa-file-lines",
        color_class: "warning",
      },
      {
        id: "SQL",
        text: `SQL`,
        description: "Make SQL queries to different databases.",
        icon_class: "fa-solid fa-database",
        color_class: "link",
      },
      {
        id: "SQL_BULK_I",
        text: `SQL INSERT BULK`,
        description: "Make BULK INSERT",
        icon_class: "fa-solid fa-database",
        color_class: "danger",
      },
      {
        id: "HANA",
        text: `HANA`,
        description: "Make SQL queries to SAP HANA databases.",
        icon_class: "fa-solid fa-database",
        color_class: "",
      },
      {
        id: "FUNCTION",
        text: `FUNCTION`,
        description: "Calls custom functions written on the server.",
        icon_class: "fa-solid fa-robot",
        color_class: "danger",
      },
      {
        id: "MONGODB",
        text: `MONGODB`,
        description: "Connect with MongoDB",
        icon_class: "fa-solid fa-database",
        color_class: "",
      },
      {
        id: "MCP",
        text: `MCP`,
        description: "Create an mcp server for the application.",
        icon_class: " fa-solid fa-brain ",
        color_class: "danger",
      },
      {
        id: "AGENT_IA",
        text: `AGENT IA`,
        description: "Implement a basic AI agent",
        icon_class: "fa-solid fa-database",
        color_class: "",
      },
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
