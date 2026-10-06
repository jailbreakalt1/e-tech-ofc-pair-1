import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { safeWriteFile, safeReadFile, ensureDir } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SessionManager {
  constructor(sessionName) {
    this.sessionName = sessionName;
    this.sessionDir = path.resolve(sessionName);
    this.credsFile = path.join(this.sessionDir, 'creds.json');
    this.backupFile = `${this.credsFile}.bak`;
    this.tempDir = path.join(this.sessionDir, 'temp');
  }

  async initialize() {
    ensureDir(this.sessionDir);
    ensureDir(this.tempDir);
    return this.loadSession();
  }

  async loadSession() {
    if (fs.existsSync(this.credsFile)) {
      const data = safeReadFile(this.credsFile);
      if (data) {
        await this.createBackup();
        return data;
      }
    }
    if (fs.existsSync(this.backupFile)) {
      const data = safeReadFile(this.backupFile);
      if (data) {
        await safeWriteFile(this.credsFile, data);
        return data;
      }
    }
    return null;
  }

  async createBackup() {
    if (fs.existsSync(this.credsFile)) {
      const data = safeReadFile(this.credsFile);
      if (data) {
        await safeWriteFile(this.backupFile, data);
      }
    }
  }

  async saveCreds(creds) {
    await safeWriteFile(this.credsFile, creds);
    await this.createBackup();
  }

  async loadFromUrl(sessionUrl) {
    if (!sessionUrl) return false;
    try {
      let url = sessionUrl.trim();
      if (url.includes('pastebin.com') && !url.includes('/raw/')) {
        url = url.replace('pastebin.com/', 'pastebin.com/raw/');
      }
      const response = await fetch(url, { timeout: 15000 });
      let data = await response.json();
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data) {
        await safeWriteFile(this.credsFile, data);
        await this.createBackup();
        return true;
      }
    } catch (error) {
      console.error('Failed to load session from URL:', error.message);
    }
    return false;
  }

  async clearSession() {
    try {
      if (fs.existsSync(this.credsFile)) fs.rmSync(this.credsFile);
      if (fs.existsSync(this.backupFile)) fs.rmSync(this.backupFile);
      return true;
    } catch {
      return false;
    }
  }

  getCredsFile() {
    return this.credsFile;
  }

  getTempDir(prefix = '') {
    const tempPath = path.join(this.tempDir, `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
    ensureDir(tempPath);
    return tempPath;
  }

  async cleanupTemp(dirPath, delayMs = 0) {
    if (delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }
    try {
      if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    } catch {
      // ignore
    }
  }
}
