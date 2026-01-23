# Golden Path Flow: Slice 01 — Encounter Lifecycle

## 1. CLASSIFICATION
- **Status:** DRAFT
- **Type:** GOLDEN PATH FLOW
- **Domain:** Encounter
- **Slice:** 01 – Lifecycle

## 2. PURPOSE
Define the single, canonical, successful lifecycle flow for an Encounter, from initial creation to terminal completion. This flow demonstrates the deterministic state machine transitions required for regulator-grade clinical coordination.

## 3. PRECONDITIONS
- The system is in a stable, operational state.
- The actor possesses the necessary capabilities to initiate and transition an Encounter.
- No Encounter with the intended unique identifier exists within the tenant scope.

## 4. GOLDEN PATH FLOW
The following steps represent the sequential, successful progression of the Encounter lifecycle:

### Step 1: Encounter Initialization
- **Action:** An authorized actor initiates the creation of a new Encounter.
- **Transition:** [None] -> `CREATED`
- **Result:** The Encounter is successfully instantiated in the `CREATED` state. It exists as a unique entity within the tenant scope but is not yet active for clinical coordination.

### Step 2: Activation of Clinical Coordination
- **Action:** An authorized actor explicitly transitions the Encounter to the active state.
- **Transition:** `CREATED` -> `ACTIVE`
- **Result:** The Encounter state is updated to `ACTIVE`. The system now permits clinical activities and coordination to be associated with this specific Encounter.

### Step 3: Clinical Coordination Execution
- **Action:** Clinical coordination occurs within the context of the `ACTIVE` Encounter.
- **Transition:** [None] (State remains `ACTIVE`)
- **Result:** The Encounter remains in the `ACTIVE` state throughout the duration of the clinical interaction. All coordination activities are anchored to this state.

### Step 4: Terminal Conclusion
- **Action:** An authorized actor explicitly signals the conclusion of the clinical encounter.
- **Transition:** `ACTIVE` -> `COMPLETED`
- **Result:** The Encounter state is updated to `COMPLETED`. This is a terminal state. No further clinical coordination or state transitions are permitted for this Encounter.

## 5. POSTCONDITIONS
- The Encounter exists in the terminal `COMPLETED` state.
- The state transition history is recorded and immutable.
- The Encounter is locked against further modifications or state changes.

## 6. EXPLICIT EXCLUSIONS
- **No Failure Modes:** This flow does not describe error conditions, invalid transitions, or authorization failures.
- **No Retries:** Each transition is attempted exactly once and must succeed synchronously.
- **No Side Effects:** This flow excludes downstream behaviors such as note generation, billing, or scheduling.
- **No Role Logic:** Transitions are governed by capabilities, not fixed administrative roles.
- **No Re-opening:** The flow ends at `COMPLETED` and cannot be reversed.

## 7. DETERMINISM GUARANTEES
- **Atomic Transitions:** Each state change is synchronous and atomic.
- **Explicit Triggers:** No state transition occurs automatically; each requires an explicit, authorized request.
- **Finite State Machine:** The flow strictly adheres to the allowed paths: `CREATED` -> `ACTIVE` -> `COMPLETED`.
- **Regulator-Grade Traceability:** Every transition in the flow is recorded with high-fidelity evidence of the action and the resulting state.
