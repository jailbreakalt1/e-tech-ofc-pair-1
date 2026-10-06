export default {
  name: 'toimg',
  alias: ['toimage', 'img'],
  category: 'tools',
  description: 'Convert sticker to image',
  usage: '.toimg (reply to sticker)',
  cooldown: 5,
  execute: async ({ sock, m, settings, chat }) => {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.stickerMessage) {
      return await sock.sendMessage(chat, { text: '❌ Reply to a sticker with .toimg' }, { quoted: m });
    }

    try {
      const media = await sock.downloadAndSaveMediaMessage(quoted);
      await sock.sendMessage(chat, { image: fs.readFileSync(media), caption: '> ' + settings.footer }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
