export default {
  name: 'close',
  alias: ['closegroup', 'grouclose'],
  category: 'group',
  description: 'Close group (admins only)',
  usage: '.close',
  cooldown: 5,
  groupOnly: true,
  sudoOnly: true,
  execute: async ({ sock, m, settings, chat, sender, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    try {
      const metadata = await sock.groupMetadata(chat);
      const isBotAdmin = metadata.participants.some(p => p.id === sock.user.id && (p.admin === 'admin' || p.admin === 'superadmin'));
      if (!isBotAdmin) return await sock.sendMessage(chat, { text: '❌ Bot must be admin' }, { quoted: m });

      await sock.groupSettingUpdate(chat, 'announcement');
      await sock.sendMessage(chat, { text: '🔒 Group closed! Only admins can send messages.\n> ' + settings.footer }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
