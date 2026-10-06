import axios from 'axios';

export default {
  name: 'ai',
  alias: ['chatgpt', 'gpt', 'ask'],
  category: 'ai',
  description: 'Chat with AI',
  usage: '.ai <question>',
  cooldown: 10,
  heavy: true,
  execute: async ({ sock, m, args, text, settings, chat }) => {
    const query = text || args.join(' ').trim();
    if (!query) return await sock.sendMessage(chat, { text: '❌ Ask something: .ai What is AI?' }, { quoted: m });

    await sock.sendMessage(chat, { text: '🤖 Thinking...' }, { quoted: m });

    try {
      const response = await axios.post('https://api.etechofc.com/ai', { question: query }, { timeout: 30000 });
      const answer = response.data?.answer || response.data?.response || 'No response';
      await sock.sendMessage(chat, { text: `🤖 *AI Response:*\n\n${answer}\n\n> ${settings.footer}` }, { quoted: m });
    } catch {
      await sock.sendMessage(chat, { text: '❌ AI service unavailable. Try again later.' }, { quoted: m });
    }
  }
};
