import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import axios from 'axios';
import chalk from 'chalk';
import moment from 'moment-timezone';
import { settings, PROTECTED_OWNER_NUMS, COMMAND_CATEGORIES } from './config/settings.js';
import { loadCommands } from './lib/commandLoader.js';
import { SessionManager } from './lib/sessionManager.js';
import { checkRateLimit } from './lib/rateLimiter.js';
import { isOwner, isSudo, isGroup, getSender, sanitizePhone, toJid, formatUptime } from './lib/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let buttonHelper;
try { buttonHelper = (await import('@ryuu-reinzz/button-helper')).default; } catch(e) { console.log('button-helper not available'); }

const delay = ms => new Promise(res => setTimeout(res, ms));

global.privacyMode = global.privacyMode || 'public';
global.antiviewonce = global.antiviewonce !== false;
global.anticall = global.anticall || false;
global.creact = global.creact !== false;

const sessionManager = new SessionManager(settings.sessionName);
await sessionManager.initialize();

sessionManager.safeReadFile = (filepath, fallback = null) => {
  try {
    if (!fs.existsSync(filepath)) return fallback;
    const raw = fs.readFileSync(filepath, 'utf8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

if (process.env.SESSION_ID) {
  await sessionManager.loadFromUrl(process.env.SESSION_ID);
}

const { commands, categories } = await loadCommands(path.join(__dirname, 'commands'));

const subMenus = {
  "1": `╭───◐\n│ 👑 OWNER MENU\n╰───◐\n╭───◐\n│.privacy 🔵\n│.setting ⚙️\n│.getdp 🥰\n│.csong 🎵\n│.forward 💯\n│.setsudo 👑\n│.delsudo 🚫\n│.setcall 📞\n│.delcall 🔓\n│.ban 🔨\n│.unban ✅\n│.boost 🚀\n│.doboost 🔥\n│.rboost ❤️\n╰───◐\n${settings.footer}`,
  "2": `╭───◐\n│ 🌐 SOCIAL MENU\n╰───◐\n╭───◐\n│.song 🎧\n│.video 📹\n│.fb 📘\n│.tiktok 🎵\n│.insta 📸\n│.twitter 🐦\n│.movie 🎬\n│.apk 📱\n│.img 🖼️\n╰───◐\n${settings.footer}`,
  "3": `╭───◐\n│ 🤖 AI MENU\n│.ai 💬\n│.gpt 🧠\n│.imagine 🎨\n│.gemini ✨\n╰───◐\n${settings.footer}`,
  "4": `╭───◐\n│ 👥 GROUP MENU\n│.add ➕.kick 👢.promote 👑.demote 🔻.tagall 👥.hidetag 👁️.open 🔓.close 🔒\n╰───◐\n${settings.footer}`,
  "5": `╭───◐\n│ 🛠️ TOOLS MENU\n│.ping 📶.alive 🖐️.menu 🌍.sticker 🏷️.toimg 🖼️\n╰───◐\n${settings.footer}`,
  "6": `╭───◐\n│ 📚 EDUCATION MENU\n│.define 📖.translate 🌐.wikipedia 📚\n╰───◐\n${settings.footer}`,
  "7": `╭───◐\n│ 📢 CHANNEL MENU\n│.mychannels 📋.setchannel 📌.delchannel 🗑️.creact ⚡\n╰───◐\n│ Channel: ${settings.channelLink}\n╰───◐\n${settings.footer}`
};

let botGeneration = 0;
let pendingRestart = null;
let authFailureStreak = 0;
const AUTH_FAILURE_LIMIT = 3;
let sock = null;
let connectionStable = false;
let stableStart = 0;

function scheduleRestart(delayMs, reason) {
  if (pendingRestart) return;
  pendingRestart = setTimeout(() => {
    pendingRestart = null;
    console.log(chalk.yellow(`🔄 Reconnecting (${reason})...`));
    startBot().catch(error => console.log(chalk.red(`Reconnect failed: ${error.message}`)));
  }, delayMs);
}

function isRealOwner(jid) {
  return isOwner(jid, PROTECTED_OWNER_NUMS);
}

function isProtectedAction(body) {
  const bannedActions = ['.ban', '.block', '.kick', '.remove', '.del', '.delsudo'];
  return PROTECTED_OWNER_NUMS.some(num => body.includes(num)) &&
         bannedActions.some(action => body.startsWith(action));
}

async function startBot() {
  const credsFile = sessionManager.getCredsFile();
  if (!fs.existsSync(credsFile)) {
    console.log(chalk.yellow('⚠️ No session found. Waiting for pairing via /pair or /qr endpoint...'));
    return;
  }

  const creds = sessionManager.safeReadFile(credsFile);
  if (!creds || !creds.me?.id) {
    console.log(chalk.yellow('⚠️ Invalid session. Waiting for pairing...'));
    return;
  }

  botGeneration++;
  const myGeneration = botGeneration;

  const { state, saveCreds } = await useMultiFileAuthState(sessionManager.sessionDir);

  sock = makeWASocket({
    auth: state,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    logger: pino({ level: 'silent' }),
    browser: Browsers.windows('Chrome'),
    connectTimeoutMs: 180000,
    defaultQueryTimeoutMs: 180000,
    keepAliveIntervalMs: 30000,
    retryRequestDelayMs: 2000,
    maxRetries: 15,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: false,
  });

  sock.ev.on('creds.update', async (creds) => {
    await saveCreds(creds);
    console.log('💾 Creds saved');
  });

  sock.ev.on('connection.update', async (update) => {
    const time = moment().tz('Africa/Lagos').format('HH:mm:ss');
    if (update.qr) {
      console.log(chalk.yellow('📱 QR received - session may have expired'));
      qrcode.generate(update.qr, { small: true });
    }

    if (update.connection === 'open') {
      if (myGeneration !== botGeneration) return;
      authFailureStreak = 0;
      connectionStable = true;
      const stableStart = Date.now();
      console.log(chalk.green(`✅ [${time}] E TECH OFC Connected`));
      console.log(chalk.green(`✅ Protected Owners: ${PROTECTED_OWNER_NUMS.join(' & ')}`));
      console.log(chalk.cyan(`✅ Loaded ${commands.size} commands across ${categories.size} categories`));

      try {
        const meta = await sock.newsletterMetadata('invite', settings.channelInviteCode);
        if (meta?.id) {
          await sock.newsletterFollow(meta.id);
          console.log(chalk.cyan('✅ Auto-followed E TECH OFC channel'));
        }
      } catch(e) { console.log(chalk.yellow(`⚠️ Channel follow skipped: ${e.message}`)); }
    }

    if (update.connection === 'close') {
      if (myGeneration !== botGeneration) return;
      
      // Only allow reconnect if connection was stable for at least 30s
      if (connectionStable && stableStart && (Date.now() - stableStart < 30000)) {
        console.log(chalk.yellow('⚠️ Connection was not stable long enough, skipping immediate reconnect'));
        return;
      }
      
      const statusCode = update.lastDisconnect?.error?.output?.statusCode;
      const errorMessage = update.lastDisconnect?.error?.message || 'unknown error';
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;
      const creds = state.creds || {};
      const isAuthenticated = !!(creds.me?.id && creds.registrationId != null && creds.signedIdentityKey);

      if (isLoggedOut && isAuthenticated) authFailureStreak++;
      else if (!isLoggedOut) authFailureStreak = 0;

      const canDiscard = isLoggedOut && (!isAuthenticated || authFailureStreak >= AUTH_FAILURE_LIMIT);
      if (canDiscard) {
        authFailureStreak = 0;
        await sessionManager.clearSession();
        console.log(chalk.yellow(`🔐 Pairing reset (${isAuthenticated ? 'session logged out' : 'pairing incomplete'}: ${statusCode || errorMessage})`));
        scheduleRestart(3000, 'fresh pairing code/QR');
        return;
      }

      let reconnectDelay = 10000;
      if (statusCode === 440) {
        console.log(chalk.yellow(`⚠️ Stream error 440 - likely conflict, waiting 120s...`));
        reconnectDelay = 300000;
      } else if (statusCode === 515 || statusCode === 503 || statusCode === 408) {
        console.log(chalk.yellow(`🔄 Stream error ${statusCode} - reconnecting...`));
        reconnectDelay = 30000;
      } else if (statusCode === 401) {
        console.log(chalk.red(`❌ Unauthorized - session invalid`));
        reconnectDelay = 5000;
      }

      connectionStable = false;
      console.log(chalk.yellow(`Connection closed (${statusCode || errorMessage}); preserving auth and reconnecting in ${reconnectDelay/1000}s`));
      scheduleRestart(reconnectDelay, `server close ${statusCode || errorMessage}`);
    }
  });

  sock.ev.on('call', async (calls) => {
    if (global.anticall) {
      for (const call of calls) {
        if (call.status === 'offer') {
          await sock.rejectCall(call.id, call.from).catch(() => {});
        }
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      const m = messages[0];
      if (!m.message || m.key.fromMe) return;

      const chat = m.key.remoteJid;
      const sender = getSender(m);
      if (!chat) return;

      const isGrp = isGroup(chat);
      const ownerCheck = isRealOwner(sender) || isSudo(sender, global.sudo || []);

      let body = m.message.conversation ||
                 m.message.extendedTextMessage?.text ||
                 m.message.buttonsResponseMessage?.selectedButtonId ||
                 m.message.templateButtonReplyMessage?.selectedId || '';

      if (m.message?.interactiveResponseMessage?.nativeFlowResponseMessage) {
        try {
          const p = JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
          if (p.id) body = p.id;
        } catch {}
      }

      if (body) {
        if (isProtectedAction(body)) {
          await sock.sendMessage(chat, {
            text: `🛡️ *E TECH OFC PROTECTION*\n\n❌ Cannot target protected owner!\n\nProtected:\n• Main: 2347072956206\n• Backup: 2348108717744\n\n${settings.footer}`
          }, { quoted: m });
          return;
        }
      }

      if ((body.includes('.tagall') || body.includes('.hidetag')) && !ownerCheck) {
        await sock.sendMessage(chat, {
          text: `❌ Only Owner can use this!\nOwner: 2347072956206 & 2348108717744`
        }, { quoted: m });
        return;
      }

      let cleanBody = body.trim();
      if (subMenus[cleanBody]) {
        await sock.sendMessage(chat, { text: subMenus[cleanBody] }, { quoted: m }).catch(() => {});
        return;
      }

      if ((cleanBody === '1' || cleanBody === '2' || cleanBody.toLowerCase() === 'audio' ||
           cleanBody.toLowerCase() === 'doc' || cleanBody.toLowerCase() === 'document' ||
           cleanBody.startsWith('etech_')) && commands.has('song')) {
        try {
          await sock.sendPresenceUpdate('composing', chat);
          const songCmd = commands.get('song');
          if (songCmd.execute.length <= 2) {
            await songCmd.execute(m, { conn: sock, text: cleanBody, args: [cleanBody] });
          } else {
            await songCmd.execute(sock, m, [cleanBody], settings);
          }
        } catch(e) { console.log('song fallback err', e.message); }
        return;
      }

      if (!body.startsWith(settings.prefix)) return;

      try {
        await sock.sendPresenceUpdate('composing', chat);
        if (global.creact) {
          await sock.sendMessage(chat, { react: { text: '⚡', key: m.key } }).catch(() => {});
        }
      } catch {}

      const args = body.slice(settings.prefix.length).trim().split(/ +/);
      const cmdName = args.shift().toLowerCase();

      if (commands.has(cmdName)) {
        const cmd = commands.get(cmdName);

        if (cmd.ownerOnly && !isRealOwner(sender)) {
          await sock.sendMessage(chat, { text: '❌ Owner only command!' }, { quoted: m });
          return;
        }
        if (cmd.sudoOnly && !ownerCheck) {
          await sock.sendMessage(chat, { text: '❌ Sudo/Owner only command!' }, { quoted: m });
          return;
        }
        if (cmd.groupOnly && !isGrp) {
          await sock.sendMessage(chat, { text: '❌ Group only command!' }, { quoted: m });
          return;
        }

        const rateKey = `${sender}:${cmdName}`;
        const limitType = cmd.category === 'owner' ? 'admin' : (cmd.heavy ? 'heavy' : 'default');
        const limit = checkRateLimit(rateKey, limitType);
        if (!limit.allowed) {
          const waitSec = Math.ceil((limit.resetTime - Date.now()) / 1000);
          await sock.sendMessage(chat, { text: `⏳ Rate limited. Try again in ${waitSec}s.` }, { quoted: m });
          return;
        }

        const ctx = {
          sock,
          m,
          args,
          settings,
          sender,
          isOwner: isRealOwner(sender),
          isSudo: isSudo(sender, global.sudo || []),
          isGroup: isGrp,
          chat,
        };

        try {
          await cmd.execute(ctx);
        } catch (error) {
          console.error(chalk.red(`Command.${cmdName} failed: ${error.message}`));
          await sock.sendMessage(chat, { text: `❌ Command failed: ${error.message}` }, { quoted: m }).catch(() => {});
        }
      }
    }
  });
}

const credsFile = sessionManager.getCredsFile();
const initialCreds = sessionManager.safeReadFile(credsFile);
if (initialCreds && initialCreds.me?.id) {
  console.log('✅ Valid session found, starting bot...');
  startBot().catch(error => {
    console.log(chalk.red(`Startup failed: ${error.message}`));
    scheduleRestart(3000, 'startup failure');
  });
} else {
  console.log(chalk.yellow('⚠️ No valid session. Bot will start after pairing via /pair or /qr'));
  console.log(chalk.cyan('💡 Use the pairing server (e-tech-ofc-pair) to generate session'));
}

process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n🛑 Shutting down gracefully...'));
  if (sock) { try { await sock.end(undefined, undefined, { reason: 'user shutdown' }); } catch {} }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n🛑 Shutting down gracefully...'));
  if (sock) { try { await sock.end(undefined, undefined, { reason: 'system shutdown' }); } catch {} }
  process.exit(0);
});
