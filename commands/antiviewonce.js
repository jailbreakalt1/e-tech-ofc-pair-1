export default {
  name: 'antiviewonce',
  alias: ['avw', 'viewonce'],
  category: 'owner',
  description: 'Toggle anti-view-once (auto-save view once media)',
  usage: '.antiviewonce on/off',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0]) return await sock.sendMessage(chat, { text: `Current: ${global.antiviewonce ? 'ON' : 'OFF'}\nUse: .antiviewonce on/off` }, { quoted: m });

    const val = args[0].toLowerCase();
    if (val === 'on' || val === 'true' || val === '1') {
      global.antiviewonce = true;
      await sock.sendMessage(chat, { text: '✅ Anti-view-once enabled\n> ' + settings.footer }, { quoted: m });
    } else if (val === 'off' || val === 'false' || val === '0') {
      global.antiviewonce = false;
      await sock.sendMessage(chat, { text: '✅ Anti-view-once disabled\n> ' + settings.footer }, { quoted: m });
    } else {
      await sock.sendMessage(chat, { text: '❌ Use: .antiviewonce on/off' }, { quoted: m });
    }
  }
};
