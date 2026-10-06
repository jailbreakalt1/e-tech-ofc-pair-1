import { toJid, getSender } from '../lib/utils.js';

export default {
  name: 'kick',
  alias: ['remove', 'kickout'],
  category: 'group',
  description: 'Remove a user from group',
  usage: '.kick @user',
  cooldown: 5,
  groupOnly: true,
  sudoOnly: true,
  execute: async ({ sock, m, args, settings, chat, sender, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    let target = m.mentionedJid?.[0] || 
                 m.message?.extendedTextMessage?.contextInfo?.participant ||
                 (args[0] ? toJid(args[0]) : null);

    if (!target) {
      return await sock.sendMessage(chat, { text: '❌ Tag or mention a user to kick' }, { quoted: m });
    }

    try {
      const metadata = await sock.groupMetadata(chat);
      const isAdmin = metadata.participants.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
      const isBotAdmin = metadata.participants.some(p => p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin'));

      if (!isBotAdmin) {
        return await sock.sendMessage(chat, { text: '❌ Bot must be admin to kick users' }, { quoted: m });
      }

      await sock.groupParticipantsUpdate(chat, [target], 'remove');
      await sock.sendMessage(chat, { text: `✅ Kicked @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
