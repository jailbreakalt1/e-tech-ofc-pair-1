import axios from 'axios';

export default {
  name: 'fb',
  alias: ['facebook', 'fbdl'],
  category: 'social',
  description: 'Download Facebook video',
  usage: '.fb <url>',
  cooldown: 15,
  heavy: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0] || !args[0].includes('facebook.com') && !args[0].includes('fb.watch')) {
      return await sock.sendMessage(chat, { text: '❌ Provide a valid Facebook URL' }, { quoted: m });
    }

    await sock.sendMessage(chat, { text: '⬇️ Downloading...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/fbdl?url=${encodeURIComponent(args[0])}`, { timeout: 60000 });
      const data = response.data;
      if (!data?.url) throw new Error('No video found');

      await sock.sendMessage(chat, {
        video: { url: data.url },
        caption: `📘 *Facebook Video*\n\n${data.title || ''}\n> ${settings.footer}`
      }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to download. Video may be private or unavailable.' }, { quoted: m });
    }
  }
};
