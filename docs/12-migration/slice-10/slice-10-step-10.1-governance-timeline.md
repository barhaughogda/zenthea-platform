# Slice 10 – Step 10.1: Governance & Approval Timeline (Read-Only)

## Status
Completed

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

## Implementation Details

### Timeline Models
Defined in `packages/tool-gateway/src/timeline.ts`:
- `GovernanceTimelineEvent`: Union type of all governance-related events.
- `ToolGatewayTimelineEvent`: Metadata-only view of tool invocations (PII/PHI stripped).
- `GovernanceControlTimelineEvent`: View of policy enforcement results.
- `ApprovalSignalTimelineEvent`: View of escalation/approval triggers.
- `TransitionTimelineEvent`: View of agent lifecycle changes.

### Security Enforcement
The `TimelineAggregator` strictly enforces data boundary rules:
- **PII/PHI Stripping**: `tenantId`, `actorId`, `requestId`, and `idempotencyKeyHash` are removed from `ToolGatewayEvent` during conversion.
- **Metadata Only**: No payloads or free-text fields are included.
- **Append-only**: Logic is provided for chronological sorting by timestamp.

### Query Interface
The `IGovernanceTimelineReader` interface provides a standard way for storage backends (like Convex) to expose the timeline:
```typescript
export interface IGovernanceTimelineReader {
  query(filter: TimelineFilter): Promise<GovernanceTimelineEvent[]>;
  getEvent(eventId: string): Promise<GovernanceTimelineEvent | null>;
}
```
