---
name: ship-spec
description: Spec-driven voyage — write a crisp spec, chart with Navigator, then ship via Captain
---

# Skill: ship-spec

Use this workflow when the user wants reliable delivery of a feature or change.

## Steps

1. **Spec (5–10 bullets)**
   - Problem / user outcome
   - In scope / out of scope
   - Constraints (stack, time, compatibility)
   - Acceptance criteria (checkbox-ready)
   - Non-functionals (security, perf, a11y)

2. **Chart** — Run **@navigator** against the spec; require task table with owners.

3. **Sail** — **@captain** executes the chart: parallel specialists where possible.

4. **Inspect** — **@gunner** + **@lookout** before calling it done.

5. **Log** — Short voyage summary + leftover risks.

## Anti-patterns

- Coding before a plan on multi-file features
- Skipping security on auth/tenant/payment work
- One mega-agent doing UI + API + infra alone when crew is installed
