# Stakeholder Planning Artifacts (Derived, Non-Interpretive)

## 0. Source, Scope, and Method

### Source (authoritative)
All artifacts in this file are **pure transformations** of:
- `docs/00-overview/stakeholders-and-user-stories.md`

### Non-interpretive rules (enforced)
- No new roles, stories, or flows are introduced.
- No role merging.
- Story text in the **Story Register** is copied verbatim from the governing document.
- Where a required field cannot be filled without interpretation, it is marked **“Ambiguous — Requires Governance Review”**.

### Source section notation
All “Source Sections” references use the governing document’s heading structure:
- `§4 Role Definitions > <Role Name>`
- `§5 User Stories > <Role group heading>`
- `§6 User Flows > <Flow heading>`
- `§10 Gaps`

---

## 1. Role Table (Single Source Index)

> One row per role; conservative values; ambiguity surfaced.

| Role Name | Category | Human / Non-Human | Primary Authority Level (Informational \| Draft \| Propose \| Execute \| Govern \| Audit) | Writes Allowed? (Yes/No/Conditional) | PHI Access? (None \| Read \| Draft \| Conditional) | Primary Governing Constraints | Source Sections |
|---|---|---|---|---|---|---|---|
| Patient | Patient & Representation | Human | Informational | No | Read | Informational/educational only; consent-gated; fail-closed | `§4 Role Definitions > Patient` |
| Legal Guardian / Authorized Representative / Personal Representative | Patient & Representation | Human | Informational | No | Conditional | Authorized access only; no implied access | `§4 Role Definitions > Legal Guardian / Authorized Representative / Personal Representative` |
| Licensed Clinician (Physician / NP / PA) | Clinical Care Delivery | Human | Draft | Conditional | Draft | Draft-only outputs; cannot sign/commit; consent-gated PHI access | `§4 Role Definitions > Licensed Clinician (Physician / NP / PA)` |
| Nursing / Allied Health Professional | Clinical Care Delivery | Human | Draft | Conditional | Conditional | No autonomous clinical actions; no signing/finalizing via AI | `§4 Role Definitions > Nursing / Allied Health Professional` |
| Medical Assistant / Clinical Support | Clinical Care Delivery / Practice Operations | Human | Draft | Conditional | Conditional | Draft/structured support only; strict authorization boundaries | `§4 Role Definitions > Medical Assistant / Clinical Support` |
| Medical Scribe (where applicable) | Clinical Care Delivery | Human | Draft | Conditional | Conditional | Draft-only; cannot sign/finalize; consent-gated | `§4 Role Definitions > Medical Scribe (where applicable)` |
| Clinical Staff (Reception / Care Coordinators / Schedulers / Registration) | Practice Operations | Human | Propose | No | Conditional | No direct side effects; scheduling proposals only until approved/executed via governed pathways | `§4 Role Definitions > Clinical Staff (Reception / Care Coordinators / Schedulers / Registration)` |
| Practice Leadership (Practice owner / administrator leadership function) | Practice Operations | Human | Govern | Ambiguous — Requires Governance Review | Conditional | Adoption/risk posture ownership (org); platform write permissions not specified | `§4 Role Definitions > Practice Leadership (Practice owner / administrator leadership function)` |
| Health Information Management (HIM) / Medical Records (e.g., RHIA function) | Practice Operations | Human | Audit | Ambiguous — Requires Governance Review | Conditional | Deterministic consent decisions; auditable logs; avoid PHI in telemetry | `§4 Role Definitions > Health Information Management (HIM) / Medical Records (e.g., RHIA function)` |
| Billing / Revenue Cycle Staff | Financial Ecosystem | Human | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Billing domain authoritative; AI never performs financial actions | `§4 Role Definitions > Billing / Revenue Cycle Staff` |
| Payer / Health Plan (Insurer) | Financial Ecosystem | Human (org actor) | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Payer workflows noted as gap (not specified for Zenthea) | `§4 Role Definitions > Payer / Health Plan (Insurer)`; `§10 Gaps` |
| Health Care Clearinghouse (Intermediary) | Financial Ecosystem | Human (org actor) | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Clearinghouse integrations noted as gap | `§4 Role Definitions > Health Care Clearinghouse (Intermediary)`; `§10 Gaps` |
| Laboratory Staff / Lab Organization | External Partners | Human (org actor) | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Lab ordering/ingestion interfaces noted as gap; patient portal may explain lab results | `§4 Role Definitions > Laboratory Staff / Lab Organization`; `§10 Gaps` |
| IT & Security Team (Provider org) | Platform Operations & Engineering | Human | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Zero trust; multiple identity types; auditability | `§4 Role Definitions > IT & Security Team (Provider org)` |
| EHR Builder / Configuration Specialist | Platform Operations & Engineering / Practice Operations | Human | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Configuration authority not specified in governing doc | `§4 Role Definitions > EHR Builder / Configuration Specialist` |
| Implementation / Change Management / Super User / Training Lead | Practice Operations | Human | Govern | Ambiguous — Requires Governance Review | Conditional | Training/workflow redesign responsibility; platform write permissions not specified | `§4 Role Definitions > Implementation / Change Management / Super User / Training Lead` |
| Public Health Authority (context role) | Interoperability & External Exchange | Human (org actor) | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Public health reporting workflows noted as gap | `§4 Role Definitions > Public Health Authority (context role)`; `§10 Gaps` |
| Health IT Developer / HIE / HIN (Interoperability actors) | Interoperability & External Exchange | Human (org actor) | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Interoperability surfaces/standards support not specified | `§4 Role Definitions > Health IT Developer / HIE / HIN (Interoperability actors)`; `§10 Gaps` |
| Platform Operator (Control Plane Operator) | Platform Operations & Engineering | Human | Audit | No | None | Read-only; metadata-only; forbidden identifiers/PHI | `§4 Role Definitions > Platform Operator (Control Plane Operator)` |
| Platform Administrator | Platform Operations & Engineering | Human | Govern | Conditional | Conditional | Identity/permissions management implied; exact runtime powers not specified | `§4 Role Definitions > Platform Administrator` |
| Service Owner (Agent/Service Maintainer) | Platform Operations & Engineering | Human | Govern | Ambiguous — Requires Governance Review | None | Own one domain; obey policy/tool constraints | `§4 Role Definitions > Service Owner (Agent/Service Maintainer)` |
| Platform Engineer / SRE | Platform Operations & Engineering | Human | Execute | Conditional | None | Mitigations/kill switches; preserve auditability/determinism/non-cacheability | `§4 Role Definitions > Platform Engineer / SRE` |
| Platform Architect | Platform Operations & Engineering | Human | Govern | Ambiguous — Requires Governance Review | None | Steward doctrine and slice contracts; enforce execution standards | `§4 Role Definitions > Platform Architect` |
| Platform Governance Authority | Governance, Safety, Security, Compliance | Human | Govern | Yes | None | Approve/seal governance artifacts; deny-by-default; fail-closed | `§4 Role Definitions > Platform Governance Authority` |
| Compliance Officer | Governance, Safety, Security, Compliance | Human | Audit | Ambiguous — Requires Governance Review | Conditional | Consent/auditability/data handling; review consent decision logs | `§4 Role Definitions > Compliance Officer` |
| Security Lead | Governance, Safety, Security, Compliance | Human | Govern | Ambiguous — Requires Governance Review | None | Incident response posture; security constraints | `§4 Role Definitions > Security Lead` |
| Clinical Safety Auditor | Governance, Safety, Security, Compliance | Human | Audit | No | None | Audit draft-only enforcement and consent gating | `§4 Role Definitions > Clinical Safety Auditor` |
| External Auditor (SOC 2 / HIPAA / Vendor Audit) | Governance, Safety, Security, Compliance | Human (external) | Audit | No | None | Evidence review | `§4 Role Definitions > External Auditor (SOC 2 / HIPAA / Vendor Audit)` |
| Regulator (HIPAA / GDPR) | Governance, Safety, Security, Compliance | Human (external) | Audit | No | None | External constraint; evidence requirement | `§4 Role Definitions > Regulator (HIPAA / GDPR)` |
| Sales Team Member | Business & Commercial | Human | Draft | Conditional | None | Cannot bypass authorization; humans accountable | `§4 Role Definitions > Sales Team Member` |
| Marketing Team Member | Business & Commercial | Human | Draft | Conditional | None | Cannot publish autonomously by default; approval gates | `§4 Role Definitions > Marketing Team Member` |
| Finance / Accounting Professional | Business & Commercial | Human | Draft | Conditional | None | AI may not post journal entries; human oversight required | `§4 Role Definitions > Finance / Accounting Professional` |
| Executive Stakeholder / Leadership | Business & Commercial | Human | Govern | Ambiguous — Requires Governance Review | None | Cannot override sealed doctrine without artifacts | `§4 Role Definitions > Executive Stakeholder / Leadership` |
| Investor / Demo Reviewer (Synthetic Data Only) | Business & Commercial | Human (external) | Informational | No | None | Must not receive PHI; synthetic/non-production data only | `§4 Role Definitions > Investor / Demo Reviewer (Synthetic Data Only)` |
| External Integration Owner (EHR / FHIR / Labs / Scheduling System) | External Systems & Vendors | Human (org actor) | Ambiguous — Requires Governance Review | Ambiguous — Requires Governance Review | Conditional | Governed integration boundary; no payload-like content in audits; no background job semantics | `§4 Role Definitions > External Integration Owner (EHR / FHIR / Labs / Scheduling System)` |
| AI Model Provider (Vendor) | External Systems & Vendors | Human (org actor) | Execute | Ambiguous — Requires Governance Review | Conditional | Vendor eligibility; PHI only if BAA + constraints satisfied | `§4 Role Definitions > AI Model Provider (Vendor)` |
| Payment Provider (for example Stripe) | External Systems & Vendors | Human (org actor) | Execute | Yes | None | Validated/idempotent webhook handling; billing authoritative | `§4 Role Definitions > Payment Provider (for example Stripe)` |
| Observability / Logging Vendor | External Systems & Vendors | Human (org actor) | Audit | No | None | Telemetry filtered to avoid PHI leakage; access audited | `§4 Role Definitions > Observability / Logging Vendor` |
| Service Account / Internal System Component (Non-human) | Platform Operations & Engineering | Non-Human | Execute | Yes | Conditional | Least privilege; deny-by-default; auditable actions | `§4 Role Definitions > Service Account / Internal System Component (Non-human)` |
| AI Execution Context (Non-human) | Platform Operations & Engineering | Non-Human | Ambiguous — Requires Governance Review | Conditional | Conditional | Tool usage permission-gated and audited; cannot gain capabilities beyond explicitly granted tools/policies | `§4 Role Definitions > AI Execution Context (Non-human)` |

---

## 2. User Story Matrix

### 2.1 Story Register (canonical text; IDs assigned)

ID scheme:
- `<ROLECODE>-NN` where `ROLECODE` is derived from the **role group heading** in `§5 User Stories`.
- Text is copied verbatim from `docs/00-overview/stakeholders-and-user-stories.md`.

#### Patient — Story Register (`§5 User Stories > Patient`)
- **PAT-01**: As a Patient, I want to ask questions about my own record in plain language so that I can understand my health information without medical jargon.
- **PAT-02**: As a Patient, I want the system to refuse requests to access other patients’ data so that my privacy boundary is not compromised.
- **PAT-03**: As a Patient, I want informational answers to be clearly labeled as not medical advice so that I do not mistake AI output for diagnosis or treatment.
- **PAT-04**: As a Patient, I want consent checks to happen before any AI processing of my PHI so that my data is only used when permitted.
- **PAT-05**: As a Patient, I want revoked consent to stop further processing immediately so that I can withdraw access without delay.
- **PAT-06**: As a Patient, I want the system to fail closed when consent cannot be verified so that missing verification never results in accidental exposure.
- **PAT-07**: As a Patient, I want explanations to be calm and non-alarmist so that I am not unnecessarily distressed.
- **PAT-08**: As a Patient, I want an auditable trail of access decisions (without exposing my PHI in logs) so that access can be accounted for if needed.

#### Personal Representative — Story Register (`§5 User Stories > Personal Representative`)
- **REP-01**: As a Legal Guardian / Authorized Representative, I want to access a patient’s information only when my authorization is validated so that lawful access is supported without expanding scope.
- **REP-02**: As a Legal Guardian / Authorized Representative, I want requests outside my authorization to be denied deterministically so that ambiguity does not create a privacy breach.
- **REP-03**: As a Legal Guardian / Authorized Representative, I want consent revocation by the patient to be honored immediately so that my delegated access cannot persist after withdrawal.

#### Licensed Clinician — Story Register (`§5 User Stories > Licensed Clinician`)
- **CLIN-01**: As a Licensed Clinician, I want clinical AI outputs to be clearly labeled as draft/advisory so that I remain the accountable authority.
- **CLIN-02**: As a Licensed Clinician, I want the system to refuse any attempt to sign, attest, finalize, or commit via AI so that the draft-only doctrine is preserved.
- **CLIN-03**: As a Licensed Clinician, I want consent gating to occur before any patient-scoped retrieval or AI drafting so that I only access data with verified permission.
- **CLIN-04**: As a Licensed Clinician, I want the system to fail closed when consent verification is unavailable so that I don’t accidentally draft using unauthorized data.
- **CLIN-05**: As a Licensed Clinician, I want AI to avoid hallucinated facts and speculative diagnoses so that drafts never introduce unsafe clinical content.
- **CLIN-06**: As a Licensed Clinician, I want to reject or correct AI drafts and have that decision captured (metadata-only) so that model behavior can be evaluated and improved safely.
- **CLIN-07**: As a Licensed Clinician, I want evidence sources to be cited when external clinical evidence is used so that recommendations are reviewable.
- **CLIN-08**: As a Licensed Clinician, I want the system to block any downstream action from occurring automatically based on advisory output so that human-in-the-loop is preserved.

#### Nursing / Allied Health — Story Register (`§5 User Stories > Nursing / Allied Health`)
- **NURS-01**: As Nursing/Allied Health staff, I want role and scope validation to gate access so that I cannot exceed my authorized clinical scope.
- **NURS-02**: As Nursing/Allied Health staff, I want drafts to remain non-final and clearly marked so that my contributions cannot be mistaken for a signed clinical record.
- **NURS-03**: As Nursing/Allied Health staff, I want unsafe prompts (e.g., requests to add unverified facts) to be refused so that clinical documentation remains accurate.
- **NURS-04**: As Nursing/Allied Health staff, I want all access and drafting to be auditable without PHI appearing in logs so that compliance requirements are satisfied.

#### Medical Scribe — Story Register (`§5 User Stories > Medical Scribe`)
- **SCRIBE-01**: As a Medical Scribe, I want AI-generated drafts to be editable and non-final so that I can prepare documentation for clinician review without creating a legal record.
- **SCRIBE-02**: As a Medical Scribe, I want the system to prevent any “sign/commit” semantics in my workflow so that I cannot inadvertently create a finalized record.
- **SCRIBE-03**: As a Medical Scribe, I want consent to be validated before I access patient-scoped drafting context so that I do not participate in unauthorized processing.

#### Clinical Staff — Story Register (`§5 User Stories > Clinical Staff (Reception / Care Coordinators / Schedulers / Registration)`)
- **OPS-01**: As Clinical Staff, I want to propose appointment changes without executing them so that scheduling remains controlled and auditable.
- **OPS-02**: As Clinical Staff, I want the system to clearly indicate when an appointment action is pending approval so that I do not promise outcomes prematurely.
- **OPS-03**: As Clinical Staff, I want identity and consent validation to occur before patient-related scheduling proposals so that I do not act on unauthorized requests.
- **OPS-04**: As Clinical Staff, I want failures (conflicts, authorization denial, system errors) to be explicit and traceable so that I can resolve scheduling issues without workarounds.
- **OPS-05**: As Clinical Staff, I want repeated policy denials or unknown tool attempts to escalate to the appropriate playbook so that unsafe behavior is mitigated quickly.

#### Practice Administrator / Tenant Administrator — Story Register (`§5 User Stories > Practice Administrator / Tenant Administrator`)
- **TENANT-01**: As a Practice Administrator, I want tenant context to be explicit for all operations so that cross-tenant access is prevented by design.
- **TENANT-02**: As a Practice Administrator, I want access governance to be role-based and auditable so that I can demonstrate appropriate controls under HIPAA’s shared responsibility model.
- **TENANT-03**: As a Practice Administrator, I want consent-related workflows to be explainable so that staff training and patient support can be consistent.
- **TENANT-04**: As a Practice Administrator, I want the system to block any attempt to rely on UI-only entitlements so that access control remains authoritative in services.

#### Billing / Revenue Cycle Staff — Story Register (`§5 User Stories > Billing / Revenue Cycle Staff`)
- **BILL-01**: As Billing staff, I want entitlements to be checked centrally so that plan assumptions in frontends don’t create inconsistent access.
- **BILL-02**: As Billing staff, I want billing failures to be explicit and observable so that charging and access problems can be addressed without guesswork.
- **BILL-03**: As Billing staff, I want payment events to be processed idempotently so that retries do not double-charge or create conflicting states.
- **BILL-04**: As Billing staff, I want AI to explain billing state but never execute refunds, credits, or payments so that financial actions remain controlled.

#### Platform Operator — Story Register (`§5 User Stories > Platform Operator`)
- **OP-01**: As a Platform Operator, I want to execute only registered operator query policies so that operator visibility is auditable and deny-by-default.
- **OP-02**: As a Platform Operator, I want unknown policy/view IDs to be rejected with stable reason codes so that ambiguity does not hide governance failures.
- **OP-03**: As a Platform Operator, I want operator audit events emitted on both success and rejection so that all operator actions are traceable.
- **OP-04**: As a Platform Operator, I want operator-visible outputs to exclude tenantId/actorId/requestId/cursors/payloads so that operator access remains metadata-only and PHI-safe.
- **OP-05**: As a Platform Operator, I want decision hooks to signal when human review is required so that high-risk outcomes are routed appropriately without performing mutations.
- **OP-06**: As a Platform Operator, I want escalation playbooks to map signals to bounded actions (kill switches) so that mitigation is reversible and non-autonomous.
- **OP-07**: As a Platform Operator, I want to identify unknown agent/tool activity quickly so that I can trigger emergency escalation when required.

#### Platform Administrator — Story Register (`§5 User Stories > Platform Administrator`)
- **PLATADM-01**: As a Platform Administrator, I want identities and permissions to be explicit per identity type (end user, service account, AI execution context) so that trust is never assumed.
- **PLATADM-02**: As a Platform Administrator, I want authorization failures to be logged and observable so that misuse can be detected without exposing sensitive data.
- **PLATADM-03**: As a Platform Administrator, I want secrets to be injected at runtime and never stored in code so that credential leakage is treated as an incident and prevented by design.

#### Service Owner — Story Register (`§5 User Stories > Service Owner`)
- **SVC-01**: As a Service Owner, I want my service to own exactly one domain so that responsibilities remain clear and composable.
- **SVC-02**: As a Service Owner, I want AI to be embedded using the shared runtime and remain observable and testable so that behavior can be governed.
- **SVC-03**: As a Service Owner, I want tool usage to be deny-by-default and explicitly scoped per agent so that permission drift is prevented.
- **SVC-04**: As a Service Owner, I want policy checks to exist before and after AI execution so that unsafe outputs or requests are blocked.
- **SVC-05**: As a Service Owner, I want cross-service communication to occur only via APIs/events so that no direct cross-service database access is possible.
- **SVC-06**: As a Service Owner, I want audits and telemetry to remain metadata-only where required so that observability does not become a leakage vector.

#### Platform Engineer / SRE — Story Register (`§5 User Stories > Platform Engineer / SRE`)
- **SRE-01**: As a Platform Engineer/SRE, I want governed execution/decision/mutation/audit paths to be non-cacheable by construction so that replay cannot occur silently.
- **SRE-02**: As a Platform Engineer/SRE, I want the platform to fail closed when audit emission cannot be acknowledged so that un-audited execution is impossible.
- **SRE-03**: As a Platform Engineer/SRE, I want kill switches to be reversible and not require redeploy so that mitigations can be applied quickly and safely.
- **SRE-04**: As a Platform Engineer/SRE, I want incident response capabilities that can disable AI capabilities selectively so that response can be targeted and auditable.

#### Platform Architect — Story Register (`§5 User Stories > Platform Architect`)
- **ARCH-01**: As a Platform Architect, I want slice execution to be governed by a mandatory checklist and evidence so that “completed” status is meaningful and auditable.
- **ARCH-02**: As a Platform Architect, I want application surfaces to have governance closure so that doctrine cannot be bypassed by legacy routes or caching configuration drift.
- **ARCH-03**: As a Platform Architect, I want services to remain frontend-agnostic so that frontends can be swapped without rewriting core logic.
- **ARCH-04**: As a Platform Architect, I want policy contracts to have a canonical owner so that semantic drift does not break determinism or auditability.

#### Platform Governance Authority — Story Register (`§5 User Stories > Platform Governance Authority`)
- **GOV-01**: As Platform Governance, I want high-risk orchestration work to be blocked until evidence artifacts exist so that “automation” never expands capability implicitly.
- **GOV-02**: As Platform Governance, I want fail-closed semantics to be explicit and bounded for every surface so that there is no autonomous recovery or hidden retry.
- **GOV-03**: As Platform Governance, I want 100% surface inventories and proof mappings (no sampling) so that bypass paths cannot hide in unenumerated entrypoints.
- **GOV-04**: As Platform Governance, I want a formal unblock record to be the only mechanism to authorize implementation so that governance decisions are explicit and revocable.

#### Compliance Officer — Story Register (`§5 User Stories > Compliance Officer`)
- **COMP-01**: As a Compliance Officer, I want consent decisions to be traceable, explainable, and auditable so that I can support HIPAA authorization and GDPR lawful basis obligations.
- **COMP-02**: As a Compliance Officer, I want vendors that process PHI to be eligible only with a BAA so that unapproved vendors never receive PHI.
- **COMP-03**: As a Compliance Officer, I want PHI access and AI executions involving PHI to be logged as metadata-only events so that audits are possible without PHI in telemetry.
- **COMP-04**: As a Compliance Officer, I want “HIPAA mode” to be restrictive by design so that experimental features and unvetted integrations are blocked.

#### Security Lead — Story Register (`§5 User Stories > Security Lead`)
- **SEC-01**: As a Security Lead, I want every request to be authenticated and authorized at boundaries so that no component is trusted by default.
- **SEC-02**: As a Security Lead, I want tool usage to be permission-based and audited so that tool abuse is detectable and bounded.
- **SEC-03**: As a Security Lead, I want emergency escalation triggers (e.g., UNKNOWN_AGENT) to map to immediate write disablement so that unsafe behavior is stopped quickly.
- **SEC-04**: As a Security Lead, I want incidents to support revocation and credential rotation so that compromise can be contained.

#### Clinical Safety Auditor — Story Register (`§5 User Stories > Clinical Safety Auditor`)
- **SAFETY-01**: As a Clinical Safety Auditor, I want draft-only enforcement to be provable (including refusals to sign/attest) so that clinical AI cannot create legally binding records.
- **SAFETY-02**: As a Clinical Safety Auditor, I want consent gating to be a hard gate for any PHI-involving drafting so that unsafe drafting cannot proceed under uncertainty.
- **SAFETY-03**: As a Clinical Safety Auditor, I want stop conditions for scope creep (“commit/sign/attest”) to trigger immediate work cessation so that unsafe capability does not leak into early slices.

#### External Auditor — Story Register (`§5 User Stories > External Auditor`)
- **EXTAUD-01**: As an External Auditor, I want deterministic evidence artifacts and audit logs that can be exported so that I can assess controls without relying on unverifiable assumptions.
- **EXTAUD-02**: As an External Auditor, I want proof that sensitive paths are non-cacheable and non-bypassable so that data replay risk is controlled.
- **EXTAUD-03**: As an External Auditor, I want stable taxonomies for rejections/errors so that audits do not depend on ad-hoc strings.

#### Regulator — Story Register (`§5 User Stories > Regulator`)
- **REG-01**: As a Regulator, I want systems handling PHI to demonstrate auditability and minimum-necessary access so that compliance is provable.
- **REG-02**: As a Regulator, I want shared-responsibility boundaries to be explicit so that responsibilities are not implied or hidden.

#### Business & Commercial — Story Register (`§5 User Stories > Business & Commercial`)
- **BIZ-01**: As a Sales team member, I want AI to provide explainable lead scoring so that I can trust recommendations without treating them as authority.
- **BIZ-02**: As a Sales team member, I want policy-governed automation to require appropriate authorization so that outreach actions don’t bypass controls.
- **BIZ-03**: As a Sales team member, I want tool usage to be auditable so that automated actions are traceable to the service and context that produced them.
- **BIZ-04**: As a Marketing team member, I want AI to generate content drafts and variants so that I can accelerate creation while retaining review authority.
- **BIZ-05**: As a Marketing team member, I want the system to flag claims requiring legal review so that publishing does not create compliance risk.
- **BIZ-06**: As a Marketing team member, I want publishing to remain approval-gated so that automation does not bypass brand/legal constraints.
- **BIZ-07**: As a Finance/Accounting professional, I want AI to suggest classifications with explanations so that I can review and correct without losing auditability.
- **BIZ-08**: As a Finance/Accounting professional, I want immutable audit trails for material actions so that financial reviews are defensible.
- **BIZ-09**: As a Finance/Accounting professional, I want AI to never execute payments or post journal entries automatically so that irreversible actions remain controlled.
- **BIZ-10**: As Leadership, I want platform work to prioritize security/compliance and governance before capability so that trust is non-negotiable.
- **BIZ-11**: As Leadership, I want roadmap claims to be anchored in sealed evidence so that progress reporting is credible.
- **BIZ-12**: As an Investor/Demo reviewer, I want demonstrations to use synthetic/non-PHI data so that early validation does not create compliance exposure.
- **BIZ-13**: As an Investor/Demo reviewer, I want the platform’s governance constraints to be explicit so that expectations don’t drive unsafe shortcuts.

#### External Systems & Vendors — Story Register (`§5 User Stories > External Systems & Vendors`)
- **VEND-01**: As an External Integration Owner, I want integrations to be vendor-neutral and contract-defined so that replacing vendors does not require systemic redesign.
- **VEND-02**: As an External Integration Owner, I want writes to require idempotency keys so that retries do not create duplicate side effects.
- **VEND-03**: As an External Integration Owner, I want failure taxonomy to be bounded and metadata-only so that error handling is deterministic and auditable.
- **VEND-04**: As an AI Model Provider, I want clear constraints on data retention and training so that PHI handling is compliant and auditable.
- **VEND-05**: As an AI Model Provider, I want model versions to be explicit so that changes can be managed and traced.
- **VEND-06**: As a Payment Provider, I want webhook handling to be validated and processed idempotently so that payment events do not create inconsistent billing state.
- **VEND-07**: As an Observability vendor, I want telemetry to be classified and filtered so that I never receive PHI in logs by default.
- **VEND-08**: As an Observability vendor, I want retention and access controls to be explicit so that audit and incident response are supported without uncontrolled exposure.

#### Non-human identities — Story Register (`§5 User Stories > Non-human identities`)
- **NH-01**: As a Service Account, I want explicit permissions and scopes so that my actions are least-privilege and auditable.
- **NH-02**: As a Service Account, I want authentication context to be propagated explicitly so that downstream services can enforce access properly.
- **NH-03**: As an AI Execution Context, I want tool access to be permission-based and deny-by-default so that AI cannot expand capabilities implicitly.
- **NH-04**: As an AI Execution Context, I want tool invocations to be audited so that privileged actions are traceable and governable.

### 2.2 Matrix (Roles → behavior dimensions; each story appears exactly once)

Assignment rules (mechanical):
- Each story ID is placed in the **single** column whose name best matches the story’s main action verb.
- If a story describes a prohibition (e.g., “never execute”), it is placed in the relevant action column (e.g., **Executions**) and treated as **Explicitly forbidden** for that behavior.

| Role | Information Access | Draft Creation | Proposals | Executions | Approvals | External Exchange | Exception / Failure Handling | Audit / Oversight |
|---|---|---|---|---|---|---|---|---|
| Patient | PAT-01, PAT-03, PAT-07 | Not applicable | Not applicable | Not applicable | PAT-04 | Not applicable | PAT-02, PAT-05, PAT-06 | PAT-08 |
| Legal Guardian / Authorized Representative / Personal Representative | REP-01 | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | REP-02, REP-03 | Not applicable |
| Licensed Clinician (Physician / NP / PA) | CLIN-01, CLIN-07 | CLIN-05 | Not applicable | CLIN-02, CLIN-08 | CLIN-03 | Not applicable | CLIN-04 | CLIN-06 |
| Nursing / Allied Health Professional | Not applicable | NURS-02, NURS-03 | Not applicable | Not applicable | NURS-01 | Not applicable | Not applicable | NURS-04 |
| Medical Assistant / Clinical Support | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Medical Scribe (where applicable) | Not applicable | SCRIBE-01 | Not applicable | SCRIBE-02 | SCRIBE-03 | Not applicable | Not applicable | Not applicable |
| Clinical Staff (Reception / Care Coordinators / Schedulers / Registration) | OPS-02 | Not applicable | OPS-01 | Not applicable | OPS-03 | Not applicable | OPS-04, OPS-05 | Not applicable |
| Practice Administrator / Tenant Administrator | Not applicable | Not applicable | Not applicable | TENANT-04 | TENANT-01 | Not applicable | Not applicable | TENANT-02, TENANT-03 |
| Practice Leadership (Practice owner / administrator leadership function) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Health Information Management (HIM) / Medical Records (e.g., RHIA function) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Billing / Revenue Cycle Staff | Not applicable | Not applicable | Not applicable | BILL-04 | BILL-01 | Not applicable | BILL-02, BILL-03 | Not applicable |
| Payer / Health Plan (Insurer) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Health Care Clearinghouse (Intermediary) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Laboratory Staff / Lab Organization | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| IT & Security Team (Provider org) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| EHR Builder / Configuration Specialist | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Implementation / Change Management / Super User / Training Lead | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Public Health Authority (context role) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Health IT Developer / HIE / HIN (Interoperability actors) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| Platform Operator (Control Plane Operator) | Not applicable | Not applicable | Not applicable | Not applicable | OP-01 | Not applicable | OP-02 | OP-03, OP-04, OP-05, OP-06, OP-07 |
| Platform Administrator | Not applicable | Not applicable | Not applicable | Not applicable | PLATADM-01 | Not applicable | PLATADM-02 | PLATADM-03 |
| Service Owner (Agent/Service Maintainer) | Not applicable | SVC-02 | Not applicable | Not applicable | SVC-03, SVC-04 | SVC-05 | Not applicable | SVC-01, SVC-06 |
| Platform Engineer / SRE | Not applicable | Not applicable | Not applicable | SRE-03 | Not applicable | Not applicable | SRE-02 | SRE-01, SRE-04 |
| Platform Architect | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | ARCH-01, ARCH-02, ARCH-03, ARCH-04 |
| Platform Governance Authority | Not applicable | Not applicable | Not applicable | Not applicable | GOV-04 | Not applicable | GOV-02 | GOV-01, GOV-03 |
| Compliance Officer | Not applicable | Not applicable | Not applicable | Not applicable | COMP-02, COMP-04 | Not applicable | Not applicable | COMP-01, COMP-03 |
| Security Lead | Not applicable | Not applicable | Not applicable | SEC-03 | SEC-01, SEC-02 | Not applicable | SEC-04 | Not applicable |
| Clinical Safety Auditor | Not applicable | Not applicable | Not applicable | Not applicable | SAFETY-02 | Not applicable | SAFETY-03 | SAFETY-01 |
| External Auditor (SOC 2 / HIPAA / Vendor Audit) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | EXTAUD-01 | Not applicable | EXTAUD-02, EXTAUD-03 |
| Regulator (HIPAA / GDPR) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | REG-02 | REG-01 |
| Sales Team Member | BIZ-01 | Not applicable | Not applicable | Not applicable | BIZ-02 | Not applicable | Not applicable | BIZ-03 |
| Marketing Team Member | Not applicable | BIZ-04 | Not applicable | BIZ-06 | BIZ-05 | Not applicable | Not applicable | Not applicable |
| Finance / Accounting Professional | Not applicable | BIZ-07 | Not applicable | BIZ-09 | Not applicable | Not applicable | Not applicable | BIZ-08 |
| Executive Stakeholder / Leadership | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | BIZ-10, BIZ-11 |
| Investor / Demo Reviewer (Synthetic Data Only) | BIZ-12, BIZ-13 | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable |
| External Integration Owner (EHR / FHIR / Labs / Scheduling System) | Not applicable | Not applicable | Not applicable | VEND-02 | Not applicable | VEND-01 | VEND-03 | Not applicable |
| AI Model Provider (Vendor) | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | VEND-04, VEND-05 |
| Payment Provider (for example Stripe) | Not applicable | Not applicable | Not applicable | VEND-06 | Not applicable | Not applicable | Not applicable | Not applicable |
| Observability / Logging Vendor | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | VEND-07, VEND-08 |
| Service Account / Internal System Component (Non-human) | Not applicable | Not applicable | Not applicable | NH-01 | Not applicable | Not applicable | Not applicable | NH-02 |
| AI Execution Context (Non-human) | Not applicable | Not applicable | NH-03 | Not applicable | Not applicable | Not applicable | Not applicable | NH-04 |

---

## 3. User Flow Inventory (Diagram-Ready)

> Inventory of flows in `§6 User Flows`. No diagrams; no UI assumptions.

### FLOW-6.1 — Draft clinical documentation (Licensed clinician)
- **Participating roles**: Licensed Clinician; Clinical Documentation Agent (implied by step 3); Consent Agent (implied by step 2)
- **Trigger**: “Clinician initiates documentation support for a specific patient encounter.”
- **Preconditions**: “Identity/role verification + patient scoping + consent validation (fail closed if unavailable).”
- **Steps**:
  1. Clinician initiates documentation support for a specific patient encounter.
  2. Identity/role verification + patient scoping + consent validation (fail closed if unavailable).
  3. Clinical Documentation Agent produces a **draft** note; no new facts; clearly labeled draft.
  4. Clinician reviews/edits/rejects; corrections captured.
  5. Audit captures metadata (no PHI in logs).
- **Side effects**: Draft creation (draft note); audit metadata emission.
- **Failure / refusal modes**: “Fail closed if [consent validation] unavailable.”
- **Governance gates**: Consent validation; fail-closed semantics; “no PHI in logs.”
- **Downstream dependencies**: Not specified in governing document.
- **Source**: `§6 User Flows > 6.1 Draft clinical documentation (Licensed clinician)`

### FLOW-6.2 — Appointment request → proposal → approval → execution (Scheduling)
- **Participating roles**: Patient; Clinical Staff (as “staff”); Appointment Booking Agent; Approver (“human/system policy”) (Ambiguous — Requires Governance Review)
- **Trigger**: “Patient or staff requests schedule/reschedule/cancel.”
- **Preconditions**: “Identity verification + consent validation + policy checks.”
- **Steps**:
  1. Patient or staff requests schedule/reschedule/cancel.
  2. Identity verification + consent validation + policy checks.
  3. Appointment Booking Agent emits a **proposal** (not execution).
  4. Approval step (human/system policy).
  5. Execution via governed gateway (agent never executes directly).
- **Side effects**: Execution of a scheduling action (via governed gateway) (exact side effect semantics not specified in governing document).
- **Failure / refusal modes**: Not specified in governing document.
- **Governance gates**: Consent validation; policy checks; explicit approval step; “agent never executes directly.”
- **Downstream dependencies**: “Execution via governed gateway” (gateway not defined in governing document).
- **Source**: `§6 User Flows > 6.2 Appointment request → proposal → approval → execution (Scheduling)`

### FLOW-6.3 — Patient question about their record (Patient portal)
- **Participating roles**: Patient; Consent Agent (implied by step 2); Patient Portal Agent
- **Trigger**: “Patient authenticates; identity- and tenant-scoped.”
- **Preconditions**: “Consent validated; fail closed if unavailable.”
- **Steps**:
  1. Patient authenticates; identity- and tenant-scoped.
  2. Consent validated; fail closed if unavailable.
  3. Patient Portal Agent retrieves minimum necessary data and summarizes without hallucination.
  4. Response is informational, calm, non-alarmist; not medical advice.
  5. Audit metadata emitted without PHI.
- **Side effects**: Audit metadata emission.
- **Failure / refusal modes**: “Fail closed if unavailable [consent].”
- **Governance gates**: Consent validation; fail-closed semantics; “without hallucination”; “not medical advice”; “without PHI.”
- **Downstream dependencies**: Not specified in governing document.
- **Source**: `§6 User Flows > 6.3 Patient question about their record (Patient portal)`

### FLOW-6.4 — Vendor eligibility enforcement for PHI-bearing workflows (IT/Security)
- **Participating roles**: IT/Security (as “IT/Security”); Vendor allowlist/eligibility registry (implied)
- **Trigger**: Not specified in governing document (flow starts at “Determine PHI involvement and compliance mode.”)
- **Preconditions**: PHI involvement determination; compliance mode determination.
- **Steps**:
  1. Determine PHI involvement and compliance mode.
  2. Enforce vendor allowlist/eligibility (BAA gating where required).
  3. Deny + audit when vendor is not eligible; proceed with minimized exposure when eligible.
- **Side effects**: Deny decisions; audit emission; vendor eligibility enforcement.
- **Failure / refusal modes**: Deny when vendor is not eligible.
- **Governance gates**: Vendor allowlist/eligibility; BAA gating.
- **Downstream dependencies**: Not specified in governing document.
- **Source**: `§6 User Flows > 6.4 Vendor eligibility enforcement for PHI-bearing workflows (IT/Security)`

### FLOW-6.5 — Interoperability actor request (contextual ecosystem flow)
- **Participating roles**: Requestor (“requestor seeks access/exchange/use of EHI”); Provider (“provider evaluates legitimacy…”) (Ambiguous mapping to specific roles — Requires Governance Review)
- **Trigger**: “Requestor seeks access/exchange/use of EHI.”
- **Preconditions**: Not specified in governing document.
- **Steps**:
  1. Requestor seeks access/exchange/use of EHI.
  2. Provider evaluates legitimacy and applies privacy/security feasibility constraints and exceptions as applicable.
- **Side effects**: Not specified in governing document.
- **Failure / refusal modes**: Not specified in governing document.
- **Governance gates**: “privacy/security feasibility constraints and exceptions as applicable.”
- **Downstream dependencies**: “Zenthea’s specific interoperability surfaces are not yet specified.”
- **Source**: `§6 User Flows > 6.5 Interoperability actor request (contextual ecosystem flow)`

---

## 4. Coverage & Gap Analysis

### 4.1 Roles with no execution-capable flows (as specified in `§6 User Flows`)

> This list is derived mechanically: roles that appear in the Role Table but do **not** participate in any flow that includes an explicit “Execution …” step.

- Patient
- Legal Guardian / Authorized Representative / Personal Representative
- Licensed Clinician (Physician / NP / PA)
- Nursing / Allied Health Professional
- Medical Assistant / Clinical Support
- Medical Scribe (where applicable)
- Practice Leadership (Practice owner / administrator leadership function)
- Health Information Management (HIM) / Medical Records (e.g., RHIA function)
- Billing / Revenue Cycle Staff
- Payer / Health Plan (Insurer)
- Health Care Clearinghouse (Intermediary)
- Laboratory Staff / Lab Organization
- EHR Builder / Configuration Specialist
- Implementation / Change Management / Super User / Training Lead
- Public Health Authority (context role)
- Health IT Developer / HIE / HIN (Interoperability actors)
- Platform Operator (Control Plane Operator)
- Platform Administrator
- Service Owner (Agent/Service Maintainer)
- Platform Engineer / SRE
- Platform Architect
- Platform Governance Authority
- Compliance Officer
- Security Lead
- Clinical Safety Auditor
- External Auditor (SOC 2 / HIPAA / Vendor Audit)
- Regulator (HIPAA / GDPR)
- Sales Team Member
- Marketing Team Member
- Finance / Accounting Professional
- Executive Stakeholder / Leadership
- Investor / Demo Reviewer (Synthetic Data Only)
- External Integration Owner (EHR / FHIR / Labs / Scheduling System)
- AI Model Provider (Vendor)
- Payment Provider (for example Stripe)
- Observability / Logging Vendor
- Service Account / Internal System Component (Non-human)
- AI Execution Context (Non-human)

**Note**: `§6.2` contains “Execution via governed gateway” but does not define which named role is the approver/executor; that is treated as an explicit ambiguity.

### 4.2 Stories or flows that depend on undocumented platform capabilities

Derived only from explicit “gaps” language and flow notes in the governing document:

- **FLOW-6.2 depends on “Execution via governed gateway”** (gateway not defined in governing document).  
  Source: `§6 User Flows > 6.2`; classification: **Enabling dependency** (Ambiguous — Requires Governance Review).

- **Payer workflows (prior authorization, claims exchange)** are not specified in internal docs.  
  Source: `§10 Gaps`; classification: **Enabling dependency**.

- **Clearinghouse integrations** are not specified.  
  Source: `§10 Gaps`; classification: **Enabling dependency**.

- **Lab ordering/result ingestion interfaces** are not specified.  
  Source: `§10 Gaps`; classification: **Enabling dependency**.

- **HIE/HIN exchange and information blocking workflows** (specific interoperability surfaces/standards support) are not specified.  
  Source: `§10 Gaps`; classification: **Enabling dependency**.

- **Public health reporting workflows** are referenced as a gap.  
  Source: `§4 Role Definitions > Public Health Authority (context role)`; classification: **Enabling dependency**.

### 4.3 Explicitly deferred
- **Clinical “sign/commit” write paths are explicitly blocked by design until MIG-04B is approved.**  
  Source: `docs/00-overview/stakeholders-and-user-stories.md` `§8 Roadmap Extraction Guidance > Foundational vs enabling vs deferred`.

---

## 5. Roadmap Readiness Notes (Non-Prescriptive)

- These artifacts make roadmap derivation mechanical by providing:
  - A **single role index** with conservative authority classifications and explicit ambiguity markers.
  - A **story register** with stable IDs and verbatim text for traceability.
  - A **story matrix** where each story appears exactly once across behavior dimensions.
  - A **flow inventory** that is diagram-ready without re-reading narrative.
  - A **gap list** derived solely from explicit “gap” and “not specified” statements in the governing document.

- What is sufficient to begin roadmap extraction:
  - Roles, stories, and flows that are fully specified in `§5` and `§6` can be clustered by the governance boundaries already enumerated in `§8`.

- What remains intentionally blocked by governance:
  - Clinical “sign/commit” write paths (explicitly deferred per `§8`).
  - Any workflow described as a gap in `§10` remains non-derivable without additional governing documentation.

---

## 6. Required Execution Report

### Files read
- `docs/00-overview/stakeholders-and-user-stories.md`

### Files written
- `docs/00-overview/stakeholder-planning-artifacts.md`

### Counts (from source document)
- **Roles**: 40 (from `§4 Role Definitions`)
- **User stories**: 108 (from `§5 User Stories`)
- **Flows**: 5 (from `§6 User Flows`)

### Ambiguities / conflicts detected (no guessing performed)
- **Role authority fields**: multiple roles require “Ambiguous — Requires Governance Review” for authority/write/PHI classification because the governing doc does not state runtime powers explicitly (see Role Table).
- **FLOW-6.2 approver identity**: “Approval step (human/system policy)” does not name a role; cannot be mapped without interpretation.
- **FLOW-6.2 governed gateway**: “Execution via governed gateway” is referenced but not defined in the governing doc.

