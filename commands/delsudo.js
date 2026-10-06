import path from 'path';
import { fileURLToPath } from 'url';
import { toJid, safeWriteFile, safeReadFile, ensureDir } from '../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUDO_FILE = path.join(__dirname, '../data/sudo.json');
ensureDir(path.dirname(SUDO_FILE));

export default {
  name: 'delsudo',
  alias: ['removesudo', 'sudoremove'],
  category: 'owner',
  description: 'Remove user from sudo list',
  usage: '.delsudo @user or .delsudo <number>',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    const target = m.mentionedJid?.[0] || (args[0] ? toJid(args[0]) : null);
    if (!target) return await sock.sendMessage(chat, { text: '❌ Tag or give number to remove' }, { quoted: m });

    const sudo = safeReadFile(SUDO_FILE, []);
    const filtered = sudo.filter(x => x !== target);
    safeWriteFile(SUDO_FILE, filtered);

    global.sudo = filtered;
    await sock.sendMessage(chat, { text: `❌ Removed from Sudo: @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
  }
};
