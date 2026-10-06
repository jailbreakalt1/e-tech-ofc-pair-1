import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toJid, safeWriteFile, safeReadFile, ensureDir } from '../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BAN_FILE = path.join(__dirname, '../data/banned.json');
ensureDir(path.dirname(BAN_FILE));

export default {
  name: 'unban',
  alias: ['unblock'],
  category: 'owner',
  description: 'Unban a user',
  usage: '.unban @user or .unban <number>',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    const target = m.mentionedJid?.[0] || 
                   m.message?.extendedTextMessage?.contextInfo?.participant ||
                   (args[0] ? toJid(args[0]) : null);

    if (!target) return await sock.sendMessage(chat, { text: '❌ Tag or provide number to unban' }, { quoted: m });

    const banned = safeReadFile(BAN_FILE, []);
    const filtered = banned.filter(x => x !== target);
    safeWriteFile(BAN_FILE, filtered);

    global.banned = filtered;
    await sock.sendMessage(chat, { text: `✅ Unbanned: @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
  }
};
