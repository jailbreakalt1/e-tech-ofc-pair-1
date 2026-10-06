import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yts from 'yt-search';
import { safeWriteFile, safeReadFile, ensureDir, sanitizeFilename, sleep } from '../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_PATH = path.join(__dirname, '../tmp/song_store.json');
const TMP_DIR = path.join(__dirname, '../tmp');

ensureDir(TMP_DIR);
ensureDir(path.dirname(STORE_PATH));

function getStore() { return safeReadFile(STORE_PATH, {}); }
function saveStore(data) { safeWriteFile(STORE_PATH, data); }

const MAX_DOWNLOAD_TIME = 120000;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export default {
  name: 'song',
  alias: ['play', 'music', 's', 'audio'],
  category: 'social',
  description: 'Download audio from YouTube',
  usage: '.song <query>',
  cooldown: 10,
  heavy: true,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const query = text || args.join(' ').trim();
    let buttonId = m?.message?.buttonsResponseMessage?.selectedButtonId ||
                   m?.message?.templateButtonReplyMessage?.selectedId || '';

    if (m?.message?.interactiveResponseMessage?.nativeFlowResponseMessage) {
      try {
        const p = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
        buttonId = p.id || '';
      } catch {}
    }

    if (buttonId.startsWith('etech_')) {
      const parts = buttonId.split('_');
      const type = parts[1];
      const id = parts.slice(2).join('_');
      const store = getStore();
      const videoData = store[id];

      if (!videoData) {
        return await sock.sendMessage(chat, { text: '❌ Session expired. Search again.' }, { quoted: m });
      }

      await sock.sendMessage(chat, { text: `⬇️ Downloading *${videoData.title}*...` }, { quoted: m });

      const fileName = path.join(TMP_DIR, `${id}.mp3`);
      const ytdlpCmd = `yt-dlp -x --audio-format mp3 --audio-quality 192K --no-playlist -o "${fileName}" "${videoData.url}"`;

      const downloadPromise = new Promise((resolve, reject) => {
        const proc = exec(ytdlpCmd, { timeout: MAX_DOWNLOAD_TIME, maxBuffer: 1024 * 1024 }, async (err) => {
          if (err) return reject(err);
          if (!fs.existsSync(fileName)) return reject(new Error('File not created'));
          const stats = fs.statSync(fileName);
          if (stats.size > MAX_FILE_SIZE) {
            fs.unlinkSync(fileName);
            return reject(new Error('File too large (>50MB)'));
          }
          resolve({ fileName, stats });
        });
      });

      try {
        const { fileName } = await downloadPromise;

        if (type === 'audio') {
          await sock.sendMessage(chat, {
            audio: fs.readFileSync(fileName),
            mimetype: 'audio/mpeg',
            fileName: `${sanitizeFilename(videoData.title)}.mp3`
          }, { quoted: m });
        } else {
          await sock.sendMessage(chat, {
            document: fs.readFileSync(fileName),
            mimetype: 'audio/mpeg',
            fileName: `${sanitizeFilename(videoData.title)}.mp3`
          }, { quoted: m });
        }
      } catch (err) {
        await sock.sendMessage(chat, { text: `❌ Download failed: ${err.message}` }, { quoted: m });
      } finally {
        try { if (fs.existsSync(fileName)) fs.unlinkSync(fileName); } catch {}
        const ns = getStore();
        delete ns[id];
        saveStore(ns);
      }
      return;
    }

    if (!query) {
      return await sock.sendMessage(chat, { text: '🎵 Example: .song Seyi Vibez - Chance' }, { quoted: m });
    }

    const search = await yts(query + ' song');
    if (!search.videos.length) {
      return await sock.sendMessage(chat, { text: '❌ No song found' }, { quoted: m });
    }

    const video = search.videos[0];
    const videoId = Date.now().toString();
    const store = getStore();
    store[videoId] = { url: video.url, title: video.title, duration: video.timestamp };
    saveStore(store);

    const caption = `*🎵 E TECH SONG DOWNLOADER*\n\n*Title:* ${video.title}\n*Duration:* ${video.timestamp}\n\n> ${settings.footer}`;

    await sock.sendMessage(chat, {
      image: { url: video.thumbnail },
      caption,
      footer: 'Choose format 👇',
      buttons: [
        { buttonId: `etech_audio_${videoId}`, buttonText: { displayText: '🎧 AUDIO' }, type: 1 },
        { buttonId: `etech_doc_${videoId}`, buttonText: { displayText: '📁 DOCUMENT' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m });
  }
};
