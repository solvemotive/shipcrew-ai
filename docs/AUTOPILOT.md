# Autopilot

Hands-off end-to-end delivery with shipcrew-ai.

## Quick start

```bash
npx --yes github:solvemotive/shipcrew-ai init ship-crew
npx --yes github:solvemotive/shipcrew-ai run "Ship team invites with RBAC"
```

Then paste the printed prompt into Claude Code / Cursor, or run:

```text
/autopilot Ship team invites with RBAC
```

## What gets installed

| Path | Role |
|------|------|
| `.shipcrew/policy.md` | Always-on routing + mandatory gates |
| `.shipcrew/dod.md` | Definition of Done — required before `shipped` |
| `.shipcrew/voyage.yml` | Multi-session voyage state |
| `.claude/commands/autopilot.md` | `/autopilot` slash command |

## CLI

```bash
shipcrew-ai run "goal"     # start voyage + print prompt
shipcrew-ai status         # show voyage.yml
shipcrew-ai resume         # continue in_progress voyage
```

## GitHub ticket → ship

1. Label an issue `ship` or `autopilot`
2. Action opens branch `autopilot/issue-N` with `.shipcrew/voyage.yml` + PR
3. Comment posts the exact `/autopilot` instructions

Workflow: [`.github/workflows/autopilot-issue.yml`](../.github/workflows/autopilot-issue.yml) (copy into your app repo).

**Prereq:** run `npx @solvemotive/shipcrew-ai init` in the app first so `.shipcrew/policy.md` and `.shipcrew/dod.md` already exist. The workflow **keeps** those files; it only falls back to `templates/shipcrew/*` (shipcrew-ai source tree) or a minimal stub if they are missing. It never overwrites an existing policy/DoD. Crew comes from `.shipcrew/crew.json` when present.

## Cursor transform

On `init`, `.claude/agents` keep Claude frontmatter (`tools`, `model`).  
`.cursor/agents` get Cursor frontmatter (`readonly`, `model: inherit`) — no `tools:` key.

## DoD rule

Captain must not declare shipped while DoD items remain unchecked without a `blocked` reason in `voyage.yml`.
