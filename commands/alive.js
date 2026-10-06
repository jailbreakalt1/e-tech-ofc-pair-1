export default {
  name: 'alive',
  alias: ['alive'],
  category: 'tools',
  description: 'Check if bot is alive',
  usage: '.alive',
  cooldown: 5,
  execute: async ({ sock, m, settings, sender, isOwner }) => {
    const text = `
╭───◐ *E TECH OFC ALIVE* ◐───╮
│ ✅ *Status:* Online & Active
│ 👑 *Owner:* ${settings.ownerName}
│ 📞 *Main:* 2347072956206
│ 📞 *Backup:* 2348108717744
│ 🚀 *Version:* 2.0.0 (Enhanced)
│ 📜 *Commands:* ${Object.keys(commands).length}
│ ⚙️ *Prefix:* [ ${settings.prefix} ]
│ 🤖 *Uptime:* 24/7
│ 🌐 *Web:* ${settings.botLink}
╰───◐

╭─「 *Quick Actions* 」─╮
│ 1️⃣ Main Menu (.menu)
│ 2️⃣ Check Ping (.ping)
│ 3️⃣ Bot Info (.bot)
╰─────────────────────╯

> ${settings.footer}
`;
    await sock.sendMessage(m.key.remoteJid, {
      image: { url: settings.aliveImage },
      caption: text
    }, { quoted: m });
  }
};
