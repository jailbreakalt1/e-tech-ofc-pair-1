export default {
  name: 'anticall',
  alias: ['blockcall', 'callblock'],
  category: 'owner',
  description: 'Toggle auto-reject calls',
  usage: '.anticall on/off',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0]) return await sock.sendMessage(chat, { text: `Current: ${global.anticall ? 'ON' : 'OFF'}\nUse: .anticall on/off` }, { quoted: m });

    const val = args[0].toLowerCase();
    if (val === 'on' || val === 'true' || val === '1') {
      global.anticall = true;
      await sock.sendMessage(chat, { text: '✅ Anti-call enabled (auto-reject)\n> ' + settings.footer }, { quoted: m });
    } else if (val === 'off' || val === 'false' || val === '0') {
      global.anticall = false;
      await sock.sendMessage(chat, { text: '✅ Anti-call disabled\n> ' + settings.footer }, { quoted: m });
    } else {
      await sock.sendMessage(chat, { text: '❌ Use: .anticall on/off' }, { quoted: m });
    }
  }
};
