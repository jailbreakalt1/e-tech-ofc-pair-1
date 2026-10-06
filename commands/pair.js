import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import { toJid, isValidPhone, sleep } from '../lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'pair',
  alias: ['paircode', 'link'],
  category: 'tools',
  description: 'Generate WhatsApp pairing code',
  usage: '.pair <number>',
  cooldown: 15,
  heavy: true,
  execute: async ({ sock, m, args, settings, chat }) => {
    if (!args[0]) {
      return await sock.sendMessage(chat, {
        text: `*E TECH OFC PAIR SYSTEM*\n\nUsage: .pair 2347072956206\n\nPut number with country code, no + sign\n\nExample: .pair 2348012345678\n\n> ${settings.footer}`
      }, { quoted: m });
    }

    const number = args[0].replace(/[^0-9]/g, '');
    if (!isValidPhone(number)) {
      return await sock.sendMessage(chat, { text: '❌ Invalid number. Example: .pair 2347072956206' }, { quoted: m });
    }

    await sock.sendMessage(chat, { text: `⏳ Generating pair code for ${number}...\nUsing temp session - main bot stays online.` }, { quoted: m });

    const tempId = `temp/${Date.now()}_${number}`;
    const tempPath = path.join(__dirname, '..', tempId);
    fs.mkdirSync(tempPath, { recursive: true });

    try {
      const { state, saveCreds } = await useMultiFileAuthState(tempPath);
      const tempSock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['E TECH OFC', 'Chrome', '1.0.0']
      });

      tempSock.ev.on('creds.update', saveCreds);
      await sleep(3000);

      let code = await tempSock.requestPairingCode(number);
      code = String(code).replace(/\s/g, '').match(/.{1,4}/g)?.join('-');
      if (!code) throw new Error('WhatsApp did not return a pairing code');

      await sock.sendMessage(chat, {
        image: { url: settings.menuImage },
        caption: `✅ *E TECH OFC PAIR CODE*\n\n*Number:* ${number}\n*Code:* *${code}*\n\n1. Open WhatsApp > Linked Devices\n2. Link a device > Link with phone number\n3. Enter: ${code}\n\n⏰ Expires in 60 seconds!\n\n> ${settings.footer}\n> Channel: ${settings.channelLink}`
      }, { quoted: m });

      setTimeout(async () => {
        try { await tempSock.end(undefined, undefined, { reason: 'pairing window expired' }); } catch {}
        try { fs.rmSync(tempPath, { recursive: true, force: true }); } catch {}
      }, 70000);

    } catch (e) {
      console.error('Pair error:', e);
      try { fs.rmSync(tempPath, { recursive: true, force: true }); } catch {}
      await sock.sendMessage(chat, { text: `❌ Failed: ${e.message}\nTry again after 2 mins.` }, { quoted: m });
    }
  }
};
