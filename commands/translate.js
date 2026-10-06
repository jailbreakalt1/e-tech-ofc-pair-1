import axios from 'axios';

export default {
  name: 'translate',
  alias: ['tr', 'trans'],
  category: 'education',
  description: 'Translate text',
  usage: '.translate <target_lang> <text>',
  cooldown: 5,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    if (args.length < 2) return await sock.sendMessage(chat, { text: '❌ Use: .translate en Hola mundo' }, { quoted: m });

    const targetLang = args[0];
    const sourceText = args.slice(1).join(' ');

    try {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`, { timeout: 10000 });
      const translated = response.data[0][0][0];
      await sock.sendMessage(chat, { text: `🌐 *Translated to ${targetLang.toUpperCase()}*\n\n${translated}\n\n> ${settings.footer}` }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Translation failed.' }, { quoted: m });
    }
  }
};
