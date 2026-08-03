# FAQ

## Install & package

### `npx @solvemotive/shipcrew-ai` fails / “package not found or too new”

The package is on npm (`@solvemotive/shipcrew-ai`). If install fails right after a release, you likely have a **minimum release age** gate (pnpm 11, npm `min-release-age`, Yarn Berry age gate, or a corporate mirror). Wait ~24h, or bypass:

```bash
npm install @solvemotive/shipcrew-ai --min-release-age=0
# or
pnpm add @solvemotive/shipcrew-ai --config.minimumReleaseAge=0
```

Or skip the registry and install from GitHub:

```bash
npx --yes github:solvemotive/shipcrew-ai init ship-crew
```

Shell installer (npm → GitHub → git clone):

```bash
curl -fsSL https://raw.githubusercontent.com/solvemotive/shipcrew-ai/main/install.sh | bash
```

Also confirm the scoped name: `@solvemotive/shipcrew-ai` (not bare `shipcrew`).
### What’s the official name?

| Name | Meaning |
|------|---------|
| **shipcrew-ai** | Product brand, CLI (`shipcrew-ai`), and GitHub repo |
| **@solvemotive/shipcrew-ai** | npm package |
| **`ship-crew`** | Full-roster team preset (not the product name) |

### Can I run `init` inside the shipcrew-ai repo?

No — the CLI refuses, so it cannot prune its own agent source trees. Init in your app directory.

## Agents & crews

### `@gunner-security` doesn’t work

Use **`@gunner`** and **`@lookout`** — frontmatter `name:` values, not filenames.

### `--force` deleted agents I still wanted

`--force` installs the selected crew and **removes** agents not in that preset. Restore with:

```bash
npx --yes github:solvemotive/shipcrew-ai init ship-crew --force
```

### Which crew should I pick?

| If you… | Use |
|---------|-----|
| Ship a SaaS on Next | `saas-crew` |
| Work alone / want less noise | `indie-crew` |
| Are firefighting | `bug-hunt-crew` |
| Are starting a repo | `launch-crew` |
| Want everything | `ship-crew` |

### Do design-only agents write files?

Usually no — they deliver specs. Captain (or you) assigns `@boatswain` / `@carpenter-next` to apply. `@cartographer` drafts docs for someone to write. `@team-configurator` does write `CLAUDE.md`.

## Cursor vs Claude Code

### Are agents identical?

Source prompts live in `agents/` and are copied to both `.cursor/agents/` and `.claude/agents/`. Claude Code honors `tools:` / `model:` frontmatter strictly; Cursor uses agents + the `shipcrew-ai.mdc` rule — still `@`-mention the same names.

### Slash commands in Cursor?

`/ship` and `/crew` are Claude Code commands under `.claude/commands/`. In Cursor, paste the recipes from [VOYAGES.md](./VOYAGES.md) or call `@captain` directly.

## CLAUDE.md

### Will `init` wipe my CLAUDE.md?

No. It only replaces the block between `<!-- shipcrew-ai:start -->` and `<!-- shipcrew-ai:end -->`. Content outside is preserved.

### Stack table looks wrong

Run `@team-configurator` or re-init after adding manifests (`package.json`, `go.mod`, etc.).

## Safety

### Is `@gunner` really read-only?

Yes — tools are Read / Glob / Grep only, model Opus. It must not Write/Edit.

### Does Captain write application code?

No. Captain orchestrates and synthesizes; specialists implement.

## Still stuck?

Open an issue: https://github.com/solvemotive/shipcrew-ai/issues
