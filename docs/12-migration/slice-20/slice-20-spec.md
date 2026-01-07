# Slice 20 – External Integrations & Interop

**Status:** Completed
**Owner:** Senior Staff Platform Engineer
**Scope:** Integration Boundary Governance
**Precondition:** Slice 19 complete and sealed

---

## Purpose

Define the platform’s strict boundary for interaction with external systems. This is a governance-focused slice (types, schemas, contracts, and tests) designed to prevent unsafe, non-idempotent, or PHI-leaking integrations.

---

## Doctrine (Non-Negotiables)

- **Vendor Neutrality**: Contracts must not depend on vendor-specific SDKs or types.
- **Privacy First**: Zero PHI/PII leakage into logs or audit metadata.
- **Auditability**: Every external interaction must be traceable via correlation IDs.
- **Reliability**: Writes require explicit idempotency keys.
- **Determinism**: Failure taxonomy is bounded and metadata-only.
- **No Persistence**: This layer does not store data or manage background jobs.

---

## In Scope

- **Integration Boundary Types**: Zod-backed definitions for connectors, capabilities, and data classification.
- **Request/Result Envelopes**: Standardized metadata-heavy envelopes for all external calls.
- **Redaction Policy**: Declarative rules for sensitive data handling.
- **Retry & Idempotency Contracts**: Requirements for reliability and safe retries.
- **Connector Interface**: A unified interface (`IExternalConnector`) for all future integrations.
- **Failure Taxonomy**: A stable set of failure codes (timeout, unreachable, auth_failed, etc.).

---

## Out of Scope

- **No Network Calls**: No fetch, axios, or HTTP clients.
- **No Credentials**: No handling of API keys or secrets.
- **No Real Integrations**: No FHIR, n8n, or calendar implementations.
- **No Background Jobs**: No Redis, queues, or async worker logic.
- **No Payload in Audits**: Audit events must only contain metadata summaries.

---

## Acceptance Criteria

- [x] Integration boundary types and schemas defined in `packages/tool-gateway/src/integrations/types.ts`.
- [x] `IExternalConnector` interface defined in `packages/tool-gateway/src/integrations/connector.ts`.
- [x] Tests in `packages/tool-gateway/src/slice-20.test.ts` assert safety and governance rules.
- [x] PHI/PII data classification strictly enforced via Zod (no sensitive data in result envelopes).
- [x] WRITE_CONTROLLED operations require idempotency keys.
- [x] Failure taxonomy is exhaustive and metadata-only.

---

## Evidence (Fill When Complete)

- Implementation:
  - `packages/tool-gateway/src/integrations/types.ts`
  - `packages/tool-gateway/src/integrations/connector.ts`
- Tests:
  - `packages/tool-gateway/src/slice-20.test.ts`
