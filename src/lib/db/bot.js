import { Bot } from "./models.js";
import { createBotBackup } from "./bot_backup.js";

export const upsertBot = async (
  /** @type {import("sequelize").Optional<any, string>} */ data,
) => {
  try {
    const [result, created] = await Bot.upsert(data, { returning: true });
    
    try {
        await createBotBackup({ data: data, idbot: result.idbot });
      } catch (error) {
        console.error("Error creating bot backup:", error);
      }
    

    return { result, created };
  } catch (error) {
    console.error("Error retrieving:", error, data);
    throw error; // c4ca4238-a0b9-2382-0dcc-509a6f75849b
  }
};

// READ
export const getBotById = async (
  /** @type {import("sequelize").Identifier | undefined} */ idbot,
) => {
  try {
    const bot = await Bot.findByPk(idbot);
    return bot;
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
};

export const getAllBots = async () => {
  try {
    const bots = await Bot.findAll();
    return bots;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

// DELETE
export const deleteBot = async (
  /** @type {import("sequelize").Identifier | undefined} */ idbot,
) => {
  try {
    const bot = await Bot.findByPk(idbot);
    if (bot) {
      await bot.destroy();
      return true; // Deletion successful
    }
    return false; // User not found
  } catch (error) {
    console.error("Error deleting idendpoint:", error);
    throw error;
  }
};




