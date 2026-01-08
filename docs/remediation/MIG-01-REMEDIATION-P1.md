# MIG-01 REMEDIATION P1 — Website Builder BlockConfigPanel Structural Decomposition (Design-Only, Locked)

**Slice:** MIG-01 (Website Builder — Non-Clinical)  
**Remediation ID:** MIG-01-REMEDIATION-P1  
**Status:** **LOCKED (design-only; no code changes in this artifact)**  
**Date:** 2026-01-09  
**Owner:** Documentation Agent (per Cursor Prompt: REMEDIATION-P1)  

---

## 0. Objective (What this plan must achieve)

Resolve the **structural violation** in:

- `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx`

…by defining a **design-only** decomposition plan that:

- **Restores platform file-size and single-responsibility compliance** through extraction into focused modules.
- **Preserves behavior and contracts** (no functional changes, no implicit API changes, no new features).
- Defines **responsibility boundaries**, **phased extraction**, **invariants**, **risks**, and **seal evidence**.

This document is intentionally **implementation-agnostic**: it defines phases and guardrails, but does **not** provide step-by-step refactor instructions.

---

## 1. Constraints & Non-Negotiables (from governance)

### 1.1 Allowed / forbidden scope

- **Allowed scope:** `apps/website-builder` only, and only what is required to remediate MIG-01 structural findings.
- **Forbidden:** any application behavior change, refactors beyond structural decomposition, new features, roadmap edits, changes outside `apps/website-builder`, documentation outside the allowed output files.

### 1.2 Stop conditions (hard halt)

Stop immediately (do not proceed with implementation) if any of the following occur:

- **Unverifiable “no behavior change”:** if the remediation cannot establish credible before/after equivalence evidence (see §9) for the panel behavior.
- **Scope drift outside `apps/website-builder`.**
- **Non-reversible phases:** if any step cannot be cleanly rolled back without data migration or contract changes.
- **Implicit API or contract changes:** any change to block prop shapes, appearance schema, or exported component APIs.
- **Ambiguous success criteria:** if “done” cannot be objectively checked (see §9).

---

## 2. Verified Evidence (Why MIG-01 must be re-opened)

### 2.1 Governance artifacts (repository docs)

- `docs/ARCHITECTURE-CHECKPOINT-REPORT.md` declares a STOP-SHIP violation for `BlockConfigPanel.tsx` due to extreme file size and SRP violation.
- `docs/ARCHITECTURE-SLICE-SEAL-INDEX.md` marks MIG-01 seal confidence as **FAIL**, explicitly citing the “1700-line legacy blob.”
- `docs/ARCHITECTURE-DOCTRINE-AUDIT.md` highlights “Application Surface” doctrine leakage risk (website-builder) even while Control Plane is compliant.
- `docs/ROADMAP.md` lists **MIG-01** as “Completed,” but the seal index contradicts this with an explicit FAIL due to the unresolved blob.

### 2.2 Code evidence (current structural state)

`BlockConfigPanel.tsx` currently contains multiple distinct responsibilities in a single file, including:

- Shared helper utilities (`cssVarToHex`) and shared UI primitives (`ColorPicker`).
- Appearance token controls (background/text tokens, custom overrides, layout spacing, borders).
- Hero-specific background and text appearance controls.
- Button appearance controls for Hero and CTA Band.
- Block-type dispatch and multiple block content forms.

The file length is **~1.7k+ lines** per prior audit; the current repository snapshot shows the module ending at **~1.8k+ lines** (line numbers in the file read exceed the audit’s 1,728), indicating continued divergence and reinforcing the STOP-SHIP classification.

---

## 3. Remediation Target Surface (What we will and will not change)

### 3.1 Primary target (structural)

- **Primary:** `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx`

### 3.2 Directly imported, in-scope dependencies (verified)

Direct imports from `BlockConfigPanel.tsx` (Website Builder scope):

- `apps/website-builder/src/components/ui/slider.tsx`
- `apps/website-builder/src/components/ui/collapsible.tsx`
- `apps/website-builder/src/components/website-blocks/editors/CustomTextBlockFormFields.tsx`
- `apps/website-builder/src/components/website-builder/block-config/FAQContentConfigForm.tsx`
- `apps/website-builder/src/components/website-builder/block-config/FAQAppearanceControls.tsx`
- `apps/website-builder/src/components/website-builder/ImageUpload.tsx`
- `apps/website-builder/src/lib/website-builder/schema.ts` (and, by design intent, its re-exported contracts)

### 3.3 Explicit non-goals

- No changes to `@starter/ui` components, Radix wrappers, or external libraries.
- No schema/contract changes in `apps/website-builder/src/lib/website-builder/*`.
- No attempt to “improve” UX, validation, or styling; only structural decomposition.
- No consolidation of similar components across unrelated areas (e.g., ColorPicker duplication) unless proven behavior-identical and fully evidenced (default assumption: **do not consolidate**).

---

## 4. Current Responsibility Clusters (Observed in the code)

This plan treats the existing file as a composition of discrete clusters. Decomposition must preserve each cluster’s external behavior.

### 4.1 Cluster A — Panel Shell & Dispatch

Responsibilities:

- Handles “no block selected” empty state.
- Loads `BLOCK_METADATA[block.type]` for header name/description.
- Computes `hasAppearanceCustomizations` (including hero-specific checks).
- Dispatches the correct config form via `switch (block.type)`.
- Wraps content and appearance sections, including collapsible behavior.

### 4.2 Cluster B — Block Content Forms (per block type)

Responsibilities:

- Form UIs for content editing for:
  - `hero`, `care-team`, `services`, `contact`, `cta-band`, `custom-text`, `faq`, and generic fallback.
- Uses `block.props` as a `Record<string, unknown>` and writes updates via `onUpdate`.

### 4.3 Cluster C — Generic Appearance Configuration

Responsibilities:

- Token-based background/text selection using `BackgroundTokens`, `TextTokens`.
- Optional custom overrides (toggle + input).
- Layout: padding, max width, borders.
- “Reset to Block Defaults” behavior by setting appearance to `undefined`.

### 4.4 Cluster D — Hero-specific Background + Text Appearance

Responsibilities:

- Consolidates hero background type (gradient/solid/image) controls.
- Uses `ImageUpload` for hero background image.
- Controls hero text colors via token/custom patterns.
- Updates `block.props` keys: `backgroundType`, `gradientFrom`, `gradientTo`, `gradientDirection`, `backgroundColor`, `backgroundImage`, `backgroundOverlay`, plus `headingTextAppearance` and `taglineTextAppearance`.
- Delegates layout spacing to `onAppearanceUpdate` (shared with Cluster C).

### 4.5 Cluster E — Button Appearance Configuration

Responsibilities:

- Configures `primaryButtonAppearance` and `secondaryButtonAppearance` for `hero` and `cta-band`.
- Writes nested appearance objects back into `block.props`.

### 4.6 Cluster F — Local Utilities & UI Primitives

Responsibilities:

- `cssVarToHex` resolution (browser-only behavior; depends on `window`/`document`).
- Color picker UI that supports CSS var display and hex input.
- Human labels for tokens (e.g., `BACKGROUND_TOKEN_LABELS`, `TEXT_TOKEN_LABELS`, hero/button variants).

---

## 5. Target Responsibility Boundaries (Post-remediation structure)

This plan introduces **explicit boundaries** to prevent future blob re-growth. Boundaries are local to `apps/website-builder` and are reversible.

### 5.1 Boundary rules (must hold in all phases)

- **B1 (Shell purity):** `BlockConfigPanel.tsx` becomes a thin orchestrator: layout + dispatch + composition only.
- **B2 (No schema mutation):** No changes to `BlockAppearance`, `BlockInstance`, token enums, or `BLOCK_METADATA` contracts.
- **B3 (No cross-cluster hidden coupling):** Sub-forms must communicate only via explicitly passed props:
  - `props` (block props record),
  - `onUpdate` (props update),
  - `appearance`/`onAppearanceUpdate` (appearance update),
  - `disabled`.
- **B4 (Client-only correctness):** Any module using hooks or browser APIs must remain a client component (`'use client'` retained as required).
- **B5 (Import direction):** Sub-forms may import schema tokens/types and local UI primitives; the shell may import sub-forms; sub-forms must not import the shell.

### 5.2 Proposed module groupings (structure, not implementation steps)

Use the existing `components/website-builder/block-config/` area as the canonical location for block-config sub-forms (it already exists for FAQ forms). Introduce additional subfolders only within that subtree if needed for readability:

- **Shell:** `components/website-builder/BlockConfigPanel.tsx`
- **Content forms:** `components/website-builder/block-config/content/*`
- **Appearance forms:** `components/website-builder/block-config/appearance/*`
- **Hero-specific forms:** `components/website-builder/block-config/hero/*`
- **Button appearance forms:** `components/website-builder/block-config/buttons/*`
- **Shared config primitives:** `components/website-builder/block-config/shared/*`

These groupings are designed to keep files under the platform size limits and enforce SRP at the module level.

---

## 6. Extraction Phases (Design-only; reversible)

Each phase is intended to be small and independently reversible. “Behavior preserved” is an invariant for every phase, not an outcome checked only at the end.

### Phase 0 — Baseline & Closure Criteria Lock (pre-work gate)

**Purpose:** Ensure “no behavior change” is verifiable and the remediation has objective completion criteria.

- **Entry criteria:** Current behavior can be exercised in a stable way (local dev + deterministic UI steps or equivalent harness).
- **Exit criteria:** Baseline evidence plan is agreed and stored as closure artifacts (see §9), or remediation halts under stop conditions.
- **Rollback:** Not applicable (documentation-only gate).

### Phase 1 — Isolate Cluster F (Utilities + shared primitives)

**Purpose:** Prevent helpers/label maps from cohabiting with orchestration logic.

- **Outcome:** Shared utilities and token label maps are moved into dedicated modules, maintaining identical behavior.
- **Guardrails:** No semantic edits to parsing/resolution logic (notably `cssVarToHex` behavior and fallbacks).
- **Rollback:** Re-inline helpers into the original file.

### Phase 2 — Isolate Cluster C (Generic Appearance)

**Purpose:** Separate generic appearance editing from panel orchestration.

- **Outcome:** Appearance configuration becomes one or more dedicated modules that accept only:
  - `appearance`, `onUpdate`, `disabled`
- **Guardrails:** Preserve:
  - default merging behavior with `DEFAULT_BLOCK_APPEARANCE`,
  - “reset to defaults” behavior (`undefined`),
  - toggle behaviors for custom overrides,
  - all token label strings and option sets.
- **Rollback:** Re-inline appearance form(s) into the shell file.

### Phase 3 — Isolate Cluster D (Hero background + text)

**Purpose:** Remove hero-specific complexity from the shared panel.

- **Outcome:** Hero configuration modules are isolated and remain client-safe.
- **Guardrails:** Preserve:
  - default `backgroundType` behavior,
  - slider numeric mapping semantics for overlay,
  - text appearance object shape cleanup behavior (deleting default/empty keys),
  - exact prop keys written into `block.props`.
- **Rollback:** Re-inline hero configuration into the prior structure.

### Phase 4 — Isolate Cluster E (Button appearance)

**Purpose:** Remove cross-block button appearance logic from the panel.

- **Outcome:** Button appearance form(s) exist as dedicated modules.
- **Guardrails:** Preserve cleanup rules for `default` tokens and empty custom values.
- **Rollback:** Re-inline button appearance form into prior structure.

### Phase 5 — Isolate Cluster B (Block content forms) + stabilize Cluster A dispatch

**Purpose:** Make the panel shell SRP-compliant by extracting per-block content forms.

- **Outcome:** Per-block content forms exist as dedicated modules; the shell dispatch remains functionally identical (switch or equivalent), but the file size is reduced below thresholds.
- **Guardrails:** Preserve:
  - placeholder strings,
  - conditional rendering logic (e.g., secondary CTA fields),
  - `disabled` propagation behavior,
  - any casting behavior from `Record<string, unknown>` to specific prop types (no new validation).
- **Rollback:** Re-inline block forms and dispatch.

---

## 7. Invariants (Must remain true; any violation is failure)

### 7.1 Component export and wiring invariants

- `BlockConfigPanel` exported symbol remains available to all existing importers.
- Default export remains `BlockConfigPanel` (no export shape change).
- Props contract remains:
  - `block: BlockInstance | null`
  - `onUpdate: (props: Record<string, unknown>) => void`
  - `onAppearanceUpdate?: (appearance: BlockAppearance | undefined) => void`
  - `disabled?: boolean`

### 7.2 Schema & data contract invariants

- No changes to:
  - `BlockInstance`, `BlockAppearance`, token enums and defaults (`DEFAULT_BLOCK_APPEARANCE`),
  - `BLOCK_METADATA` / `blockMetadata` shapes,
  - block prop keys used by the UI (`backgroundType`, `gradientFrom`, etc.).
- No new parsing/validation logic introduced in the UI path (beyond what is already present).

### 7.3 UI behavior invariants (observable)

- The panel renders the same controls for a given `block.type` and `block.props`.
- Control interactions (typing, selecting, toggling, slider changes) call `onUpdate` / `onAppearanceUpdate` with the same shape and semantics as before.
- The “Appearance” collapsible behavior and indicator dot semantics are preserved.
- The “Reset to Block Defaults” behavior remains: `appearance` becomes `undefined` and local toggles reset accordingly.

### 7.4 Client/runtime invariants

- Modules that depend on browser APIs (`window`, `document`, `getComputedStyle`) remain client-only and do not execute on the server.
- No new network calls or API endpoints are introduced; existing calls (e.g., `ImageUpload` → `/api/upload/cloudinary`) are not modified by this remediation.

---

## 8. Risks (and required mitigations)

### 8.1 React behavioral drift from extraction

**Risk:** Hook placement and component boundaries can cause subtle behavioral drift (e.g., state reset timing, memoization identity, controlled input re-mounting).

**Mitigation:** Preserve component hierarchy and state ownership:

- Keep state in the same conceptual layer (e.g., if toggles are local today, they remain local within the same sub-form responsibility).
- Avoid introducing memoization or optimization changes as part of the extraction.

### 8.2 “No behavior change” evidence gap

**Risk:** Without an existing deterministic test harness, behavioral equivalence can become subjective.

**Mitigation:** Require explicit closure evidence (see §9). If evidence cannot be produced, **halt** (stop condition).

### 8.3 Contract drift via “cleanup” logic

**Risk:** The current code deletes keys (e.g., token defaults) to normalize prop objects; extraction could unintentionally change cleanup rules.

**Mitigation:** Treat cleanup behavior as contract: it must be preserved and validated via evidence snapshots of emitted updates.

### 8.4 Client/server boundary regression

**Risk:** Moving code can accidentally drop `'use client'` annotations, causing runtime failures or different rendering.

**Mitigation:** Boundary rule **B4** is mandatory; extracted modules must retain client annotations when required.

---

## 9. Seal Evidence (Closure criteria for MIG-01)

MIG-01 remediation is not “done” when the code compiles; it is done when closure evidence demonstrates:

### 9.1 Structural compliance evidence (objective)

- **File size compliance:**
  - No file created by this remediation exceeds the platform max (500 lines).
  - Prefer < 400 lines per file.
- **SRP compliance:** `BlockConfigPanel.tsx` becomes an orchestrator and no longer contains large sub-form implementations.

### 9.2 Contract equivalence evidence (required for “no behavior change”)

At minimum, the closure evidence must include:

- A documented set of deterministic UI interaction sequences (for each affected block type) and the resulting update payload shapes for:
  - `onUpdate` (props updates)
  - `onAppearanceUpdate` (appearance updates)
- Confirmation that payload shapes and semantics are identical pre/post remediation.

If this evidence cannot be produced credibly, remediation halts under stop conditions.

### 9.3 Build/test evidence (required)

- TypeScript build passes for `apps/website-builder`.
- Existing tests (if present for the app) pass unchanged.

> Note: This remediation plan does **not** require adding tests, but it requires evidence that equivalence can be credibly demonstrated. If tests are the only credible path, that becomes a gating decision (Phase 0).

---

## 10. ADR Requirement Evaluation

**ADR created?** **NO**

**Reason:** This remediation proposes a local decomposition within an existing subtree (`components/website-builder/block-config/`) that already exists and is used today (FAQ config forms). The plan does **not** introduce a new cross-app structural convention or an irreversible architectural decision; it is a reversible organization change within one app.

If future remediation work proposes a new “registry pattern” or enforced cross-module convention beyond this app subtree, an ADR should be considered at that time.

---

## 11. Appendix — Files Read (for auditability)

### Governance / doctrine

- `docs/ARCHITECTURE-CHECKPOINT-REPORT.md`
- `docs/ARCHITECTURE-SLICE-SEAL-INDEX.md`
- `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`
- `docs/ROADMAP.md`

### Remediation target + direct imports

- `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx`
- `apps/website-builder/src/components/website-blocks/editors/CustomTextBlockFormFields.tsx`
- `apps/website-builder/src/components/website-builder/block-config/FAQContentConfigForm.tsx`
- `apps/website-builder/src/components/website-builder/block-config/FAQAppearanceControls.tsx`
- `apps/website-builder/src/components/website-builder/ImageUpload.tsx`
- `apps/website-builder/src/components/ui/slider.tsx`
- `apps/website-builder/src/components/ui/collapsible.tsx`
- `apps/website-builder/src/lib/website-builder/schema.ts`

### Schema contract support (within the schema module’s re-export surface)

- `apps/website-builder/src/lib/website-builder/types.ts`
- `apps/website-builder/src/lib/website-builder/zod-schemas.ts`
- `apps/website-builder/src/lib/website-builder/content-generators.ts`
- `apps/website-builder/src/lib/website-builder/metadata.ts`

