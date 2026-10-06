import { sanitizeFilename } from '../lib/utils.js';

export default {
  name: 'sticker',
  alias: ['stiker', 's'],
  category: 'tools',
  description: 'Convert image/video to sticker',
  usage: '.sticker (reply to image/video)',
  cooldown: 5,
  execute: async ({ sock, m, settings, chat }) => {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
      return await sock.sendMessage(chat, { text: '❌ Reply to an image or video with .sticker' }, { quoted: m });
    }

    try {
      const media = await sock.downloadAndSaveMediaMessage(quoted);
      await sock.sendMessage(chat, {
        sticker: fs.readFileSync(media),
        isAnimated: !!quoted.videoMessage
      }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
