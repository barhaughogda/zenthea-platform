# Slice 10 – Step 10.1: Governance & Approval Timeline (Read-Only)

## Status
Planned

## Purpose
Provide operators and providers with a unified, chronological view of all governance-relevant events without enabling any control or mutation.

This timeline answers:
- What happened?
- When did it happen?
- Under which policy snapshot?
- Which agent version was involved?

## Data Sources (Read-Only)
- ToolGatewayEvent
- GovernanceControlResult
- ApprovalSignal
- TransitionEvent

## Correlation Rules
Events MUST be correlatable via:
- policySnapshotHash
- agentVersion
- toolName (when applicable)
- timestamp

## Display Model
- Strictly append-only timeline
- Filterable by:
  - agentId (logical)
  - agentVersion
  - toolName
  - severity
  - decision type
- No grouping that hides ordering

## Security Constraints
- No PHI
- No tenantId
- No actorId
- No payloads
- No free-text fields beyond predefined enums

## Non-Goals
- No approval actions
- No lifecycle transitions
- No policy edits
- No alert configuration

## Outcome
Operators gain full historical context for governance and approval behavior without any ability to influence runtime behavior.