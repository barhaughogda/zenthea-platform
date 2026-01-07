# CP-17: Controlled Mutations (Option A: Communication Side Effects Only)

## Overview
CP-17 introduces the first governed mutation pathway for the Zenthea Platform, enabling communication side effects (messages and notifications) while maintaining strict security, auditability, and determinism.

## Acceptance Criteria
- [ ] **One Mutation Gateway Only**: All side effects execute through `packages/tool-gateway`.
- [ ] **Approval Required**: No mutation executes without an explicit approval record.
- [ ] **Allowlist Required**: Only `comm.send_message@v1` and `comm.create_notification@v1` are allowed.
- [ ] **Deterministic + Idempotent**: Idempotency keys required; replays return prior results.
- [ ] **Fail Closed**: Rejection if any requirement is missing.
- [ ] **Metadata-Only Outputs**: Operator DTOs do not leak sensitive information (tenantId, PHI, raw results).
- [ ] **Audit Emission**: Full lifecycle audit with metadata-only payloads.

## Constraints
- **Scope Lock**: Support ONLY `comm.send_message@v1` and `comm.create_notification@v1`.
- **No Real Side Effects**: Use deterministic mock executor in this slice.
- **No UI**: Implementation is limited to `packages/tool-gateway`.
- **No Database**: Idempotency store is in-memory.
