import { WASocket, proto } from '@whiskeysockets/baileys';

export interface BotSettings {
  botName: string;
  ownerName: string;
  prefix: string;
  footer: string;
  botLink: string;
  channelLink: string;
  channelInviteCode: string;
  aliveImage: string;
  menuImage: string;
  sessionName: string;
  pairWebsite?: string;
}

export interface CommandContext {
  sock: WASocket;
  m: proto.IWebMessageInfo;
  args: string[];
  settings: BotSettings;
  sender: string;
  isOwner: boolean;
  isSudo: boolean;
  isGroup: boolean;
  chat: string;
}

export interface Command {
  name: string;
  alias?: string[];
  category: 'owner' | 'social' | 'ai' | 'group' | 'tools' | 'education' | 'channel' | 'system';
  description: string;
  usage?: string;
  cooldown?: number;
  ownerOnly?: boolean;
  sudoOnly?: boolean;
  groupOnly?: boolean;
  execute: (ctx: CommandContext) => Promise<void>;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface SessionData {
  creds: any;
  keys: any;
}
