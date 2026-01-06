# Slice 08 – Step 08.3: Approval Hooks (Interfaces Only)

## Status
Planned

## Purpose
Define platform-level interfaces for human approval workflows triggered by ApprovalSignals, without implementing storage, UI, or automation.

This step introduces **hooks and contracts only**.

---

## Non-Negotiable Constraints

- No persistence of approvals
- No UI implementation
- No workflow engine
- No background jobs
- No automated mitigation
- No PHI
- No tenantId, actorId, agentId

---

## Conceptual Model

### Inputs
ApprovalSignals emitted by the Tool Gateway (Slice 08.1)

### Human Output
An ApprovalDecision recorded externally (future slice or external system)

### Runtime Effect
None in this slice.
Any action taken is manual (e.g., kill switches), guided by Step 08.2.

---

## Interfaces

### ApprovalRequest (metadata-only)
Represents a request for a human decision.

Fields:
- requestId: string (opaque UUID)
- triggerType: string (derived from ApprovalSignal triggerType)
- escalationLevel: 1 | 2 | 3
- severity: 'low' | 'medium' | 'high'
- toolName: string
- agentType: string
- agentVersion: string
- policySnapshotHash: string
- timestamp: string (ISO)

### ApprovalDecision (metadata-only)
Represents a human decision outcome.

Fields:
- requestId: string
- decision: 'approve' | 'reject' | 'defer'
- decidedByRole: 'platform_owner' | 'security' | 'on_call' | 'support'
- timestamp: string (ISO)
- note: string (optional, must not contain PHI)

---

## Hook Contracts

### IApprovalRequestEmitter
A hook to emit approval requests for external systems.

Methods:
- emit(request: ApprovalRequest): void

Rules:
- Must not throw
- Must not log PHI
- Must be safe to call in hot path (fire-and-forget)

### IApprovalDecisionProvider
A hook for pulling decisions from an external system.

Methods:
- getDecision(requestId: string): ApprovalDecision | null

Rules:
- No persistence in tool-gateway
- No polling loops in runtime
- Intended for future slices only

---

## Integration Guidance (No Implementation)

- Tool Gateway may create ApprovalRequest objects when ApprovalSignals fire
- ApprovalRequest may be forwarded to:
  - Pager system
  - Ticketing system
  - Security queue
- Decision ingestion is explicitly deferred to a future slice

---

## Completion Criteria

- ApprovalRequest and ApprovalDecision are defined
- Hook interfaces are defined
- All constraints are explicitly stated
- No runtime behavior changes introduced