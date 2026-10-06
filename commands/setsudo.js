import path from 'path';
import { fileURLToPath } from 'url';
import { toJid, safeWriteFile, safeReadFile, ensureDir } from '../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUDO_FILE = path.join(__dirname, '../data/sudo.json');
ensureDir(path.dirname(SUDO_FILE));

export default {
  name: 'setsudo',
  alias: ['addsudo', 'sudoadd'],
  category: 'owner',
  description: 'Add user to sudo list',
  usage: '.setsudo @user or .setsudo <number>',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    let target = m.mentionedJid?.[0] || (args[0] ? toJid(args[0]) : null);
    if (!target || target === '@s.whatsapp.net') return await sock.sendMessage(chat, { text: '❌ Tag or give valid number' }, { quoted: m });

    const sudo = safeReadFile(SUDO_FILE, []);
    if (!sudo.includes(target)) {
      sudo.push(target);
      safeWriteFile(SUDO_FILE, sudo);
    }

    global.sudo = sudo;
    await sock.sendMessage(chat, { text: `👑 Added to Sudo: @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
  }
};
