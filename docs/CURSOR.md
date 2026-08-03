# shipcrew + Cursor

Use shipcrew agents natively in Cursor via `.cursor/agents/` and the always-on rule `.cursor/rules/shipcrew.mdc`.

## Install

```bash
npx --yes github:solvemotive/shipcrew-ai init
# or pick a crew
npx --yes github:solvemotive/shipcrew-ai init saas-crew
# after npm publish: npx @solvemotive/shipcrew-ai init
```

This copies agents into `.cursor/agents/` and installs `shipcrew.mdc`.

## Usage

In Cursor Agent chat:

```text
@captain ship email+password auth with Prisma
```

Or call a specialist directly for narrow work:

```text
@surgeon fix the failing auth test
@gunner review the middleware authz
@carpenter-next add a settings page
```

## Tips

- Multi-step features → **@captain** (orchestrates Navigator → specialists → Gunner/Lookout).
- Planning only → **@navigator**.
- Security-sensitive → always include **@gunner** before merge.
- After changing stacks or apps in a monorepo → **@team-configurator**.

## Teams

| Crew | Best for |
|------|----------|
| `saas-crew` | Product SaaS (Next + API + security + QA) |
| `indie-crew` | Solo/small teams (4 agents) |
| `bug-hunt-crew` | Incidents and regressions |
| `launch-crew` | Greenfield scaffolding |
| `ship-crew` | Full company of 16 |

See the root [README.md](../README.md) for the full roster.
