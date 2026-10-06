import { toJid } from '../lib/utils.js';

export default {
  name: 'demote',
  alias: ['unadmin'],
  category: 'group',
  description: 'Demote admin to member',
  usage: '.demote @user',
  cooldown: 5,
  groupOnly: true,
  sudoOnly: true,
  execute: async ({ sock, m, args, settings, chat, sender, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    const target = m.mentionedJid?.[0] || (args[0] ? toJid(args[0]) : null);
    if (!target) return await sock.sendMessage(chat, { text: '❌ Tag or mention a user to demote' }, { quoted: m });

    try {
      const metadata = await sock.groupMetadata(chat);
      const isBotAdmin = metadata.participants.some(p => p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin'));
      if (!isBotAdmin) return await sock.sendMessage(chat, { text: '❌ Bot must be admin' }, { quoted: m });

      await sock.groupParticipantsUpdate(chat, [target], 'demote');
      await sock.sendMessage(chat, { text: `✅ Demoted @${target.split('@')[0]}\n> ${settings.footer}`, mentions: [target] }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
