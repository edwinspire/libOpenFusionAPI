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

      this.bot.on("callback_query", (query) => {
        const action = query.update.callback_query.data; // "confirmar" o "cancelar"
        const msgId = query.msgId;
        const chatId = query.chat.id;

        if (action === "confirmar") {
          bot.sendMessage(chatId, "¡Confirmado!");
        } else if (action === "cancelar") {
          bot.sendMessage(chatId, "Operación cancelada.");
        }

        // Opcionalmente puedes editar el mensaje original para no dejar botones viejos
        bot.editMessageReplyMarkup(
          { inline_keyboard: [] },
          { chat_id: chatId, message_id: msgId }
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
     this.bot.on('message', (ctx) => {
        ctx.reply("👍");
      });

      

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

  autoscape(message, parse_mode = "MarkdownV2", autoscape = false) {
    let msg = message;
    if (autoscape) {
      switch (parse_mode) {
        case "MarkdownV2":
          msg = this.escapeMarkdownV2(message);
          break;
        case "HTML":
          msg = this.escapeHTML(message);
          break;
      }
    }
    return msg;
  }

  async sendPhoto(
    chatId,
    url_photo,
    extra = {
      parse_mode: "MarkdownV2",
      message_thread_id: undefined,
      caption: undefined,
    },
    autoscape = false
  ) {
    if (this.bot) {
      if (extra.caption) {
        extra.caption = this.autoscape(
          extra.caption,
          extra.parse_mode,
          autoscape
        );
      }

      return await this.bot.telegram.sendPhoto(chatId, url_photo, extra);
    } else {
      throw new Error("Telegram Bot no started.");
    }
  }

  // Función para enviar el mensaje
  async sendMessage(
    chatId,
    message,
    extra = { parse_mode: "MarkdownV2", message_thread_id: undefined },
    autoscape = false
  ) {
    //console.log("Mensaje enviado con éxito");
    if (this.bot) {
      return await this.bot.telegram.sendMessage(
        chatId,
        this.autoscape(message, parse_mode, autoscape),
        extra
      );
    } else {
      throw new Error("Telegram Bot no started.");
    }
  }

  boldText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2bold(text);
        break;
      case "HTML":
        result = this.HTMLbold(text);
        break;
    }
    return result;
  }

  italicText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2italic(text);
        break;
      case "HTML":
        result = this.HTMLitalic(text);
        break;
    }
    return result;
  }

  underlineText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2underline(text);
        break;
      case "HTML":
        result = this.HTMLunderline(text);
        break;
    }
    return result;
  }

  strikethroughText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2strikethrough(text);
        break;
      case "HTML":
        result = this.HTMLstrikethrough(text);
        break;
    }
    return result;
  }

  strikethroughText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2strikethrough(text);
        break;
      case "HTML":
        result = this.HTMLstrikethrough(text);
        break;
    }
    return result;
  }

  spoilerText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2spoiler(text);
        break;
      case "HTML":
        result = this.HTMLspoiler(text);
        break;
    }
    return result;
  }

  inlineURLText(label, url, parse_mode = "MarkdownV2") {
    let result = label;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2inlineURL(label, url);
        break;
      case "HTML":
        result = this.HTMLinlineURL(label, url);
        break;
    }
    return result;
  }

  emogiText(label, idemogi, parse_mode = "MarkdownV2") {
    let result = label;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2emogi(label, idemogi);
        break;
      case "HTML":
        result = this.HTMLemogi(label, idemogi);
        break;
    }
    return result;
  }

  codeText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2preformatted(text);
        break;
      case "HTML":
        result = this.HTMLcode(text);
        break;
    }
    return result;
  }

  preformatedText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2preformatted(text);
        break;
      case "HTML":
        result = this.HTMLpreformatted(text);
        break;
    }
    return result;
  }

  blockText(text, parse_mode = "MarkdownV2") {
    let result = text;
    switch (parse_mode) {
      case "MarkdownV2":
        result = this.MDV2block(text);
        break;
      case "HTML":
        result = this.HTMLblock(text);
        break;
    }
    return result;
  }

  ////////////////////////////////////////////////////////////

  escapeMarkdownV2(message) {
    return message.replace(/([_*\[\]()~`>#+\-=|{}.!\\]|\n)/g, (match) =>
      match === "\n" ? "\\n" : "\\" + match
    );
  }

  MDV2bold(message) {
    return `*${this.escapeMarkdownV2(message)}*`;
  }

  MDV2italic(message) {
    return `_${this.escapeMarkdownV2(message)}_`;
  }

  MDV2underline(message) {
    return `__${this.escapeMarkdownV2(message)}__`;
  }

  MDV2strikethrough(message) {
    return `~${this.escapeMarkdownV2(message)}~`;
  }

  MDV2spoiler(message) {
    return `||${this.escapeMarkdownV2(message)}||`;
  }

  MDV2inlineURL(label, url) {
    return `[${this.escapeMarkdownV2(label)}](${this.escapeMarkdownV2(url)})`;
  }

  MDV2emogi(label, idemogi) {
    return `![${label}](tg://emoji?id=${idemogi})`;
  }

  MDV2preformatted(message) {
    return "```" + this.escapeMarkdownV2(message) + "```";
  }

  MDV2block(message) {
    return `>${this.escapeMarkdownV2(message)}`;
  }

  escapeHTML(input) {
    // Esta expresión busca:
    // - Todo lo que está dentro de <etiquetas>
    // - Todo lo que es una entidad válida (&...;)
    // - Todo lo demás
    return input.replace(
      /(<[^>]*>|&[^;\s]{1,10};)|[<>&]|\n/g,
      (match, captured) => {
        if (captured) {
          // Es una etiqueta o una entidad válida, no lo tocamos
          return captured;
        }
        switch (match) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case "&":
            return "&amp;";
          case "\n":
            return "\\n"; // Reemplazamos salto de línea por texto \n
          default:
            return match;
        }
      }
    );
  }

  HTMLbold(message) {
    return `<b>${this.escapeHTML(message)}</b>`;
  }

  HTMLitalic(message) {
    return `<i>${this.escapeHTML(message)}</i>`;
  }

  HTMLunderline(message) {
    return `<u>${this.escapeHTML(message)}</u>`;
  }

  HTMLstrikethrough(message) {
    return `<s>${this.escapeHTML(message)}</s>`;
  }

  HTMLspoiler(message) {
    return `<tg-spoiler>${this.escapeHTML(message)}</tg-spoiler>`;
  }

  HTMLinlineURL(label, url) {
    return `<a href=\"${this.escapeHTML(url)}\">${this.escapeHTML(label)}</a>`;
  }

  HTMLemogi(label, idemogi) {
    return `<tg-emoji emoji-id=\"${idemogi}\">${label}</tg-emoji >`;
  }

  HTMLcode(message) {
    return `<code>${message}</code>`;
  }

  HTMLpreformatted(message) {
    return `<pre>${message}</pre>`;
  }

  HTMLblock(message) {
    return `<blockquote>${this.escapeHTML(message)}</blockquote>`;
  }
}
