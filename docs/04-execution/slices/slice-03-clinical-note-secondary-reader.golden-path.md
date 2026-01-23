# Golden Path Flow: Slice 03 - Clinical Note Secondary Reader

## 1. Actors
- **Secondary Reader**: A clinician authenticated within the platform.
- **System**: The Zenthea Platform clinical note service.

## 2. Preconditions
- The Clinical Note exists in the persistence layer.
- The Clinical Note `State` is exactly `SIGNED`.
- The Secondary Reader is authenticated and has a valid `Session`.
- The Secondary Reader's `TenantID` matches the Clinical Note's `TenantID`.
- The Secondary Reader's `Role` is authorized for secondary clinical review (e.g., `Supervisor`).
- The Secondary Reader is NOT the author of the note (this is a secondary read).

## 3. Step-by-Step Golden Path
1. **Request Initiation**: The Secondary Reader submits a `GET` request for a specific `NoteID`.
2. **Transport Validation**: The System validates the request format and presence of required identity headers.
3. **Tenant Context Extraction**: The System extracts the `TenantID` from the Secondary Reader's security context.
4. **Note Retrieval**: The System fetches the Clinical Note from the persistence layer using `NoteID` and `TenantID`.
5. **Authorization Check**: The System evaluates the access request against the Authorization Boundary (see Section 4).
6. **Audit Emission**: The System emits a `NOTE_READ` audit event (see Section 6).
7. **Response Delivery**: The System returns the Clinical Note content with a `200 OK` status.

## 4. Authorization Checkpoint
The System MUST verify the following logical conditions before granting access:
- **Tenant Isolation**: `Request.TenantID == Note.TenantID`
- **State Requirement**: `Note.State == 'SIGNED'`
- **Role Authority**: `Request.UserRole` is in the set of authorized secondary reader roles.
- **Access Level**: Access is strictly `READ-ONLY`.

## 5. Persistence Interaction (Read-Only)
- **Operation**: `SELECT` (or equivalent read operation).
- **Scope**: Single record retrieval by `NoteID`.
- **Constraint**: No data modification or state transition is permitted during this flow.

## 6. Audit Emission
The System MUST emit a `NOTE_READ` event with the following metadata:
- `EventID`: Unique identifier for the audit record.
- `Timestamp`: UTC execution time.
- `ActorID`: The `UserID` of the Secondary Reader.
- `ActorRole`: The `Role` of the Secondary Reader.
- `NoteID`: The identifier of the note accessed.
- `TenantID`: The identifier of the tenant.
- `AccessType`: `SecondaryReader`.

## 7. Postconditions
- The Secondary Reader has received the full content of the `SIGNED` clinical note.
- The state of the Clinical Note remains unchanged (`SIGNED`).
- A permanent, immutable audit record of the access exists in the audit trail.
- No PHI has been leaked outside the tenant boundary.

---
**Classification**: DESIGN-ONLY. NON-EXECUTABLE.
