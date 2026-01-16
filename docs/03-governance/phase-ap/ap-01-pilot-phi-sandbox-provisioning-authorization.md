# Phase AP-01: Pilot PHI Sandbox Provisioning Authorization

## 1. Phase Classification and Lock Status
- **Phase Identifier:** AP-01 (Architecture & Provisioning)
- **Status:** **PROVISIONING AUTHORIZED | EXECUTION LOCKED**
- **Governance Constraint:** This document authorizes infrastructure creation only. The platform runtime environment remains in a `BLOCKED` state. Application deployment, binary execution, and service activation are strictly prohibited under this authorization.

## 2. Authorization Scope
This authorization is limited to the provisioning of an **AWS Pilot PHI Sandbox** infrastructure boundary. The intent is to establish the minimum viable security and network perimeter required for future pilot operations without introducing any data or operational logic.

## 3. Explicit Non-Authorization Clauses
The following activities are **NOT AUTHORIZED** and remain strictly forbidden:
- **PHI Ingestion:** No Protected Health Information (PHI) may be uploaded, stored, or transmitted.
- **PHI Processing:** No data processing workflows or ETL jobs may be executed.
- **Application Execution:** No application code (backend services, frontend servers, or workers) may be deployed or run.
- **Production Traffic:** No external or internal production traffic is permitted to reach this sandbox.
- **Integrations:** No connections to third-party services or existing internal production systems are authorized.

## 4. Allowed Provisioning Actions
Only the following AWS resource categories may be provisioned:
- **Account Boundary:** Setup of a dedicated AWS Account with Consolidated Billing and basic organization guardrails.
- **IAM (Identity & Access Management):** Creation of service-linked roles, sandbox-specific administrative users, and restricted execution roles (in a dormant state).
- **Network Boundary:** Provisioning of VPCs, Subnets, Route Tables, and Security Groups. All ingress must be denied by default.
- **Encrypted Storage:** Provisioning of empty S3 buckets and RDS instances, provided that AES-256 encryption at rest (via AWS KMS) is enforced at the resource policy level.

## 5. Forbidden Actions and Expansions
The following expansions are explicitly excluded from this phase:
- **Analytics:** No data warehousing or analytics services (e.g., Redshift, Athena).
- **Eventing:** No message buses or event-driven architectures (e.g., SQS, SNS, EventBridge).
- **Background Processing:** No serverless functions (Lambda) or container orchestration (ECS/EKS) in an active state.
- **Multi-Region:** Provisioning is limited to a single primary AWS region.

## 6. Preconditions Before Any PHI Is Introduced
Before any data ingestion can be considered, the following must be met:
- **Kill Switch Authority:** An operational kill switch must be defined and tested, allowing for immediate isolation of the sandbox environment by designated security personnel.
- **Audit Logging:** CloudTrail and VPC Flow Logs must be active and routing to a secured, immutable log bucket.
- **Compliance Review:** An automated scan of the provisioned infrastructure against the defined boundary rules.

## 7. Phase Completion Criteria
Phase AP-01 is considered complete when:
1. The AWS Pilot PHI Sandbox infrastructure is provisioned according to the "Allowed Provisioning Actions."
2. Infrastructure-as-Code (IaC) templates are committed and verified against governance rules.
3. No application code or PHI exists within the boundary.
4. The kill switch mechanism is documented and operationally ready.
