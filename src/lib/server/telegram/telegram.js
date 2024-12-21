import { Telegraf, Markup, session, Scenes } from "telegraf";
//import { message } from "telegraf/filters";
import { EventEmitter } from "events";

export class TelegramBot extends EventEmitter {
  constructor() {
    super();

    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    } else {
      console.warn("Not set process.env.TELEGRAM_BOT_TOKEN");
    }
  }

  async launch() {
    if (this.bot) {
      this.bot.use(session());

      //
      this.bot.command("getidgroup", (ctx, next) => {
        console.log(">>>>> 0 >>> ", ctx.chat, ctx.message);
        ctx.reply(
          "The id of this group is: " +
            ctx.chat.id +
            ". Topic: " +
            ctx.message.message_thread_id
        );
      });

      /*
    this.bot.command("add_group", (ctx, next) => {
      console.log(">>>>> 0 >>> ", ctx.update.update_id, ctx);
      ctx.reply("Hello! Welcome to the information collection wizard.");

      ctx.session = ctx.session || {};

      ctx.session.wizard = ctx.session.wizard || {};

      ctx.session.wizard.step = 1; // Iniciar el wizard
      ctx.session.wizard.process = "add_group";
      next();
    });
*/

      /*
    this.bot.use(async (ctx, next) => {
      if (
        ctx.session &&
        ctx.session.wizard &&
        ctx.session.wizard.process &&
        ctx.session.wizard.step
      ) {
        switch (ctx.session.wizard.process) {
          case "add_group":
            this._wizardAddGroup(ctx, next);
            break;
          case "register_device":
            this._wizardRegisterDevice(ctx, next);
            break;
          default:
            break;
        }
      }

      await next();
    });
    */

      /*
    this.bot.start((ctx) => ctx.reply("Welcome"));
    this.bot.help((ctx) => ctx.reply("Send me a sticker"));
    this.bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
    this.bot.hears("hi", (ctx) => ctx.reply("Hey there"));
    */

      await this.bot.launch();
    } else {
      console.warn("Not Telegram Bot");
    }
  }

  /*
  async _wizardAddGroup(ctx, next) {
    switch (ctx.session.wizard.step) {
      case 1:
        ctx.reply("Por favor, ingrese la geolocalización del grupo: ");
        ctx.session.wizard.step++;
        break;
      case 2:
        ctx.session.wizard.geo = ctx.update.message.location;
        console.log(">>>> ctx.update.message.location", ctx.session.wizard.geo);
        if (ctx.session.wizard.geo) {
          ctx.reply(
            `¡Gracias!\nLos datos ingresados para el grupo ${ctx.update.message.chat.title} son:\nLatitude: ${ctx.session.wizard.geo.latitude}\nLongitude: ${ctx.session.wizard.geo.longitude}\n\nDesea registrar el grupo? (si/no)`
          );
        } else {
          ctx.reply(
            `No ingresó la ubicación del grupo.\nDesea registrar el grupo? (si/no)`
          );
        }
        ctx.session.wizard.step++;
        break;
      case 3:
        if (ctx.message.text && ctx.message.text.toUpperCase() == "SI") {
          ctx.reply(
            `¡Gracias!\nUn momento por favor, se está procesando la solicitud...`
          );
          try {
            let data = {
              idtg: TelegrafOCS.getUUIDGroup(ctx.update.message.chat.id),
              group: ctx.update.message.chat.id,
              name: ctx.update.message.chat.title,
              enable: true,
              latitude: ctx.session.wizard.geo.latitude,
              longitude: ctx.session.wizard.geo.longitude,
            };

            let resp = await fetchOCSPost(OCS_URL_TELEGRAM_GROUPS, data);
            let data_resp = await resp.json();
            console.log("Data registro ", data, data_resp);
            if (data_resp && data_resp.idtg) {
              ctx.reply(
                data_resp.name +
                  " se encuentra registrado. ID: " +
                  data_resp.idtg
              );
            } else {
              ctx.reply("No se pudo registrar en este momento.");
            }
          } catch (error) {
            console.log(error);
            ctx.reply("Ocurrió un error, no se pudo registrar");
          }
        } else {
          ctx.reply(`¡Gracias!\nSe ha cancelado la solicitud`);
        }

        ctx.session.wizard = {}; // Reiniciar el wizard

        break;
    }
  }
*/

  // Función para enviar el mensaje
  async sendMessage(
    chatId,
    message,
    extra = { parse_mode: "MarkdownV2", message_thread_id: undefined }
  ) {
    //console.log("Mensaje enviado con éxito");
    if (this.bot) {
      return await this.bot.telegram.sendMessage(chatId, message, extra);
    } else {
      throw new Error("Telegram Bot no started.");
    }
  }
}
