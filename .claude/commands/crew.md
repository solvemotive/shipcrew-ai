---
description: Inspect installed shipcrew agents, pick a crew, or ask Captain who should handle a task
---

# /crew

$ARGUMENTS

## Intent

Help the user work with their installed **shipcrew** agents.

## Behavior

1. List agents present under `.claude/agents/` (and `.cursor/agents/` if present).
2. If the user names a goal, recommend the right crew member(s) with a one-line why.
3. If the user asks to install/switch crews, remind them:
   ```bash
   npx @solvemotive/shipcrew-ai init
   npx @solvemotive/shipcrew-ai init saas-crew
   npx @solvemotive/shipcrew-ai list
   ```
4. For multi-step work, recommend: `use @captain and …` or `/ship …`.
5. Summarize team presets: `saas-crew`, `indie-crew`, `bug-hunt-crew`, `ship-crew`, `launch-crew`.

## Output

- Installed agents table (name · role)
- Recommended call for the user’s ask
- Optional next command they can paste
