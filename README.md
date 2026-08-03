# shipcrew-ai

[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![npm](https://img.shields.io/npm/v/@solvemotive/shipcrew-ai?style=flat-square)](https://www.npmjs.com/package/@solvemotive/shipcrew-ai)
[![npm downloads](https://img.shields.io/npm/dm/@solvemotive/shipcrew-ai?style=flat-square)](https://www.npmjs.com/package/@solvemotive/shipcrew-ai)
[![GitHub](https://img.shields.io/badge/GitHub-solvemotive%2Fshipcrew--ai-181717?style=flat-square&logo=github)](https://github.com/solvemotive/shipcrew-ai)
[![Cursor](https://img.shields.io/badge/Cursor-compatible-0A66C2?style=flat-square&logo=cursor&logoColor=white)](./docs/CURSOR.md)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-D97706?style=flat-square)](./docs/CLAUDE.md)
[![GitHub stars](https://img.shields.io/github/stars/solvemotive/shipcrew-ai?style=flat-square&logo=github)](https://github.com/solvemotive/shipcrew-ai)

# Stop prompting. Command a crew.

**shipcrew-ai** is a full **AI software house** in one repo — **23 specialists** for Cursor & Claude Code that deliver end-to-end: discovery → architecture → build → security → QA → docs → ship.

One install. One Captain. The whole team.

```bash
npx --yes github:solvemotive/shipcrew-ai init ship-crew
```

Then:

```bash
claude "use @captain and build auth"
```

```text
@captain ship email auth with Prisma and tests
```

---

## Autopilot

```bash
npx --yes github:solvemotive/shipcrew-ai init ship-crew
npx --yes github:solvemotive/shipcrew-ai run "Ship team invites with RBAC"
```

Paste the prompt into Claude/Cursor, or use `/autopilot …`.  
Gates: `.shipcrew/policy.md` + `.shipcrew/dod.md` + voyage state. Full guide: [docs/AUTOPILOT.md](./docs/AUTOPILOT.md).

## Why shipcrew-ai

A solo model is a freelancer. **shipcrew-ai is the software house**: product engineering, platform stacks, security, QA, DevOps, and docs — coordinated by Captain for full delivery.

| Solo AI | shipcrew-ai (software house) |
|---------|------------------------------|
| One model does everything | 23 specialists with clear jobs |
| Easy to skip security / tests | **@gunner** + **@lookout** gate the voyage |
| Plans optional | **@navigator** charts before build |
| Stack-blind | Node, Nest, PHP, Laravel, Spring, RN, web3, Next… |
| Tool-specific prompts | Same crew in **Cursor** and **Claude Code** |

### End-to-end delivery loop

```mermaid
flowchart LR
  You[You] --> Captain[@captain]
  Captain --> Navigator[@navigator plan]
  Navigator --> Captain
  Captain --> Specs[Specialists in parallel]
  Specs --> Gunner[@gunner]
  Specs --> Lookout[@lookout]
  Gunner --> Captain
  Lookout --> Captain
  Captain --> You
```

1. **@navigator** writes the chart (architecture, tasks, risks)  
2. **@captain** delegates — backend, frontend, API, DB, DevOps…  
3. **@gunner** + **@lookout** gate sensitive / shippable work  
4. Captain returns a voyage summary — **never writes app code**

---

## Quick start

### 1. Install into your project

```bash
cd your-app
npx @solvemotive/shipcrew-ai init ship-crew
```

Pick a crew interactively, or pass one (`indie-crew` · `bug-hunt-crew` · `launch-crew` · `polyglot-crew` · `ship-crew`):

```bash
npx @solvemotive/shipcrew-ai init saas-crew
npx @solvemotive/shipcrew-ai run "Ship auth"
```

If your package manager blocks brand-new publishes (“not found” / “too new”), wait ~24h, pass `--min-release-age=0`, or install from GitHub:

```bash
npx --yes github:solvemotive/shipcrew-ai init ship-crew
```
**Shell installers** (npm → GitHub → git clone fallbacks):

```bash
curl -fsSL https://raw.githubusercontent.com/solvemotive/shipcrew-ai/main/install.sh | bash
```

```powershell
irm https://raw.githubusercontent.com/solvemotive/shipcrew-ai/main/install.ps1 | iex
```

### 2. Command the Captain

| Tool | Example |
|------|---------|
| Claude Code | `claude "use @captain and build auth"` |
| Claude slash | `/ship Add magic-link login` |
| Cursor Agent | `@captain ship email auth with Prisma and tests` |

### 3. What lands in your repo

| Path | Purpose |
|------|---------|
| `.claude/agents/` | Claude Code subagents |
| `.claude/commands/` | `/ship`, `/crew` |
| `.cursor/agents/` | Cursor agents |
| `.cursor/rules/shipcrew-ai.mdc` | Always-on routing rule |
| `CLAUDE.md` | Shipcrew-AI Configuration (Task \| Agent \| Notes) when a manifest is detected |

---

## Choose a crew

**Default for full software-house delivery: `ship-crew` (all 23).**  
Smaller presets exist when you want a leaner roster.

| Crew | Size | Best for | Includes |
|------|------|----------|----------|
| **ship-crew** | 23 | Full E2E software house | Entire roster — recommended |
| **saas-crew** | 7 | Product SaaS slice | captain, navigator, boatswain, carpenter-next, rigger, gunner, lookout |
| **polyglot-crew** | 11 | Multi-stack backends/mobile | Node, Nest, PHP, Laravel, Spring, chain, RN + core |
| **indie-crew** | 4 | Solo / small teams | captain, carpenter-next, design-mate, quartermaster |
| **bug-hunt-crew** | 4 | Incidents & regressions | captain, surgeon, lookout, gunner |
| **launch-crew** | 7 | Greenfield scaffolding | captain, navigator, carpenter-next, design-mate, quartermaster, cartographer, team-configurator |

```bash
npx --yes github:solvemotive/shipcrew-ai list
npx --yes github:solvemotive/shipcrew-ai init bug-hunt-crew --force
```

`--force` replaces the installed crew set (prunes agents not in the new preset).

---

## Crew roster (23)

| Agent | Role | Model | Mutates repo? |
|-------|------|-------|---------------|
| **@captain** | Orchestrator — only agent that spawns others | opus | No (Agent tool only) |
| **@navigator** | System architect — plan before build | sonnet | No |
| **@boatswain** | Backend (APIs, auth, jobs, services) | sonnet | Yes |
| **@carpenter** | Frontend React / Vue | sonnet | Yes |
| **@carpenter-next** | Next.js App Router / RSC / actions | sonnet | Yes |
| **@rigger** | API & GraphQL contracts | sonnet | No |
| **@gunner** | Security auditor | opus | **Never** |
| **@surgeon** | Debugger & minimal fixes | sonnet | Yes |
| **@quartermaster** | Docker, CI/CD, deploy | sonnet | Yes |
| **@lookout** | Tests & QA | sonnet | Yes |
| **@cartographer** | Docs / ADRs / runbooks | sonnet | Drafts only |
| **@purser** | Performance | sonnet | No |
| **@code-archaeologist** | Legacy / unknown codebases | sonnet | No |
| **@data-master** | SQL, Prisma, Drizzle | sonnet | No (specs) |
| **@design-mate** | UI/UX + Tailwind | sonnet | No (specs) |
| **@team-configurator** | Stack detect → CLAUDE.md | sonnet | Yes |
| **@deckhand** | Node.js (Express/Fastify/Hono) | sonnet | Yes |
| **@helmsman** | NestJS | sonnet | Yes |
| **@steward** | PHP | sonnet | Yes |
| **@sailmaker** | Laravel | sonnet | Yes |
| **@ironwright** | Spring Boot (Java/Kotlin) | sonnet | Yes |
| **@chainlocker** | Blockchain / web3 | sonnet | Yes |
| **@outrigger** | React Native / Expo | sonnet | Yes |

---

## Prompt recipes

Copy-paste starters — full playbook in [docs/VOYAGES.md](./docs/VOYAGES.md).

**New feature**
```text
@captain Ship team invites with role-based access.
Use @navigator first. Prefer existing auth patterns. End with @gunner + @lookout.
```

**Bug**
```text
@captain Fix flaky checkout test on CI only.
Delegate @surgeon, then lock with @lookout. @gunner if auth/money touched.
```

**Security pass**
```text
@gunner Review auth middleware and tenant isolation. Read-only. Rank findings by severity.
```

**Greenfield**
```text
@captain Scaffold a Next.js SaaS with Prisma, Auth.js, and Tailwind.
Use launch-crew specialists. @cartographer should draft README setup.
```

---

## Platform guides

| Guide | Contents |
|-------|----------|
| [docs/CURSOR.md](./docs/CURSOR.md) | Cursor agents, rules, recipes, troubleshooting |
| [docs/CLAUDE.md](./docs/CLAUDE.md) | Claude Code subagents, `/ship` `/crew`, CLAUDE.md markers |
| [docs/VOYAGES.md](./docs/VOYAGES.md) | End-to-end prompt playbooks |
| [docs/FAQ.md](./docs/FAQ.md) | Common issues and answers |
| [docs/AUTOPILOT.md](./docs/AUTOPILOT.md) | Autopilot, voyage state, GitHub label flow |

### Skills (optional playbooks)

- `skills/ship-spec.md` — spec → navigate → ship → verify  
- `skills/ship-review.md` — multi-lens PR review  

---

## CLI reference

```bash
npx --yes github:solvemotive/shipcrew-ai init [crew] [--force] [--yes]
npx --yes github:solvemotive/shipcrew-ai list
npx --yes github:solvemotive/shipcrew-ai help
npx --yes github:solvemotive/shipcrew-ai version
```

| Flag | Meaning |
|------|---------|
| `--yes` / `-y` | Non-interactive (default crew `ship-crew` if omitted) |
| `--force` / `-f` | Overwrite agents; prune ones not in the selected crew |

CLI bin after install: **`shipcrew-ai`**.

Package: **`@solvemotive/shipcrew-ai`** · Repo: **[solvemotive/shipcrew-ai](https://github.com/solvemotive/shipcrew-ai)**

---

## Development

```bash
git clone https://github.com/solvemotive/shipcrew-ai.git
cd shipcrew-ai
node bin/cli.js list
# init only inside a separate test project — never in this repo
mkdir /tmp/crew-demo && cd /tmp/crew-demo
npm init -y
node /path/to/shipcrew-ai/bin/cli.js init indie-crew --yes
```

Edit agents in `agents/` only, then copy to `.claude/agents/` and `.cursor/agents/`.

## License

[MIT](./LICENSE) © SolveMotive
