#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {
  toCursorAgent,
  ensureShipcrewDir,
  readVoyage,
  startVoyage,
  parseVoyageFields,
  buildAutopilotPrompt,
  voyagePath,
} = require('./lib/autopilot');

const PKG_ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(PKG_ROOT, 'agents');
const TEAMS_DIR = path.join(PKG_ROOT, 'teams');
const SKILLS_DIR = path.join(PKG_ROOT, 'skills');
const TEMPLATES_SHIPCREW = path.join(PKG_ROOT, 'templates', 'shipcrew');

const TEAMS = {
  'saas-crew': 'SaaS product crew — captain, navigator, backend, next, api, security, qa',
  'indie-crew': 'Lean indie crew — captain, next, design, devops (4 agents)',
  'bug-hunt-crew': 'Bug hunt — captain, surgeon, lookout, gunner',
  'ship-crew': 'Full software house — all 23 agents for end-to-end delivery',
  'launch-crew': 'New project scaffolding — captain, navigator, next, design, devops, docs',
  'polyglot-crew': 'Stack specialists — Node, Nest, PHP, Laravel, Spring, Blockchain, React Native',
};

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function c(color, text) {
  if (process.env.NO_COLOR || !process.stdout.isTTY) return text;
  return `${COLORS[color] || ''}${text}${COLORS.reset}`;
}

function log(msg) {
  console.log(msg);
}

function banner() {
  log('');
  log(c('cyan', '  ⚓  shipcrew-ai'));
  log(c('dim', '  Stop prompting. Command a crew.'));
  log('');
}

function usage() {
  log(`Usage: ${c('bold', 'npx @solvemotive/shipcrew-ai <command>')} [options]

Commands:
  ${c('green', 'init')} [crew]       Install agents + autopilot templates
  ${c('green', 'run')} <goal>        Start autopilot voyage + print prompt
  ${c('green', 'status')}            Show .shipcrew/voyage.yml status
  ${c('green', 'resume')}            Print resume prompt for current voyage
  ${c('green', 'list')}              List crews and agents
  ${c('green', 'help')}              Show this help

Crews:
${Object.entries(TEAMS)
  .map(([k, v]) => `  ${c('cyan', k.padEnd(16))} ${v}`)
  .join('\n')}

Examples:
  npx --yes github:solvemotive/shipcrew-ai init ship-crew
  npx @solvemotive/shipcrew-ai run "Ship team invites with RBAC"
  npx @solvemotive/shipcrew-ai status
  npx @solvemotive/shipcrew-ai resume
`);
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(String(answer || '').trim());
    });
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function listAgentFiles() {
  return fs
    .readdirSync(AGENTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

function loadTeam(crewName) {
  const file = path.join(TEAMS_DIR, `${crewName}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown crew: ${crewName}. Available: ${Object.keys(TEAMS).join(', ')}`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function agentFileForName(name) {
  const files = listAgentFiles();
  const needle = String(name).toLowerCase().replace(/^@/, '');

  const aliases = {
    backend: 'boatswain',
    'boatswain-backend': 'boatswain',
    frontend: 'carpenter',
    'carpenter-frontend': 'carpenter',
    next: 'carpenter-next',
    api: 'rigger',
    'rigger-api': 'rigger',
    security: 'gunner',
    'gunner-security': 'gunner',
    debug: 'surgeon',
    'surgeon-debug': 'surgeon',
    devops: 'quartermaster',
    'quartermaster-devops': 'quartermaster',
    qa: 'lookout',
    'lookout-qa': 'lookout',
    docs: 'cartographer',
    'cartographer-docs': 'cartographer',
    performance: 'purser',
    'purser-performance': 'purser',
    archaeologist: 'code-archaeologist',
    dba: 'data-master',
    tailwind: 'design-mate',
    design: 'design-mate',
    configurator: 'team-configurator',
    node: 'deckhand',
    nodejs: 'deckhand',
    'deckhand-nodejs': 'deckhand',
    nest: 'helmsman',
    nestjs: 'helmsman',
    'helmsman-nestjs': 'helmsman',
    php: 'steward',
    'steward-php': 'steward',
    laravel: 'sailmaker',
    'sailmaker-laravel': 'sailmaker',
    spring: 'ironwright',
    'spring-boot': 'ironwright',
    'ironwright-spring': 'ironwright',
    blockchain: 'chainlocker',
    web3: 'chainlocker',
    'chainlocker-blockchain': 'chainlocker',
    'react-native': 'outrigger',
    rn: 'outrigger',
    expo: 'outrigger',
    'outrigger-react-native': 'outrigger',
  };

  const target = aliases[needle] || needle;

  // Exact frontmatter/base match first (carpenter-next before carpenter)
  const scored = files.map((f) => {
    const base = f.replace(/^\d+-/, '').replace(/\.md$/, '').toLowerCase();
    const role = base.split('-')[0];
    let score = 0;
    if (base === target) score = 100;
    else if (base.startsWith(`${target}-`)) score = 80;
    else if (base.includes(target)) score = 60;
    else if (role === target) score = 40;
    else if (f.toLowerCase().includes(target)) score = 20;
    return { f, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0] && scored[0].score > 0 ? scored[0].f : null;
}

function resolveAgentFiles(team) {
  const all = listAgentFiles();
  const agents = team.agents || [];
  const resolved = [];

  for (const agentName of agents) {
    const file = agentFileForName(agentName);
    if (!file) {
      log(c('yellow', `  ⚠  Could not resolve agent: ${agentName}`));
      continue;
    }
    resolved.push(file);
  }

  if (team.includeAll || agents.includes('*') || agents.includes('all')) {
    return all;
  }

  return [...new Set(resolved)];
}

function detectStack(cwd) {
  const stack = {
    runtime: null,
    framework: null,
    language: null,
    packageManager: null,
    orm: null,
    files: [],
  };

  const has = (f) => fs.existsSync(path.join(cwd, f));

  if (has('package.json')) {
    stack.runtime = 'Node.js';
    stack.language = 'JavaScript/TypeScript';
    stack.files.push('package.json');
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps.next) stack.framework = 'Next.js';
      else if (deps.nuxt) stack.framework = 'Nuxt';
      else if (deps.vue) stack.framework = 'Vue';
      else if (deps.react) stack.framework = 'React';
      else if (deps.express || deps.fastify || deps.hono || deps.koa) stack.framework = 'Node API';
      else if (deps['@nestjs/core']) stack.framework = 'NestJS';
      if (deps.prisma || deps['@prisma/client']) stack.orm = 'Prisma';
      else if (deps.drizzle-orm) stack.orm = 'Drizzle';
      else if (deps.typeorm) stack.orm = 'TypeORM';
      else if (deps.mongoose) stack.orm = 'Mongoose';
      if (has('pnpm-lock.yaml')) stack.packageManager = 'pnpm';
      else if (has('yarn.lock')) stack.packageManager = 'yarn';
      else if (has('bun.lockb') || has('bun.lock')) stack.packageManager = 'bun';
      else stack.packageManager = 'npm';
      if (has('tsconfig.json')) stack.language = 'TypeScript';
    } catch {
      /* ignore parse errors */
    }
  }

  if (has('go.mod')) {
    stack.runtime = stack.runtime || 'Go';
    stack.language = stack.language ? `${stack.language}, Go` : 'Go';
    stack.files.push('go.mod');
  }
  if (has('requirements.txt') || has('pyproject.toml') || has('Pipfile')) {
    stack.runtime = stack.runtime || 'Python';
    stack.language = stack.language ? `${stack.language}, Python` : 'Python';
    stack.files.push(has('pyproject.toml') ? 'pyproject.toml' : has('Pipfile') ? 'Pipfile' : 'requirements.txt');
    if (has('manage.py')) stack.framework = stack.framework || 'Django';
  }
  if (has('Cargo.toml')) {
    stack.runtime = stack.runtime || 'Rust';
    stack.language = stack.language ? `${stack.language}, Rust` : 'Rust';
    stack.files.push('Cargo.toml');
  }
  if (has('Gemfile')) {
    stack.runtime = stack.runtime || 'Ruby';
    stack.language = stack.language ? `${stack.language}, Ruby` : 'Ruby';
    stack.files.push('Gemfile');
  }
  if (has('composer.json')) {
    stack.runtime = stack.runtime || 'PHP';
    stack.language = stack.language ? `${stack.language}, PHP` : 'PHP';
    stack.files.push('composer.json');
  }
  if (has('Dockerfile') || has('docker-compose.yml') || has('compose.yml')) {
    stack.files.push('Docker');
  }

  return stack;
}

function buildConfigSection(stack, crewName, agentFiles) {
  const agentRows = agentFiles
    .map((f) => {
      const name = f.replace(/^\d+-/, '').replace(/\.md$/, '');
      const role = name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
      return `| Feature work | @${name.split('-')[0] === 'carpenter' || name.split('-')[0] === 'boatswain' || name.includes('carpenter') || name.includes('boatswain') ? name : name.split('-')[0]} | ${role} |`;
    })
    .join('\n');

  return `## Shipcrew-AI Configuration

> Generated by \`npx @solvemotive/shipcrew-ai init\` — crew: **${crewName}**

| Detected | Value |
|----------|-------|
| Runtime | ${stack.runtime || 'Unknown'} |
| Language | ${stack.language || 'Unknown'} |
| Framework | ${stack.framework || 'None detected'} |
| ORM | ${stack.orm || 'None detected'} |
| Package manager | ${stack.packageManager || 'n/a'} |
| Manifests | ${stack.files.length ? stack.files.join(', ') : 'None'} |

### Task routing

| Task | Agent | Notes |
|------|-------|-------|
| Orchestrate multi-step features | @captain | Never writes app code; delegates only |
| Architecture & tech plan | @navigator | Plan before implementation |
| Backend / server logic | @boatswain | APIs, services, auth, data layer |
| Frontend UI | @carpenter / @carpenter-next | React/Vue or Next.js |
| API & GraphQL design | @rigger | Contracts, schemas, versioning |
| Security review | @gunner | Read-only; always Opus |
| Debug & fix bugs | @surgeon | Reproduce → isolate → fix |
| DevOps / CI / Docker | @quartermaster | Pipelines and infra as code |
| Tests & QA | @lookout | Unit, integration, e2e |
| Documentation | @cartographer | README, ADRs, API docs |
| Performance | @purser | Profiles, budgets, optimizations |
| Legacy exploration | @code-archaeologist | Map before changing |
| Database / ORM | @data-master | SQL, Prisma, Drizzle |
| UI/UX + Tailwind | @design-mate | Design system & polish |
| Stack detection | @team-configurator | Refresh this section |
| Node.js | @deckhand | Express/Fastify/Hono |
| NestJS | @helmsman | Modules, DI, guards |
| PHP | @steward | Composer / general PHP |
| Laravel | @sailmaker | Eloquent, Artisan |
| Spring Boot | @ironwright | Java/Kotlin services |
| Blockchain / web3 | @chainlocker | Contracts & wallet integrations |
| React Native | @outrigger | Expo / bare RN |

### Installed crew files

${agentFiles.map((f) => `- \`${f}\``).join('\n')}

${agentRows ? `<!-- routing hint rows available for custom extension -->\n` : ''}
When in doubt, start with: \`use @captain and …\`
`;
}

function upsertClaudeMd(cwd, section) {
  const target = path.join(cwd, 'CLAUDE.md');
  const markerStart = '<!-- shipcrew-ai:start -->';
  const markerEnd = '<!-- shipcrew-ai:end -->';
  const legacyStart = '<!-- shipcrew:start -->';
  const legacyEnd = '<!-- shipcrew:end -->';
  const block = `${markerStart}\n${section.trim()}\n${markerEnd}\n`;

  if (!fs.existsSync(target)) {
    fs.writeFileSync(
      target,
      `# Project Instructions\n\n${block}`,
      'utf8'
    );
    return 'created';
  }

  let existing = fs.readFileSync(target, 'utf8');
  // Migrate legacy markers if present
  if (existing.includes(legacyStart) && existing.includes(legacyEnd)) {
    existing = existing.replace(
      new RegExp(`${legacyStart}[\\s\\S]*?${legacyEnd}\\n?`),
      block
    );
    fs.writeFileSync(target, existing, 'utf8');
    return 'updated';
  }

  if (existing.includes(markerStart) && existing.includes(markerEnd)) {
    const next = existing.replace(
      new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}\\n?`),
      block
    );
    fs.writeFileSync(target, next, 'utf8');
    return 'updated';
  }

  fs.writeFileSync(target, `${existing.trimEnd()}\n\n${block}`, 'utf8');
  return 'appended';
}

function upsertReadmeBadge(cwd) {
  const readme = path.join(cwd, 'README.md');
  if (!fs.existsSync(readme)) return null;
  const badge =
    '[![shipcrew-ai](https://img.shields.io/badge/shipcrew--ai-ready-0ea5e9?style=flat-square)](https://github.com/solvemotive/shipcrew-ai)';
  let content = fs.readFileSync(readme, 'utf8');
  if (content.includes('shipcrew--ai-ready') || content.includes('shipcrew-ai-ready')) return 'exists';
  if (content.startsWith('#')) {
    const lines = content.split('\n');
    lines.splice(1, 0, '', badge);
    content = lines.join('\n');
    fs.writeFileSync(readme, content, 'utf8');
    return 'added';
  }
  return null;
}

function installSkills(cwd, force) {
  const dest = path.join(cwd, 'skills');
  if (!fs.existsSync(SKILLS_DIR)) return [];
  ensureDir(dest);
  const installed = [];
  for (const file of fs.readdirSync(SKILLS_DIR).filter((f) => f.endsWith('.md'))) {
    const target = path.join(dest, file);
    if (fs.existsSync(target) && !force) {
      installed.push({ file, status: 'skipped' });
      continue;
    }
    copyFile(path.join(SKILLS_DIR, file), target);
    installed.push({ file, status: 'copied' });
  }
  return installed;
}

function installCommands(cwd, force) {
  const src = path.join(PKG_ROOT, '.claude', 'commands');
  const dest = path.join(cwd, '.claude', 'commands');
  if (!fs.existsSync(src)) return [];
  ensureDir(dest);
  const installed = [];
  for (const file of fs.readdirSync(src).filter((f) => f.endsWith('.md'))) {
    const target = path.join(dest, file);
    if (fs.existsSync(target) && !force) {
      installed.push({ file, status: 'skipped' });
      continue;
    }
    copyFile(path.join(src, file), target);
    installed.push({ file, status: 'copied' });
  }
  return installed;
}

function installCursorRules(cwd, force) {
  const src = path.join(PKG_ROOT, '.cursor', 'rules', 'shipcrew-ai.mdc');
  const destDir = path.join(cwd, '.cursor', 'rules');
  const dest = path.join(destDir, 'shipcrew-ai.mdc');
  const legacy = path.join(destDir, 'shipcrew.mdc');
  if (!fs.existsSync(src)) return null;
  if (fs.existsSync(dest) && !force) return 'skipped';
  copyFile(src, dest);
  if (force && fs.existsSync(legacy)) {
    try {
      fs.unlinkSync(legacy);
    } catch {
      /* ignore */
    }
  }
  return 'copied';
}

async function cmdInit(args) {
  banner();
  const cwd = process.cwd();
  const force = args.includes('--force') || args.includes('-f');
  const yes = args.includes('--yes') || args.includes('-y');
  let crewName = args.find((a) => !a.startsWith('-') && a !== 'init');

  // Never mutate the shipcrew-ai package source tree itself
  const pkgJsonPath = path.join(cwd, 'package.json');
  if (path.resolve(cwd) === path.resolve(PKG_ROOT)) {
    log(c('red', '  Refusing to run init inside the shipcrew-ai source repo.'));
    log(c('dim', '  cd into your project directory, then run init again.'));
    process.exit(1);
  }
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const localPkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      if (localPkg.name === '@solvemotive/shipcrew-ai') {
        log(c('red', '  Refusing to run init inside the @solvemotive/shipcrew-ai package.'));
        log(c('dim', '  cd into your project directory, then run init again.'));
        process.exit(1);
      }
    } catch {
      /* ignore */
    }
  }

  const hasClaude = fs.existsSync(path.join(cwd, '.claude'));
  const hasCursor = fs.existsSync(path.join(cwd, '.cursor'));

  log(c('dim', `  Working directory: ${cwd}`));
  log(
    `  Detected: ${hasClaude ? c('green', '.claude') : c('dim', 'no .claude')} · ${
      hasCursor ? c('green', '.cursor') : c('dim', 'no .cursor')
    }`
  );
  log('');

  if (!crewName) {
    if (yes) {
      crewName = 'ship-crew';
    } else if (process.stdin.isTTY) {
      log(c('bold', '  Which crew do you want to install?'));
      const keys = Object.keys(TEAMS);
      keys.forEach((k, i) => {
        log(`    ${c('cyan', String(i + 1))}. ${k} — ${TEAMS[k]}`);
      });
      log('');
      const answer = await ask('  Enter number or name [ship-crew]: ');
      if (!answer) {
        crewName = 'ship-crew';
      } else if (/^\d+$/.test(answer)) {
        crewName = keys[Number(answer) - 1] || 'ship-crew';
      } else {
        crewName = answer;
      }
    } else {
      crewName = 'ship-crew';
      log(c('dim', '  Non-interactive shell — defaulting to ship-crew'));
    }
  }

  if (!TEAMS[crewName]) {
    log(c('red', `  Unknown crew: ${crewName}`));
    log(`  Available: ${Object.keys(TEAMS).join(', ')}`);
    process.exit(1);
  }

  const team = loadTeam(crewName);
  const agentFiles = resolveAgentFiles(team);

  if (!agentFiles.length) {
    log(c('red', '  No agents resolved for this crew.'));
    process.exit(1);
  }

  log('');
  log(c('bold', `  Installing ${crewName} (${agentFiles.length} agents)…`));

  const claudeAgents = path.join(cwd, '.claude', 'agents');
  const cursorAgents = path.join(cwd, '.cursor', 'agents');
  ensureDir(claudeAgents);
  ensureDir(cursorAgents);

  let copied = 0;
  let skipped = 0;
  let pruned = 0;

  // --force replaces the installed crew set (removes agents not in the selection)
  if (force) {
    for (const dir of [claudeAgents, cursorAgents]) {
      if (!fs.existsSync(dir)) continue;
      for (const existing of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
        if (!agentFiles.includes(existing)) {
          fs.unlinkSync(path.join(dir, existing));
          pruned += 1;
        }
      }
    }
  }

  for (const file of agentFiles) {
    const src = path.join(AGENTS_DIR, file);
    const claudeDest = path.join(claudeAgents, file);
    const cursorDest = path.join(cursorAgents, file);
    const content = fs.readFileSync(src, 'utf8');

    if (!fs.existsSync(claudeDest) || force) {
      ensureDir(path.dirname(claudeDest));
      fs.writeFileSync(claudeDest, content, 'utf8');
      copied += 1;
    } else {
      skipped += 1;
    }

    if (!fs.existsSync(cursorDest) || force) {
      ensureDir(path.dirname(cursorDest));
      fs.writeFileSync(cursorDest, toCursorAgent(content), 'utf8');
      copied += 1;
    } else {
      skipped += 1;
    }
    log(`  ${c('green', '✓')} ${file}`);
  }

  installCommands(cwd, force);
  installCursorRules(cwd, force);
  installSkills(cwd, force);
  const tpl = ensureShipcrewDir(cwd, TEMPLATES_SHIPCREW, force);
  if (tpl.length) {
    log(`  ${c('green', '✓')} .shipcrew/ autopilot templates (${tpl.map((t) => t.file).join(', ')})`);
  }

  const stack = detectStack(cwd);
  let configStatus = null;
  if (stack.files.length || fs.existsSync(path.join(cwd, 'package.json'))) {
    const section = buildConfigSection(stack, crewName, agentFiles);
    configStatus = upsertClaudeMd(cwd, section);
    log(`  ${c('green', '✓')} CLAUDE.md ${configStatus} (Shipcrew-AI Configuration)`);
    const badge = upsertReadmeBadge(cwd);
    if (badge) log(`  ${c('green', '✓')} README badge ${badge}`);
  } else {
    log(c('dim', '  No package manifest detected — skipped CLAUDE.md config'));
  }

  log('');
  log(c('green', c('bold', '  ⚓ Shipcrew-AI ready.')));
  log('');
  log(
    `  Copied ${copied} agent files${skipped ? ` (${skipped} skipped; use --force to overwrite)` : ''}${
      pruned ? ` (${pruned} removed from previous crew)` : ''
    }.`
  );
  log(`  Targets: ${c('cyan', '.claude/agents/')} and ${c('cyan', '.cursor/agents/')}`);
  log('');
  log(c('bold', '  Try:'));
  log(`    ${c('cyan', 'npx @solvemotive/shipcrew-ai run "Ship auth with tests"')}`);
  log(`    ${c('cyan', "/autopilot Ship auth with tests")}`);
  log(`    ${c('cyan', "claude 'use @captain and build auth'")}`);
  log('');
}

function cmdRun(args) {
  banner();
  const cwd = process.cwd();
  const force = args.includes('--force') || args.includes('-f');
  const goal = args.filter((a) => !a.startsWith('-')).join(' ').trim();
  if (!goal) {
    log(c('red', '  Usage: shipcrew-ai run "<goal>"'));
    process.exit(1);
  }

  ensureShipcrewDir(cwd, TEMPLATES_SHIPCREW, force);
  const existing = parseVoyageFields(readVoyage(cwd) || '');
  if (existing && existing.status === 'in_progress' && !force) {
    log(c('yellow', '  A voyage is already in_progress. Use --force to replace, or:'));
    log(`    ${c('cyan', 'shipcrew-ai resume')}`);
    log(`    ${c('cyan', 'shipcrew-ai status')}`);
    process.exit(1);
  }

  const { id, path: vpath } = startVoyage(cwd, { goal, source: 'cli', crew: 'ship-crew' });
  const prompt = buildAutopilotPrompt(goal);

  log(c('green', c('bold', '  ⚓ Autopilot voyage started')));
  log(`  id: ${id}`);
  log(`  file: ${c('cyan', vpath)}`);
  log('');
  log(c('bold', '  Paste into Claude Code / Cursor:'));
  log('');
  log(prompt);
  log('');
  log(c('dim', '  Or: /autopilot ' + goal));
  log('');
}

function cmdStatus() {
  banner();
  const cwd = process.cwd();
  const raw = readVoyage(cwd);
  if (!raw) {
    log(c('yellow', '  No voyage found. Start one:'));
    log(`    ${c('cyan', 'shipcrew-ai run "Your goal"')}`);
    process.exit(1);
  }
  const v = parseVoyageFields(raw);
  log(c('bold', '  Voyage status'));
  log(`  id:      ${v.id}`);
  log(`  status:  ${v.status}`);
  log(`  goal:    ${v.goal}`);
  log(`  crew:    ${v.crew}`);
  log(`  source:  ${v.source}`);
  log(`  updated: ${v.updated_at}`);
  log(`  file:    ${c('cyan', voyagePath(cwd))}`);
  if (v.summary) log(`  summary: ${v.summary}`);
  log('');
  const gates = raw.match(/gates:[\s\S]*?(?=\nblockers:|\nsummary:|$)/);
  if (gates) {
    log(c('bold', '  Gates'));
    log(gates[0].replace(/^/gm, '  '));
  }
  log('');
}

function cmdResume() {
  banner();
  const cwd = process.cwd();
  const raw = readVoyage(cwd);
  const v = parseVoyageFields(raw || '');
  if (!v || !v.goal) {
    log(c('yellow', '  No active voyage. Start with:'));
    log(`    ${c('cyan', 'shipcrew-ai run "Your goal"')}`);
    process.exit(1);
  }
  const prompt = `RESUME AUTOPILOT. Read .shipcrew/voyage.yml (status=${v.status}), .shipcrew/policy.md, .shipcrew/dod.md.

Continue mission: ${v.goal}

Do not restart from zero — update existing tasks, finish pending gates, satisfy DoD, then set status shipped or blocked.`;
  log(c('bold', '  Resume prompt:'));
  log('');
  log(prompt);
  log('');
}

function cmdList() {
  banner();
  log(c('bold', '  Crews'));
  for (const [name, desc] of Object.entries(TEAMS)) {
    try {
      const team = loadTeam(name);
      const count = (team.agents || []).includes('all')
        ? listAgentFiles().length
        : (team.agents || []).length;
      log(`  ${c('cyan', name.padEnd(16))} ${desc} ${c('dim', `(${count})`)}`);
    } catch {
      log(`  ${c('cyan', name.padEnd(16))} ${desc}`);
    }
  }
  log('');
  log(c('bold', '  Agents'));
  for (const file of listAgentFiles()) {
    const src = path.join(AGENTS_DIR, file);
    const raw = fs.readFileSync(src, 'utf8');
    const name = (raw.match(/^name:\s*(.+)$/m) || [])[1] || file;
    const desc = (raw.match(/^description:\s*(.+)$/m) || [])[1] || '';
    log(`  ${c('green', String(name).padEnd(22))} ${c('dim', desc.slice(0, 72))}${desc.length > 72 ? '…' : ''}`);
  }
  log('');
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'help';

  try {
    if (cmd === 'init') {
      await cmdInit(args.slice(1));
    } else if (cmd === 'run') {
      cmdRun(args.slice(1));
    } else if (cmd === 'status') {
      cmdStatus();
    } else if (cmd === 'resume') {
      cmdResume();
    } else if (cmd === 'list') {
      cmdList();
    } else if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
      banner();
      usage();
    } else if (cmd === '--version' || cmd === '-v' || cmd === 'version') {
      const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
      log(`shipcrew-ai v${pkg.version}`);
    } else {
      log(c('red', `Unknown command: ${cmd}`));
      usage();
      process.exit(1);
    }
  } catch (err) {
    log(c('red', `Error: ${err.message}`));
    process.exit(1);
  }
}

main();
