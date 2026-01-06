# Slice 10 – Step 10.2: Agent Registry (Read-Only)

## Status
Complete

## Purpose
Expose a read-only, metadata-only view of all registered agents and their versions.

This registry provides operators and providers with visibility into:
- Which agents exist
- Which versions are active
- Their lifecycle states
- Their allowed scopes
- The policy snapshot currently governing them

No control or mutation capabilities are introduced.

---

## Scope
- Read-only projection of the agent registry
- Deterministic and reproducible
- Derived from the canonical governance configuration
- Metadata-only

---

## Explicit Non-Goals
- No lifecycle transitions
- No approvals
- No writes
- No tenant or actor scoping
- No PHI or PII
- No policy editing

---

## Data Model
Each registry entry MUST include:
- agentId
- agentVersion
- agentType
- lifecycleState
- allowedScopes (string names only)
- policySnapshotHash
- lastUpdatedAt (ISO string)

---

## Interfaces
### IAgentRegistryReader
- listAgents()
- getAgent(agentId)
- getAgentVersion(agentId, agentVersion)

All interfaces MUST be read-only.

---

## Security Constraints
- MUST NOT include tenantId
- MUST NOT include actorId
- MUST NOT include requestId
- MUST NOT include payloads
- MUST NOT include internal policy rules
- MUST NOT include free-text fields

---

## Determinism
- Registry output MUST be derived directly from the in-memory governance configuration
- Ordering MUST be stable
- Output MUST be reproducible across runs

---

## Verification Requirements
- Type safety enforced
- Snapshot hash correlation verified
- Tests asserting forbidden fields are never exposed

---

## Outcome
Operators gain a clear, safe, read-only view of the agent surface without any ability to influence runtime behavior.