# Definition of Done (autopilot)

Captain may set voyage status to `shipped` only when every item is `[x]` or explicitly `blocked` (with reason in `voyage.yml`).

## Product

- [ ] Acceptance criteria from the Navigator plan are met
- [ ] Happy path works for the primary user story
- [ ] Error / empty / loading states handled where UI changed

## Engineering

- [ ] Changes match existing repo conventions (no parallel architecture)
- [ ] Types / lint pass for touched packages (or blocked with command+error)
- [ ] No secrets committed; env vars documented by name only

## Security

- [ ] `@gunner` completed when policy requires it (or N/A documented)
- [ ] Authz fail-closed on new mutating endpoints
- [ ] Tenant/user isolation verified if multi-tenant

## Quality

- [ ] `@lookout` added/updated tests for critical behavior (or blocked with reason)
- [ ] Regression for any bug fixed by `@surgeon`

## Ops & docs

- [ ] `@quartermaster` updated CI/Docker when pipelines/images changed (or N/A)
- [ ] `@cartographer` updated README/docs when setup or public API changed (or N/A)
- [ ] `.shipcrew/voyage.yml` reflects final task statuses

## Sign-off

- [ ] Voyage summary reported to the user (outcomes, agents, risks, next steps)
