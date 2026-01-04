# Legacy to Platform Mapping Template

This document defines how each part of a legacy system maps into the Zenthea Platform.

It is completed **after** the legacy inventory and **before** any migration work begins.

This document prevents:
- Accidental architectural regression
- Service overlap
- Unclear ownership
- Silent compliance violations

---

## Mapping Rules (Non-Negotiable)

- Every legacy domain maps to exactly one primary agent or service.
- Shared logic moves to `/packages` only if it is truly domain-agnostic.
- Frontends never own business logic.
- AI logic must be rewritten to use the governed AI runtime.
- Tool execution must be routed through the Tool Execution Gateway.
- If a legacy module does not map cleanly, it must be redesigned.

---

## Mapping Process

For each legacy domain identified in the inventory:

1. Identify its **primary responsibility**
2. Select the **authoritative agent/service**
3. Decide the **migration approach**
4. Identify **required refactors**
5. Document **risk and sequencing**

Do not skip steps.

---

## Mapping Table Template

Create one section per legacy domain.

### Legacy Domain: <LEGACY DOMAIN NAME>

- Legacy paths:
  - `<path>`
- Description:
  - <what this domain does today>

#### Target Mapping

- Target type:
  - service / package / app / delete
- Target name:
  - `<agent-name>` or `<package-name>`
- Build wave:
  - Wave 1 / Wave 2 / Wave 3 / Post-migration
- Migration approach:
  - rewrite
  - partial port (logic only)
  - replace entirely
- Primary users:
  - clinicians / patients / admins / ops
- Data sensitivity:
  - PHI / PII / none

#### Architectural Adjustments Required

- Coupling to remove:
- Logic to relocate:
- State to isolate:
- APIs to redefine:
- AI behavior to re-govern:

#### Compliance Notes

- HIPAA considerations:
- GDPR considerations:
- Consent requirements:
- Audit trail requirements:

#### Risks and Unknowns

- Key risks:
- Open questions:
- Suggested mitigations:

---

## Frontend Mapping

For each legacy frontend:

### Legacy App: <APP NAME>

- Legacy path:
- Target type:
  - product UI / composed module / delete
- Target app:
  - apps/<app-name>
- Consumed services:
- SDKs required:
- UI components to extract (if any):
- Refactors required:

---

## Integration Mapping

For each legacy integration:

### Integration: <NAME>

- Legacy usage location:
- Target integration layer:
  - service/integrations
- Direction:
  - read / write / bidirectional
- Tool execution required:
  - yes / no
- Approval required:
  - automated / human / mixed
- Notes:

---

## Sequencing Recommendation

Based on the mappings above, list migration order:

1. <domain 1>
2. <domain 2>
3. <domain 3>

Rationale:
- <why this order minimizes risk>

---

## Exit Criteria

This document is complete when:
- Every legacy domain is mapped
- Every frontend has a target
- Every integration has an execution path
- Migration order is defined

No migration work begins until this document is approved.