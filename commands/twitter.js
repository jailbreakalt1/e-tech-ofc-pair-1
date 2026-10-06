import axios from 'axios';

export default {
  name: 'twitter',
  alias: ['x', 'tw', 'twit'],
  category: 'social',
  description: 'Download Twitter/X video',
  usage: '.twitter <url>',
  cooldown: 15,
  heavy: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0] || !args[0].includes('twitter.com') && !args[0].includes('x.com')) {
      return await sock.sendMessage(chat, { text: '❌ Provide a valid Twitter/X URL' }, { quoted: m });
    }

    await sock.sendMessage(chat, { text: '⬇️ Downloading...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/twdl?url=${encodeURIComponent(args[0])}`, { timeout: 60000 });
      const data = response.data;
      if (!data?.url) throw new Error('No video found');

      await sock.sendMessage(chat, { video: { url: data.url }, caption: `🐦 Twitter/X\n> ${settings.footer}` }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to download. May be private or unavailable.' }, { quoted: m });
    }
  }
};
