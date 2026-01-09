# Phase C Extraction Strategy (Authoritative)

**Status:** Authoritative — Governance Sealed  
**Phase:** C-0 (Strategy Definition)  
**Objective:** Relocate legacy logic into governed platform boundaries without altering logical behavior.

---

## 1. Definition of "Extraction"

"Extraction" in Phase C is defined as the **physical relocation** of code from legacy locations (e.g., `apps/`, `legacy-services/`) into platform-managed locations (`packages/`, `services/`).

- **Extraction is a Move Operation**: Files are moved, and imports are updated to reflect their new governed home.
- **Extraction is NOT a Refactor**: Changing business logic, optimizing performance, or re-architecting internal flow is strictly forbidden during extraction.
- **Extraction is a Governance Wrap**: Every extracted module must be wrapped in or mediated by a **CP-21 compliant boundary** (Policy Evaluation, Cache Boundary, and Audit Emission).

---

## 2. Allowed vs. Forbidden Operations

### 2.1 Allowed Operations
- **Relocation**: Moving code from legacy directories to `packages/` or `services/`.
- **Typing Fixes**: Updating TypeScript types to comply with new package boundaries (e.g., fixing relative imports).
- **Adapter Integration**: Wrapping extracted logic in Service-to-Control-Plane adapters.
- **Test Relocation**: Moving existing unit tests alongside the extracted logic and ensuring they pass in the new location.
- **Documentation**: Adding JSDoc or markdown documentation explaining the extraction provenance.

### 2.2 Forbidden Operations
- **Logic Modification**: Changing `if/else` branches, loops, or business rules.
- **Bypassing CP-21**: Exporting raw logic that bypasses policy evaluation or audit emission.
- **New Dependency Introduction**: Adding third-party libraries that were not previously present in the legacy code.
- **Schema Changes**: Altering database schemas or shared DTOs (unless required by CP-14).
- **Optimization**: "Cleaning up" code during the move. Compliance > Cleanliness.

---

## 3. Sequencing Rules

Extraction must follow a strict "dependency-first" order:

1.  **Level 0 (Utils/Types)**: Shared utilities and types with zero domain dependencies.
2.  **Level 1 (Domain Core)**: Pure domain logic (calculators, validators) with no external side effects.
3.  **Level 2 (Infrastructural Clients)**: Database clients, external API wrappers (must be wrapped in CP-20 envelopes).
4.  **Level 3 (Orchestration/Services)**: The logic that ties Level 1 and 2 together.
5.  **Level 4 (Entrypoints)**: HTTP handlers, cron triggers, and workers.

---

## 4. CP-21 Enforcement Insertion Order

For every extracted entrypoint (Level 4), the following enforcement order must be applied:

1.  **Audit Start**: Emit a metadata-only audit event signaling the start of the governed operation.
2.  **Cache Check**: Verify the request is flowing through a **Non-Cacheable** boundary (per ADR-CP-21).
3.  **Policy Evaluation**: Execute the appropriate `PolicyEvaluator.evaluate()` call and enforce the resulting `PolicyEffect` (PERMIT/DENY/INDETERMINATE).
4.  **Logic Execution**: Invoke the extracted legacy logic.
5.  **Audit Completion**: Emit a metadata-only audit event signaling success/failure.

---

## 5. Legacy Coexistence Rules

Until migration is complete, legacy and extracted code will coexist:

- **Adapter Redirection**: Legacy handlers must be updated to call the new extracted service rather than containing their own logic.
- **Dual-Write (Forbidden)**: Legacy code must not write to the same state as extracted code via different paths. State mutation must be centralized in the extracted service.
- **No Circularity**: Extracted platform code MUST NOT depend on legacy code. The dependency direction is strictly: `Legacy -> Platform`.

---

## 6. Stop Conditions (Exit Criteria)

Phase C execution MUST STOP if:
- **S-1**: A legacy dependency cannot be resolved without a circular dependency on the platform.
- **S-2**: The extraction requires a change to the "Draft-Only" doctrine (AI signing records).
- **S-3**: A cache-boundary violation is detected during verification of an extracted route.
- **S-4**: The **MIG-04B Block** is encountered (Write paths in clinical documentation).

---

## 7. What Phase C is NOT

- Phase C is **NOT** a platform rewrite.
- Phase C is **NOT** a UI redesign.
- Phase C is **NOT** an opportunity to fix "tech debt" unrelated to governance.
- Phase C is **NOT** an autonomous AI migration. It is an engineering-led extraction process.

---

## 8. Platform Summary

Phase C establishes the "Governed Mirror" of the legacy application. By the end of Phase C, all business logic resides in `packages/` and `services/`, and all entrypoints flow through CP-21 enforcement. The legacy `apps/` folders should become thin shells containing only UI and configuration.
