import server from "./lib/index.js";

const OFAPIServer = new server();

setTimeout(async () => {
  try {
   await OFAPIServer.listen();
  } catch (error) {
    console.log(error);

    // Enable graceful stop
  //  process.once("SIGINT", () => bot.stop("SIGINT"));
  //  process.once("SIGTERM", () => bot.stop("SIGTERM"));
  }
}, 5000);
