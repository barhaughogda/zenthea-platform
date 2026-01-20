# Phase J.7.0 — Executable Infrastructure Bootstrap Authorization

## Status: AUTHORIZED AND LOCKED

## 1. Scope and Purpose

This document provides explicit DESIGN and EXECUTION AUTHORIZATION for the first executable Infrastructure-as-Code (IaC) for the Zenthea Platform. This authorization is strictly limited to infrastructure bootstrapping and the establishment of foundational governance mechanisms.

## 2. Authorized Executable Code

The platform is authorized to utilize the following IaC tools and commands:
- **Tooling**: OpenTofu or Terraform.
- **Authorized Execution Path**: Manual execution only by authorized human operators.
  - `terraform init`
  - `terraform plan`
  - `terraform apply`

## 3. Configuration Authorization

### 3.1 Provider Configuration
Explicit AWS provider blocks are authorized. Configuration must be region-bound and compliant with the selections made in Phase J.4.2 and J.6.1.

### 3.2 State Backend Configuration
The remote state backend selection from Phase J.6.3 is authorized for instantiation.
- **Storage**: Amazon S3 (Bucket: as defined in J.6.3).
- **Locking**: Amazon DynamoDB (Table: as defined in J.6.3).
- **Security**: Mandatory state locking and strong consistency guarantees are required.

### 3.3 Concrete Identifiers
The use of concrete identifiers is explicitly authorized for this phase:
- AWS Account IDs
- Specific AWS Regions
- S3 Bucket Names for state storage
- DynamoDB Table Names for state locking

### 3.4 State Isolation
The platform must implement one isolated state per:
- AWS Account
- Environment (e.g., prod, staging)
- Logical Region

## 4. Fail-Closed Behavior

Any infrastructure configuration or execution must fail-closed if the following conditions are met:
- Missing backend configuration.
- Missing or non-functional state lock.
- Ambiguous configuration of regions or accounts.

## 5. Authorized Infrastructure Resources

Authorization is STRICTLY LIMITED to the following resources:
- **Remote State Backend**: S3 Buckets and DynamoDB Tables required for IaC state management.
- **Provider Wiring**: Infrastructure required for provider authentication and connectivity.
- **Foundational IAM Roles**:
  - Roles for Human Operators (Least Privilege).
  - Roles for Automation Execution (Least Privilege).

## 6. Explicit Prohibitions

The following activities and resources are STRICTLY FORBIDDEN under Phase J.7.0:
- Any application-level infrastructure (compute, storage, etc.).
- Any databases for application data storage.
- Any networking resources beyond what is strictly required for the state backend.
- Any CI/CD pipelines or automated execution frameworks.
- Any auto-apply or unattended execution of infrastructure code.
- Any observability stacks (logging, monitoring, tracing).
- Any secrets management for runtime workloads.
- Any feature flags or environment mutation logic.
- Any inference of identifiers or regions (must be explicit).
- Any storage of PHI (Protected Health Information) or PII (Personally Identifiable Information) in infrastructure state.

## 7. Security and Compliance

- **Access Control**: Identity-based access only, utilizing Least-Privilege IAM principles.
- **Role Separation**: Strict separation between human operator roles and future automation roles.
- **Data Residency**: Execution is region-bound and GDPR-compatible.
- **Data Privacy**: No clinical or patient data shall exist at this foundational layer.
- **Location Independence**: Developer physical location is not a factor for authorization; all access is governed by identity and cryptographic proof.

## 8. Phase Boundaries

- **J.7.0**: Authorizes ONLY infrastructure bootstrapping.
- **J.8.0**: Required for Application Infrastructure authorization.
- **Future Phases**: Required for runtime deployment and any scope expansion.

## 9. Lock Statement

Phase J.7.0 is hereby AUTHORIZED and LOCKED. No additional execution or configuration is permitted beyond the scope defined in this document. Any expansion of scope requires a new governance authorization phase.
