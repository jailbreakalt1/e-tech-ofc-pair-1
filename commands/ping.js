export default {
  name: 'ping',
  alias: ['pong', 'speed'],
  category: 'tools',
  description: 'Check bot response time',
  usage: '.ping',
  cooldown: 3,
  execute: async ({ sock, m, settings }) => {
    const start = Date.now();
    const msg = await sock.sendMessage(m.key.remoteJid, { text: '*Pinging E TECH OFC...* ⚡' }, { quoted: m });
    const latency = Date.now() - start;
    const uptime = process.uptime();
    const mem = process.memoryUsage();

    const text = `
╭───◐ *E TECH OFC PING* ◐───╮
│ ⚡ *Speed:* ${latency}ms
│ ⏱️ *Uptime:* ${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m ${Math.floor(uptime%60)}s
│ 🧠 *Memory:* ${(mem.heapUsed/1024/1024).toFixed(1)}MB / ${(mem.heapTotal/1024/1024).toFixed(1)}MB
│ 🤖 *Bot:* E TECH OFC V2.0 Enhanced
│ 👑 *Owner:* MR EPHRAIM OFC
│ 📞 *Main:* 2347072956206
╰───◐
✅ *Active & Stable*

> ${settings.footer}
  `;

    await sock.sendMessage(m.key.remoteJid, { text, edit: msg.key }, { quoted: m });
  }
};
