# TELEGRAM_BOT Examples

These examples assume the OpenFusionAPI runtime has already created:

- `$BOT`: a `grammy.Bot` instance
- `$BOT_TOKEN`: the token loaded from `custom_data.token`

Do not create `new Bot(...)` yourself unless the runtime contract changes.
Do not call `$BOT.start()` manually; the runtime starts the bot after evaluating the endpoint code.

## Minimal Bot

```javascript
$BOT.command("start", async (ctx) => {
  await ctx.reply("Bot activo desde OpenFusionAPI");
});
```

Use this pattern when you only need a simple command and want the endpoint to behave as a persisted bot definition.

## Echo Messages

```javascript
$BOT.on("message:text", async (ctx) => {
  await ctx.reply(`Recibido: ${ctx.message.text}`);
});
```

This is useful as a smoke test to confirm the token is valid and the bot is processing updates correctly.

## Inline Buttons

```javascript
$BOT.command("start", async (ctx) => {
  await ctx.reply("¿Deseas continuar?", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Aceptar", callback_data: "accept" },
          { text: "Cancelar", callback_data: "cancel" }
        ]
      ]
    }
  });
});

$BOT.on("callback_query:data", async (ctx) => {
  const action = ctx.callbackQuery.data;

  if (action === "accept") {
    await ctx.answerCallbackQuery({ text: "Aceptado" });
    await ctx.editMessageText("Operacion confirmada");
    return;
  }

  if (action === "cancel") {
    await ctx.answerCallbackQuery({ text: "Cancelado" });
    await ctx.editMessageText("Operacion cancelada");
  }
});
```

This is the same style used by the demo endpoint `/api/demo/bot/qa`.

## Using Application Variables

```javascript
const allowedChatId = $_VAR_ALLOWED_CHAT_ID;

$BOT.on("message:text", async (ctx) => {
  if (String(ctx.chat.id) !== String(allowedChatId)) {
    await ctx.reply("No autorizado");
    return;
  }

  await ctx.reply("Acceso permitido");
});
```

Use app variables for environment-specific identifiers, feature flags, URLs, or secrets that should not be hardcoded into the bot source.

## Calling Internal OpenFusionAPI Endpoints

```javascript
$BOT.command("status", async (ctx) => {
  const uF = uFetchAutoEnv.auto("/api/system/api/apps-list/auto", true);
  const response = await uF.get();
  const data = await response.json();

  await ctx.reply(`Aplicaciones detectadas: ${Array.isArray(data) ? data.length : 0}`);
});
```

This pattern is useful when the bot should orchestrate other internal endpoints from the same OpenFusionAPI instance.

## Token Storage

Recommended `custom_data` shape:

```json
{
  "token": "123456789:telegram-bot-token"
}
```

The runtime reads `custom_data.token` and injects it as `$BOT_TOKEN` before evaluating the bot source.

## Notes

- The HTTP response of a `TELEGRAM_BOT` endpoint is not the primary result of this handler.
- The important side effect is that the bot manager loads the endpoint and starts the bot worker.
- Keep the code focused on grammY registration.
- Do not end the script with `$BOT.start()`; startup is handled by the runtime.
- If you are validating a bot change, check server logs in addition to the HTTP response.
- In this repository, seeded apps can restore endpoint definitions on restart, so persistent bot changes may also require updating the corresponding default app file.
- Repeated startup failures can auto-disable the endpoint, so confirm `enabled` after testing.