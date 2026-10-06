import ytSearch from 'yt-search';
import { sanitizeFilename } from '../lib/utils.js';

export default {
  name: 'video',
  alias: ['vid', 'v'],
  category: 'social',
  description: 'Download video from YouTube',
  usage: '.video <query>',
  cooldown: 10,
  heavy: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args.length) {
      return await sock.sendMessage(chat, { text: '❌ Use: .video <name>' }, { quoted: m });
    }

    const q = args.join(' ');
    await sock.sendMessage(chat, { text: '🔍 Searching...' }, { quoted: m });

    try {
      const search = await ytSearch(q);
      const video = search.videos[0];
      if (!video) {
        return await sock.sendMessage(chat, { text: '❌ Not found' }, { quoted: m });
      }

      const cap = `📹 *E TECH VIDEO DOWNLOADER*\n\n*Title:* ${video.title}\n*Duration:* ${video.timestamp}\n*Views:* ${video.views.toLocaleString()}\n\n> ${settings.footer}`;

      const btns = [
        { buttonId: `vid_${video.url}`, buttonText: { displayText: '📹 VIDEO' }, type: 1 },
        { buttonId: `viddoc_${video.url}`, buttonText: { displayText: '📁 DOCUMENT' }, type: 1 }
      ];

      await sock.sendMessage(chat, {
        image: { url: video.thumbnail },
        caption: cap,
        buttons: btns,
        headerType: 4
      }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Search failed: ${err.message}` }, { quoted: m });
    }
  }
};
