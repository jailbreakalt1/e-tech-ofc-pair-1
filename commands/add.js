import { toJid } from '../lib/utils.js';

export default {
  name: 'add',
  alias: ['invite'],
  category: 'group',
  description: 'Add user to group',
  usage: '.add <number>',
  cooldown: 5,
  groupOnly: true,
  sudoOnly: true,
  execute: async ({ sock, m, args, settings, chat, sender, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });
    if (!args[0]) return await sock.sendMessage(chat, { text: '❌ Provide number to add\nEx: .add 2347072956206' }, { quoted: m });

    const target = toJid(args[0]);
    try {
      const metadata = await sock.groupMetadata(chat);
      const isBotAdmin = metadata.participants.some(p => p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin'));
      if (!isBotAdmin) return await sock.sendMessage(chat, { text: '❌ Bot must be admin' }, { quoted: m });

      await sock.groupParticipantsUpdate(chat, [target], 'add');
      await sock.sendMessage(chat, { text: `✅ Added @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
