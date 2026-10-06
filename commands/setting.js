export default {
  name: 'setting',
  alias: ['settings', 'config'],
  category: 'owner',
  description: 'Show bot settings',
  usage: '.setting',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, settings: botSettings, chat }) => {
    const cap = `┌─「 *BOT SETTINGS* 」\n│ • Bot Name: ${botSettings.botName}\n│ • Owner: ${botSettings.ownerName}\n│ • Prefix: ${botSettings.prefix}\n│ • Privacy: ${global.privacyMode || 'public'}\n│ • AntiViewOnce: ${global.antiviewonce ? 'ON' : 'OFF'}\n│ • AntiCall: ${global.anticall ? 'ON' : 'OFF'}\n│ • Auto React: ${global.creact ? 'ON' : 'OFF'}\n│ • Sudo Users: ${global.sudo?.length || 0}\n│ • Banned Users: ${global.banned?.length || 0}\n└─────────────\n> ${botSettings.footer}`;
    await sock.sendMessage(chat, { text: cap }, { quoted: m });
  }
};
