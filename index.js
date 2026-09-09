const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/cyber3000-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

/* Added the -advice command below! */
app.command("/cyber3000-advice", async ({ ack, respond}) => {
await ack();

 try{
    console.log("sent an advice! :)");
   const response = await axios.get("https://api.adviceslip.com/advice");
        await respond({
            text:`${response.data.slip.advice}`});
    }
 catch(err) {
    await respond({ text: "Failed to fetch an advice.."});
 }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();