# shipcrew + Claude Code

Use shipcrew as Claude Code subagents under `.claude/agents/` plus slash commands `/ship` and `/crew`.

## Install

```bash
npx shipcrew init
npx shipcrew init ship-crew --force
```

Agents land in `.claude/agents/`. Commands land in `.claude/commands/`.

`init` also writes a **Shipcrew Configuration** section into `CLAUDE.md` when it detects a package manifest.

## Usage

```bash
claude "use @captain and build auth"
```

Slash commands:

```text
/ship Add team invites with role-based access
/crew What agent should own Redis caching?
```

## Subagent rules (shipcrew)

1. **@captain** is the only orchestrator and the only agent that should use the Agent tool to spawn specialists.
2. **@navigator** plans before Captain executes feature work.
3. **@gunner** is read-only and uses Opus.
4. Write/Edit backend/UI/tests/infra via **@boatswain**, **@carpenter**, **@carpenter-next**, **@surgeon**, **@quartermaster**, **@lookout**, **@team-configurator**.
5. Design-only agents (**@rigger**, **@data-master**, **@design-mate**, **@purser**, **@cartographer**, **@code-archaeologist**) produce specs/maps for implementers.

## CLAUDE.md

Keep the generated block bounded by:

```html
<!-- shipcrew:start -->
…
<!-- shipcrew:end -->
```

Refresh anytime:

```text
use @team-configurator and update Shipcrew Configuration
```

## Teams

Same presets as Cursor — see root [README.md](../README.md).
