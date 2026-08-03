# Voyages — prompt playbooks

Ready-to-run prompts for shipcrew. Replace bracketed bits. Prefer **@captain** for anything that spans more than one concern.

## Feature shipping

### Auth

```text
@captain Ship email+password auth with sessions (or Auth.js if already in repo).
Constraints: match existing patterns; no new auth vendors unless necessary.
Protocol: @navigator → implementers → @gunner → @lookout.
Done when: signup/login/logout works, tests cover authz happy+deny paths.
```

### CRUD resource

```text
@captain Ship [Resource] CRUD (list/create/edit/delete) for the current stack.
Include validation, empty states, and tenant isolation if multi-tenant.
@navigator charts files; @data-master if schema changes; @rigger for API shape.
```

### Billing / payments

```text
@captain Add [Stripe/Lemon] checkout + customer portal for [plan].
Hard requirement: @gunner before done. No secrets in client. Idempotent webhooks.
```

## Debugging

### Flaky CI

```text
@captain CI fails only on [job/os]. Reproduce locally if possible.
@surgeon finds root cause with minimal diff; @lookout adds regression;
@quartermaster only if the pipeline itself is wrong.
```

### Production incident

```text
@captain Triage: [symptom / error / since when].
@code-archaeologist if unfamiliar module; @surgeon for fix;
@gunner if security-shaped; @lookout for regression lock.
Prefer hotfix slice over rewrite.
```

## Quality gates

### Pre-merge security

```text
@gunner Review auth, tenancy, injections, and secret handling for [paths or PR].
Output ranked findings with remediations. Read-only. Block ship on Critical/High.
```

### Pre-merge QA

```text
@lookout Add/adjust tests for [behavior]. Prefer existing runner.
Cover deny paths for authz. Report gaps you cannot automate.
```

### Performance

```text
@purser Profile [slow page/API]. Rank fixes by impact/effort.
Hand implementers concrete owners (@boatswain / @carpenter-next / @data-master).
```

## Greenfield

```text
@captain Bootstrap a [Next.js/Node] app for [product one-liner].
Use launch-crew style: plan, app shell, Tailwind baseline, CI stub, README.
@team-configurator writes Shipcrew Configuration when package.json exists.
```

## Legacy modernization

```text
@code-archaeologist Map [module] entrypoints, hotspots, and safe change points.
Then @navigator: strangler plan for [goal] without big-bang rewrite.
@captain executes only after the chart exists.
```

## Docs & DX

```text
@cartographer Draft README quickstart + architecture mermaid from the real scripts.
@quartermaster add CI lint/test if missing.
```

## Review voyage

```text
@captain Run a ship-review on the current diff:
@navigator (architecture), @gunner (security), @lookout (tests), @purser (perf).
Return verdict: approve | nits | request-changes.
```

See also `skills/ship-spec.md` and `skills/ship-review.md`.
