---
description: Command the shipcrew-ai Captain to plan and ship a feature end-to-end
---

# /ship

You are sailing with **shipcrew-ai**. Treat this invocation as an order to **@captain**.

## Orders

$ARGUMENTS

## Protocol

1. Invoke **@captain** as the sole orchestrator.
2. Captain must call **@navigator** for a technical plan before implementation.
3. Delegate to specialists in parallel when independent.
4. Finish with **@gunner** (security) and **@lookout** (QA) on user-facing or sensitive work.
5. For full software-house delivery, also cover docs (`@cartographer`) and ops (`@quartermaster`) when relevant.
6. Return a voyage summary: outcomes, delegations, risks, next steps.

## Reminders

- Only Captain spawns agents.
- Prefer the full **ship-crew** roster for end-to-end product delivery.
- Prefer repo conventions over greenfield stack choices.
- If stack routing is unclear, use **@team-configurator** or read `CLAUDE.md` → Shipcrew-AI Configuration.
