export default {
  name: 'tagall',
  alias: ['mentionall', 'all'],
  category: 'group',
  description: 'Tag all group members',
  usage: '.tagall <message>',
  cooldown: 10,
  groupOnly: true,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat, sender, text, isGroup }) => {
    if (!isGroup) return await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });

    const metadata = await sock.groupMetadata(chat);
    const participants = metadata.participants.map(p => p.id);
    const msg = text || args.join(' ') || '📢 *Group Announcement*';

    const mentionText = participants.map(id => `@${id.split('@')[0]}`).join(' ');
    const fullText = `${msg}\n\n${mentionText}\n\n> ${settings.footer}`;

    await sock.sendMessage(chat, { text: fullText, mentions: participants }, { quoted: m });
  }
};
