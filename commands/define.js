import axios from 'axios';

export default {
  name: 'define',
  alias: ['dictionary', 'meaning'],
  category: 'education',
  description: 'Get word definition',
  usage: '.define <word>',
  cooldown: 5,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const word = text || args.join(' ').trim();
    if (!word) return await sock.sendMessage(chat, { text: '❌ Define: .define hello' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 10000 });
      const data = response.data[0];
      const meanings = data.meanings.map(m => `*${m.partOfSpeech}:* ${m.definitions[0].definition}`).join('\n');
      const cap = `📖 *${data.word}*\n\n${meanings}\n\n> ${settings.footer}`;
      await sock.sendMessage(chat, { text: cap }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Word not found or API error.' }, { quoted: m });
    }
  }
};
