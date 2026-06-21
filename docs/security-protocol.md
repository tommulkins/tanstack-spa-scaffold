# Security protocol

Mandatory security pass before merge — supply chain, secrets hygiene, diff review, and API baseline. Complements verify/analyze; does not replace them.

Any harness can follow this file. Optional: invoke a **readonly** security-review subagent (Cursor) using the checklist below.

## Principle

**Security is a slow gate after `pnpm gate` green, before PR or merge.** `sfw` covers install-time supply chain; this protocol covers the **diff**, secrets, and API/web baseline.

## When to run

| Trigger                              | Required                                |
| ------------------------------------ | --------------------------------------- |
| Feature complete (before merge / PR) | yes                                     |
| Any dependency add/change            | yes — re-run supply-chain + diff review |
| Auth / PII / trust-boundary change   | yes — human sign-off on findings        |
| Docs-only change                     | skip unless touching security protocol  |

**Order:**

```
pnpm gate  →  pnpm security:check  →  security-review (checklist / subagent)  →  PR
```

Not in Lefthook pre-commit (ADR 0001). Not a separate CI job in base scaffold — agent/human before PR; CI runs `pnpm gate` (ADR 0006).

## Layers

| Layer                 | Mechanism                                      | Notes                                   |
| --------------------- | ---------------------------------------------- | --------------------------------------- |
| **Supply chain**      | `sfw pnpm` install/add/update                  | Flag new deps in PR summary             |
| **Secrets**           | `pnpm security:check`                          | Grep staged files; block `.env` commits |
| **Diff review**       | Checklist below (+ optional readonly subagent) | Branch or uncommitted diff              |
| **API baseline**      | Zod on inputs; generic 4xx; explicit CORS      | See checklist                           |
| **Static (optional)** | ESLint + fallow                                | No Semgrep in base scaffold             |

## Commands

```sh
# After pnpm gate green — scan staged files for likely secrets
pnpm security:check

# Audit whole repo (local)
bash scripts/check-secrets.sh --repo

# Self-test
pnpm test:security-check
```

## Diff review checklist

Review `git diff origin/main...HEAD` (or uncommitted diff). Record findings in a [security dossier](./security-dossier-template.md) under `reports/security/`.

### Supply chain

- [ ] New/changed dependencies installed only via `sfw pnpm`
- [ ] New deps justified in PR/summary; lockfile updated
- [ ] No `npm` / `yarn` / bare `pnpm` for registry installs

### Secrets

- [ ] No `.env`, tokens, or private keys in diff
- [ ] `pnpm security:check` passes on staged files
- [ ] Dossiers/logs do not paste credentials

### API (`packages/api`)

- [ ] Request bodies parsed with `@scaffold/schemas`
- [ ] 4xx responses use generic JSON (`{ error: '...' }`) — no stack traces
- [ ] CORS `origin` changes are intentional and documented in plan
- [ ] No new unauthenticated sensitive endpoints without plan approval

### Web (`apps/web`)

- [ ] API responses parsed with shared schemas before use
- [ ] Forms validate with same schemas as API
- [ ] No secrets in client bundle or `import.meta.env` without plan

### Auth / data (if applicable)

- [ ] Matches `PLAN.md` § Security constraints
- [ ] No auth/session/storage introduced without plan approval

## Findings and escalation

| Severity            | Action                                                          |
| ------------------- | --------------------------------------------------------------- |
| **Critical / high** | Stop — fix or human must acknowledge before merge               |
| **Medium**          | Fix before merge or document in security dossier with rationale |
| **Low**             | Fix or accept with note in dossier                              |

Use the same retry discipline as [`debug-protocol.md`](./debug-protocol.md) for fixable code issues (max 3 attempts). **No silent dismiss.**

Critical/high examples: committed secret, missing input validation on new endpoint, open CORS to `*`, SQL/command injection, SSRF without plan.

## Kickoff integration

Fill `PLAN.md` § **Security constraints** at grill when the feature touches auth, PII, payments, or third-party trust boundaries:

- Data sensitivity
- Trust boundaries (browser ↔ API ↔ third parties)
- Explicit non-goals (e.g. "no auth in v1")

Agent must not introduce auth, secrets storage, or external data processors without plan approval.

## Harness subagent (optional)

Cursor and similar tools may expose a readonly **security-review** subagent on the branch diff. Use it for a second pass; **protocol checklist remains canonical**. Subagent output feeds the security dossier.

## Related

- [ADR 0007](./adr/0007-security-review-tier.md) — slow gate placement
- [`security-dossier-template.md`](./security-dossier-template.md)
- [`hooks-protocol.md`](./hooks-protocol.md) — agent suppressions (fork #9)
- [`ci-protocol.md`](./ci-protocol.md) — CI runs `pnpm gate`; security before PR

## Explicitly not in scope

- Penetration test / bug bounty
- Auth product implementation
- SOC2/compliance checklists
- Semgrep / SAST plugins (optional per product)
