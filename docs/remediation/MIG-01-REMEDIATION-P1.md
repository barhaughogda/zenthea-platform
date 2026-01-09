# MIG-01 — REMEDIATION-P1 (Authoritative Design Lock)

**Document type:** Design-only remediation plan (authoritative)

**Slice:** MIG-01 — Website Builder (Non-Clinical)

**Primary violation to remediate:** **[STOP-SHIP-01] Structural** — `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx` exceeds platform file-size and responsibility boundaries.

**This document is the single source of truth** for MIG-01 remediation execution prompts.

---

## 1. Scope & Objective

### Objective
Decompose `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx` into explicit responsibility-aligned modules **within `apps/website-builder` only**, while preserving behavior and callback payloads.

### Scope (in-bounds)
- Only code under `apps/website-builder/**` may be modified.
- Only structural extraction and module boundary changes are permitted.
- No changes to public behavior, event handling semantics, or callback payload shapes/values.

### Out of scope (explicit non-goals)
- No UI/UX improvements.
- No visual redesign, styling changes, or accessibility changes.
- No type tightening, renaming, or API redesign.
- No refactors motivated by aesthetics (only those required for cluster isolation).
- No changes to any application outside `apps/website-builder`.

---

## 2. Evidence Baseline (Repository-Observed)

### Structural failure
Audit artifacts explicitly identify MIG-01 as failing seal confidence due to the legacy “blob” component:
- `docs/ARCHITECTURE-CHECKPOINT-REPORT.md`: `BlockConfigPanel.tsx` is **~1,728 lines** and violates file-size and SRP rules.
- `docs/ARCHITECTURE-SLICE-SEAL-INDEX.md`: MIG-01 seal confidence is **FAIL** due to the same blob.

### Direct-import surface for the target
`apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx` directly imports:
- Local modules (within `apps/website-builder`):
  - `./ImageUpload`
  - `./block-config/FAQContentConfigForm`
  - `./block-config/FAQAppearanceControls`
  - `@/components/ui/slider`
  - `@/components/ui/collapsible`
  - `@/components/website-blocks/editors/CustomTextBlockFormFields`
  - `@/lib/website-builder/schema`
- External UI package: `@starter/ui`

These are the **only** permitted dependency edges for this remediation, except for newly created extraction modules under the specified directory.

---

## 3. Responsibility Clusters (Grounded in Code)

The current `BlockConfigPanel.tsx` co-locates multiple unrelated concerns. Remediation decomposes it along the following clusters.

### Cluster A: Panel shell & orchestration
- The exported `BlockConfigPanel` component.
- Block selection empty-state rendering.
- Collapsible “Appearance” section orchestration.
- `renderConfigForm` switch routing by `block.type`.

### Cluster B: Content configuration forms (per block type)
- Block-specific content forms (e.g., `HeroConfigForm`, `CareTeamConfigForm`, `ServicesConfigForm`, `ContactConfigForm`, `CTABandConfigForm`, `CustomTextConfigForm`, `GenericConfigForm`) and their local handlers.

### Cluster C: Generic appearance configuration
- `AppearanceConfigForm` and its internal UI state.
- Interaction with `DEFAULT_BLOCK_APPEARANCE`, token selectors, padding/border controls.

### Cluster D: Hero-specific appearance & background control
- `HeroBackgroundConfigForm` and its internal “heading/tagline appearance” state.

### Cluster E: Button appearance controls
- `ButtonAppearanceForm` and internal primary/secondary button appearance state.

### **Cluster F: Utilities & Shared Primitives**
Defined precisely in §4.

---

## 4. Cluster F: Utilities & Shared Primitives (Exact Definition)

### Cluster F purpose
Cluster F contains **pure(ish) shared primitives** and **display-only token label maps** that are used across multiple form clusters, and which must remain behavior-identical when extracted.

### Cluster F file-local boundaries (source of truth)
Cluster F is **exactly** the following items currently defined in `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx`:

#### F.1 Utility function
- `cssVarToHex(cssVar: string): string`
  - Includes the browser-only resolution path guarded by `typeof window !== 'undefined'`.
  - Includes the `knownVars` fallback map.

#### F.2 Shared primitive component
- `ColorPicker(props: ColorPickerProps)`
- `ColorPickerProps` interface

#### F.3 Token label maps (UI display-only)
- `BACKGROUND_TOKEN_LABELS: Record<BackgroundToken, string>`
- `TEXT_TOKEN_LABELS: Record<TextToken, string>`
- `HERO_TEXT_TOKEN_LABELS: Record<TextToken, string>`
- `BUTTON_BACKGROUND_TOKEN_LABELS: Record<BackgroundToken, string>`
- `BUTTON_TEXT_TOKEN_LABELS: Record<TextToken, string>`

### Explicit exclusions (not Cluster F)
The following are **not** part of Cluster F and must not be pulled into Cluster F modules:
- Any form components (`AppearanceConfigForm`, `HeroBackgroundConfigForm`, `ButtonAppearanceForm`, or block-specific content forms).
- Any mutation/update handlers other than those inside `ColorPicker`.
- Any imports other than those required to type the above items (`BackgroundToken`, `TextToken`) and render the primitive (`Label`, `Input`).

### Cluster F constraints
- **No renaming** of exports.
- **No semantic changes**:
  - `cssVarToHex` must preserve browser-only assumptions and fallbacks.
  - `ColorPicker` must preserve `aria-label` and value transformation (`cssVarToHex` usage).
  - All label maps must preserve keys and exact string values.

---

## 5. Invariants (Must Not Change)

These are non-negotiable invariants for all phases:

- **Behavioral invariants**
  - UI interaction outcomes remain identical.
  - No changes to conditional rendering behavior.
  - No changes to default values, fallbacks, or cleanup semantics.

- **Callback invariants (critical)**
  - `onUpdate(props: Record<string, unknown>)` payload shape and values must be identical for the same deterministic UI actions.
  - `onAppearanceUpdate(appearance: BlockAppearance | undefined)` payload shape and values must be identical for the same deterministic UI actions.
  - No new keys, removed keys, or value normalization differences.

- **Environment invariants**
  - `cssVarToHex` must remain safe under SSR/Node execution and preserve the existing `typeof window !== 'undefined'` guard.

- **Boundary invariants**
  - No modifications outside `apps/website-builder/**`.

---

## 6. Evidence Model (Deterministic Interaction + Payload Snapshots)

### 6.1 Deterministic UI interaction script
To verify behavior preservation, the execution prompt MUST use a deterministic interaction script that:
- Uses a fixed block instance per `block.type`.
- Executes a fixed sequence of UI operations (no random input, no time-dependent IDs).
- Does not rely on network, upload services, or asynchronous external state.

**Minimal deterministic actions required (baseline):**
- Panel empty state: `block = null`.
- Panel content: set `block` to each supported `block.type` routed by `renderConfigForm`.
- Appearance section toggle open/close.
- For appearance:
  - Change background token selector and text token selector.
  - Toggle custom background override on/off and set a fixed hex value.
  - Toggle custom text override on/off and set a fixed hex value.
- For hero:
  - Switch background type among `gradient`, `solid`, `image`.
  - For gradient: set fixed `gradientFrom`, `gradientTo`, `gradientDirection`.
  - For image: set overlay slider to a fixed value (e.g. 40%).
- For buttons:
  - For primary/secondary: set token selectors and toggle custom fields to fixed values.

### 6.2 Callback payload snapshot comparison
Execution prompts must capture callback payloads as ordered snapshots:
- Wrap `onUpdate` and `onAppearanceUpdate` with instrumentation that records:
  - Call index
  - Timestamp (optional; not used for comparison)
  - Payload JSON (stable key ordering for comparison)
- Compare “before refactor” vs “after refactor” snapshots:
  - Same number of calls.
  - Same payloads in the same order.

**Acceptance rule:** A remediation phase passes only if payload snapshots are byte-identical after stable serialization.

---

## 7. Phase Plan (Numbered, Execution-Prompt Ready)

Each phase is intentionally small and must be executed verbatim by remediation prompts.

### Phase 1 — Isolate Cluster F (Utilities & Shared Primitives)
**Purpose:** Extract Cluster F into `apps/website-builder/src/components/website-builder/block-config/shared/` as local modules, with **zero logic change**.

- **Allowed changes**
  - Create new modules under:
    - `apps/website-builder/src/components/website-builder/block-config/shared/**`
  - Move Cluster F items exactly as defined in §4.
  - Update imports in `BlockConfigPanel.tsx` to reference extracted modules.

- **Stop conditions**
  - Any semantic change to `cssVarToHex` behavior (including SSR guard behavior).
  - Any change to `ColorPicker` value handling or ARIA label string.
  - Any change to label map keys/values.
  - Any change detectable in callback payload snapshots.
  - Any file exceeds platform size limits.

- **Rollback semantics**
  - Revert Phase 1 commit(s) (or reset to pre-phase branch state).
  - Confirm restored snapshot identity against the baseline.

### Phase 2 — Extract Cluster C (Generic Appearance Config)
**Purpose:** Move `AppearanceConfigForm` and its supporting local constants/state (excluding Cluster F) into a dedicated module.

- **Constraints**
  - Imports from Cluster F must use the extracted shared modules.
  - No changes to appearance defaults or update semantics.

- **Stop conditions**
  - Any callback payload diff for `onAppearanceUpdate`.
  - Any UI interaction difference in deterministic script.

- **Rollback semantics**
  - Revert Phase 2 changes.

### Phase 3 — Extract Cluster D (Hero Background & Text Appearance)
**Purpose:** Move `HeroBackgroundConfigForm` into a dedicated module.

- **Constraints**
  - Must continue using `ColorPicker` from Cluster F.
  - Must preserve cleanup semantics (`delete` behavior on default/undefined) exactly.

- **Stop conditions**
  - Any diff in `onUpdate` payload snapshots for hero interactions.

- **Rollback semantics**
  - Revert Phase 3 changes.

### Phase 4 — Extract Cluster E (Button Appearance)
**Purpose:** Move `ButtonAppearanceForm` into a dedicated module.

- **Constraints**
  - Must preserve `primaryButtonAppearance` / `secondaryButtonAppearance` cleanup semantics.

- **Stop conditions**
  - Any diff in `onUpdate` payload snapshots for hero/cta-band button interactions.

- **Rollback semantics**
  - Revert Phase 4 changes.

### Phase 5 — Extract Cluster B (Block Content Forms)
**Purpose:** Move block-specific content forms into focused modules to reduce `BlockConfigPanel.tsx` size.

- **Constraints**
  - Preserve each form’s local defaulting and conditional rendering.

- **Stop conditions**
  - Any payload snapshot diffs for content edits.

- **Rollback semantics**
  - Revert Phase 5 changes.

### Phase 6 — Reseal: Cluster A Minimal Shell
**Purpose:** Leave `BlockConfigPanel.tsx` as a thin orchestrator that wires imports, selects forms, and renders the panel shell.

- **Stop conditions**
  - File remains above platform size limits.

- **Rollback semantics**
  - Revert Phase 6 changes.

---

## 8. Reseal Criteria (MIG-01 Closure)

MIG-01 can be re-sealed only when all criteria are met:

- **Structural criteria**
  - `apps/website-builder/src/components/website-builder/BlockConfigPanel.tsx` is reduced to within platform size limits and is a clear orchestration shell.
  - Each extracted module has a single responsibility aligned to clusters.

- **Evidence criteria**
  - Deterministic UI interaction script passes.
  - Callback payload snapshots are byte-identical for all tested block types and appearance flows.

- **Boundary criteria**
  - No modifications outside `apps/website-builder/**`.

---

## 9. Stop Conditions (Global)

Stop immediately and report if any of the following occurs:
- Responsibility clusters cannot be defined without guessing.
- Cluster F boundaries cannot be stated explicitly (must match §4).
- Behavior preservation cannot be credibly evidenced via payload snapshots.
- Remediation would require touching code outside `apps/website-builder`.

---

## 10. Appendix: Cluster F Extraction Target Path

All Cluster F items must be extracted to:
- `apps/website-builder/src/components/website-builder/block-config/shared/`

This path is reserved for shared, UI-level primitives and label maps used by block config subcomponents.
