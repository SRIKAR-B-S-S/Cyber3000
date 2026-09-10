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

/* Added the function for -seek command here! - Uses DuckDuckGo JSON API(api.duckduckgo.com) to give a summary of the keyword entered.*/

async function getKeywordInfo(query) {
    try {
        const ddgURL = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
        const ddgRES = await axios.get(ddgURL);

const abstract = ddgRES.data.Abstract;

    if (abstract && abstract.length > 0) {
      return {
        text: abstract
      };
    } else {
      return { 
        text: `Failed to fetch the results :( \n Try shortening your keyword or searching for a specific topic.`
      };
    }
  } catch(error) {
    console.error("Error fetching data: ", error.message);
    return { 
      text: `Error: Failed to fetch the results :(`
    };
  }
}

/* Added the -seek command here which uses the above function to display the summary about the keyword!*/

app.command('/cyber3000-seek', async ({ command, ack, respond}) => {
    await ack();

    const keyword = command.text.trim();

    if (!keyword) {
        await respond({
            text: "Please provide a keyword! \n Usage `/cyber3000-seek <keyword>` (eg. /cyber3000-seek iPod Classic ) "
        });
        return;
    }

const seekResult = await getKeywordInfo(keyword);

    await respond({
        text: `\`\`\` ${keyword.toUpperCase()} \`\`\`\n${seekResult.text}`
    });
});



(async () => {
  await app.start();
  console.log("bot is running!");
})();