export const settings = {
  botName: 'E TECH OFC',
  ownerName: 'MR EPHRAIM OFC',
  prefix: '.',
  footer: '© 2026 E TECH OFC | MR EPHRAIM OFC',
  botLink: 'https://github.com/EphraimOFC/-MR-EPHRAIM-OFC',
  channelLink: 'https://whatsapp.com/channel/0029Vb5eXxx',
  channelInviteCode: 'CHANNEL_INVITE_CODE',
  aliveImage: 'https://telegra.ph/file/xxxxx.jpg',
  menuImage: 'https://telegra.ph/file/xxxxx.jpg',
  sessionName: 'session',
  pairWebsite: 'https://etechofc.vercel.app',
};

export const PROTECTED_OWNER_NUMS = [
  '2347072956206',
  '2348108717744'
];

export const RATE_LIMITS = {
  default: { max: 30, windowMs: 60000 },
  heavy: { max: 5, windowMs: 60000 },
  admin: { max: 10, windowMs: 60000 },
};

export const COMMAND_CATEGORIES = {
  owner: { emoji: '👑', label: 'OWNER MENU' },
  social: { emoji: '🌐', label: 'SOCIAL MENU' },
  ai: { emoji: '🤖', label: 'AI MENU' },
  group: { emoji: '👥', label: 'GROUP MENU' },
  tools: { emoji: '🛠️', label: 'TOOLS MENU' },
  education: { emoji: '📚', label: 'EDUCATION MENU' },
  channel: { emoji: '📢', label: 'CHANNEL MENU' },
  system: { emoji: '⚙️', label: 'SYSTEM MENU' },
};
