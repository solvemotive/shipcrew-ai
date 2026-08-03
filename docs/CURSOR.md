# shipcrew-ai + Cursor

Run a full AI crew inside **Cursor Agent** — same specialists as Claude Code, installed to `.cursor/agents/` with an always-on rule.

## Install

```bash
cd your-app
npx --yes github:solvemotive/shipcrew-ai init
# or a preset:
npx --yes github:solvemotive/shipcrew-ai init saas-crew
```

After npm publish: `npx @solvemotive/shipcrew-ai init`.

### What you get

| Path | Role |
|------|------|
| `.cursor/agents/*.md` | Subagents you `@`-mention |
| `.cursor/rules/shipcrew-ai.mdc` | Routing cheat sheet (`alwaysApply`) |
| `.claude/agents/` | Same crew for Claude Code (dual install) |
| `CLAUDE.md` | Stack + Task\|Agent\|Notes (if manifests found) |

## Usage patterns

### Feature voyage (recommended)

```text
@captain Ship billing portal: list invoices, download PDF, update payment method.
Follow shipcrew-ai protocol: @navigator plan first, parallel specialists, then @gunner + @lookout.
```

### Direct specialist (narrow work)

```text
@carpenter-next Add a settings page with server actions and zod validation
@surgeon Isolate why webhook retries double-charge
@gunner Review this diff for IDOR and secret leakage — read only
@design-mate Spec Tailwind + a11y fixes for the empty-state on /projects
```

### Legacy / unknown repo

```text
@code-archaeologist Map auth and tenancy before we change anything.
Then @captain: propose the smallest safe path to add SSO.
```

## When to use whom

| Situation | Start with |
|-----------|------------|
| Multi-file feature | `@captain` |
| Architecture only | `@navigator` |
| Next.js UI / RSC | `@carpenter-next` |
| React/Vue SPA | `@carpenter` |
| API / server | `@boatswain` |
| Schema / Prisma | `@data-master` then implementers |
| CI / Docker | `@quartermaster` |
| Failing tests / bugs | `@surgeon` + `@lookout` |
| Before merge (auth/tenant/pay) | `@gunner` |

## Crew presets

| Crew | Best for |
|------|----------|
| `saas-crew` | Next + API + security + QA |
| `indie-crew` | Lean 4-agent setup |
| `bug-hunt-crew` | Incident response |
| `launch-crew` | New project scaffolding |
| `ship-crew` | All 23 agents |
| `polyglot-crew` | Node, Nest, PHP, Laravel, Spring, Blockchain, React Native |

Switch crews:

```bash
npx --yes github:solvemotive/shipcrew-ai init bug-hunt-crew --force
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `@captain` not listed | Re-run `init`; confirm `.cursor/agents/00-captain.md` exists |
| Agent ignores “read-only” | Prefer Claude Code for strict tool lists today; still instruct `@gunner` not to edit |
| Wrong stack in CLAUDE.md | `@team-configurator` refresh, or re-run `init` |
| Too many agents / noise | Install `indie-crew` or `saas-crew` instead of `ship-crew` |
| Accidental prune | `--force` replaces the crew set — re-init `ship-crew` to restore all |

## Tips

- Keep user messages **outcome-shaped** (“ship X with Y constraint”), not file laundry lists — Navigator/Captain will chart files.
- For design-system work, pair `@design-mate` (spec) with `@carpenter-next` (implement).
- Security-sensitive PRs: always run `@gunner` before you call it done.

More recipes: [VOYAGES.md](./VOYAGES.md) · FAQ: [FAQ.md](./FAQ.md) · Roster: [README](../README.md)
