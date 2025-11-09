export default async function handler(req, res) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  if (req.method !== "POST") return res.status(200).send("OK");

  const update = req.body;
  const msg = update?.message;
  const chat_id = msg?.chat?.id;
  const text = msg?.text;

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

  // START command
  if (text === "/start") {
    await sendMessage(chat_id,
`👋 Welcome!

Click /create to get your personal verification link.`);
    return res.status(200).end();
  }

  // CREATE command
  if (text === "/create") {

    // ✅ Correct Domain here
    const baseUrl = "https://freeinternet-seven.vercel.app";

    // ✅ Auto attach chatid
    const link = `${baseUrl}/?chatid=${chat_id}`;

    await sendMessage(chat_id,
`🎯 Your Verification Link is Ready

🔗 <code>${link}</code>

Open the link and wait 5 seconds ✅`, {
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
