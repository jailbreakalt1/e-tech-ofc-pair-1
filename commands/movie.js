import axios from 'axios';

export default {
  name: 'movie',
  alias: ['film', 'cinema'],
  category: 'social',
  description: 'Search movie info',
  usage: '.movie <title>',
  cooldown: 10,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const query = text || args.join(' ').trim();
    if (!query) return await sock.sendMessage(chat, { text: '❌ Search for: .movie Inception' }, { quoted: m });

    await sock.sendMessage(chat, { text: '🔍 Searching movie...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/movie?query=${encodeURIComponent(query)}`, { timeout: 30000 });
      const data = response.data;
      if (!data?.results?.length) throw new Error('No movie found');

      const m = data.results[0];
      const cap = `🎬 *${m.title}* (${m.year})\n\n*Rating:* ${m.rating}/10\n*Genre:* ${m.genre?.join(', ')}\n*Plot:* ${m.plot?.substring(0, 300)}...\n\n> ${settings.footer}`;

      await sock.sendMessage(chat, {
        image: { url: m.poster },
        caption: cap
      }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to search movie.' }, { quoted: m });
    }
  }
};
