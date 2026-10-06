# E TECH OFC Enhanced - WhatsApp Bot

Enhanced version of MR EPHRAIM OFC's WhatsApp bot with security fixes, better architecture, and new features.

## Key Improvements

### Security
- ✅ Input validation on all commands
- ✅ Rate limiting (per-user, per-command)
- ✅ Permission checks (owner/sudo/group/admin)
- ✅ Protected owner numbers cannot be targeted
- ✅ Secure session handling with atomic writes
- ✅ Safe file operations with temp files

### Architecture
- ✅ ES Modules (type: module)
- ✅ Command loader with validation
- ✅ Consistent command structure
- ✅ Category-based organization
- ✅ SessionManager class
- ✅ RateLimiter class
- ✅ Utility functions

### Reliability
- ✅ Error boundaries on all commands
- ✅ Temp file cleanup with timeouts
- ✅ Download timeouts and size limits
- ✅ Graceful shutdown (SIGINT/SIGTERM)
- ✅ Connection retry logic with backoff
- ✅ Session backup/restore

### Maintainability
- ✅ TypeScript types (in `/types`)
- ✅ Configuration in `/config`
- ✅ Shared utilities in `/lib`
- ✅ Consistent code style
- ✅ Comprehensive logging

## Installation

```bash
npm install
npm start
```

## Environment Variables

```bash
SESSION_ID=https://pastebin.com/raw/xxx  # Optional: load session from URL
```

## Commands

### Tools
- `.ping` - Check bot speed
- `.menu` - Show all commands
- `.alive` - Bot status
- `.sticker` - Image/video to sticker
- `.toimg` - Sticker to image
- `.getdp` - Get profile picture
- `.pair` - Generate pairing code
- `.bot` - Create your own bot

### Owner
- `.privacy` - Set privacy mode
- `.setting` - View settings
- `.setsudo` - Add sudo user
- `.delsudo` - Remove sudo user
- `.ban` / `.unban` - Ban/unban users
- `.creact` - Toggle auto-react
- `.antiviewonce` - Toggle anti-view-once
- `.anticall` - Toggle anti-call

### Group (Sudo/Owner)
- `.kick` - Remove user
- `.promote` / `.demote` - Admin management
- `.add` - Add user
- `.open` / `.close` - Group settings
- `.tagall` / `.hidetag` - Mention all
- `.leave` - Bot leaves group

### Social
- `.song` - Download audio
- `.video` - Download video
- `.fb` / `.tiktok` / `.insta` / `.twitter` - Social media
- `.img` - Google Images
- `.apk` - APK search
- `.movie` - Movie info

### AI
- `.ai` - Chat with AI
- `.gpt` / `.gemini` - AI variants

### Education
- `.define` - Dictionary
- `.translate` - Translate text
- `.wikipedia` - Wiki search

## Deployment

### Vercel
1. Fork this repo
2. Connect to Vercel
3. Add `SESSION_ID` env variable
4. Deploy

### VPS/Docker
```bash
docker build -t etech-ofc .
docker run -d -e SESSION_ID=... etech-ofc
```

## File Structure
```
├── index.js              # Main entry point
├── config/
│   └── settings.js       # Bot configuration
├── types/
│   └── index.ts          # TypeScript types
├── lib/
│   ├── utils.js          # Shared utilities
│   ├── rateLimiter.js    # Rate limiting
│   ├── commandLoader.js  # Command loading
│   └── sessionManager.js # Session handling
├── commands/             # Command files
├── data/                 # JSON data (sudo, banned)
├── tmp/                  # Temp downloads
└── session/              # Baileys session
```

## License
MIT - MR EPHRAIM OFC
