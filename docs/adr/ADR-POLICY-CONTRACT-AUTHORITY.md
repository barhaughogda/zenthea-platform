# ADR-POLICY-CONTRACT-AUTHORITY: Canonical Ownership of Policy Contracts

## 1. Context
The Zenthea Platform requires high-integrity, deterministic policy evaluation as defined in [ADR-MIG-06](../adr/ADR-MIG-06-ORCHESTRATION-MODEL.md) (Orchestration Model) and enforced by [ADR-CP-21-CACHE-BOUNDARY-ENFORCEMENT.md](../adr/ADR-CP-21-CACHE-BOUNDARY-ENFORCEMENT.md). Currently, core policy contracts—specifically `PolicyEffect`, `PolicyDecision`, and `PolicyEvaluator`—exist in duplicated or fragmented states across:
- `packages/auth`
- `packages/tool-gateway`
- `packages/policy` (newly scaffolded)

## 2. Problem Statement
Fragmentation of policy contracts introduces "semantic drift" risk, where diverging definitions of policy outcomes could break platform determinism and auditability. To satisfy the requirements of CP-21 and MIG-06, the platform must establish a single canonical boundary for policy definitions to ensure a fail-closed, auditable governance model.

## 3. Options Considered
- **Option 1: tool-gateway Ownership (Status Quo)**: Keep contracts within the gateway. *Rejected* as it couples governance definitions to execution implementation.
- **Option 2: auth Ownership**: Consolidate within the identity boundary. *Rejected* as it conflates authentication (identity) with authorization logic (policy).
- **Option 3: policy Ownership (Dedicated Boundary)**: Centralize contracts in a dedicated `@zenthea/policy` package. *Accepted* as it provides a clean, domain-isolated authority for platform-wide governance rules.

## 4. Decision
The package **`packages/policy`** is designated as the **Canonical Owner** of all Policy contracts and evaluation interfaces.

This authority covers the following primary contracts:
- `PolicyEffect`
- `PolicyDecision`
- `PolicyEvaluator` (Interface and Base Implementation)

**Authority is immediate.** However, to comply with Phase A restrictions, **no code movement or refactoring is permitted at this time.** Physical consolidation and import resolution are strictly **deferred to Phase C**.

## 5. Consequences
- **Source of Truth**: Any ambiguity in policy contract semantics is resolved by the definitions in `packages/policy`.
- **Dependency Hierarchy**: In Phase C, `packages/tool-gateway` and `packages/auth` will become consumers of `packages/policy`.
- **Auditability**: Deterministic decision signals are guaranteed by a single shared contract, preventing non-deterministic branching caused by duplicate type definitions.

## 6. Explicit Non-Goals
- **No Code Refactoring**: This ADR does not authorize moving files, changing imports, or deleting duplicates during Phase A.
- **No Behavioral Changes**: Existing policy evaluation logic must remain unchanged; this ADR defines authority, not implementation.
- **No Model Expansion**: This ADR does not widen the scope of policy evaluation beyond what is currently defined in the Control Plane slices.

---
**Status: Proposed**
**Date: 2026-01-09**
**Authority: Governance / ADR Authoring Mode**
