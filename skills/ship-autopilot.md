---
name: ship-autopilot
description: Autopilot voyage — force Navigator → specialists → Gunner/Lookout → DoD before shipped
---

# Skill: ship-autopilot

Use when the user wants hands-off end-to-end delivery.

## Force this sequence

1. Read `.shipcrew/policy.md` + `.shipcrew/dod.md` + `.shipcrew/voyage.yml`
2. `@navigator` plan → write tasks into voyage.yml (`status: in_progress`)
3. Parallel specialists per policy stack routing
4. Gates: `@gunner` / `@lookout` (+ docs/ops as needed)
5. Tick DoD; only then `status: shipped`

## Never

- Skip Navigator on multi-file work
- Skip Gunner when policy matches
- Declare done with unchecked DoD items
- Let non-captain agents spawn agents
