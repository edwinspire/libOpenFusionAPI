# TELEGRAM BOT Handler

The **TELEGRAM_BOT handler** is used to store and execute **JavaScript bot code** powered by **grammY**.

Its main purpose is **not** to return business data through HTTP. Instead, the endpoint acts as a persisted bot definition: the server reads the endpoint configuration, starts a worker, creates a Telegram bot instance, executes the saved code, and keeps the bot running in the background.

---

<details>
<summary>🧠 How It Works</summary>

When an endpoint uses the **TELEGRAM_BOT** handler:
1.  The endpoint record stores the bot source code in `code`.
2.  The bot token is read from `custom_data.token`.
3.  The background bot lifecycle task scans enabled `TELEGRAM_BOT` endpoints.
4.  For each enabled endpoint, the server starts a worker thread.
5.  Inside that worker, OpenFusionAPI creates `const $BOT = new grammy.Bot($BOT_TOKEN);` automatically.
6.  Your saved JavaScript runs inside a sandbox and registers commands, handlers, middleware, menus, callbacks, or any other grammY logic against `$BOT`.
7.  If the code initializes correctly, the server starts `$BOT` automatically and keeps it alive until the endpoint or app is disabled.

Important runtime nuance:
- The HTTP endpoint returning `200` does not prove the bot started successfully.
- The real startup happens later in the bot lifecycle worker.
- A bot can acknowledge the HTTP request and still fail during `getMe`, `deleteWebhook`, or worker startup.

</details>

---

<details>
<summary>⚙️ Endpoint Configuration</summary>

### `code`
The `code` field must contain **JavaScript source** that configures the already-created `$BOT` instance.

You do **not** need to instantiate the bot yourself with `new Bot(...)`; the runtime does that for you.
You also do **not** need to call `$BOT.start()` manually; the runtime starts the bot after evaluating the code.

Available runtime variables include:
- `$BOT`: an instance of **grammY** `Bot`
- `$BOT_TOKEN`: the Telegram token loaded from `custom_data.token`
- helper symbols exposed by `functionsVars(...)`
- application variables for the current environment

### `custom_data`
Expected shape:

```json
{
  "token": "123456:telegram-bot-token"
}
```

If the token is missing or invalid, the worker cannot start the bot correctly.

Additional runtime constraints:
- The sandbox initialization has a 10 second timeout for loading the script.
- That timeout applies only to the initial evaluation step, not to the bot lifetime after it starts.
- The endpoint is started only when both the application and the endpoint are enabled.

</details>

---

<details>
<summary>✍️ Code Contract</summary>

The code should register handlers on `$BOT`, for example:

```javascript
$BOT.command("start", async (ctx) => {
  await ctx.reply("Hola desde OpenFusionAPI + grammY");
});

$BOT.on("message:text", async (ctx) => {
  await ctx.reply(`Recibido: ${ctx.message.text}`);
});
```

Recommended rules:
- Use `$BOT` directly; do not redeclare it.
- Put grammY setup logic in `code`.
- Do not call `$BOT.start()` manually; the runtime starts the bot after loading the script.
- Treat the HTTP endpoint as a persisted bot definition, not as a REST response endpoint.
- Avoid long synchronous initialization blocks; the worker VM enforces a startup timeout.
- Prefer using app vars for chat IDs, URLs, and environment-specific values instead of hardcoding them.

</details>

---

<details>
<summary>📎 Example</summary>

The demo application includes a more realistic example at:

`/api/demo/bot/qa`

That endpoint stores grammY code such as:
- `/start` command registration
- inline keyboard buttons
- callback query handlers
- automatic runtime startup after handler registration

For reusable snippets, see [examples.md](./examples.md).

</details>

---

<details>
<summary>📥 HTTP Response Behavior</summary>

The current HTTP handler path still returns a minimal `200` acknowledgement body, commonly `null` in the current runtime implementation.

That HTTP response is **not** the primary output of the handler. The real effect is that the bot code is loaded and executed by the bot manager in the background.

For validation, treat the HTTP response and the bot lifecycle as two separate checks:
- HTTP check: confirms the endpoint route exists and the handler accepted the request.
- Worker check: confirms the bot actually initialized and remained running.

</details>

---

<details>
<summary>🛠️ Troubleshooting</summary>

Common failure patterns:

- `200` from HTTP route but no running bot:
  The request was accepted, but the worker failed later during startup. Check server logs.

- `401 Unauthorized` from grammY startup:
  `custom_data.token` is invalid, revoked, or belongs to another bot.

- `404 Not Found` from `getMe` or `deleteWebhook`:
  The token format may look valid but Telegram does not recognize that bot.

- `Code did not define a valid $BOT instance.`:
  The worker/runtime contract is broken or the injected bot instance was not exposed correctly.

- Endpoint becomes disabled unexpectedly:
  The bot manager auto-disables a bot after repeated startup failures to avoid wasting resources.

Recommended debugging order:
1.  Verify `custom_data.token` with Telegram `getMe`.
2.  Confirm the endpoint and application are both enabled.
3.  Check server logs for worker startup errors.
4.  Confirm the seeded metadata for the app does not overwrite your changes on restart.

</details>

---

<details>
<summary>🤖 Agent Notes</summary>

These notes are especially important for AI agents modifying TELEGRAM_BOT endpoints:

- Updating the live endpoint only may not be enough in this repository.
- The server boot process restores default applications on startup.
- If the endpoint belongs to a seeded app such as `demo`, changes should also be synchronized in the corresponding default app file.
- Otherwise, the next restart can restore the previous token, enabled flag, or code.

Operational implications:
- A bot can be auto-disabled after repeated failures, so agents should re-check `enabled` after validation.
- A successful `endpoint_upsert` does not guarantee that a later restart will preserve the same state if the seed definition still differs.
- When validating a TELEGRAM_BOT change, inspect both metadata and startup logs.

</details>

---

© 2025 – OpenFusionAPI · Created and maintained by **edwinspire**
