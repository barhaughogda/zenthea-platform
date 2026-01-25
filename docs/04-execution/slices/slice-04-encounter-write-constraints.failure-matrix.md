# Failure Matrix: Encounter Slice 04 — Write / Mutation Constraints

**Status: DESIGN-ONLY**
**Classification: CRITICAL / REGULATOR-GRADE**

## 1. Failure Philosophy

This Failure Matrix defines the deterministic boundary for Encounter mutation operations. The system operates under a strict **Fail-Closed** architecture. Any deviation from the established invariants, context requirements, or authorization state results in an immediate and total abort of the operation.

### Core Invariants:
- **Atomicity:** Mutations are strictly atomic. Partial state changes are prohibited.
- **Zero Leakage:** Error responses must not leak internal state, structural metadata, or sensitive context.
- **Immutability of Failure:** A failed request shall leave the system state identical to its pre-request state.
- **No Overrides:** There are no administrative, role-based, or emergency bypasses for these constraints.

---

## 2. Failure Categories

### 2.1 Context Failures
| Scenario | Failure Condition | Required Outcome |
| :--- | :--- | :--- |
| Missing Tenant Context | Operation requested without a valid tenant identifier. | Immediate Abort |
| Malformed Tenant Context | Tenant identifier format is invalid or unrecognized. | Immediate Abort |
| Missing Authority Context | Operation requested without an established actor identity. | Immediate Abort |
| Malformed Authority Context | Actor identity format is invalid or cryptographically unverifiable. | Immediate Abort |

### 2.2 Authorization Failures
| Scenario | Failure Condition | Required Outcome |
| :--- | :--- | :--- |
| Missing Capability | Actor lacks the `can_mutate_encounter` capability. | Immediate Abort |
| Inactive Capability | Required capability is present but marked revoked or inactive. | Immediate Abort |
| Relationship Violation | Actor identity is valid but lacks permission for the specific Encounter resource. | Immediate Abort |

### 2.3 Lifecycle State Failures
| Scenario | Failure Condition | Required Outcome |
| :--- | :--- | :--- |
| Invalid Source State | Encounter is in a state other than `CREATED` or `ACTIVE`. | Immediate Abort |
| Terminal State Mutation | Attempt to modify an Encounter in a terminal state (e.g., `COMPLETED`, `CANCELLED`). | Immediate Abort |
| Illegal Transition | Mutation request implies a state transition not permitted by the lifecycle model. | Immediate Abort |

### 2.4 Temporal Failures
| Scenario | Failure Condition | Required Outcome |
| :--- | :--- | :--- |
| Outside Mutation Window | Request timestamp falls outside the permitted window for the current state. | Immediate Abort |
| Malformed Timestamp | Provided temporal data is not in a deterministic, ISO-compliant format. | Immediate Abort |
| Temporal Ambiguity | Detected clock skew or sequence violation relative to known system time. | Immediate Abort |

### 2.5 Resource Failures
| Scenario | Failure Condition | Required Outcome |
| :--- | :--- | :--- |
| Resource Non-Existence | The targeted Encounter identifier does not exist in the system. | Immediate Abort |
| Cross-Tenant Violation | Target Encounter belongs to a tenant different from the request context. | Immediate Abort |
| Invariant Violation | Mutation would result in an Encounter state that violates core integrity rules. | Immediate Abort |

### 2.6 System Failures
| Scenario | Failure Condition | Required Outcome |
| :--- | :--- | :--- |
| Persistence Failure | Underlying storage mechanism fails to acknowledge the mutation. | Immediate Abort |
| Audit Sink Failure | The mandatory audit record cannot be durably recorded. | Immediate Abort |
| Atomicity Violation | Any part of the multi-resource mutation fails to commit. | Total Rollback |

---

## 3. Prohibited Behaviors (Absolute)

The following behaviors are strictly prohibited and must be prevented by the system design:

1.  **Partial Mutations:** No subset of the requested changes may be applied if any part of the request fails.
2.  **State Staging:** No "draft" or "pending" state may be created in the event of a constraint violation.
3.  **Automatic Retries:** The system must not automatically retry a request that failed due to a constraint violation.
4.  **Role-Based Bypass:** No user role, including "System Administrator" or "Superuser," shall bypass these constraints.
5.  **Error Detail Leakage:** Error responses must not contain stack traces, database schema details, or specific field-level values.
6.  **Audit Omission:** No successful mutation shall occur without a corresponding, durable audit entry.
7.  **Audit Emission on Failure:** Failed requests must not emit audit events that suggest a state change occurred.
