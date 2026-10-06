export default {
  name: 'forward',
  alias: ['fwd', 'sendto'],
  category: 'owner',
  description: 'Forward a message to another user',
  usage: '.forward <number/jid> (reply to message)',
  cooldown: 5,
  ownerOnly: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return await sock.sendMessage(chat, { text: '❌ Reply to a message with .forward <jid/number>' }, { quoted: m });

    let jid = args[0];
    if (!jid) return await sock.sendMessage(chat, { text: '❌ Provide JID or number\nEx: .forward 234707xxx' }, { quoted: m });
    if (!jid.includes('@')) jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    try {
      const msgKey = m.message.extendedTextMessage.contextInfo.stanzaId;
      await sock.sendMessage(jid, { forward: { key: { remoteJid: chat, id: msgKey, fromMe: false }, message: quoted } });
      await sock.sendMessage(chat, { text: `✅ Forwarded to ${jid}\n> ${settings.footer}` }, { quoted: m });
    } catch (err) {
      await sock.sendMessage(chat, { text: `❌ Failed: ${err.message}` }, { quoted: m });
    }
  }
};
