'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'cli.js');
const { toCursorAgent, startVoyage, parseVoyageFields, buildAutopilotPrompt } = require('../bin/lib/autopilot');

function runCli(cwd, args) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
  });
}

test('toCursorAgent strips tools and sets readonly for gunner', () => {
  const src = fs.readFileSync(path.join(ROOT, 'agents', '06-gunner-security.md'), 'utf8');
  const out = toCursorAgent(src);
  assert.match(out, /^---\nname: gunner/m);
  assert.match(out, /readonly: true/);
  assert.doesNotMatch(out, /^tools:/m);
  assert.match(out, /model: inherit/);
});

test('toCursorAgent allows writers without readonly', () => {
  const src = fs.readFileSync(path.join(ROOT, 'agents', '16-deckhand-nodejs.md'), 'utf8');
  const out = toCursorAgent(src);
  assert.match(out, /name: deckhand/);
  assert.doesNotMatch(out, /readonly: true/);
});

test('init ship-crew installs agents, commands, and .shipcrew templates', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shipcrew-test-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'demo', dependencies: { next: '15' } }));
  const res = runCli(dir, ['init', 'ship-crew', '--yes']);
  assert.equal(res.status, 0, res.stderr || res.stdout);
  assert.ok(fs.existsSync(path.join(dir, '.claude', 'agents', '00-captain.md')));
  assert.ok(fs.existsSync(path.join(dir, '.cursor', 'agents', '00-captain.md')));
  assert.ok(fs.existsSync(path.join(dir, '.claude', 'commands', 'autopilot.md')));
  assert.ok(fs.existsSync(path.join(dir, '.shipcrew', 'policy.md')));
  assert.ok(fs.existsSync(path.join(dir, '.shipcrew', 'dod.md')));
  const cursorCaptain = fs.readFileSync(path.join(dir, '.cursor', 'agents', '00-captain.md'), 'utf8');
  assert.match(cursorCaptain, /readonly: true/);
  assert.equal(fs.readdirSync(path.join(dir, '.claude', 'agents')).length, 23);
});

test('run + status + resume voyage lifecycle', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shipcrew-run-'));
  fs.writeFileSync(path.join(dir, 'package.json'), '{"name":"x"}');
  runCli(dir, ['init', 'indie-crew', '--yes']);
  const run = runCli(dir, ['run', 'Ship', 'auth']);
  assert.equal(run.status, 0, run.stdout);
  assert.match(run.stdout, /Autopilot voyage started/);
  assert.match(run.stdout, /AUTOPILOT MODE/);
  const st = runCli(dir, ['status']);
  assert.equal(st.status, 0);
  assert.match(st.stdout, /status:\s+in_progress/);
  assert.match(st.stdout, /Ship auth/);
  const rs = runCli(dir, ['resume']);
  assert.equal(rs.status, 0);
  assert.match(rs.stdout, /RESUME AUTOPILOT/);
});

test('startVoyage writes parseable fields', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shipcrew-v-'));
  startVoyage(dir, { goal: 'Test goal', source: 'test', crew: 'ship-crew' });
  const raw = fs.readFileSync(path.join(dir, '.shipcrew', 'voyage.yml'), 'utf8');
  const v = parseVoyageFields(raw);
  assert.equal(v.goal, 'Test goal');
  assert.equal(v.status, 'in_progress');
  assert.match(buildAutopilotPrompt('X'), /Mission: X/);
});

test('unknown crew fails', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shipcrew-bad-'));
  const res = runCli(dir, ['init', 'nope', '--yes']);
  assert.notEqual(res.status, 0);
});

test('refuses init inside package root', () => {
  const res = runCli(ROOT, ['init', 'indie-crew', '--yes']);
  assert.notEqual(res.status, 0);
  assert.match(res.stdout + res.stderr, /Refusing/);
});
