import axios from 'axios';

export default {
  name: 'wikipedia',
  alias: ['wiki', 'wikip'],
  category: 'education',
  description: 'Search Wikipedia',
  usage: '.wikipedia <query>',
  cooldown: 5,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const query = text || args.join(' ').trim();
    if (!query) return await sock.sendMessage(chat, { text: '❌ Search: .wiki Albert Einstein' }, { quoted: m });

    try {
      const search = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`, { timeout: 10000 });
      const page = search.data.query.search[0];
      if (!page) throw new Error('Not found');

      const content = await axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(page.title)}&format=json`, { timeout: 10000 });
      const pages = content.data.query.pages;
      const extract = Object.values(pages)[0].extract;

      const cap = `📚 *${page.title}*\n\n${extract.substring(0, 1000)}...\n\n🔗 https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}\n\n> ${settings.footer}`;
      await sock.sendMessage(chat, { text: cap }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Wikipedia search failed.' }, { quoted: m });
    }
  }
};
