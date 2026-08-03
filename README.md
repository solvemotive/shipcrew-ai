# shipcrew

[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![npx](https://img.shields.io/badge/npx-shipcrew-black?style=flat-square)](https://github.com/solvemotive/shipcrew#quick-start)
[![Cursor](https://img.shields.io/badge/Cursor-compatible-0A66C2?style=flat-square&logo=cursor&logoColor=white)](./docs/CURSOR.md)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-D97706?style=flat-square)](./docs/CLAUDE.md)
[![GitHub stars](https://img.shields.io/github/stars/solvemotive/shipcrew?style=flat-square&logo=github)](https://github.com/solvemotive/shipcrew)

**The AI crew that actually ships. For Cursor & Claude Code.**

> Stop prompting. Command a crew.

One command installs a full company of specialized AI agents that work natively in **Cursor** (`.cursor/rules`, `.cursor/agents`) and **Claude Code** (`.claude/agents`).

## Quick start

**1. Initialize shipcrew in your project**

```bash
npx shipcrew init
```

**2. Pick a crew** (interactive), or pass one explicitly:

```bash
npx shipcrew init saas-crew
# indie-crew | bug-hunt-crew | launch-crew | ship-crew
```

**3. Command the Captain**

```bash
claude "use @captain and build auth"
```

In Cursor Agent:

```text
@captain ship email auth with Prisma and tests
```

Alternative installers:

```bash
curl -fsSL https://raw.githubusercontent.com/solvemotive/shipcrew/main/install.sh | bash
```

```powershell
irm https://raw.githubusercontent.com/solvemotive/shipcrew/main/install.ps1 | iex
```

## Why shipcrew vs solo AI

| Solo prompting | shipcrew |
|----------------|----------|
| One generalist does architecture, code, security, and tests | Specialists with clear jobs and tool permissions |
| Easy to skip threat modeling | **@gunner** is read-only Opus security on every sensitive voyage |
| Plans optional | **@navigator** charts before Captain executes |
| Context muddies across roles | Agents stay scoped; Captain synthesizes |
| Works in one tool | Same crew for **Cursor** and **Claude Code** |

## Crew roster (16)

| Agent | Role | Model | Tools |
|-------|------|-------|-------|
| **@captain** | Orchestrator / tech lead — only agent that spawns others | opus | Read, Glob, Grep, Agent |
| **@navigator** | System architect — plans before build | sonnet | Read, Glob, Grep |
| **@boatswain** | Backend engineer (universal) | sonnet | Read, Glob, Grep, Bash, Edit, Write |
| **@carpenter** | Frontend React/Vue | sonnet | Read, Glob, Grep, Bash, Edit, Write |
| **@carpenter-next** | Next.js (App Router, RSC, actions) | sonnet | Read, Glob, Grep, Bash, Edit, Write |
| **@rigger** | API & GraphQL architect | sonnet | Read, Glob, Grep |
| **@gunner** | Security auditor (always read-only) | opus | Read, Glob, Grep |
| **@surgeon** | Debugger & bug fixer | sonnet | Read, Glob, Grep, Bash, Edit, Write |
| **@quartermaster** | DevOps — Docker, CI/CD | sonnet | Read, Glob, Grep, Bash, Edit, Write |
| **@lookout** | Tests & QA | sonnet | Read, Glob, Grep, Bash, Edit, Write |
| **@cartographer** | Documentation | sonnet | Read, Glob, Grep |
| **@purser** | Performance optimizer | sonnet | Read, Glob, Grep |
| **@code-archaeologist** | Legacy / unfamiliar code explorer | sonnet | Read, Glob, Grep |
| **@data-master** | DBA — SQL, Prisma, Drizzle | sonnet | Read, Glob, Grep |
| **@design-mate** | UI/UX + Tailwind | sonnet | Read, Glob, Grep |
| **@team-configurator** | Detects stack; writes CLAUDE.md config | sonnet | Read, Glob, Grep, Bash, Edit, Write |

## Teams

Presets live in `teams/*.json` and control which agents `init` copies:

| Team | Agents | Best for |
|------|--------|----------|
| **saas-crew** | captain, navigator, boatswain, carpenter-next, rigger, gunner, lookout | SaaS products |
| **indie-crew** | captain, carpenter-next, design-mate, quartermaster | Lean solo/small teams |
| **bug-hunt-crew** | captain, surgeon, lookout, gunner | Incidents & regressions |
| **launch-crew** | captain, navigator, carpenter-next, design-mate, quartermaster, cartographer, team-configurator | Greenfield scaffolding |
| **ship-crew** | all 16 | Full coverage |

```bash
npx shipcrew list
npx shipcrew init bug-hunt-crew --force
```

## How Captain works

When you ask to build something, **@captain**:

1. Calls **@navigator** for a technical plan  
2. Breaks the plan into tasks  
3. Delegates to specialists (parallel when independent)  
4. Runs **@gunner** + **@lookout** for final check  
5. Reports a voyage summary — Captain does **not** write app code  

## What `init` does

- Detects `.claude` / `.cursor`
- Copies selected agents → `.claude/agents/` and `.cursor/agents/`
- Installs `.claude/commands/` (`/ship`, `/crew`) and `.cursor/rules/shipcrew.mdc`
- If `package.json` (or other manifests) exist, writes **## Shipcrew Configuration** into `CLAUDE.md` with a Task \| Agent \| Notes table

## Skills

- `skills/ship-spec.md` — spec → navigate → ship → verify  
- `skills/ship-review.md` — multi-lens PR review  

## Docs

- [Cursor setup](./docs/CURSOR.md)
- [Claude Code setup](./docs/CLAUDE.md)

## Development

```bash
git clone https://github.com/solvemotive/shipcrew.git
cd shipcrew
node bin/cli.js list
node bin/cli.js init ship-crew --yes
```

## License

[MIT](./LICENSE)
