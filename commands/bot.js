import { generateId } from '../lib/utils.js';

export default {
  name: 'bot',
  alias: ['createbot', 'pairbot'],
  category: 'tools',
  description: 'Get pairing website link to create your own bot',
  usage: '.bot',
  cooldown: 10,
  execute: async ({ sock, m, settings, chat }) => {
    const pairId = generateId('ETC_');
    const pairingSite = settings.pairWebsite || 'https://etechofc.vercel.app';

    const text = `
╭───◐ E TECH OFC - CREATE YOUR BOT ◐───╮

Your Pair Request ID: *${pairId}*

To get your real WhatsApp Pair Code:

1️⃣ Go to: ${pairingSite}
2️⃣ Enter your WhatsApp number
3️⃣ Enter this ID: ${pairId}
4️⃣ You will get 8-digit Pair Code
5️⃣ Link device on WhatsApp > Linked Devices

Your bot will auto-follow:
${settings.channelLink}

╭─◐ Reply Number ◐─╮
│ 1️⃣ MAIN MENU
│ 2️⃣ TUTORIAL VIDEO
│ 3️⃣ CHANNEL
╰───◐

> ${settings.footer}
`;

    await sock.sendMessage(chat, {
      image: { url: settings.menuImage },
      caption: text,
      contextInfo: {
        externalAdReply: {
          title: 'E TECH OFC - Bot Pairing',
          body: `Your Pair ID: ${pairId} - Tap to get code`,
          thumbnailUrl: settings.menuImage,
          sourceUrl: pairingSite,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await sock.sendMessage(chat, {
      text: `🔗 Get Pair Code Here:\n${pairingSite}\nID: *${pairId}*`,
      contextInfo: { forwardingScore: 999, isForwarded: true }
    }, { quoted: m });
  }
};
