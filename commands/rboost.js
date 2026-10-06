export default {
  name: 'rboost',
  alias: [],
  category: 'owner',
  description: 'Boost related command',
  usage: '.rboost',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, settings, chat }) => {
    await sock.sendMessage(chat, { text: '⚡ CMD_LABEL coming soon!\n> ' + settings.footer }, { quoted: m });
  }
};
