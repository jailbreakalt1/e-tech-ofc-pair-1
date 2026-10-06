import { COMMAND_CATEGORIES } from '../config/settings.js';

export default {
  name: 'menu',
  alias: ['help', 'cmds'],
  category: 'tools',
  description: 'Show all available commands',
  usage: '.menu [category]',
  cooldown: 5,
  execute: async ({ sock, m, args, settings, sender, isOwner }) => {
    const category = args[0]?.toLowerCase();
    let text = '';

    if (category && COMMAND_CATEGORIES[category]) {
      text = `╭───◐ ${COMMAND_CATEGORIES[category].emoji} ${COMMAND_CATEGORIES[category].label} ◐───╮\n`;
      // Would need access to categories Map - simplified for now
      text += `Use .menu to see all categories\n╰────────────────────────╯\n> ${settings.footer}`;
    } else {
      text = `
╭─○ *E TECH OFC COMMANDS* ✦
│ ✦ *${settings.ownerName}* ༆
╰─○

╭───◐ *BOT INFO* ◐───╮
│ 👑 Owner: ${settings.ownerName}
│ 📞 Main: 2347072956206
│ 📞 Backup: 2348108717744
│ 🚀 Version: E TECH V2.0 Enhanced
│ 📜 Total Commands: 50+
│ ⚙️ Prefix: [ ${settings.prefix} ]
│ 🌐 Web: ${settings.botLink}
╰───◐

╭─「 *Categories* 」─╮
│ 1️⃣ 👑 Owner Menu (.menu owner)
│ 2️⃣ 🌐 Social Menu (.menu social)
│ 3️⃣ 🤖 AI Menu (.menu ai)
│ 4️⃣ 👥 Group Menu (.menu group)
│ 5️⃣ 🛠️ Tools Menu (.menu tools)
│ 6️⃣ 📚 Education Menu (.menu education)
│ 7️⃣ 📢 Channel Menu (.menu channel)
│ 8️⃣ ⚙️ System Menu (.menu system)
╰───◐

Reply with number or use \`.menu <category>\`
> ${settings.footer}
`;
    }

    await sock.sendMessage(m.key.remoteJid, {
      image: { url: settings.menuImage },
      caption: text
    }, { quoted: m });
  }
};
