# 1. Slice Identifier

- Name: slice-01-clinical-note-golden-path
- Status: ACTIVE
- Classification: EXECUTION SLICE (NON-GOVERNANCE)

# 2. Objective

The goal is to deliver one end-to-end, production-grade clinical note workflow. This slice exists to validate authorization, auditability, persistence, and immutability within the locked boundaries of the v1 governance framework.

# 3. Explicit In-Scope

- Single tenant
- Single clinician role
- One clinical note type
- Lifecycle: draft → signed → read

# 4. Explicit Out-of-Scope

- Editing after signing
- Multi-role access
- Sharing
- Templates
- Search
- Export
- Background jobs
- Notifications
- Analytics

# 5. Execution Constraint

Anything not explicitly in-scope does not exist. Execution occurs strictly within the locked boundaries defined by the v1 governance framework.
