# Phase J.5 – Infrastructure-as-Code (IaC) Architecture Authorization

## 1. Purpose
The purpose of Phase J.5 is to authorize the existence and conceptual architecture of Infrastructure-as-Code (IaC) within the Zenthea Platform. This document defines the high-level design, structure, and tooling of the IaC layer.

- This phase is **DESIGN-ONLY**.
- This phase authorizes the **EXISTENCE** and **STRUCTURE** of IaC.
- This phase defines **WHAT** may exist, not how it is executed.
- **NO execution** of IaC is authorized.

## 2. Explicit Confirmation of Design-Only Status
Phase J.5 does not authorize the implementation or execution of any infrastructure.
- **NO** Terraform/OpenTofu code is authorized for implementation.
- **NO** IaC files may be executable or applyable.
- **NO** cloud resources may be defined or instantiated.
- **NO** environments may be created or provisioned.

## 3. IaC Tooling Selection
Exactly one primary IaC tool is selected and authorized for use in subsequent phases:
- **Tool:** OpenTofu
- **Justification:** Open-source, vendor-neutral infrastructure orchestration that aligns with the platform's commitment to avoiding proprietary lock-in while maintaining industry-standard syntax and provider support.

## 4. Conceptual Repository Structure
The IaC repository structure is authorized conceptually as follows:

### 4.1 Modules vs. Environments
- **Modules Folder:** Contains reusable, versionable, and generic infrastructure components.
- **Environments Folder:** Contains environment-specific configurations that call upon modules.
- **Separation of Concerns:** Modules define "how" something is built; environments define "what" is built and for whom.

### 4.2 Module Philosophy
- **Small and Focused:** Modules must be granular and focused on a single responsibility.
- **Explicit Inputs/Outputs:** All dependencies and exports must be explicitly declared.
- **Single Responsibility:** A module should represent a single logical unit of infrastructure (e.g., a network boundary, a persistence cluster).

### 4.3 Environment Composition Rules
- **No Inheritance:** Environments must not inherit configuration from one another.
- **No Promotion:** Resources are not "promoted" from one environment to another; they are declared independently using shared modules.
- **Isolation:** Each environment's declaration must be completely self-contained.

## 5. Conceptual State Model
The concept of remote state is authorized as follows:
- **State as Metadata:** State is a conceptual metadata layer that tracks the relationship between declarations and reality.
- **Remote State Requirement:** All environments must use a remote state mechanism (conceptually) to ensure consistency and collaboration.
- **No Implementation:** Selection of state backends (S3, GCS, etc.) is NOT authorized in this phase.

## 6. Architectural Invariants
- **Isolation:** Environment state and declarations must be logically and physically isolated.
- **Determinism:** IaC declarations must be deterministic; the same input must always produce the same conceptual output.
- **Safety-First:** The architecture must prioritize the prevention of accidental cross-environment contamination.

## 7. Explicit Prohibitions
The following are **STRICTLY FORBIDDEN** in Phase J.5:
- **Provider Binding:** No specific provider blocks (AWS, GCP, Azure) may be configured.
- **Real Resources:** No real infrastructure resources (VMs, VPCs, DBs) may be defined.
- **Execution:** No `init`, `plan`, or `apply` operations are authorized.
- **Backends:** No specific remote state backend configuration (e.g., bucket names, DynamoDB tables).
- **Credentials:** No IAM keys, service account tokens, or provider credentials.
- **Regions/Accounts:** No selection of specific cloud regions or account IDs.

## 8. Phase Boundaries
Advancement beyond J.5 is strictly controlled:
- **Phase J.6** is REQUIRED before any provider configuration, state backends, account selection, or regional assignments.
- **Phase J.7** is REQUIRED before any real resources are defined or applyable plans are generated.

## 9. Lock Statement
**Phase J.5 is hereby LOCKED as the authorized architecture for Infrastructure-as-Code.**
