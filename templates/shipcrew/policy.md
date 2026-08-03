# shipcrew-ai policy (autopilot)

Edit this file in your project to enforce always-on routing. Captain and `/autopilot` must obey it.

## Mandatory gates

| Condition | Required agents | Notes |
|-----------|-----------------|-------|
| Auth, sessions, OAuth, API keys | @gunner, @lookout | Fail closed |
| Multi-tenant / IDOR-sensitive data | @gunner | Prove isolation |
| Payments, billing, webhooks | @gunner, @lookout | Idempotency required |
| Schema / migrations | @data-master then implementers | Expand/contract preferred |
| Public HTTP/GraphQL API | @rigger then writers; @gunner | Contracts first |
| CI / Docker / deploy | @quartermaster | Least privilege |
| Mobile (RN/Expo) | @outrigger | No web-only APIs |
| Smart contracts / wallet flows | @chainlocker, @gunner | Gunner mandatory |

## Stack routing (prefer specialists)

| Detected stack | Prefer |
|----------------|--------|
| NestJS | @helmsman |
| Express/Fastify/Hono Node | @deckhand |
| Laravel | @sailmaker |
| General PHP | @steward |
| Spring Boot | @ironwright |
| Next.js | @carpenter-next |
| React/Vue SPA | @carpenter |
| React Native | @outrigger |
| Blockchain / web3 | @chainlocker |

## Autopilot behavior

- Always start with **@navigator** for multi-file work.
- Update `.shipcrew/voyage.yml` as tasks progress.
- Do **not** mark voyage `shipped` until `.shipcrew/dod.md` is satisfied.
- If a gate cannot run, set task/voyage to `blocked` with reason — never silent skip.
