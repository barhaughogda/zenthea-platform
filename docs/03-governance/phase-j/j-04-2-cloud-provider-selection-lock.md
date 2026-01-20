# Phase J.4.2 – Cloud Provider Selection Lock

## 1. Purpose
This phase irreversibly locks which cloud providers are permitted execution targets for the Zenthea Platform.
- This phase answers **WHERE** the system may run, not **HOW** it is provisioned.
- This phase is **DESIGN-ONLY**. No infrastructure is provisioned, and no execution is authorized during this phase.

## 2. Cloud Provider Selection
### 2.1 Primary Provider: AWS
- **Amazon Web Services (AWS)** is hereby designated as the **PRIMARY** and **FIRST-CLASS** cloud provider.
- AWS is the reference execution environment for all Zenthea Platform components.
- AWS documentation and service behaviors serve as the authoritative semantic reference for infrastructure expectations.

### 2.2 Secondary Provider (Exit Option): GCP
- **Google Cloud Platform (GCP)** is optionally recognized as a **FUTURE EXIT OPTION ONLY**.
- This designation is for long-term strategic de-risking and does not authorize active development or deployment.
- **Strict Constraints on Secondary Provider:**
  - No abstraction layers (multi-cloud wrappers) are authorized.
  - No parity requirements exist; the system is optimized for AWS.
  - No multi-cloud tooling or cross-provider management plane is permitted.

## 3. Authorized Conceptual Categories
The following concepts are authorized for architectural design only:
- Provider account and organization boundary concepts.
- Region and Availability Zone (AZ) topological concepts.
- Managed PostgreSQL database concepts (e.g., RDS/Cloud SQL).
- Load balancing and traffic distribution concepts.
- Network isolation and private connectivity concepts (VPC-like).

## 4. Explicitly Forbidden Actions and Artifacts
The following are **STRICTLY FORBIDDEN** in Phase J.4.2:
- **Infrastructure-as-Code (IaC):** Writing or committing Terraform, OpenTofu, CDK, Pulumi, or CloudFormation.
- **Provider SDKs:** Integration of AWS or GCP SDKs into executable code.
- **Resource Provisioning:** Actual account creation or manual service provisioning.
- **Specific Allocations:** Final selection of specific regions or CIDR blocks.
- **Financial Modeling:** Cost modeling, sizing estimates, or budget commitments.
- **Security Policy Authoring:** Writing IAM policies, Service Control Policies (SCPs), or security group rules.
- **Technical Diagrams:** Detailed networking or wiring diagrams.
- **Container Orchestration:** Making final Kubernetes (EKS/GKE) or ECS decisions.
- **Abstractions:** Use of "provider-agnostic" libraries or multi-cloud wrappers intended to hide provider-specific semantics.

## 5. Architectural Invariants
- **Single-Provider-First:** Design must leverage the full capabilities of AWS without artificial constraints imposed by hypothetical portability.
- **No Lowest-Common-Denominator:** Architecture shall not be restricted to features common across multiple providers.
- **Portability via Discipline:** Portability is achieved through strict adherence to Phase J.3 (Runtime Execution) boundaries, not through infrastructure abstraction.
- **Sovereignty of Runtime:** Provider choice must not affect runtime semantics. Phase J.3 remains the sovereign definition of application behavior.

## 6. Phase Boundaries and Advancement
- **Phase J.4.3** is REQUIRED before any Infrastructure-as-Code (IaC) is written.
- **Phase J.5** is REQUIRED before any secrets management or environment wiring occurs.
- No software execution or infrastructure deployment is authorized in J.4.2.

## 7. Lock Statement
**Phase J.4.2 is hereby LOCKED.**
Any deviation from the providers or constraints specified herein requires a new Phase J.x governance authorization.
