# Service → Control Plane Adapter

## Purpose
This package defines the explicit, non-behavioral boundary between backend Domain Services and the Platform Control Plane. It ensures that all governance-critical operations (policy evaluation, audit emission, decision hooks) are mediated through a strictly defined contract.

## Responsibility
- Define the contract for services to request policy decisions.
- Define the contract for emitting uniform, metadata-only audit events.
- Ensure all control plane interactions are deterministic and version-aware.

## Non-Goals
- No implementation of policy logic.
- No implementation of audit storage or processing.
- No side effects inside the adapter.
- No imports from `services/` or control plane implementation code.
- No behavioral logic.
