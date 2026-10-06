import axios from 'axios';

export default {
  name: 'tiktok',
  alias: ['tt', 'tiktokdl'],
  category: 'social',
  description: 'Download TikTok video',
  usage: '.tiktok <url>',
  cooldown: 15,
  heavy: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0] || !args[0].includes('tiktok.com')) {
      return await sock.sendMessage(chat, { text: '❌ Provide a valid TikTok URL' }, { quoted: m });
    }

    await sock.sendMessage(chat, { text: '⬇️ Downloading...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/ttdl?url=${encodeURIComponent(args[0])}`, { timeout: 60000 });
      const data = response.data;
      if (!data?.url) throw new Error('No video found');

      await sock.sendMessage(chat, {
        video: { url: data.url },
        caption: `🎵 *TikTok Video*\n\n${data.title || ''}\n> ${settings.footer}`
      }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to download. Video may be private or unavailable.' }, { quoted: m });
    }
  }
};
