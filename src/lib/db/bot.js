import { Endpoint } from "./models.js";

// READ
export const getBotById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idendpoint,
) => {
  try {
    const bot = await Endpoint.findByPk(idendpoint);
    return bot;
  } catch (error) {
    console.error("Error retrieving endpoint:", error);
    throw error;
  }
};

export const getAllBots = async () => {
  try {
    const bots = await Endpoint.findAll({
      where: {
        handler: "TELEGRAM_BOT",
      },
    });

    let data_bots = [];

    if (Array.isArray(bots)) {
      data_bots = bots.map((bot) => {
        let result = {};
        result.idbot = bot.idendpoint;
        result.name = bot.title;
        result.description = bot.description;
        result.enabled = bot.enabled;
        result.code = bot.code;
        result.token = bot.custom_data?.token || "";
        result.environment = bot.environment || "dev";
        return result;
      });
    }

    return data_bots;
  } catch (error) {
    console.error("Error retrieving bots:", error);
    throw error;
  }
};

//
