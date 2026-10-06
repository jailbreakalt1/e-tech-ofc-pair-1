export default {
  name: 'creact',
  alias: ['autoreact', 'react'],
  category: 'owner',
  description: 'Toggle auto-react to messages',
  usage: '.creact on/off',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0]) return await sock.sendMessage(chat, { text: `Current: ${global.creact ? 'ON' : 'OFF'}\nUse: .creact on/off` }, { quoted: m });

    const val = args[0].toLowerCase();
    if (val === 'on' || val === 'true' || val === '1') {
      global.creact = true;
      await sock.sendMessage(chat, { text: '✅ Auto-react enabled\n> ' + settings.footer }, { quoted: m });
    } else if (val === 'off' || val === 'false' || val === '0') {
      global.creact = false;
      await sock.sendMessage(chat, { text: '✅ Auto-react disabled\n> ' + settings.footer }, { quoted: m });
    } else {
      await sock.sendMessage(chat, { text: '❌ Use: .creact on/off' }, { quoted: m });
    }
  }
};
