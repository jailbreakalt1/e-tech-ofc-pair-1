export default {
  name: 'hidetag',
  alias: ['htag', 'silenttag'],
  category: 'group',
  description: 'Hidden tag all members (no visible mentions)',
  usage: '.hidetag <message>',
  cooldown: 10,
  groupOnly: true,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat, sender, text, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    const metadata = await sock.groupMetadata(chat);
    const participants = metadata.participants.map(p => p.id);
    const msg = text || args.join(' ') || '📢 *Hidden Announcement*';

    await sock.sendMessage(chat, { text: `${msg}\n\n> ${settings.footer}`, mentions: participants }, { quoted: m });
  }
};
