import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function sanitizePhone(input) {
  if (!input) return '';
  return input.replace(/[^0-9]/g, '');
}

export function isValidPhone(phone) {
  const clean = sanitizePhone(phone);
  return clean.length >= 10 && clean.length <= 15;
}

export function toJid(phone) {
  const clean = sanitizePhone(phone);
  return `${clean}@s.whatsapp.net`;
}

export function isOwner(jid, protectedOwners = []) {
  if (!jid) return false;
  return protectedOwners.some(num => jid.includes(num));
}

export function isSudo(jid, sudoList = []) {
  if (!jid) return false;
  return sudoList.includes(jid);
}

export function isGroup(chat) {
  return chat?.endsWith('@g.us') === true;
}

export function getSender(m) {
  return m.key.participant || m.key.remoteJid;
}

export async function safeWriteFile(filepath, data) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmp = `${filepath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, filepath);
}

export function safeReadFile(filepath, fallback = null) {
  try {
    if (!fs.existsSync(filepath)) return fallback;
    const raw = fs.readFileSync(filepath, 'utf8');
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function ensureDir(dirpath) {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath, { recursive: true });
  }
}

export function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export function generateId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function truncate(str, maxLen = 100) {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

export function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 200);
}
