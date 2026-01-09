# @zenthea/policy

## Status: Canonical Authority (Phase A Scaffolding)

This package is the **Canonical Owner** of all Policy contracts and evaluation interfaces for the Zenthea Platform, as defined in `docs/adr/ADR-POLICY-CONTRACT-AUTHORITY.md`.

### Governance Rules (Phase A)

1.  **Canonical Source**: This package is the single source of truth for `PolicyEffect`, `PolicyDecision`, and `PolicyEvaluator` interfaces.
2.  **No Implementation**: During Phase A, this package contains ONLY interface-level contracts. No behavioral logic is permitted.
3.  **Deferred Consolidation**: Physical consolidation of duplicated contracts (e.g., in `packages/auth`, `packages/tool-gateway`) is strictly **deferred to Phase C**.
4.  **No Import Updates**: Existing packages must NOT update their imports to point to this package during Phase A to avoid breaking existing builds or introducing circular dependencies.

### Primary Contracts

- `PolicyEffect`: The core tri-state outcome of any policy check.
- `PolicyDecision`: The structured signal emitted by any governing component.
- `PolicyEvaluator`: The interface for evaluation components.

---
**Authority**: ADR-POLICY-CONTRACT-AUTHORITY
**Phase**: A (Scaffolding)
