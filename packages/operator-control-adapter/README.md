# Operator UI → Control Plane Adapter

## Purpose
This package defines the explicit, non-behavioral boundary between the Operator UI and the Platform Control Plane. It ensures that internal administrative and governance operations are mediated through a strictly defined contract.

## Responsibility
- Define the contract for administrative operations (policy updates, audit inspection).
- Define the contract for human-in-the-loop (HITL) decision signaling.
- Ensure all operator interactions are authenticated, audited, and deterministic.

## Non-Goals
- No implementation of governance logic.
- No UI components or rendering logic.
- No direct database access.
- No imports from `apps/` or `services/`.
- No side effects.
