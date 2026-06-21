# ADR 0005: MCP is optional augmentation; shell gates are canonical

## Status

Accepted — fork #10

## Context

Agents can use MCP (Model Context Protocol) for browser automation, docs lookup, and external APIs. MCP tool schemas consume context tokens; some agents over-rely on browser MCP instead of Playwright e2e. The scaffold already defines done via `pnpm` scripts.

[AXI](https://axi.md/) shows agent-first CLIs with TOON output can match or beat MCP on reliability and token cost for many domains.

## Decision

1. **Definition of done** stays shell gates: `typecheck`, `lint`, `test`, `analyze` — no MCP required.
2. **MCP is optional** for explore, docs, e2e debug, and fallow deep dives — documented in [`docs/mcp-protocol.md`](../mcp-protocol.md).
3. **Prefer AXI CLIs** (gh-axi, chrome-devtools-axi) over raw MCP when both are available for the same task.
4. **CI (fork #11)** runs shell gates only; MCP is not a merge dependency.
5. **Example config** ships as `docs/mcp.example.json`; personal `.cursor/mcp.json` is not committed.

## Consequences

- Contributors without MCP still pass all gates.
- Agents must not claim done based on browser MCP observation alone.
- Custom verification MCPs follow read-only + structured output pattern; product MCP servers live outside this ADR unless the feature demands them.

## Alternatives considered

- **MCP-required workflow** — rejected; excludes harnesses and headless CI.
- **Browser MCP replaces Playwright** — rejected; Playwright specs are the executable contract (fork #12 extends rigor).
