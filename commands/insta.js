import axios from 'axios';

export default {
  name: 'insta',
  alias: ['ig', 'instagram', 'instadl'],
  category: 'social',
  description: 'Download Instagram media',
  usage: '.insta <url>',
  cooldown: 15,
  heavy: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0] || !args[0].includes('instagram.com')) {
      return await sock.sendMessage(chat, { text: '❌ Provide a valid Instagram URL' }, { quoted: m });
    }

    await sock.sendMessage(chat, { text: '⬇️ Downloading...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/igdl?url=${encodeURIComponent(args[0])}`, { timeout: 60000 });
      const data = response.data;
      if (!data?.url && !data?.images?.length) throw new Error('No media found');

      if (data.images?.length) {
        for (const img of data.images.slice(0, 5)) {
          await sock.sendMessage(chat, { image: { url: img }, caption: `📸 Instagram\n> ${settings.footer}` }, { quoted: m });
        }
      } else if (data.url) {
        await sock.sendMessage(chat, { video: { url: data.url }, caption: `📸 Instagram\n> ${settings.footer}` }, { quoted: m });
      }
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to download. May be private or unavailable.' }, { quoted: m });
    }
  }
};
