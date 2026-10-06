import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(commandsDir) {
  const commands = new Map();
  const categories = new Map();

  if (!fs.existsSync(commandsDir)) {
    console.warn(`Commands directory not found: ${commandsDir}`);
    return { commands, categories };
  }

  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    try {
      const cmdPath = path.join(commandsDir, file);
      const cmdModule = await import(`file://${cmdPath}`);
      const cmd = cmdModule.default || cmdModule;

      if (!validateCommand(cmd, file)) {
        console.warn(`Invalid command structure in ${file}, skipping`);
        continue;
      }

      commands.set(cmd.name.toLowerCase(), cmd);
      if (cmd.alias) {
        for (const alias of cmd.alias) {
          commands.set(alias.toLowerCase(), cmd);
        }
      }

      if (!categories.has(cmd.category)) {
        categories.set(cmd.category, []);
      }
      categories.get(cmd.category).push(cmd);

      console.log(`✅ Loaded command: ${cmd.name} [${cmd.category}]${cmd.alias ? ` (aliases: ${cmd.alias.join(', ')})` : ''}`);
    } catch (error) {
      console.error(`❌ Failed to load ${file}:`, error.message);
    }
  }

  return { commands, categories };
}

function validateCommand(cmd, filename) {
  if (!cmd.name || typeof cmd.name !== 'string') {
    console.error(`${filename}: missing or invalid 'name'`);
    return false;
  }
  if (!cmd.execute || typeof cmd.execute !== 'function') {
    console.error(`${filename}: missing or invalid 'execute' function`);
    return false;
  }
  if (!cmd.category || !['owner', 'social', 'ai', 'group', 'tools', 'education', 'channel', 'system'].includes(cmd.category)) {
    console.error(`${filename}: invalid or missing 'category'`);
    return false;
  }
  return true;
}

export function getCommandHelp(commands, categories, prefix) {
  const lines = [];
  for (const [category, cmds] of categories.entries()) {
    lines.push(`╭───◐ ${category.toUpperCase()} ◐───╮`);
    for (const cmd of cmds) {
      const aliases = cmd.alias ? ` (${cmd.alias.join(', ')})` : '';
      lines.push(`│ ${prefix}${cmd.name}${aliases} - ${cmd.description}`);
    }
    lines.push(`╰────────────────────────╯`);
  }
  return lines.join('\n');
}
