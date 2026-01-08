# ARCHITECTURE CHECKPOINT REPORT

**Date:** 2026-01-08  
**Auditor:** Principal Platform Architect & Clinical Safety Auditor  
**Scope:** Full Repository Audit  
**Status:** 🚩 CRITICAL FINDINGS (STOP-SHIP)

---

## 1. Structural Integrity Assessment

The repository maintains a high-level organizational discipline (monorepo with `apps/`, `packages/`, `services/`, and `docs/`). However, the internal integrity of individual applications varies wildly between "Platform Native" and "Legacy Ported."

- **Native Integrity**: `packages/tool-gateway` and `services/clinical-documentation-agent` follow strict DTO, audit, and governance boundaries.
- **Ported Decay**: `apps/website-builder` is an unrefined legacy port. It violates nearly all platform-level file size and structural rules.

---

## 2. Orphaned Files, Routes, or Services

The following assets exist in the repository but are **untracked** in the `ROADMAP.md` or any governing specification. They represent "shadow capability" that has not been audited for clinical safety.

- **`apps/client-demo/`**: Active Next.js application with chat capabilities. Not governed by the roadmap.
- **`apps/chat-ui/`**: Alternative chat interface. Not governed by the roadmap.
- **`apps/provider-portal/src/app/company/analytics/`**: Placeholder analytics pages with unknown data-leakage profiles.

---

## 3. Legacy Remnants (Still Reachable)

- **`apps/website-builder/src/components/website-builder/`**: Contains raw, unrefactored legacy components.
- **`services/clinical-documentation-agent/ai/index.ts`**: Contains placeholder "mock AI" logic that is reachable in "Completed" slices. While safe for Phase A, it represents a risk if not strictly replaced before Phase D.

---

## 4. Unsafe or Ambiguous Execution Paths

- **Website Builder Mutations**: `apps/website-builder/src/components/website-builder/WebsiteBuilder.tsx` mentions "Page-related mutations" (Line 137). It is ambiguous whether these mutations bypass the `ToolExecutionGateway`. Any mutation bypassing the gateway is a **Systemic Safety Violation**.
- **Provider Portal EHR Stubs**: `apps/provider-portal` uses local mocks for patient data. There is no evidence of a "Gate" ensuring these mocks cannot be accidentally switched to live data without governance.

---

## 5. Violations of Platform Doctrine

- **File Size Rule (STOP-SHIP)**: `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx` is **1,728 lines**. This is a 245% violation of the maximum allowed file size (500 lines) and a 332% violation of the preferred size (400 lines).
- **Single Responsibility Violation**: `WebsiteBuilder.tsx` (~700 lines) manages state, rendering, and mutations for the entire application.

---

## 6. STOP-SHIP Findings (Labeled)

1.  **[STOP-SHIP-01] [Structural]**: `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx` (1,728 lines) exceeds the architectural limit. It must be decomposed before any clinical integration.
2.  **[STOP-SHIP-02] [Governance]**: `apps/client-demo` and `apps/chat-ui` exist as ungoverned applications. These must be deleted or moved to an `orphans/` directory with explicit build-disabling.
3.  **[STOP-SHIP-03] [Audit]**: `MIG-03` (Provider Portal) is marked "Completed" but contains raw legacy code that has not been audited for PHI leakage in console logs or error states.

---

## Summary

The platform is at risk of "Scaffold Rot," where the governance layer (`packages/tool-gateway`) is robust but the application layer (`apps/website-builder`, `apps/provider-portal`) is importing legacy technical debt faster than it can be governed.

**Decision: ARCHITECTURAL RED FLAG.** No further "Write Enablement" slices should be approved until `apps/website-builder` is decomposed.
