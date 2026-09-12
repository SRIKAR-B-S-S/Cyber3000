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
  await respond({ 
    response_type: "in_channel",
    text: `Pong!\nLatency: ${latency}ms` 
  });
});

/* Added the -advice command below! */
app.command("/cyber3000-advice", async ({ ack, respond}) => {
await ack();

 try{
    console.log("sent an advice! :)");
   const response = await axios.get("https://api.adviceslip.com/advice");
        await respond({
          response_type: "in_channel",
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
      response_type: "in_channel",
      text: `\`\`\` ${keyword.toUpperCase()} \`\`\`\n${seekResult.text}`
    });
});

/* Added the -nostalgia command which fetches a random nostalgic memory from the 1990s-2010s era */

app.command('/cyber3000-nostalgia', async ({ ack, respond }) => {
  await ack();
try {
    const res = await axios.get('https://raw.githubusercontent.com/SRIKAR-B-S-S/Cyber3000/main/API/nostalgia.json');
    const items = res.data;
    const randomItem = items[Math.floor(Math.random() * items.length)];

    await respond({
      response_type: "in_channel",
      text: `*Nostalgia Vault*: \n> "${randomItem.fact}"\n\n_*Era:* ${randomItem.era}_`
    });
  } catch (err) {
    await respond({ text: "Failed fetch data from the Nostalgia Vault ;(" });
        console.error("Error fetching data: ", err.message);
  }
});

/* Added the -y2ktech command below which drops info about some cool tech from the 2000s Era! */

app.command('/cyber3000-y2ktech', async ({ ack, respond }) => {
  await ack();
try {
    const res = await axios.get('https://raw.githubusercontent.com/SRIKAR-B-S-S/Cyber3000/main/API/y2ktech.json');
    const techList = res.data;
    const device = techList[Math.floor(Math.random() * techList.length)];

    await respond({
      response_type: "in_channel",
      text: `*${device.name}* [${device.year}]\n> \`\`\`${device.details} \`\`\`\n\n`
    });
  } catch (err) {
    await respond({ text: "Failed fetch data from the Tech Archive ;(" });
        console.error("Error fetching data: ", err.message);
  }
});

/* I have used 'require(relative-path-of-my-local-json-file)' in place of 'await axios.get(url-for-json-file-online)' when defining res variable as I was running my bot locally and axios can't be used to parse local JSON files */
/* require() is an inbuilt NodeJS function used import files so I have used it in place of axios, thanks to google for suggesting me this :) */
/* Also note that you have to remove the '.data' after 'res' when defining the techList or items variable as it will cause issues for the parsing the local JSON files */

/* Added the -ascii command below!! It converts the given text into ASCII Art which was really popular in the 80s and 90s*/

app.command('/cyber3000-ascii', async ({ command, ack, respond}) => {
await ack();

const text = command.text.trim();

  if (!text) {
      await respond({
        text: "Please provide some text to be converted info ASCII Art. Usage: /cyber3000-ascii <keyword>"
      });
      return;
  }

const ASCIIart = await axios.get(`https://asciified.thelicato.io/api/v2/ascii?text=${encodeURIComponent(text)}`);

      await respond({
        response_type: "in_channel",
        text: `\`\`\`\n${ASCIIart.data}\n\`\`\``
      });
});


/* Added the help command here! It displays an image from my Github Repo which has a list on all my bot's commands */

app.command('/cyber3000-help', async ({ ack, respond}) => {
await ack();

   await respond({
    response_type: "in_channel",
    text: "Cyber3000 Bot Help Documentation",
    blocks: [
      {
          type: "image",
          title: {
            type: "plain_text",
            text: "Help Guide",
          },
          image_url: "https://raw.githubusercontent.com/SRIKAR-B-S-S/Cyber3000/main/assets/help.png",
          alt_text:"Cyber3000 Bot Help Guide"
      }
    ]
    });

});


(async () => {
  await app.start();
  console.log("bot is running!");
})();