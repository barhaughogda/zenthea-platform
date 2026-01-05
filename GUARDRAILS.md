# Monorepo Guardrails & Tooling

This document explains the guardrails and tooling implemented to maintain the architectural integrity of the AI-platform-monorepo-starter monorepo.

## 1. Workspace Configuration (`pnpm`)
The monorepo uses `pnpm` workspaces to manage dependencies across the platform. This ensures efficient disk usage and strict dependency management.
- **Enforcement**: `pnpm-workspace.yaml` defines the allowed package locations (`/apps`, `/services`, `/packages`).

## 2. Build Orchestration (`Turborepo`)
`Turborepo` is used to orchestrate builds, tests, and linting. It ensures that tasks are run in the correct order based on the dependency graph.
- **Enforcement**: `turbo.json` defines task dependencies (e.g., `build` must happen before `lint`).

## 3. Dependency Boundaries (ESLint)
The core guardrails are enforced via ESLint's `import/no-restricted-paths` rule in `.eslintrc.json`.

### Service Isolation
- **Rule**: Services must not depend on other services.
- **Why**: Prevents tight coupling between backend agents. Inter-service communication must happen via public APIs or events to ensure scalability and independence.
- **Enforcement**: Blocks imports from `./services/**/*` to `./services/**/*`.

### App Consumption Limits
- **Rule**: Apps may only depend on SDKs and UI packages.
- **Why**: Frontend applications should be consumers of service APIs, not owners of business logic. Limiting dependencies to SDKs ensures a clean contract between frontend and backend.
- **Enforcement**: Blocks imports from `./services/**/*` and restricts `./packages/**/*` to specific allowed paths (SDKs, UI, Core).

### Shared Package Purity
- **Rule**: Shared packages must be domain-agnostic and contain no business logic.
- **Why**: Packages are platform primitives. If they depend on services or apps, they are no longer reusable and introduce circular dependencies.
- **Enforcement**: Blocks imports from `./services/**/*` and `./apps/**/*` into `./packages/**/*`.

## 4. Type Safety (TypeScript Project References)
The monorepo uses TypeScript Project References to ensure that types are correctly resolved across the workspace and that build order is respected.
- **Enforcement**: `tsconfig.json` and `tsconfig.base.json` define the hierarchy and boundaries for type checking.

## 5. Model Isolation (AI Runtime)
- **Rule**: No service or app may call AI models (OpenAI, Anthropic, etc.) directly.
- **Why**: Centralizing AI execution in `packages/ai-runtime` enables global policy enforcement (HIPAA/GDPR), cost tracking, and consistent tool proposal handling.
- **Enforcement**:
    - Services must import and use `AIRuntime` from `@starter/ai-runtime`.
    - Model SDKs (e.g., `openai`, `anthropic`) are only permitted as dependencies in `packages/ai-runtime`.

## 6. Tool Execution Boundary (mediated execution)
- **Rule**: AI agents must only produce **Tool Proposals**. They must never execute side effects (API calls, DB writes, etc.) directly.
- **Why**: Separation of intent (AI) from execution (System) is critical for security, auditability, and human-in-the-loop control.
- **Enforcement**:
    - Services return `ToolProposal` objects in their AI output schemas.
    - Side effects must be mediated by the `ToolExecutionGateway`.

## 7. Billing Isolation
- **Rule**: Only the `services/billing` service may interact with payment providers (e.g., Stripe).
- **Why**: Payment logic and sensitive financial integration must be isolated to a single domain to simplify compliance and prevent leakage of billing logic.
- **Enforcement**:
    - Direct usage of `stripe` or other payment SDKs is restricted to `services/billing`.
