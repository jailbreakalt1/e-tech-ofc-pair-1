import axios from 'axios';

export default {
  name: 'img',
  alias: ['image', 'google', 'pic'],
  category: 'social',
  description: 'Search Google Images',
  usage: '.img <query>',
  cooldown: 10,
  heavy: true,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const query = text || args.join(' ').trim();
    if (!query) return await sock.sendMessage(chat, { text: '❌ Search for: .img cat' }, { quoted: m });

    await sock.sendMessage(chat, { text: '🔍 Searching images...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/img?query=${encodeURIComponent(query)}`, { timeout: 30000 });
      const data = response.data;
      if (!data?.images?.length) throw new Error('No images found');

      for (const img of data.images.slice(0, 5)) {
        await sock.sendMessage(chat, { image: { url: img }, caption: `🖼️ ${query}\n> ${settings.footer}` }, { quoted: m });
        await new Promise(r => setTimeout(r, 500));
      }
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to search images.' }, { quoted: m });
    }
  }
};
