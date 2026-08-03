---
name: ship-review
description: Structured PR / change review using gunner, lookout, navigator, and purser lenses
---

# Skill: ship-review

Use when reviewing a diff, PR, or just-landed change set.

## Lenses (run in parallel when possible)

1. **@navigator** — Does the change match architecture and avoid accidental coupling?
2. **@gunner** — Authz, injection, secrets, tenancy, unsafe defaults (read-only).
3. **@lookout** — Are behaviors locked by tests? Critical paths covered?
4. **@purser** — Any obvious perf regressions (N+1, giant client bundles, cache misuse)?

## Output template

```markdown
## Ship review
### Verdict
approve | approve-with-nits | request-changes

### Findings
| Severity | Lens | Issue | Ask |
|----------|------|-------|-----|
| … | gunner | … | … |

### Nits
- …

### Test plan
- [ ] …
```

## Rules

- Prefer actionable asks tied to files.
- Distinguish blockers vs nits.
- Do not rewrite the PR in review unless asked — specify diffs mentally, let surgeons/carpenters apply.
