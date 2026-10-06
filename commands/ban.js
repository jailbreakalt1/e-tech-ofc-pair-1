import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toJid, safeWriteFile, safeReadFile, ensureDir } from '../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BAN_FILE = path.join(__dirname, '../data/banned.json');
ensureDir(path.dirname(BAN_FILE));

export default {
  name: 'ban',
  alias: ['block'],
  category: 'owner',
  description: 'Ban a user from using the bot',
  usage: '.ban @user or .ban <number>',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat, sender }) => {
    let target = m.mentionedJid?.[0] || 
                 m.message?.extendedTextMessage?.contextInfo?.participant ||
                 (args[0] ? toJid(args[0]) : null);

    if (!target) return await sock.sendMessage(chat, { text: '❌ Tag or provide number to ban' }, { quoted: m });

    const banned = safeReadFile(BAN_FILE, []);
    if (!banned.includes(target)) {
      banned.push(target);
      safeWriteFile(BAN_FILE, banned);
    }

    global.banned = banned;
    await sock.sendMessage(chat, { text: `🚫 Banned: @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
  }
};
