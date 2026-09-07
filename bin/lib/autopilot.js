'use strict';

const fs = require('fs');
const path = require('path');

const READONLY_AGENTS = new Set([
  'captain',
  'navigator',
  'rigger',
  'gunner',
  'cartographer',
  'purser',
  'code-archaeologist',
  'data-master',
  'design-mate',
]);

function parseFrontmatter(content) {
  const m = String(content).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  return { fm: m[1], body: m[2] };
}

function fmValue(fm, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const hit = fm.match(re);
  return hit ? hit[1].trim() : '';
}

/** Transform Claude Code agent markdown into Cursor-friendly frontmatter. */
function toCursorAgent(content) {
  const parsed = parseFrontmatter(content);
  if (!parsed) return content;

  const name = fmValue(parsed.fm, 'name') || 'agent';
  const description = fmValue(parsed.fm, 'description') || name;
  const model = fmValue(parsed.fm, 'model');
  const tools = fmValue(parsed.fm, 'tools');
  const readonly =
    READONLY_AGENTS.has(name) ||
    (tools && !/\b(Write|Edit|Bash)\b/i.test(tools));

  // Cursor: inherit | fast — map fast to fast, others/opus/sonnet to inherit
  const cursorModel = model === 'fast' ? 'fast' : 'inherit';

  const lines = ['---', `name: ${name}`, `description: ${description}`];
  if (readonly) lines.push('readonly: true');
  lines.push(`model: ${cursorModel}`, '---', '', parsed.body.replace(/^\n/, ''));
  return `${lines.join('\n')}\n`;
}

function isoNow() {
  return new Date().toISOString();
}

function voyagePath(cwd) {
  return path.join(cwd, '.shipcrew', 'voyage.yml');
}

function crewConfigPath(cwd) {
  return path.join(cwd, '.shipcrew', 'crew.json');
}

/** Persist the crew selected by `init` so `run` can reuse it. */
function writeInstalledCrew(cwd, crew) {
  const dest = path.join(cwd, '.shipcrew');
  ensureDir(dest);
  const payload = {
    crew: crew || 'ship-crew',
    updated_at: isoNow(),
  };
  fs.writeFileSync(crewConfigPath(cwd), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return payload.crew;
}

/** Last crew from init, or null if missing/invalid. */
function readInstalledCrew(cwd) {
  const p = crewConfigPath(cwd);
  if (!fs.existsSync(p)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const crew = typeof data.crew === 'string' ? data.crew.trim() : '';
    return crew || null;
  } catch {
    return null;
  }
}

function ensureShipcrewDir(cwd, templatesRoot, force) {
  const dest = path.join(cwd, '.shipcrew');
  ensureDir(dest);
  const files = ['policy.md', 'dod.md', 'voyage.yml'];
  const results = [];
  for (const file of files) {
    const src = path.join(templatesRoot, file);
    const target = path.join(dest, file);
    if (!fs.existsSync(src)) continue;
    if (fs.existsSync(target) && !force) {
      results.push({ file, status: 'skipped' });
      continue;
    }
    fs.copyFileSync(src, target);
    results.push({ file, status: 'copied' });
  }
  return results;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readVoyage(cwd) {
  const p = voyagePath(cwd);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf8');
}

function writeVoyage(cwd, text) {
  const p = voyagePath(cwd);
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, text, 'utf8');
}

function startVoyage(cwd, { goal, source, crew }) {
  const id = `voyage-${Date.now()}`;
  const now = isoNow();
  const text = `# Autopilot voyage state
id: "${id}"
goal: ${JSON.stringify(goal)}
status: in_progress
crew: ${crew || 'ship-crew'}
created_at: "${now}"
updated_at: "${now}"
source: ${JSON.stringify(source || 'cli')}

policy: .shipcrew/policy.md
dod: .shipcrew/dod.md

acceptance_criteria: []

tasks: []

gates:
  gunner: pending
  lookout: pending
  cartographer: n/a
  quartermaster: n/a

blockers: []
summary: ""
`;
  writeVoyage(cwd, text);
  return { id, path: voyagePath(cwd) };
}

function parseVoyageFields(raw) {
  if (!raw) return null;
  const parseScalar = (value) => {
    const v = String(value || '').trim();
    if (!v) return '';
    // Values written with JSON.stringify (goal, source, quoted ids/timestamps)
    if (v.startsWith('"')) {
      try {
        return JSON.parse(v);
      } catch {
        return v.replace(/^"|"$/g, '');
      }
    }
    return v;
  };
  const get = (key) => {
    const m = raw.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
    if (!m) return '';
    return parseScalar(m[1]);
  };
  return {
    id: get('id'),
    goal: get('goal'),
    status: get('status'),
    crew: get('crew'),
    source: get('source'),
    updated_at: get('updated_at'),
    summary: get('summary'),
  };
}

function buildAutopilotPrompt(goal) {
  return `AUTOPILOT MODE. Obey .shipcrew/policy.md and .shipcrew/dod.md. Resume/update .shipcrew/voyage.yml.

Mission: ${goal}

Protocol: @navigator plan → write tasks to voyage.yml → delegate specialists (parallel when safe) → @gunner/@lookout gates per policy → tick DoD → only then status: shipped. Captain only orchestrates; no app code from Captain.`;
}

module.exports = {
  toCursorAgent,
  READONLY_AGENTS,
  ensureShipcrewDir,
  writeInstalledCrew,
  readInstalledCrew,
  readVoyage,
  writeVoyage,
  startVoyage,
  parseVoyageFields,
  buildAutopilotPrompt,
  voyagePath,
  crewConfigPath,
};
