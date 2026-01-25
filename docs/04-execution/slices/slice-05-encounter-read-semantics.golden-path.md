# Golden Path: Encounter Slice 05 — Read Semantics

## 1. Entry Conditions
The read operation requires the absolute presence of the following conditions:
- A validated TenantContext establishing the isolation boundary.
- A validated AuthorityContext containing the explicit `can_read_encounter` capability.
- A unique and valid Encounter identifier.
- A request timestamp that falls within the defined temporal visibility window for the target resource.

## 2. Sequential Flow
The execution must follow this exact sequence. Any deviation or failure at any step terminates the flow immediately.

1. **Context Validation**: Verification of the integrity and presence of the required execution contexts.
2. **Tenant Isolation Enforcement**: Strict validation that the requested Encounter identifier belongs to the active TenantContext.
3. **Capability Authorization**: Confirmation that the AuthorityContext possesses the necessary permissions to access the Encounter resource.
4. **Temporal Visibility Validation**: Verification that the current system time and request parameters align with the temporal constraints of the Encounter.
5. **State Visibility Validation**: Verification that the Encounter is in a state designated as readable by the system policy.
6. **Encounter Retrieval**: The atomic fetch of the Encounter state from the authoritative data store.
7. **Audit Emission**: The synchronous emission of exactly one success-level audit event containing metadata-only records of the access.
8. **Deterministic Response Return**: The return of the complete Encounter state to the requester.

## 3. State Constraints
The following constraints apply to the state of the system and the resource:
- The Encounter must exist in a state that permits read access.
- No state transitions shall occur during the execution of this flow.
- No mutations to the Encounter or any related entities shall occur.
- No data enrichment or transformation of the retrieved state is permitted.

## 4. Audit Semantics
Audit logging is governed by these absolute requirements:
- Exactly one audit event is generated per successful execution.
- The audit event contains metadata only; no sensitive or resource-specific data is included.
- The event is emitted only after all validations have passed and the resource has been successfully retrieved.
- Failure to emit the audit event results in the immediate failure of the request (fail-closed).

## 5. Response Guarantees
The system provides the following guarantees for the response:
- The output is deterministic; identical inputs and system states yield identical outputs.
- The response is returned in its entirety; partial data delivery is prohibited.
- The response contains only the stored state of the Encounter; no derived, calculated, or synthetic fields are included.
