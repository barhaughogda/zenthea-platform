# ARCHITECTURE DOCTRINE AUDIT

**Audit Date:** 2026-01-08  
**Objective:** Verify enforcement of core Zenthea Platform doctrines.

---

## 1. Draft-Only Doctrine
**Status:** ✅ **COMPLIANT**

- **Definition**: AI is forbidden from signing, attesting, or finalizing clinical records.
- **Evidence**:
  - `services/clinical-documentation-agent/ai/index.ts`: Hardcoded refusal message: *"AI is forbidden from signing or attesting clinical notes."*
  - `services/clinical-documentation-agent/domain/types.ts`: Status label enforced as `'DRAFT ONLY (AI-assisted)'`.
  - `services/clinical-documentation-agent/tests/clinical-documentation.eval.test.ts`: Test case `should refuse requests to sign or attest a note (AC-AI1)` verifies enforcement.

---

## 2. Consent Gating
**Status:** ✅ **COMPLIANT**

- **Definition**: No AI-assisted drafting involving PHI may proceed without verified patient consent.
- **Evidence**:
  - `services/clinical-documentation-agent/orchestration/index.ts`: `generateAIProposal` calls `this.consentAgent.verifyConsent` as a hard gate.
  - `services/clinical-documentation-agent/integrations/index.ts`: Consent verification is documented as a *"hard gate for any AI-assisted drafting involving PHI."*

---

## 3. Audit Logging
**Status:** ✅ **COMPLIANT**

- **Definition**: Every tool execution and sensitive state change must emit a metadata-only audit event.
- **Evidence**:
  - `packages/tool-gateway/src/gateway.ts`: `ToolExecutionGateway` emits `ToolGatewayEvent` via `this.telemetryLogger.log`.
  - `services/clinical-documentation-agent/orchestration/index.ts`: Explicit `auditSink.emitEvent` calls for draft creation, updates, and consent failures.

---

## 4. Controlled Mutations
**Status:** ✅ **COMPLIANT**

- **Definition**: All state mutations must flow through the Tool Gateway to ensure governance.
- **Evidence**:
  - `packages/tool-gateway/src/gateway.ts`: Centralizes `mutationExecutor` and `idempotencyStore`.
  - `apps/patient-portal/src/lib/consent/adapter.ts`: Implements mutations via `ConsentAgentClient` which targets the platform gateway.

---

## 5. DTO and Metadata Boundaries
**Status:** ✅ **COMPLIANT**

- **Definition**: Cross-boundary communication must use explicit DTOs; raw entities are forbidden.
- **Evidence**:
  - `packages/tool-gateway/src/operator-dtos.ts`: Defines Zod schemas for `PolicyDto`, `ViewDto`, and `ExecutionResultDto`.
  - `services/clinical-documentation-agent/api/index.ts`: Uses `AIDraftProposalSchema` for all API responses.

---

## 6. Caching Boundaries
**Status:** ⚠️ **PARTIAL**

- **Definition**: Sensitive execution and mutation paths must never be cached.
- **Evidence**:
  - `packages/tool-gateway/src/performance/cache-boundaries.ts`: Correctly defines `Cacheability.NONE` for execution and audits.
  - **Issue**: Enforcement is currently at the "Annotation" level. There is no automated evidence (e.g., middleware or proxy rules) ensuring that a misconfigured `Vercel` or `Cloudflare` cache wouldn't violate these boundaries for the `Operator API`.

---

## 7. AI Execution Constraints
**Status:** ✅ **COMPLIANT**

- **Definition**: AI must be constrained by versioned prompts and provenance tracking.
- **Evidence**:
  - `services/clinical-documentation-agent/ai/index.ts`: Captures `sourceAttribution` and `model` version.
  - `services/clinical-documentation-agent/orchestration/index.ts`: Includes `patientSummary` and `provenance` in AI run metadata.

---

## Summary of Risk

While the **Control Plane** (Gateway, Agent Orchestration) shows exemplary compliance with architecture doctrine, the **Application Surface** (especially `website-builder`) lacks consistent evidence of doctrine enforcement. The primary risk is **Doctrine Leakage**, where legacy code bypasses these hard-won boundaries.

**Overall Rating: COMPLIANT (Control Plane) / PARTIAL (App Surface)**
