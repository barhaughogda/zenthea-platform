# Slice 11 – Step 11.3: Operator API Filtering & Query Controls (Read-Only)

## Status
Completed

## Evidence
- `packages/tool-gateway/src/operator-api.ts`: Implements allowlisted filtering for `getTimeline` and `getAgents`.
- `packages/tool-gateway/src/operator-api.test.ts`: Verifies filter validation, correct subset returns, and rejection of unknown filters.
- `packages/tool-gateway/src/types.ts`: Defines `OperatorTimelineFilterV1` and `OperatorAgentFilterV1` for strict boundary validation.

## Purpose
Introduce **explicit, safe, server-side filtering** for Operator APIs to support operational analysis without overfetching or client-side filtering.

This step completes the Operator read model by allowing **controlled narrowing of result sets** while preserving:
- Read-only guarantees
- Metadata-only exposure
- Deterministic ordering
- Cursor-safe pagination

No new data sources are introduced.

---

## Scope

### In Scope
- Allowlisted filters for Operator APIs:
  - Governance Timeline
  - Enriched Timeline
  - Agent Registry
- Strict filter validation at the API boundary
- Filters applied **before pagination**
- Cursor semantics preserved under filtering

### Out of Scope
- Free-text search
- Regex or fuzzy matching
- Payload inspection
- Cross-entity joins beyond existing primitives
- Any write or mutation behavior

---

## Operator APIs Affected

### 1. Governance Timeline
`getTimeline(filter, cursor?, limit?)`

### 2. Enriched Timeline
`getEnrichedTimeline(filter, cursor?, limit?)`

### 3. Agent Registry
`getAgents(filter?, cursor?, limit?)`

---

## Allowed Filters (Explicit Allowlist)

### Timeline Filters
- `toolName` (allowlisted tool names only)
- `decision` (`allowed | denied | warning | rate_limited | error`)
- `actorType`
- `agentVersion`
- `policySnapshotHash`
- `fromTimestamp`
- `toTimestamp`

### Agent Registry Filters
- `agentType`
- `lifecycleState`
- `agentId`

### Forbidden Filters
- Free-form text
- Payload-derived fields
- Tenant identifiers
- Actor identifiers
- Request IDs
- Idempotency keys
- Any field not explicitly listed above

Unknown filters MUST be rejected.

---

## Filter Validation Rules

- Filters are validated synchronously at the API boundary
- Invalid filters result in a deterministic error
- Partial filter application is forbidden
- Empty filters are allowed (return unfiltered results)

---

## Cursor Interaction Rules

- Filters MUST be applied **before pagination**
- Cursor encoding MUST NOT include filter state
- Cursor remains opaque and deterministic
- Changing filters invalidates cursor continuity (by design)

---

## Determinism Guarantees

- Stable ordering is preserved:
  - Timelines: chronological (timestamp + secondary key)
  - Registry: agentId + agentVersion
- Filtered results are a strict subset of unfiltered results
- Same input → same output ordering

---

## Security Constraints

### MUST NOT Appear in Responses
- tenantId
- actorId
- requestId
- idempotencyKey
- payloads
- free-text fields
- latency metadata

### Metadata-Only Rule
All returned data must already pass through existing sanitizers:
- TimelineAggregator
- AgentRegistryReader
- TimelineRegistryJoiner

This step introduces **no new exposure paths**.

---

## API Contract Changes

- Extend existing filter interfaces with allowlisted fields
- No breaking changes to existing response envelopes
- Pagination contract from Step 11.2 remains unchanged

---

## Testing Requirements

### Required Tests
- Valid filters return correct subsets
- Invalid filters are rejected
- Filtering + pagination works across pages
- Cursor opacity preserved
- Deterministic ordering under filtering
- Forbidden fields never appear

### Verification Commands
```bash
pnpm --filter @starter/tool-gateway typecheck
pnpm --filter @starter/tool-gateway test
```

## Rollback Plan
- Remove filter handling
- Restore unfiltered API behavior
- No data migrations required

---

## Definition of Done
- Filters implemented and validated
- Cursor semantics preserved
- All tests passing
- No PHI or sensitive identifiers exposed
- Single commit on feature branch

---