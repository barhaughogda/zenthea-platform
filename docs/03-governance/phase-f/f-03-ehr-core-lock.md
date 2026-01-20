# Phase F.3 – EHR Core Lock

## Status
LOCKED

## Effective Date
2026-01-19

## Scope
This document locks the **EHR Core domain model and behavioral invariants** implemented in Phase F.2 (Slices 1–4).  
From this point forward, the EHR Core is considered **stable, safety-critical infrastructure**.

Any changes to this scope require explicit governance authorization and must follow formal change control.

---

## Locked Domains
The following domains are LOCKED and MUST NOT be modified without explicit approval:

- Patient
- Practitioner (Clinician)
- Encounter
- Clinical Note

These domains collectively define the **minimum viable, production-grade EHR backbone**.

---

## Locked Invariants

### 1. Authority & Human Attribution
- All write operations MUST require a valid `AuthorityContext`.
- Authority MUST be fail-closed.
- Medical records MUST be attributable to a human clinician.
- No system, agent, or automation may author clinical data autonomously.

### 2. Read / Write Separation
- Read models MUST be non-authoritative.
- Read paths MUST NOT accept authority signals.
- Write paths MUST NOT return mutable data structures.

### 3. Immutability
- All read views MUST be immutable (`Object.freeze` or equivalent).
- Finalized clinical notes MUST be immutable.
- No post-finalization mutation is permitted.

### 4. Tenant Isolation
- All domain operations MUST be tenant-scoped.
- Cross-tenant reads or writes are strictly forbidden.
- Tenant context MUST NOT be inferred implicitly.

### 5. Determinism
- All EHR Core logic MUST be synchronous and deterministic.
- No background jobs, queues, retries, or eventual consistency.
- No side effects outside the immediate call boundary.

---

## Explicitly Out of Scope (LOCKED OUT)

The following are explicitly forbidden within the EHR Core:

- Database bindings or migrations
- ORM usage
- External APIs
- Network calls
- Async processing
- Event buses
- Message queues
- AI or probabilistic logic
- Transcription or voice handling
- UI concerns
- Authentication or session management

These concerns MUST be handled in outer layers.

---

## Allowed Extensions (Post-Lock)

The following MAY be added **around** the EHR Core without modifying it:

- Persistence adapters (Phase G)
- API gateways (Phase H)
- Authorization enforcement layers
- UI composition
- AI-assisted tooling (non-authoritative)
- Voice and transcription systems (ephemeral only)

All extensions MUST treat the EHR Core as immutable.

---

## Change Control
Any modification to:
- Domain fields
- Write semantics
- Authority rules
- Finalization behavior
- Tenant boundaries

requires:
1. New governance authorization
2. Explicit versioning
3. Backward compatibility analysis

---

## Purpose of This Lock
This lock ensures that:
- Safety-critical medical logic is stable
- Audits remain tractable
- Future innovation does not compromise trust
- AI and automation remain assistive, never authoritative

The EHR Core is now a **foundation**, not an experiment.

---

## Final Declaration
Phase F.3 establishes the EHR Core as **production-grade, governance-locked infrastructure**.

No further domain evolution may occur within this layer without explicit authorization.