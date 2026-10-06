export default {
  name: 'open',
  alias: ['opengroup', 'groupopen'],
  category: 'group',
  description: 'Open group for all members',
  usage: '.open',
  cooldown: 5,
  groupOnly: true,
  sudoOnly: true,
  execute: async ({ sock, m, settings, chat, sender, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    try {
      const metadata = await sock.groupMetadata(chat);
      const isBotAdmin = metadata.participants.some(p => p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin'));
      if (!isBotAdmin) return await sock.sendMessage(chat, { text: '❌ Bot must be admin' }, { quoted: m });

      await sock.groupSettingUpdate(chat, 'not_announcement');
      await sock.sendMessage(chat, { text: '🔓 Group opened! All members can send messages.\n> ' + settings.footer }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
