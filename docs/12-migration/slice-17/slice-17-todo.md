# CP-17 Todo Checklist

## 1. Documentation & Planning
- [x] Create `slice-17-spec.md` [completed]
- [x] Create `slice-17-todo.md` [completed]
- [x] Update `ROADMAP.md` status to "Completed" [completed]

## 2. Tool Gateway Implementation
- [x] Implement Tool Allowlist (`tool-allowlist.ts`) [completed]
- [x] Implement Approval Model & Execution Command Validation [completed]
- [x] Implement In-Memory Idempotency Store (`idempotency-store.ts`) [completed]
- [x] Implement Deterministic Mock Executor (`mock-executor.ts`) [completed]
- [x] Implement Mutation DTOs (`mutation-dtos.ts`) [completed]
- [x] Extend `ToolExecutionGateway` with Mutation Logic [completed]
- [x] Extend Audit Emitter with Mutation Events [completed]

## 3. Operator API
- [x] Add V2 Mutation Endpoint (Headless) to `OperatorAPI` [completed]

## 4. Verification
- [x] Create `slice-17.test.ts` [completed]
- [x] Run `pnpm test` [completed]
- [x] Run `pnpm lint` [completed]
- [x] Run `pnpm typecheck` [completed]
