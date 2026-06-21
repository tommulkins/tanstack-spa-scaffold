# Application Context

Shared language for this application. Glossary only — no plans, specs, or implementation details.

## Language

**Scaffold**:
The starter monorepo template before product-specific features are added.
_Avoid_: boilerplate, template repo

**API**:
The Hono HTTP service in `packages/api`, separate from the web SPA.
_Avoid_: backend server (too vague), server functions

**Contract**:
A Zod schema in `packages/schemas` shared by web and API.
_Avoid_: DTO, interface (when meaning a runtime-validated boundary)

**Note**:
A short text entry created via the Notes reference slice; validated by shared Zod schemas end-to-end.
_Avoid_: todo, message (when meaning this demo entity)
