# Agent Taxonomy

This document defines the full set of agents planned for the Zenthea Platform to support a world-class, AI-driven, HIPAA-compliant EHR system. It is the single source of truth for agent scope, ownership boundaries, and build order.

This is not a commitment to implement everything immediately. It is a commitment to:
- Assign every important capability a named home.
- Prevent “missing agents” later.
- Keep the platform architecture stable while capabilities expand.

---

## Definitions

### Agent
A domain service that provides:
- Deterministic domain logic (in `/domain`)
- AI capability (in `/ai`) using the governed AI runtime
- API surface (in `/api`) with validated contracts
- Orchestration (in `/orchestration`) enforcing policy and tenancy
- Strict tool proposal model (no direct side effects)

### Product UI
A frontend module (or app) that consumes an agent via a typed SDK. Frontends are thin. They do not own business logic, entitlements, or compliance rules.

### Clinical vs Patient vs Platform
Agents are grouped by:
- **Clinical (provider-facing)**: assists clinicians and clinical workflows.
- **Patient-facing**: assists patients with access and self-service.
- **Platform/Governance**: ensures policy, auditability, and system integrity.
- **Operations/Business**: supports sales, marketing, billing, internal ops.

---

## Non-Negotiable Rules (All Agents)

- No direct model calls outside the governed AI runtime package.
- No tool execution outside the Tool Execution Gateway.
- No service-to-service imports. Communication is via events or SDK/API boundaries.
- All AI outputs must be structured and validated (Zod).
- All PHI/PII handling must follow HIPAA + GDPR policy hooks and audit requirements.
- Each service README must include a `## Backup and Recovery` section.
- Each agent must have at least one AI evaluation (golden test) in CI.

---

## Agent Catalog

Each agent entry includes:
- Purpose: what it exists to do.
- Primary user: who benefits.
- Data sensitivity: PHI/PII considerations.
- Notes: key boundaries and pitfalls.

### Clinical and Provider Agents

#### medical-advisor-agent
- Purpose: Provider co-pilot for evidence-guided clinical support, summarization, and decision support.
- Primary user: Clinicians.
- Data sensitivity: PHI high.
- Notes:
  - Must be human-in-the-loop.
  - Must cite evidence sources where applicable.
  - Can use external medical evidence systems only through a governed integration boundary.
  - Never presents itself as replacing clinician judgment.

#### clinical-documentation-agent
- Purpose: Clinical scribe and documentation assistant (SOAP notes, summaries, referrals, discharge notes).
- Primary user: Clinicians.
- Data sensitivity: PHI high.
- Notes:
  - Draft-only outputs.
  - Requires explicit clinician review and sign-off.
  - Must preserve provenance and audit trail.

#### care-plan-agent
- Purpose: Generate and manage structured care plans and follow-up pathways.
- Primary user: Clinicians and care teams.
- Data sensitivity: PHI high.
- Notes:
  - Outputs are structured plans, not freeform text.
  - Approval required before care plan activation.

#### medication-agent
- Purpose: Medication reconciliation, adherence support, interaction warnings, and medication education.
- Primary user: Clinicians and patients (as read-only education).
- Data sensitivity: PHI high.
- Notes:
  - Suggest-only.
  - Must not prescribe.
  - Must not auto-change medication lists.

#### coding-agent
- Purpose: Clinical coding support (ICD-10, CPT), charge capture assistance, documentation completeness prompts.
- Primary user: Clinicians and billing staff.
- Data sensitivity: PHI medium-high.
- Notes:
  - Suggest-only.
  - Never submits claims or charges automatically.
  - Feeds billing domain via usage and coding suggestions only.

---

### Patient-Facing Agents

#### patient-portal-agent
- Purpose: Patient assistant that answers questions about the patient’s own health record, labs, medications, and care plan.
- Primary user: Patients.
- Data sensitivity: PHI high.
- Notes:
  - Requires strict identity verification and patient-scoped access controls.
  - Must use scoped retrieval patterns for PHI (RAG-style access).
  - Must avoid revealing third-party data or clinician-only notes unless policy allows.
  - Must support redaction and safe summarization.

#### appointment-booking-agent
- Purpose: Patient scheduling assistant (book, reschedule, cancel), guided intake and reminders.
- Primary user: Patients and front-desk operations.
- Data sensitivity: PHI low-medium (appointment context can be sensitive).
- Notes:
  - All side effects are tool proposals only.
  - Must enforce tenant, location, provider availability policies.
  - Can integrate with calendars through the execution gateway.

#### triage-agent
- Purpose: Symptom collection and pre-visit intake. Guides patients to the right next step (not diagnosis).
- Primary user: Patients.
- Data sensitivity: PHI high.
- Notes:
  - Must never diagnose.
  - Must provide clear guidance and escalation logic.
  - Must use conservative, safety-first language.

#### education-agent
- Purpose: Explain diagnoses, labs, procedures, and care instructions in patient-friendly language.
- Primary user: Patients.
- Data sensitivity: PHI medium-high.
- Notes:
  - Must be calm and non-alarmist.
  - Must be literacy-aware.
  - Prefer retrieval-grounded responses when referencing clinical facts.

---

### Platform and Governance Agents

#### consent-agent
- Purpose: Manage consent, disclosure rules, data sharing permissions, and access grants.
- Primary user: Compliance, clinicians, patients.
- Data sensitivity: PII/PHI medium-high.
- Notes:
  - Enforcement is deterministic first, AI assists explanation and workflow.
  - Integrates with policy hooks and audit logs.

#### ai-governor-agent
- Purpose: AI governance assistant that explains policy blocks, monitors drift, and supports admins in AI configuration review.
- Primary user: Admins, compliance, engineering.
- Data sensitivity: Low-medium (policy metadata, not PHI by default).
- Notes:
  - Must not gain access to PHI unless explicitly required and audited.
  - Focus on transparency and traceability.

#### audit-agent
- Purpose: Detect access anomalies, suspicious behavior, and policy violations; assist in audit preparation.
- Primary user: Compliance and security.
- Data sensitivity: High (audit logs may include identifiers).
- Notes:
  - No PHI in logs. Use identifiers and structured references.
  - Must support exportable audit trails.

---

### Operations and Business Agents

#### internal-admin-agent
- Purpose: Staff co-pilot for operations: internal support, task handling, workflows, and admin efficiency.
- Primary user: Staff and operators.
- Data sensitivity: Varies; should be least-privilege by default.
- Notes:
  - Gate access carefully; avoid accidental PHI exposure.
  - Often becomes the glue for internal workflows, but must remain policy-driven.

#### sales-agent
- Purpose: Sales enablement, lead management, customer follow-ups, pipeline hygiene.
- Primary user: Sales team.
- Data sensitivity: PII medium (prospect data).
- Notes:
  - Integrate with CRM via execution gateway.

#### marketing-agent
- Purpose: Content generation, campaign planning, website content ops, social posting proposals.
- Primary user: Marketing team.
- Data sensitivity: Low-medium.
- Notes:
  - External postings are tool proposals only.
  - Brand voice must be controlled and versioned.

#### project-agent
- Purpose: Internal project management assistant: task shaping, status reporting, meeting summaries.
- Primary user: Teams and operators.
- Data sensitivity: Low-medium.
- Notes:
  - Integrate with PM tools via execution gateway.

---

## Build Waves

This defines the recommended scaffold order. The goal is to validate critical patterns early.

### Wave 1: Core clinical + patient access + consent
Scaffold first:
- medical-advisor-agent
- patient-portal-agent
- appointment-booking-agent
- clinical-documentation-agent
- consent-agent

Why:
- Proves HIPAA-grade patterns.
- Separates provider vs patient logic.
- Establishes consent as a first-class primitive.

### Wave 2: Clinical depth and billing adjacency
Scaffold next:
- care-plan-agent
- medication-agent
- coding-agent
- triage-agent
- education-agent

Why:
- Adds depth without expanding integrations too early.

### Wave 3: Governance and operations
Scaffold last:
- ai-governor-agent
- audit-agent
- internal-admin-agent
- sales-agent
- marketing-agent
- project-agent

Why:
- Strong differentiation, but depends on the maturity of observability and policy.

---

## Notes on External Evidence Models and Retrieval

Some agents will use external medical evidence sources or specialized models. This must follow these rules:

- External evidence access is via an integration boundary and must be auditable.
- Patient-scoped PHI retrieval must be tenant and identity scoped (RAG-style pattern).
- No PHI is logged. Retrieval events are logged as structured references (document IDs, source IDs).
- AI outputs that inform clinical decisions must be labeled as drafts and require human review.

---

## How This Document Is Used

- Drives scaffolding order and prioritization.
- Enforces consistent language and boundaries in service READMEs.
- Prevents scope loss when migrating legacy code.
- Serves as a reference for AI agents when generating new services.

If an agent is not listed here, it does not exist. Add it here first and record an ADR if it changes system scope.