export default {
  name: 'privacy',
  alias: ['mode'],
  category: 'owner',
  description: 'Change bot privacy mode',
  usage: '.privacy <public|private|group|inbox>',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    const modes = ['public', 'private', 'group', 'inbox', 'pc'];
    const current = global.privacyMode || 'public';

    if (!args[0]) {
      return await sock.sendMessage(chat, {
        text: `┌─「 *PRIVACY MODE* 」\n│ Current: *${current}*\n│\n│ ${modes.map(m => `.privacy ${m} → ${m}`).join('\n│ ')}\n└─────────────\n> ${settings.footer}`
      }, { quoted: m });
    }

    const mode = args[0].toLowerCase();
    if (!modes.includes(mode)) {
      return await sock.sendMessage(chat, { text: `❌ Invalid mode. Use: ${modes.join(', ')}` }, { quoted: m });
    }

    global.privacyMode = mode;
    await sock.sendMessage(chat, { text: `✅ Privacy set to *${mode}*\n> ${settings.footer}` }, { quoted: m });
  }
};
