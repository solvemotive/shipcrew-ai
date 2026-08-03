# shipcrew + Claude Code

Install shipcrew as **Claude Code subagents** under `.claude/agents/`, plus slash commands `/ship` and `/crew`.

## Install

```bash
cd your-app
npx --yes github:solvemotive/shipcrew-ai init
npx --yes github:solvemotive/shipcrew-ai init saas-crew   # optional preset
```

After npm publish: `npx @solvemotive/shipcrew-ai init`.

### What you get

| Path | Role |
|------|------|
| `.claude/agents/*.md` | Subagents (`name:` frontmatter = `@name`) |
| `.claude/commands/ship.md` | `/ship …` → Captain voyage |
| `.claude/commands/crew.md` | `/crew …` → roster help / routing |
| `.cursor/agents/` + `shipcrew.mdc` | Same crew for Cursor |
| `CLAUDE.md` | `<!-- shipcrew:start -->` configuration block |

## Usage

### Captain (default for features)

```bash
claude "use @captain and build auth with Prisma"
```

```text
/ship Add team invites with RBAC and email notifications
```

### Slash: inspect the crew

```text
/crew Who should own Redis caching?
```

### Specialists

```bash
claude "use @gunner and audit tenant isolation on /api/projects"
claude "use @lookout and add regression tests for the invite flow"
claude "use @navigator and chart a plan for migrating to App Router"
```

## Subagent rules (non-negotiable)

1. **@captain** is the only orchestrator — only Captain should spawn agents.
2. **@navigator** plans before feature implementation.
3. **@gunner** is always read-only and uses **Opus**.
4. **Writers:** `@boatswain`, `@carpenter`, `@carpenter-next`, `@surgeon`, `@quartermaster`, `@lookout`, `@team-configurator`.
5. **Spec / map agents** (read-only tools): `@rigger`, `@data-master`, `@design-mate`, `@purser`, `@cartographer`, `@code-archaeologist` — Captain assigns implementers to apply their output.

## CLAUDE.md markers

`init` upserts:

```html
<!-- shipcrew:start -->
## Shipcrew Configuration
…
<!-- shipcrew:end -->
```

Refresh without a full re-init:

```text
use @team-configurator and update Shipcrew Configuration for this monorepo
```

Do not hand-edit inside the markers unless you know you’ll overwrite on next `init`.

## Crew presets

Same as Cursor — `saas-crew`, `indie-crew`, `bug-hunt-crew`, `launch-crew`, `ship-crew`.

```bash
npx --yes github:solvemotive/shipcrew-ai init launch-crew --force
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `@captain` unknown | Confirm `.claude/agents/00-captain.md` and frontmatter `name: captain` |
| Agent tries to edit as gunner | Re-state read-only; check tools frontmatter is Read/Glob/Grep only |
| Parallel agents collide | Ask Captain to serialize schema → API → UI |
| Config section stale | `@team-configurator` or re-`init` |
| Want fewer agents | Smaller crew + `--force` |

## Tips

- Prefer `/ship` for multi-step product work — it encodes the voyage protocol.
- Pass constraints once (“no new dependencies”, “match existing auth helper”).
- For GraphQL/REST design, call `@rigger` before `@boatswain` implements.

More: [VOYAGES.md](./VOYAGES.md) · [FAQ.md](./FAQ.md) · [README](../README.md)
