# Legacy Repository Inventory Template

This document is used to **fully understand an existing system before migrating any code** into the Zenthea Platform.

This inventory must be completed **in the legacy repository** (or as a copy referencing it) before:
- Any code is moved
- Any services are implemented
- Any assumptions are made about feasibility

The goal is clarity, not speed.

---

## Inventory Rules

- Do not migrate anything while this document is incomplete.
- Be explicit. Vague answers hide risk.
- Treat unknowns as risks until proven otherwise.
- Assume legacy architecture contains implicit coupling.

---

## Section 1: System Overview

- Repository name:
- Primary purpose:
- Target users (providers, patients, admins, etc.):
- Deployment environments (dev/staging/prod):
- Hosting provider(s):
- Primary database(s):
- Auth provider:
- File storage:
- External APIs:
- Background jobs / workers:
- Real-time features (if any):

---

## Section 2: Domain Breakdown

List every functional domain in the legacy system.

For **each domain**, create a subsection:

### Domain: <DOMAIN NAME>

- Legacy folder paths:
- Description of responsibility:
- Core entities:
- Core workflows:
- Public APIs:
- Background jobs:
- Integrations:
- Data sensitivity:
  - PHI: yes/no
  - PII: yes/no
- Compliance assumptions:
- Notes:

Repeat for all domains.

---

## Section 3: AI Usage (If Any)

If the legacy system already uses AI:

- Where AI is used:
- Purpose (chat, summarization, search, etc.):
- Model providers:
- Prompt storage location:
- Any tool usage:
- Logging behavior:
- Evaluation or safety checks:
- Compliance considerations:

If none, explicitly state: “No AI usage.”

---

## Section 4: Data Models and Persistence

For each datastore:

- Database type:
- Schema ownership (single schema vs shared):
- Key tables / collections:
- Relationships:
- Multi-tenancy strategy (if any):
- Data isolation strategy:
- Backup approach:
- Migration risks:

---

## Section 5: Frontend Applications

For each frontend:

### App: <APP NAME>

- Framework:
- Entry point:
- Routing strategy:
- Auth assumptions:
- API dependencies:
- Shared UI components:
- State management approach:
- Known pain points:

---

## Section 6: Integrations

List every external integration.

For each integration:

- Name:
- Purpose:
- Direction (read/write):
- Auth method:
- Rate limits:
- Failure handling:
- Data sensitivity:
- Notes:

---

## Section 7: Compliance & Security Posture

- HIPAA assumptions:
- GDPR assumptions:
- Access control model:
- Audit logging:
- Data encryption:
- Known gaps or risks:

---

## Section 8: Technical Debt & Risks

Be brutally honest.

- Tight coupling:
- Hidden side effects:
- Performance bottlenecks:
- Security concerns:
- Scaling risks:
- Areas likely to conflict with platform guardrails:

---

## Section 9: Migration Readiness Assessment

Answer honestly:

- Is the domain well-defined? yes/no
- Can it be isolated cleanly? yes/no
- Requires redesign? yes/no
- Estimated migration complexity: low / medium / high
- Suggested migration wave (early / mid / late):

---

## Final Notes

- What scares you most about this codebase?
- What parts are surprisingly solid?
- What would you never rebuild this way again?

These answers matter more than perfect documentation.

---

## Exit Criteria

This inventory is complete when:
- Every domain is listed
- Every frontend is described
- Every integration is identified
- Major risks are documented

Only then may migration planning begin.