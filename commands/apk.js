import axios from 'axios';

export default {
  name: 'apk',
  alias: ['mod', 'app'],
  category: 'social',
  description: 'Search APK/mod apps',
  usage: '.apk <app name>',
  cooldown: 10,
  heavy: true,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const query = text || args.join(' ').trim();
    if (!query) return await sock.sendMessage(chat, { text: '❌ Search for: .apk spotify' }, { quoted: m });

    await sock.sendMessage(chat, { text: '🔍 Searching APKs...' }, { quoted: m });

    try {
      const response = await axios.get(`https://api.etechofc.com/apk?query=${encodeURIComponent(query)}`, { timeout: 30000 });
      const data = response.data;
      if (!data?.results?.length) throw new Error('No apps found');

      const result = data.results[0];
      const cap = `📱 *${result.name}*\n\n*Version:* ${result.version}\n*Size:* ${result.size}\n*Mod:* ${result.modInfo || 'N/A'}\n\n> ${settings.footer}`;

      await sock.sendMessage(chat, {
        image: { url: result.icon },
        caption: cap,
        buttons: [{ buttonId: `apk_dl_${result.id}`, buttonText: { displayText: '⬇️ Download' }, type: 1 }],
        headerType: 4
      }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ Failed to search APKs.' }, { quoted: m });
    }
  }
};
