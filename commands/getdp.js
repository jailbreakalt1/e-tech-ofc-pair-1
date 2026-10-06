import { toJid, getSender } from '../lib/utils.js';

export default {
  name: 'getdp',
  alias: ['dp', 'profilepic'],
  category: 'tools',
  description: 'Get profile picture of a user',
  usage: '.getdp @user or .getdp <number>',
  cooldown: 5,
  execute: async ({ sock, m, args, settings, chat, sender }) => {
    let jid = m.mentionedJid?.[0] || 
              m.message?.extendedTextMessage?.contextInfo?.participant ||
              (args[0] ? toJid(args[0]) : sender);

    try {
      const url = await sock.profilePictureUrl(jid, 'image');
      await sock.sendMessage(chat, { image: { url }, caption: `*DP of* @${jid.split('@')[0]}\n> ${settings.footer}`, mentions: [jid] }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ No DP found or privacy settings prevent access' }, { quoted: m });
    }
  }
};
