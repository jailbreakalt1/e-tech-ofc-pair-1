export default {
  name: 'leave',
  alias: ['exit', 'leavegroup'],
  category: 'group',
  description: 'Make bot leave the group',
  usage: '.leave',
  cooldown: 5,
  groupOnly: true,
  ownerOnly: true,
  execute: async ({ sock, m, settings, chat, sender, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    await sock.sendMessage(chat, { text: '👋 Goodbye! Leaving group...\n> ' + settings.footer }, { quoted: m });
    await sock.groupLeave(chat);
  }
};
