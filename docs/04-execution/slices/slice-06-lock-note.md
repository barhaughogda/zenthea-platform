# Governance Lock Note: Slice 06

## 1. Classification
- **Status**: FINAL, HARDENED, IMMUTABLE
- **Scope**: Clinical Note Signing Semantics
- **Governance Level**: CRITICAL (Irreversible State Transition)

## 2. Artifact References
This lock note governs the design specified in the following artifacts:
- `docs/04-execution/slices/slice-00-reference-blueprint.md`
- `docs/04-execution/slices/slice-06-clinical-note-signing-semantics.definition.md`
- `docs/04-execution/slices/slice-06-clinical-note-signing-semantics.golden-path.md`
- `docs/04-execution/slices/slice-06-clinical-note-signing-semantics.failure-matrix.md`
- `docs/04-execution/slices/slice-06-clinical-note-signing-semantics.test-matrix.md`
- `docs/04-execution/slices/slice-06-clinical-note-signing-semantics.implementation-sequencing.md`

## 3. Deterministic Constraints

### Irreversibility
- **Constraint**: Once a clinical note is signed, the transition to the `SIGNED` state is absolute and irreversible.
- **Rule**: No mechanism shall exist to "unsign", "revert", or "unlock" a signed note.
- **Rule**: Post-sign mutation of the note content or its primary metadata is strictly prohibited.

### State Gating
- **Constraint**: Signing is only permitted from valid terminal draft states.
- **Rule**: The system must enforce fail-closed behavior. Any ambiguity in state, permissions, or integrity checks must result in a rejected signing attempt.
- **Rule**: No overrides, administrative bypasses, or "force-sign" flags are permitted.

### Audit Rules
- **Failure Audit**: Zero audit emission on failure to prevent noise and potential data leakage in audit logs. Errors must be handled through standard exception paths, not the audit trail.
- **Success Audit**: Success-only, metadata-only audit emission. The audit record must confirm the transition but must not contain the clinical content itself.

## 4. Immutability Declaration
Slice 06 is hereby declared **IMMUTABLE**. The design logic, state transitions, and security constraints defined in the referenced artifacts are frozen. 

Any future change to the signing semantics, state machine, or audit requirements for clinical notes requires a formal design amendment process and a new governance lock.
