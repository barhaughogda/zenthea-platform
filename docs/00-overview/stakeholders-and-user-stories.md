# Stakeholders, User Stories, and User Flows (Governing Document)

> This document **replaces and subsumes**:
> - `docs/00-overview/stakeholders-and-user-stories.md` (repo-grounded governance stakeholder map)
> - `docs/00-overview/stakeholders-research-and-user-flows.md` (externally grounded EHR ecosystem stakeholders + flows)
>
> Goal: **one governing document**, with **no loss** and **no duplication**.

## 1. Purpose & Scope

### Purpose
This document provides:

- A **complete stakeholder map** covering:
  - **Zenthea’s EHR ecosystem stakeholders** (clinical, operational, financial/payer, interoperability, regulatory).
  - **Zenthea platform stakeholders** (governance, safety, security, operators, service owners, vendors).
- **Behavioral user stories** per role that can be translated into roadmap slices.
- **Sequence-style user flows** for key role interactions, without UI assumptions.

### How this should be used (roadmap derivation)
Use this artifact to:

- Derive **capabilities** by clustering stories that share a single outcome and governance boundary.
- Define **slices** that deliver a capability **without widening platform contracts** (especially for regulated/PHI-adjacent flows).
- Add **governance gates** (policy closure, audit non-omittability, non-cacheability) as explicit dependencies where required by doctrine.

### Explicit non-goals
- No UI design, UI assumptions, or UX wireframes.
- No APIs, data models, schemas, or implementation details.
- No product features beyond what is implied by existing Zenthea documentation or externally evidenced ecosystem obligations.
- No future roadmap commitments beyond what is explicitly stated in `docs/ROADMAP.md` and sealed governance artifacts.

### Internal grounding (Zenthea docs used as constraints)
This document is grounded in (non-exhaustive):

- `docs/00-overview/vision.md` (AI-first EHR; admin burden reduction; trust/compliance posture)
- `docs/00-overview/principles.md` (services-first; determinism; documentation-as-authoritative; security/compliance constraints)
- `docs/ROADMAP.md` and `docs/01-architecture/execution-standards.md` (slice model and governance-first sequencing)
- `docs/04-security-compliance/*` (HIPAA strategy, security model, vendor selection)
- `docs/05-services/*` (service “primary users” and explicit constraints, especially draft-only/proposal-only/consent gating)

### External research grounding (ecosystem sources)
To avoid inventing roles, “natural EHR ecosystem” stakeholders are anchored in:

- EHR implementation team roles spanning clinical, operational, IT, billing, and labs:  
  `https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`
- Leadership team resource including explicit **practice roles** such as **Health Information Management / Medical Records (RHIA)**:  
  `https://www.healthit.gov/resource/creating-leadership-team-successful-ehr-implementation`
- HIPAA Privacy Rule summary for covered entity categories (providers, health plans, clearinghouses), business associates, and individual rights (access/accounting/minimum necessary):  
  `https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`
- Information blocking regulation defining “actors” (providers, health IT developers of certified health IT, HIEs, HINs):  
  `https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171`
- ONC/ASTP ISP “FHIR Ecosystem” describing payers/providers/patients/public health and administrative burden reduction (e.g., prior authorization):  
  `https://www.healthit.gov/isp/fhir-ecosystem`

---

## 2. Stakeholder Taxonomy (Single taxonomy for the whole system)

### Taxonomy categories
- **Patient & Representation**
  - Individuals receiving care and their lawful/personal representatives.
- **Clinical Care Delivery**
  - Licensed clinicians and clinical staff operating within scope of practice.
- **Practice Operations**
  - Non-clinical roles coordinating access, scheduling, records operations, and day-to-day practice throughput.
- **Financial Ecosystem (Revenue, Payer, Intermediaries)**
  - Billing/revenue cycle, health plans/payers, clearinghouses and administrative intermediaries.
- **Platform Operations & Engineering**
  - People and non-human identities responsible for operating and evolving the platform safely.
- **Governance, Safety, Security, Compliance**
  - Roles that define, approve, audit, and enforce constraints (deny-by-default, fail-closed, draft-only, consent gating).
- **Interoperability & External Exchange**
  - Health IT developers, HIE/HIN actors, public health authorities, and exchange partners.
- **Business & Commercial**
  - Go-to-market and monetisation stakeholders implied by service portfolio and billing domain docs.
- **External Systems & Vendors**
  - Third parties that can receive data or participate in workflows (model providers, observability vendors, payment providers, etc).

### Rationale (Zenthea doctrine)
- Services are the unit of value; frontends are thin consumers (`docs/00-overview/vision.md`, `docs/00-overview/principles.md`).
- Regulated-mode operation requires explicit identity, authorization, auditability, vendor eligibility (`docs/04-security-compliance/*`).
- Clinical AI is draft-only; scheduling is proposal-only; consent is deterministic-first (`docs/05-services/*`).

---

## 3. Stakeholder List (Natural EHR ecosystem + Zenthea platform governance)

### EHR ecosystem roles (externally grounded)
- **Physicians / Licensed clinicians**, **Nursing**, **Medical assistants**, **Schedulers**, **Registration staff**, **Laboratory staff**, **IT lead**, **Billing staff**, **EHR builder**, **Workflow redesign lead**, **Super-user/training lead**  
  Source: `https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`
- **Practice leadership team** and **HIM/Medical Records (RHIA)**  
  Source: `https://www.healthit.gov/resource/creating-leadership-team-successful-ehr-implementation`
- **Health plans (payers)**, **health care clearinghouses**, **providers**, **business associates**  
  Source: `https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`
- **Information blocking “actors”**: providers, health IT developers of certified health IT, HIEs, HINs  
  Source: `https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171`
- **Public health** exchange/reporting stakeholders (ecosystem context)  
  Sources: `https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`, `https://www.healthit.gov/isp/fhir-ecosystem`

### Zenthea platform roles (repo-grounded)
Includes (non-exhaustive): Patient portal users, clinicians, compliance officers, platform operators/admins, service owners, governance authority, security lead, clinical safety auditors, external auditors, vendors, and non-human identities, as defined in `docs/00-overview/vision.md`, `docs/00-overview/principles.md`, `docs/04-security-compliance/*`, `docs/05-services/*`, and migration/control plane governance artifacts.

---

## 4. Role Definitions (Single source of truth per role)

> **Format (best practice)**: one definition per role; avoids duplication by consolidating responsibilities, boundaries, needs/pain points, and Zenthea interaction model.

### Patient
- **Category**: Patient & Representation
- **Primary responsibilities**: Engage with their own health information; provide/revoke consent where required (`docs/05-services/consent-agent.md`).
- **Authority boundaries**: Limited to their own data and consent choices; no cross-patient access (`docs/05-services/patient-portal-agent.md`).
- **Needs & pain points**: Plain language, non-alarmist explanations; trustworthy boundaries (`docs/05-services/patient-portal-agent.md`).
- **Zenthea interaction**: Patient Portal Agent is informational/educational only; consent-gated; fail-closed (`docs/05-services/patient-portal-agent.md`, `docs/05-services/consent-agent.md`).

### Legal Guardian / Authorized Representative / Personal Representative
- **Category**: Patient & Representation
- **Primary responsibilities**: Act on behalf of patient when legally authorized (`docs/05-services/patient-portal-agent.md`).
- **Authority boundaries**: Only within validated authorization and consent constraints; no implied access.
- **External grounding**: HIPAA personal representatives concept (`https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`).

### Licensed Clinician (Physician / NP / PA)
- **Category**: Clinical Care Delivery
- **Primary responsibilities**: Initiate/review draft-only clinical AI assistance; retain professional accountability (`docs/05-services/clinical-documentation-agent.md`, `docs/05-services/medical-advisor-agent.md`).
- **Authority boundaries**: Cannot sign/commit clinical records via AI; MIG-04B is explicitly blocked by design (`docs/12-migration/mig-04B-clinical-documentation-commit.md`, `docs/ROADMAP.md`).
- **Needs & pain points**: Reduce documentation burden; avoid hallucinated facts; preserve authority (`docs/00-overview/vision.md`, `docs/05-services/clinical-documentation-agent.md`).
- **Zenthea interaction**: Draft-only outputs; consent-gated PHI access; auditable decisions; no autonomous downstream actions.

### Nursing / Allied Health Professional
- **Category**: Clinical Care Delivery
- **Primary responsibilities**: Participate in clinical workflows within scope; contribute to draft documentation (`docs/05-services/clinical-documentation-agent.md`).
- **Authority boundaries**: No autonomous clinical actions; no signing/finalizing via AI.

### Medical Assistant / Clinical Support
- **Category**: Clinical Care Delivery / Practice Operations (boundary role)
- **Primary responsibilities**: Intake tasks and documentation support; workflow throughput.
- **Zenthea interaction**: Draft, structured support only; strict authorization boundaries (`docs/04-security-compliance/security-model.md`).

### Medical Scribe (where applicable)
- **Category**: Clinical Care Delivery
- **Primary responsibilities**: Assist with documentation preparation; produce drafts for clinician review (`docs/05-services/clinical-documentation-agent.md`).
- **Authority boundaries**: Cannot sign/finalize; consent-gated; draft-only.

### Clinical Staff (Reception / Care Coordinators / Schedulers / Registration)
- **Category**: Practice Operations
- **Primary responsibilities**: Coordinate scheduling and patient-facing operational interactions.
- **Authority boundaries**: No direct side effects; scheduling actions are proposals until approved/executed via governed pathways (`docs/05-services/appointment-booking-agent.md`).
- **External grounding**: Scheduler lead/registration lead exist as EHR implementation stakeholders (`https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`).

### Practice Leadership (Practice owner / administrator leadership function)
- **Category**: Practice Operations
- **Primary responsibilities**: Own adoption outcomes, training, operational policies, and risk posture.
- **External grounding**: Leadership team selection is a critical step in successful EHR implementation (`https://www.healthit.gov/resource/creating-leadership-team-successful-ehr-implementation`).

### Health Information Management (HIM) / Medical Records (e.g., RHIA function)
- **Category**: Practice Operations
- **Primary responsibilities**: Medical records operations; release-of-information coordination; record corrections processes.
- **External grounding**: HIM/Medical Records role appears in HealthIT.gov leadership resource (`https://www.healthit.gov/resource/creating-leadership-team-successful-ehr-implementation`) and aligns with HIPAA access/accounting expectations (`https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`).
- **Zenthea interaction**: Use deterministic consent decisions and auditable logs; avoid PHI in telemetry (`docs/05-services/consent-agent.md`, `docs/04-security-compliance/hipaa-strategy.md`).

### Billing / Revenue Cycle Staff
- **Category**: Financial Ecosystem (Revenue, Payer, Intermediaries)
- **Primary responsibilities**: Interact with billing state and payment providers; process billing workflows.
- **Authority boundaries**: Billing is authoritative over money; AI never performs financial actions (`docs/05-services/billing-and-monetisation.md`).
- **External grounding**: Billing staff lead as implementation stakeholder (`https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`).

### Payer / Health Plan (Insurer)
- **Category**: Financial Ecosystem (Revenue, Payer, Intermediaries)
- **Primary responsibilities**: Coverage, adjudication, payment, administrative policy.
- **External grounding**: HIPAA “health plans” are covered entities (`https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`); FHIR ecosystem highlights payer-provider burden reduction (`https://www.healthit.gov/isp/fhir-ecosystem`).
- **Zenthea gaps**: payer-facing prior auth/claims exchange flows not yet specified in internal docs.

### Health Care Clearinghouse (Intermediary)
- **Category**: Financial Ecosystem (Revenue, Payer, Intermediaries)
- **Primary responsibilities**: Process nonstandard ↔ standard transactions; route administrative data.
- **External grounding**: Clearinghouses are HIPAA covered entities (`https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`) and discussed as ecosystem intermediaries (`https://www.healthit.gov/isp/fhir-ecosystem`).
- **Zenthea gaps**: clearinghouse integrations not yet specified.

### Laboratory Staff / Lab Organization
- **Category**: External Partners
- **Primary responsibilities**: Perform tests; release results; ensure correct routing.
- **External grounding**: Lab staff lead exists in EHR implementation roles (`https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`).
- **Zenthea-defined today**: Patient Portal Agent may explain lab results (`docs/05-services/patient-portal-agent.md`).
- **Zenthea gaps**: ordering workflows, interfaces, result ingestion/release policies not yet specified.

### IT & Security Team (Provider org)
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Operate and secure systems; manage identity, access, and vendor risk.
- **Zenthea grounding**: zero trust; multiple identity types; auditability (`docs/04-security-compliance/security-model.md`).

### EHR Builder / Configuration Specialist
- **Category**: Platform Operations & Engineering / Practice Operations
- **Primary responsibilities**: Configure workflows and system behavior; enable change management.
- **External grounding**: EHR builder listed in HealthIT.gov implementation roles (`https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`).

### Implementation / Change Management / Super User / Training Lead
- **Category**: Practice Operations
- **Primary responsibilities**: Training, workflow redesign, adoption support.
- **External grounding**: Workflow redesign lead and super-user/training lead are implementation stakeholders (`https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`).

### Public Health Authority (context role)
- **Category**: Interoperability & External Exchange
- **Primary responsibilities**: Collect and use health data for public health surveillance and intervention.
- **External grounding**: HIPAA permits disclosures to public health authorities; FHIR ecosystem includes public health reporting modernization (`https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`, `https://www.healthit.gov/isp/fhir-ecosystem`).
- **Zenthea gaps**: public health reporting workflows not yet specified in internal docs.

### Health IT Developer / HIE / HIN (Interoperability actors)
- **Category**: Interoperability & External Exchange
- **Primary responsibilities**: Enable access/exchange/use of EHI across systems.
- **External grounding**: “actors” include health IT developers, HIEs, HINs (`https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171`).
- **Zenthea interaction**: integrations must be vendor-eligible and governed (`docs/04-security-compliance/vendor-selection.md`).

### Platform Operator (Control Plane Operator)
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Use operator-facing read-only, metadata-only surfaces; execute named query policies and saved views (`docs/12-migration/slice-11/*`, `docs/12-migration/slice-12/*`, `docs/12-migration/slice-13/*`).
- **Authority boundaries**: Read-only; metadata-only; forbidden identifiers/PHI (`docs/12-migration/slice-16/slice-16-spec.md`).

### Platform Administrator
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Manage platform-level administrative needs implied by identity model and consent agent users (`docs/04-security-compliance/security-model.md`, `docs/05-services/consent-agent.md`).

### Service Owner (Agent/Service Maintainer)
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Own one domain; embed AI safely; obey policy/tool constraints (`docs/00-overview/principles.md`, `docs/05-services/service-template.md`).

### Platform Engineer / SRE
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Operate infrastructure preserving auditability, determinism, non-cacheability; execute mitigations/kill switches (`docs/12-migration/slice-19/*`, `docs/12-migration/slice-08/*`).

### Platform Architect
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Steward doctrine and slice contracts; enforce execution standards (`docs/01-architecture/execution-standards.md`).

### Platform Governance Authority
- **Category**: Governance, Safety, Security, Compliance
- **Primary responsibilities**: Approve/seal governance artifacts; enforce deny-by-default and fail-closed (`docs/16-phase-e/*`).

### Compliance Officer
- **Category**: Governance, Safety, Security, Compliance
- **Primary responsibilities**: Ensure consent/auditability/data handling; review consent decision logs (`docs/05-services/consent-agent.md`).

### Security Lead
- **Category**: Governance, Safety, Security, Compliance
- **Primary responsibilities**: Own incident response posture and security constraints (`docs/04-security-compliance/security-model.md`, `docs/12-migration/slice-08/*`).

### Clinical Safety Auditor
- **Category**: Governance, Safety, Security, Compliance
- **Primary responsibilities**: Audit clinical AI pathways for draft-only enforcement and consent gating (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`).

### External Auditor (SOC 2 / HIPAA / Vendor Audit)
- **Category**: Governance, Safety, Security, Compliance
- **Primary responsibilities**: Review evidence (audit logs, consent decisions, PHI access accounting, governance posture).

### Regulator (HIPAA / GDPR)
- **Category**: Governance, Safety, Security, Compliance
- **Primary responsibilities**: External constraint source; platform must produce evidence and demonstrate controls.

### Sales Team Member
- **Category**: Business & Commercial
- **Primary responsibilities**: Use AI-native sales workflows (`docs/05-services/sales-agent.md`).
- **Authority boundaries**: Cannot bypass authorization or treat AI recommendations as authority (`docs/05-services/sales-agent.md`).
- **Not responsible for**: Billing authority, accounting, platform governance.
- **Success**: AI assistance improves consistency while humans remain accountable.

### Marketing Team Member
- **Category**: Business & Commercial
- **Primary responsibilities**: Use AI assistance for marketing drafts under review/approval gates (`docs/05-services/marketing-agent.md`).
- **Authority boundaries**: Cannot publish autonomously by default; claims requiring legal review must be flagged (`docs/05-services/marketing-agent.md`).
- **Not responsible for**: Sales pipeline ownership, billing, platform governance.
- **Success**: Output remains on-brand, reviewable, and compliant.

### Finance / Accounting Professional
- **Category**: Business & Commercial
- **Primary responsibilities**: Use AI assistance for accounting workflows where correctness/auditability are non-negotiable (`docs/05-services/accounting-agent.md`).
- **Authority boundaries**: AI may not post journal entries; human oversight remains required (`docs/05-services/accounting-agent.md`).
- **Not responsible for**: Payment provider operations or defining pricing/entitlements.
- **Success**: Records remain correct and explainable; automation stays bounded.

### Executive Stakeholder / Leadership
- **Category**: Business & Commercial
- **Primary responsibilities**: Set direction consistent with mission/constraints; preserve trust as non-negotiable (`docs/00-overview/vision.md`, `docs/00-overview/principles.md`).
- **Authority boundaries**: Cannot override sealed governance doctrine without documented decisions/artifacts.
- **Not responsible for**: Day-to-day operator actions or service implementation.
- **Success**: Direction preserves leverage and governance-first sequencing.

### Investor / Demo Reviewer (Synthetic Data Only)
- **Category**: Business & Commercial
- **Primary responsibilities**: Evaluate demos and direction in a context that explicitly avoids PHI (`docs/00-overview/vision.md`).
- **Authority boundaries**: Must not receive PHI; demos use synthetic/non-production data (`docs/00-overview/vision.md`, `docs/04-security-compliance/hipaa-strategy.md`).
- **Not responsible for**: Governance or compliance decisions.
- **Success**: Can assess product direction without driving unsafe shortcuts.

### External Integration Owner (EHR / FHIR / Labs / Scheduling System)
- **Category**: External Systems & Vendors
- **Primary responsibilities**: Provide external system interfaces/events via governed integration boundary contracts (`docs/12-migration/slice-20/slice-20-spec.md`, `docs/12-migration/mig-06-automation-agent-orchestration.md`).
- **Authority boundaries**: Integration boundary forbids payload-like content in audits and forbids background job semantics (`docs/12-migration/slice-20/slice-20-spec.md`).
- **Not responsible for**: Setting Zenthea’s internal policy semantics or bypassing governance.
- **Success**: Integrations remain vendor-neutral, auditable, and do not widen exposure.

### AI Model Provider (Vendor)
- **Category**: External Systems & Vendors
- **Primary responsibilities**: Provide model inference under explicit vendor eligibility constraints; PHI only if BAA + constraints satisfied (`docs/04-security-compliance/vendor-selection.md`, `docs/04-security-compliance/hipaa-strategy.md`).
- **Authority boundaries**: Must not train on customer data unless explicitly permitted; retention/logging behavior must be documented and enforceable (`docs/04-security-compliance/hipaa-strategy.md`, `docs/04-security-compliance/vendor-selection.md`).
- **Not responsible for**: Zenthea internal governance decisions.
- **Success**: Vendor usage is provably compliant and bounded; changes are auditable.

### Payment Provider (for example Stripe)
- **Category**: External Systems & Vendors
- **Primary responsibilities**: Execute payments and emit lifecycle webhooks; billing remains authoritative (`docs/05-services/billing-and-monetisation.md`).
- **Authority boundaries**: Must not define pricing logic or entitlements; webhook handling validated/idempotent (`docs/05-services/billing-and-monetisation.md`).
- **Not responsible for**: Product domain behavior or access control decisions.
- **Success**: Reliable execution without uncontrolled side effects.

### Observability / Logging Vendor
- **Category**: External Systems & Vendors
- **Primary responsibilities**: Receive operational telemetry filtered to avoid PHI leakage; retention/access controlled (`docs/04-security-compliance/vendor-selection.md`, `docs/04-security-compliance/security-model.md`).
- **Authority boundaries**: Must not become a leakage vector; PHI must be excluded/redacted; access audited.
- **Not responsible for**: Determining sensitivity classification (Zenthea must classify/filter).
- **Success**: Supports auditability and incident response without increased exposure.

### Service Account / Internal System Component (Non-human)
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Act as authenticated identity for internal/service-to-service requests (`docs/04-security-compliance/security-model.md`).
- **Authority boundaries**: Least privilege; deny-by-default; auditable actions.
- **Not responsible for**: Human decisions or bypassing escalation requirements.
- **Success**: Capabilities remain tightly scoped and traceable.

### AI Execution Context (Non-human)
- **Category**: Platform Operations & Engineering
- **Primary responsibilities**: Represent AI-invocation identity/context as first-class security concern (`docs/04-security-compliance/security-model.md`).
- **Authority boundaries**: Cannot gain capabilities beyond explicitly granted tools/policies; tool usage permission-gated and audited (`docs/12-migration/slice-06/slice-06-agent-governance.md`).
- **Not responsible for**: Granting consent, authoring policies, making final clinical/financial decisions.
- **Success**: AI behavior is governable, observable, safely constrained.

---

## 5. User Stories (Behavioral, constraint-aware)

> **Story format:** “As a `<role>`, I want to `<do a specific thing>` so that `<clear outcome>`.”

### Patient — User stories
- As a Patient, I want to ask questions about my own record in plain language so that I can understand my health information without medical jargon. (`docs/05-services/patient-portal-agent.md`)
- As a Patient, I want the system to refuse requests to access other patients’ data so that my privacy boundary is not compromised. (`docs/05-services/patient-portal-agent.md`)
- As a Patient, I want informational answers to be clearly labeled as not medical advice so that I do not mistake AI output for diagnosis or treatment. (`docs/05-services/patient-portal-agent.md`)
- As a Patient, I want consent checks to happen before any AI processing of my PHI so that my data is only used when permitted. (`docs/05-services/patient-portal-agent.md`, `docs/05-services/consent-agent.md`)
- As a Patient, I want revoked consent to stop further processing immediately so that I can withdraw access without delay. (`docs/05-services/patient-portal-agent.md`, `docs/05-services/consent-agent.md`)
- As a Patient, I want the system to fail closed when consent cannot be verified so that missing verification never results in accidental exposure. (`docs/05-services/patient-portal-agent.md`)
- As a Patient, I want explanations to be calm and non-alarmist so that I am not unnecessarily distressed. (`docs/05-services/patient-portal-agent.md`)
- As a Patient, I want an auditable trail of access decisions (without exposing my PHI in logs) so that access can be accounted for if needed. (`docs/04-security-compliance/hipaa-strategy.md`, `docs/04-security-compliance/security-model.md`)

### Personal Representative — User stories
- As a Legal Guardian / Authorized Representative, I want to access a patient’s information only when my authorization is validated so that lawful access is supported without expanding scope. (`docs/05-services/patient-portal-agent.md`)
- As a Legal Guardian / Authorized Representative, I want requests outside my authorization to be denied deterministically so that ambiguity does not create a privacy breach. (`docs/04-security-compliance/security-model.md`)
- As a Legal Guardian / Authorized Representative, I want consent revocation by the patient to be honored immediately so that my delegated access cannot persist after withdrawal. (`docs/05-services/consent-agent.md`)

### Licensed Clinician — User stories
- As a Licensed Clinician, I want clinical AI outputs to be clearly labeled as draft/advisory so that I remain the accountable authority. (`docs/05-services/clinical-documentation-agent.md`, `docs/05-services/medical-advisor-agent.md`)
- As a Licensed Clinician, I want the system to refuse any attempt to sign, attest, finalize, or commit via AI so that the draft-only doctrine is preserved. (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, `docs/12-migration/mig-04-acceptance-guardrails.md`)
- As a Licensed Clinician, I want consent gating to occur before any patient-scoped retrieval or AI drafting so that I only access data with verified permission. (`docs/05-services/clinical-documentation-agent.md`, `docs/05-services/consent-agent.md`)
- As a Licensed Clinician, I want the system to fail closed when consent verification is unavailable so that I don’t accidentally draft using unauthorized data. (`docs/05-services/clinical-documentation-agent.md`)
- As a Licensed Clinician, I want AI to avoid hallucinated facts and speculative diagnoses so that drafts never introduce unsafe clinical content. (`docs/05-services/clinical-documentation-agent.md`, `docs/05-services/medical-advisor-agent.md`)
- As a Licensed Clinician, I want to reject or correct AI drafts and have that decision captured (metadata-only) so that model behavior can be evaluated and improved safely. (`docs/00-overview/principles.md`, `docs/04-security-compliance/security-model.md`)
- As a Licensed Clinician, I want evidence sources to be cited when external clinical evidence is used so that recommendations are reviewable. (`docs/05-services/medical-advisor-agent.md`)
- As a Licensed Clinician, I want the system to block any downstream action from occurring automatically based on advisory output so that human-in-the-loop is preserved. (`docs/05-services/medical-advisor-agent.md`)

### Nursing / Allied Health — User stories
- As Nursing/Allied Health staff, I want role and scope validation to gate access so that I cannot exceed my authorized clinical scope. (`docs/05-services/clinical-documentation-agent.md`)
- As Nursing/Allied Health staff, I want drafts to remain non-final and clearly marked so that my contributions cannot be mistaken for a signed clinical record. (`docs/05-services/clinical-documentation-agent.md`)
- As Nursing/Allied Health staff, I want unsafe prompts (e.g., requests to add unverified facts) to be refused so that clinical documentation remains accurate. (`docs/05-services/clinical-documentation-agent.md`)
- As Nursing/Allied Health staff, I want all access and drafting to be auditable without PHI appearing in logs so that compliance requirements are satisfied. (`docs/04-security-compliance/hipaa-strategy.md`)

### Medical Scribe — User stories
- As a Medical Scribe, I want AI-generated drafts to be editable and non-final so that I can prepare documentation for clinician review without creating a legal record. (`docs/05-services/clinical-documentation-agent.md`)
- As a Medical Scribe, I want the system to prevent any “sign/commit” semantics in my workflow so that I cannot inadvertently create a finalized record. (`docs/12-migration/mig-04-acceptance-guardrails.md`)
- As a Medical Scribe, I want consent to be validated before I access patient-scoped drafting context so that I do not participate in unauthorized processing. (`docs/05-services/consent-agent.md`)

### Clinical Staff (Reception / Care Coordinators / Schedulers / Registration) — User stories
- As Clinical Staff, I want to propose appointment changes without executing them so that scheduling remains controlled and auditable. (`docs/05-services/appointment-booking-agent.md`)
- As Clinical Staff, I want the system to clearly indicate when an appointment action is pending approval so that I do not promise outcomes prematurely. (`docs/05-services/appointment-booking-agent.md`)
- As Clinical Staff, I want identity and consent validation to occur before patient-related scheduling proposals so that I do not act on unauthorized requests. (`docs/05-services/appointment-booking-agent.md`, `docs/05-services/consent-agent.md`)
- As Clinical Staff, I want failures (conflicts, authorization denial, system errors) to be explicit and traceable so that I can resolve scheduling issues without workarounds. (`docs/05-services/appointment-booking-agent.md`)
- As Clinical Staff, I want repeated policy denials or unknown tool attempts to escalate to the appropriate playbook so that unsafe behavior is mitigated quickly. (`docs/12-migration/slice-08/slice-08-step-08.2-escalation-playbooks.md`)

### Practice Administrator / Tenant Administrator — User stories
- As a Practice Administrator, I want tenant context to be explicit for all operations so that cross-tenant access is prevented by design. (`docs/04-security-compliance/security-model.md`, `docs/06-frontends/frontend-template.md`)
- As a Practice Administrator, I want access governance to be role-based and auditable so that I can demonstrate appropriate controls under HIPAA’s shared responsibility model. (`docs/04-security-compliance/hipaa-strategy.md`)
- As a Practice Administrator, I want consent-related workflows to be explainable so that staff training and patient support can be consistent. (`docs/05-services/consent-agent.md`)
- As a Practice Administrator, I want the system to block any attempt to rely on UI-only entitlements so that access control remains authoritative in services. (`docs/06-frontends/frontend-strategy.md`, `docs/05-services/billing-and-monetisation.md`)

### Billing / Revenue Cycle Staff — User stories
- As Billing staff, I want entitlements to be checked centrally so that plan assumptions in frontends don’t create inconsistent access. (`docs/05-services/billing-and-monetisation.md`, `docs/06-frontends/frontend-strategy.md`)
- As Billing staff, I want billing failures to be explicit and observable so that charging and access problems can be addressed without guesswork. (`docs/05-services/billing-and-monetisation.md`)
- As Billing staff, I want payment events to be processed idempotently so that retries do not double-charge or create conflicting states. (`docs/05-services/billing-and-monetisation.md`)
- As Billing staff, I want AI to explain billing state but never execute refunds, credits, or payments so that financial actions remain controlled. (`docs/05-services/billing-and-monetisation.md`)

### Platform Operator — User stories
- As a Platform Operator, I want to execute only registered operator query policies so that operator visibility is auditable and deny-by-default. (`docs/12-migration/slice-12/slice-12-step-12.1-operator-query-policies.md`)
- As a Platform Operator, I want unknown policy/view IDs to be rejected with stable reason codes so that ambiguity does not hide governance failures. (`docs/12-migration/slice-13/slice-13-spec.md`)
- As a Platform Operator, I want operator audit events emitted on both success and rejection so that all operator actions are traceable. (`docs/12-migration/slice-13/slice-13-spec.md`)
- As a Platform Operator, I want operator-visible outputs to exclude tenantId/actorId/requestId/cursors/payloads so that operator access remains metadata-only and PHI-safe. (`docs/12-migration/slice-11/slice-11-operator-apis-readonly.md`, `docs/12-migration/slice-16/slice-16-spec.md`)
- As a Platform Operator, I want decision hooks to signal when human review is required so that high-risk outcomes are routed appropriately without performing mutations. (`docs/12-migration/slice-16/slice-16-spec.md`)
- As a Platform Operator, I want escalation playbooks to map signals to bounded actions (kill switches) so that mitigation is reversible and non-autonomous. (`docs/12-migration/slice-08/slice-08-step-08.2-escalation-playbooks.md`)
- As a Platform Operator, I want to identify unknown agent/tool activity quickly so that I can trigger emergency escalation when required. (`docs/12-migration/slice-06/slice-06-agent-governance.md`, `docs/12-migration/slice-08/slice-08-step-08.2-escalation-playbooks.md`)

### Platform Administrator — User stories
- As a Platform Administrator, I want identities and permissions to be explicit per identity type (end user, service account, AI execution context) so that trust is never assumed. (`docs/04-security-compliance/security-model.md`)
- As a Platform Administrator, I want authorization failures to be logged and observable so that misuse can be detected without exposing sensitive data. (`docs/04-security-compliance/security-model.md`)
- As a Platform Administrator, I want secrets to be injected at runtime and never stored in code so that credential leakage is treated as an incident and prevented by design. (`docs/04-security-compliance/security-model.md`)

### Service Owner — User stories
- As a Service Owner, I want my service to own exactly one domain so that responsibilities remain clear and composable. (`docs/05-services/service-template.md`)
- As a Service Owner, I want AI to be embedded using the shared runtime and remain observable and testable so that behavior can be governed. (`docs/00-overview/principles.md`, `docs/05-services/service-template.md`)
- As a Service Owner, I want tool usage to be deny-by-default and explicitly scoped per agent so that permission drift is prevented. (`docs/12-migration/slice-06/slice-06-agent-governance.md`)
- As a Service Owner, I want policy checks to exist before and after AI execution so that unsafe outputs or requests are blocked. (`docs/05-services/service-template.md`, `docs/04-security-compliance/security-model.md`)
- As a Service Owner, I want cross-service communication to occur only via APIs/events so that no direct cross-service database access is possible. (`docs/01-architecture/system-overview.md`)
- As a Service Owner, I want audits and telemetry to remain metadata-only where required so that observability does not become a leakage vector. (`docs/00-overview/principles.md`, `docs/04-security-compliance/vendor-selection.md`)

### Platform Engineer / SRE — User stories
- As a Platform Engineer/SRE, I want governed execution/decision/mutation/audit paths to be non-cacheable by construction so that replay cannot occur silently. (`docs/12-migration/slice-19/slice-19-spec.md`, `docs/adr/ADR-CP-21-CACHE-BOUNDARY-ENFORCEMENT.md`)
- As a Platform Engineer/SRE, I want the platform to fail closed when audit emission cannot be acknowledged so that un-audited execution is impossible. (`docs/16-phase-e/evidence/30-p3-non-omittability-proof.md`, `docs/16-phase-e/evidence/50-p5-fail-closed-matrix.md`)
- As a Platform Engineer/SRE, I want kill switches to be reversible and not require redeploy so that mitigations can be applied quickly and safely. (`docs/12-migration/slice-08/slice-08-step-08.2-escalation-playbooks.md`)
- As a Platform Engineer/SRE, I want incident response capabilities that can disable AI capabilities selectively so that response can be targeted and auditable. (`docs/04-security-compliance/security-model.md`, `docs/04-security-compliance/hipaa-strategy.md`)

### Platform Architect — User stories
- As a Platform Architect, I want slice execution to be governed by a mandatory checklist and evidence so that “completed” status is meaningful and auditable. (`docs/01-architecture/execution-standards.md`, `docs/ARCHITECTURE-SLICE-SEAL-INDEX.md`)
- As a Platform Architect, I want application surfaces to have governance closure so that doctrine cannot be bypassed by legacy routes or caching configuration drift. (`docs/12-migration/slice-21-application-surface-governance.md`, `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`)
- As a Platform Architect, I want services to remain frontend-agnostic so that frontends can be swapped without rewriting core logic. (`docs/00-overview/principles.md`, `docs/01-architecture/system-overview.md`)
- As a Platform Architect, I want policy contracts to have a canonical owner so that semantic drift does not break determinism or auditability. (`docs/adr/ADR-POLICY-CONTRACT-AUTHORITY.md`)

### Platform Governance Authority — User stories
- As Platform Governance, I want high-risk orchestration work to be blocked until evidence artifacts exist so that “automation” never expands capability implicitly. (`docs/16-phase-e/phase-e-final-seal.md`, `docs/16-phase-e/evidence/*`)
- As Platform Governance, I want fail-closed semantics to be explicit and bounded for every surface so that there is no autonomous recovery or hidden retry. (`docs/16-phase-e/evidence/50-p5-fail-closed-matrix.md`)
- As Platform Governance, I want 100% surface inventories and proof mappings (no sampling) so that bypass paths cannot hide in unenumerated entrypoints. (`docs/adr/ADR-CP-21-CACHE-BOUNDARY-ENFORCEMENT.md`, `docs/16-phase-e/evidence/10-p1-surface-to-contract-matrix.md`)
- As Platform Governance, I want a formal unblock record to be the only mechanism to authorize implementation so that governance decisions are explicit and revocable. (`docs/16-phase-e/e-13-mig-06-unblock-record.md`)

### Compliance Officer — User stories
- As a Compliance Officer, I want consent decisions to be traceable, explainable, and auditable so that I can support HIPAA authorization and GDPR lawful basis obligations. (`docs/05-services/consent-agent.md`)
- As a Compliance Officer, I want vendors that process PHI to be eligible only with a BAA so that unapproved vendors never receive PHI. (`docs/04-security-compliance/hipaa-strategy.md`, `docs/04-security-compliance/vendor-selection.md`)
- As a Compliance Officer, I want PHI access and AI executions involving PHI to be logged as metadata-only events so that audits are possible without PHI in telemetry. (`docs/04-security-compliance/hipaa-strategy.md`, `docs/04-security-compliance/security-model.md`)
- As a Compliance Officer, I want “HIPAA mode” to be restrictive by design so that experimental features and unvetted integrations are blocked. (`docs/04-security-compliance/hipaa-strategy.md`)

### Security Lead — User stories
- As a Security Lead, I want every request to be authenticated and authorized at boundaries so that no component is trusted by default. (`docs/04-security-compliance/security-model.md`)
- As a Security Lead, I want tool usage to be permission-based and audited so that tool abuse is detectable and bounded. (`docs/04-security-compliance/security-model.md`, `docs/12-migration/slice-06/slice-06-agent-governance.md`)
- As a Security Lead, I want emergency escalation triggers (e.g., UNKNOWN_AGENT) to map to immediate write disablement so that unsafe behavior is stopped quickly. (`docs/12-migration/slice-08/slice-08-step-08.2-escalation-playbooks.md`)
- As a Security Lead, I want incidents to support revocation and credential rotation so that compromise can be contained. (`docs/04-security-compliance/security-model.md`)

### Clinical Safety Auditor — User stories
- As a Clinical Safety Auditor, I want draft-only enforcement to be provable (including refusals to sign/attest) so that clinical AI cannot create legally binding records. (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, `docs/12-migration/mig-04-acceptance-guardrails.md`)
- As a Clinical Safety Auditor, I want consent gating to be a hard gate for any PHI-involving drafting so that unsafe drafting cannot proceed under uncertainty. (`docs/ARCHITECTURE-DOCTRINE-AUDIT.md`, `docs/05-services/clinical-documentation-agent.md`)
- As a Clinical Safety Auditor, I want stop conditions for scope creep (“commit/sign/attest”) to trigger immediate work cessation so that unsafe capability does not leak into early slices. (`docs/12-migration/mig-04-acceptance-guardrails.md`)

### External Auditor — User stories
- As an External Auditor, I want deterministic evidence artifacts and audit logs that can be exported so that I can assess controls without relying on unverifiable assumptions. (`docs/04-security-compliance/hipaa-strategy.md`, `docs/16-phase-e/*`)
- As an External Auditor, I want proof that sensitive paths are non-cacheable and non-bypassable so that data replay risk is controlled. (`docs/adr/ADR-CP-21-CACHE-BOUNDARY-ENFORCEMENT.md`, `docs/12-migration/slice-21-application-surface-governance.md`)
- As an External Auditor, I want stable taxonomies for rejections/errors so that audits do not depend on ad-hoc strings. (`docs/12-migration/slice-13/slice-13-spec.md`)

### Regulator — User stories
- As a Regulator, I want systems handling PHI to demonstrate auditability and minimum-necessary access so that compliance is provable. (`docs/04-security-compliance/hipaa-strategy.md`)
- As a Regulator, I want shared-responsibility boundaries to be explicit so that responsibilities are not implied or hidden. (`docs/04-security-compliance/hipaa-strategy.md`)

### Business & Commercial — User stories
- As a Sales team member, I want AI to provide explainable lead scoring so that I can trust recommendations without treating them as authority. (`docs/05-services/sales-agent.md`)
- As a Sales team member, I want policy-governed automation to require appropriate authorization so that outreach actions don’t bypass controls. (`docs/05-services/sales-agent.md`, `docs/04-security-compliance/security-model.md`)
- As a Sales team member, I want tool usage to be auditable so that automated actions are traceable to the service and context that produced them. (`docs/00-overview/principles.md`)
- As a Marketing team member, I want AI to generate content drafts and variants so that I can accelerate creation while retaining review authority. (`docs/05-services/marketing-agent.md`)
- As a Marketing team member, I want the system to flag claims requiring legal review so that publishing does not create compliance risk. (`docs/05-services/marketing-agent.md`)
- As a Marketing team member, I want publishing to remain approval-gated so that automation does not bypass brand/legal constraints. (`docs/05-services/marketing-agent.md`)
- As a Finance/Accounting professional, I want AI to suggest classifications with explanations so that I can review and correct without losing auditability. (`docs/05-services/accounting-agent.md`)
- As a Finance/Accounting professional, I want immutable audit trails for material actions so that financial reviews are defensible. (`docs/05-services/accounting-agent.md`)
- As a Finance/Accounting professional, I want AI to never execute payments or post journal entries automatically so that irreversible actions remain controlled. (`docs/05-services/accounting-agent.md`, `docs/05-services/billing-and-monetisation.md`)
- As Leadership, I want platform work to prioritize security/compliance and governance before capability so that trust is non-negotiable. (`docs/00-overview/principles.md`, `docs/01-architecture/execution-standards.md`)
- As Leadership, I want roadmap claims to be anchored in sealed evidence so that progress reporting is credible. (`docs/ROADMAP.md`, `docs/ARCHITECTURE-SLICE-SEAL-INDEX.md`)
- As an Investor/Demo reviewer, I want demonstrations to use synthetic/non-PHI data so that early validation does not create compliance exposure. (`docs/00-overview/vision.md`, `docs/04-security-compliance/hipaa-strategy.md`)
- As an Investor/Demo reviewer, I want the platform’s governance constraints to be explicit so that expectations don’t drive unsafe shortcuts. (`docs/00-overview/principles.md`)

### External Systems & Vendors — User stories
- As an External Integration Owner, I want integrations to be vendor-neutral and contract-defined so that replacing vendors does not require systemic redesign. (`docs/12-migration/slice-20/slice-20-spec.md`, `docs/01-architecture/system-overview.md`)
- As an External Integration Owner, I want writes to require idempotency keys so that retries do not create duplicate side effects. (`docs/12-migration/slice-20/slice-20-spec.md`)
- As an External Integration Owner, I want failure taxonomy to be bounded and metadata-only so that error handling is deterministic and auditable. (`docs/12-migration/slice-20/slice-20-spec.md`)
- As an AI Model Provider, I want clear constraints on data retention and training so that PHI handling is compliant and auditable. (`docs/04-security-compliance/hipaa-strategy.md`, `docs/04-security-compliance/vendor-selection.md`)
- As an AI Model Provider, I want model versions to be explicit so that changes can be managed and traced. (`docs/04-security-compliance/vendor-selection.md`)
- As a Payment Provider, I want webhook handling to be validated and processed idempotently so that payment events do not create inconsistent billing state. (`docs/05-services/billing-and-monetisation.md`)
- As an Observability vendor, I want telemetry to be classified and filtered so that I never receive PHI in logs by default. (`docs/04-security-compliance/vendor-selection.md`, `docs/04-security-compliance/hipaa-strategy.md`)
- As an Observability vendor, I want retention and access controls to be explicit so that audit and incident response are supported without uncontrolled exposure. (`docs/04-security-compliance/vendor-selection.md`)

### Non-human identities — User stories
- As a Service Account, I want explicit permissions and scopes so that my actions are least-privilege and auditable. (`docs/04-security-compliance/security-model.md`)
- As a Service Account, I want authentication context to be propagated explicitly so that downstream services can enforce access properly. (`docs/04-security-compliance/security-model.md`)
- As an AI Execution Context, I want tool access to be permission-based and deny-by-default so that AI cannot expand capabilities implicitly. (`docs/04-security-compliance/security-model.md`, `docs/12-migration/slice-06/slice-06-agent-governance.md`)
- As an AI Execution Context, I want tool invocations to be audited so that privileged actions are traceable and governable. (`docs/04-security-compliance/security-model.md`)

---

## 6. User Flows (Sequence descriptions; no UI assumptions)

### 6.1 Draft clinical documentation (Licensed clinician)
1. Clinician initiates documentation support for a specific patient encounter.
2. Identity/role verification + patient scoping + consent validation (fail closed if unavailable). (`docs/05-services/consent-agent.md`)
3. Clinical Documentation Agent produces a **draft** note; no new facts; clearly labeled draft. (`docs/05-services/clinical-documentation-agent.md`)
4. Clinician reviews/edits/rejects; corrections captured.
5. Audit captures metadata (no PHI in logs). (`docs/04-security-compliance/hipaa-strategy.md`)

### 6.2 Appointment request → proposal → approval → execution (Scheduling)
1. Patient or staff requests schedule/reschedule/cancel.
2. Identity verification + consent validation + policy checks. (`docs/05-services/appointment-booking-agent.md`, `docs/05-services/consent-agent.md`)
3. Appointment Booking Agent emits a **proposal** (not execution). (`docs/05-services/appointment-booking-agent.md`)
4. Approval step (human/system policy).
5. Execution via governed gateway (agent never executes directly). (`docs/05-services/appointment-booking-agent.md`)

### 6.3 Patient question about their record (Patient portal)
1. Patient authenticates; identity- and tenant-scoped.
2. Consent validated; fail closed if unavailable. (`docs/05-services/consent-agent.md`)
3. Patient Portal Agent retrieves minimum necessary data and summarizes without hallucination. (`docs/05-services/patient-portal-agent.md`)
4. Response is informational, calm, non-alarmist; not medical advice. (`docs/05-services/patient-portal-agent.md`)
5. Audit metadata emitted without PHI. (`docs/04-security-compliance/hipaa-strategy.md`)

### 6.4 Vendor eligibility enforcement for PHI-bearing workflows (IT/Security)
1. Determine PHI involvement and compliance mode. (`docs/04-security-compliance/hipaa-strategy.md`)
2. Enforce vendor allowlist/eligibility (BAA gating where required). (`docs/04-security-compliance/vendor-selection.md`)
3. Deny + audit when vendor is not eligible; proceed with minimized exposure when eligible.

### 6.5 Interoperability actor request (contextual ecosystem flow)
This flow is included to reflect ecosystem obligations; Zenthea’s specific interoperability surfaces are not yet specified.
1. Requestor seeks access/exchange/use of EHI.
2. Provider evaluates legitimacy and applies privacy/security feasibility constraints and exceptions as applicable.  
   External grounding: `https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171`

---

## 7. Cross-Role Interactions (Key interaction zones and handoffs)

### Consent gating as a universal boundary
- Patient/Representative expresses consent intent → Consent Agent becomes system of record → Other agents/services must consult and fail closed on missing consent. (`docs/05-services/consent-agent.md`, `docs/04-security-compliance/hipaa-strategy.md`)
- **Conflict zone**: Patient revocation vs in-progress workflows (revoked consent immediately blocks further processing).

### Draft-only clinical workflows
- Clinician initiates drafting → Clinical Documentation Agent produces drafts only → Clinician reviews/edits → “Sign/Commit” is explicitly out of scope unless MIG-04B is approved. (`docs/05-services/clinical-documentation-agent.md`, `docs/12-migration/mig-04-acceptance-guardrails.md`, `docs/12-migration/mig-04B-clinical-documentation-commit.md`)
- **Conflict zone**: Pressure to treat draft output as final or add “commit” semantics before governance approval.

### Operator governance visibility vs privacy
- Platform Operator needs to understand system behavior → Operator APIs provide metadata-only visibility → Forbidden fields and PHI must never leak into operator surfaces. (`docs/12-migration/slice-11/*`, `docs/12-migration/slice-13/slice-13-spec.md`, `docs/12-migration/slice-16/slice-16-spec.md`)
- **Conflict zone**: Debugging urgency vs metadata-only constraints; operator visibility must remain safe by design.

### Escalation, mitigation, and kill switches
- Governance signals emitted (deny events, lifecycle violations) → Decision hooks classify review need → Operator follows escalation playbooks → Platform Engineer/SRE applies bounded mitigations (kill switches). (`docs/12-migration/slice-16/slice-16-spec.md`, `docs/12-migration/slice-08/slice-08-step-08.2-escalation-playbooks.md`)
- **Conflict zone**: Introducing autonomous enforcement or persistence of approvals.

### Automation/orchestration governance
- Operator/System/External triggers may initiate orchestration only under explicit policy gates → Orchestration must remain deterministic, fail-closed, and non-autonomous; write-controlled actions are restricted to CP-17 allowlist. (`docs/adr/ADR-MIG-06-ORCHESTRATION-MODEL.md`, `docs/12-migration/mig-06-automation-agent-orchestration.md`, `docs/16-phase-e/evidence/*`)
- **Dependency chain**: CP-16 (decision hooks) → CP-17 (controlled mutations) → CP-18 (versioning) → CP-19 (caching boundaries) → CP-20 (integration envelopes) → CP-21 (application surface closure) → MIG-06 (bounded orchestration).
- **Conflict zone**: Implementing “automation” via background jobs/queues/workers/cron (explicitly rejected).

### Vendor eligibility and compliance
- Compliance Officer + Governance define acceptable vendor conditions → Platform enforces eligibility programmatically → Service Owners must not bypass integration boundaries. (`docs/04-security-compliance/vendor-selection.md`, `docs/04-security-compliance/hipaa-strategy.md`, `docs/12-migration/slice-20/slice-20-spec.md`)
- **Conflict zone**: Convenience-driven vendor adoption vs BAA and data-handling constraints.

---

## 8. Roadmap Extraction Guidance

### Translating roles → slices
- **Start from constraints, not capabilities**
  - If any story touches PHI, external vendors, tool execution, or automation-like triggers, first extract the governance prerequisites (policy gating, audit non-omittability, non-cacheability, deterministic outcomes) as explicit dependencies. (`docs/00-overview/principles.md`, `docs/04-security-compliance/hipaa-strategy.md`, `docs/12-migration/slice-19/slice-19-spec.md`)

- **Cluster stories by governance boundary**
  - Operator visibility (read-only, metadata-only) → CP slices 11–13, 16.
  - Controlled side effects (communication-only) → CP-17.
  - External integration envelopes → CP-20.
  - Application-surface closure → CP-21.

- **Foundational vs enabling vs deferred**
  - **Foundational (must precede anything high-risk)**: Consent gating, audit logging, deny-by-default tool governance, deterministic operator visibility, caching boundaries.
  - **Enabling (unlocks bounded workflows without widening scope)**: Decision hooks/escalation semantics; controlled mutations limited to communication; integration boundary contracts; versioning for reconstructability.
  - **Deferred (explicitly blocked by design)**: Clinical “sign/commit” write paths remain blocked until MIG-04B is approved. (`docs/12-migration/mig-04B-clinical-documentation-commit.md`, `docs/ROADMAP.md`)

### Governance gates that should appear as slice acceptance criteria
- **Fail-closed** on missing policy/approval/audit acknowledgement.
- **Metadata-only exposure** where required (no PHI/PII; no forbidden identifiers in operator-visible outputs).
- **Non-cacheability** of execution/decision/mutation/audit paths.
- **Deny-by-default** for unknown agents/tools/policies/views/triggers.

---

## 9. Key Research Citations (External)
- HealthIT.gov EHR implementation stakeholders: `https://www.healthit.gov/faq/who-are-key-stakeholders-during-electronic-health-record-ehr-implementation`
- HealthIT.gov leadership team resource (HIM/Medical Records, leadership): `https://www.healthit.gov/resource/creating-leadership-team-successful-ehr-implementation`
- HHS HIPAA Privacy Rule summary: `https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html`
- eCFR 45 CFR Part 171 (Information Blocking): `https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-D/part-171`
- ONC/ASTP ISP FHIR Ecosystem: `https://www.healthit.gov/isp/fhir-ecosystem`

---

## 10. Gaps (external ecosystem vs current internal Zenthea docs)
- **Payer workflows (prior authorization, claims exchange)**: ecosystem role is clear; Zenthea payer-facing workflows not yet specified.
- **Clearinghouse integrations**: stakeholder is explicit under HIPAA; Zenthea integration flows not yet specified.
- **Lab ordering/result ingestion interfaces**: lab stakeholders exist; Zenthea explains results but does not yet specify exchange mechanics.
- **HIE/HIN exchange and information blocking workflows**: regulatory ecosystem is clear; Zenthea’s specific interoperability surfaces/standards support not yet described.

