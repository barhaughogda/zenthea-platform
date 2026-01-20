# Phase J.4.3 – Infrastructure Modeling Authorization

## 1. Purpose
The purpose of Phase J.4.3 is to authorize the conceptual infrastructure primitives that may exist within the Zenthea Platform.
- This phase defines **WHAT** infrastructure primitives are authorized to exist.
- This phase explicitly does **NOT** define **HOW** they are provisioned.
- This phase does **NOT** authorize any implementation, deployment, or execution.
- This phase is **DESIGN-ONLY**.

## 2. Authorized Conceptual Models
Only the following conceptual models are authorized for design during this phase:

### 2.1 Environment Topology
- **Exactly three environments:** `local`, `staging`, and `production`.
- **Absolute isolation:** Environments must be logically and physically separated.
- **No shared resources:** No shared networks, databases, or secrets across environments.
- **No promotion mechanics:** Promotion workflows or mechanics are not authorized in this phase.

### 2.2 Network Model (Conceptual)
- **Primary Boundary:** One primary network boundary per environment.
- **Private-by-Default:** All infrastructure components are private by default.
- **Segmented Boundaries:** Separation between ingress, runtime, and persistence.
- **Strict Constraint:** NO CIDRs, NO routing tables, and NO Availability Zone (AZ) counts are authorized.

### 2.3 Compute Model
- **Process Type:** Long-lived service processes.
- **Runtime State:** Stateless runtime services.
- **Scaling:** Horizontal scalability as a concept only.
- **Strict Constraint:** NO orchestration (e.g., K8s/ECS), NO instance sizing, and NO machine specifications.

### 2.4 Persistence Model
- **Primitive:** Managed PostgreSQL is the **ONLY** authorized persistence primitive.
- **Logical Writer:** Single logical writer per logical database instance.
- **Access Pattern:** Access strictly via persistence adapters as defined in Phase J.3.
- **Strict Constraint:** NO replicas, NO sharding, and NO cross-region replication are authorized.

### 2.5 Ingress & Load Balancing (Conceptual)
- **Boundary:** Single ingress boundary per environment.
- **Responsibility:** Load balancing is authorized as a conceptual responsibility for traffic distribution.
- **Termination:** TLS termination is owned by the infrastructure layer.
- **Strict Constraint:** NO specific load balancer (ALB/NLB) or API Gateway decisions are authorized.

### 2.6 Configuration & Secrets Boundary (Reference Only)
- **Boundary Separation:** The configuration boundary must be distinct from the runtime environment.
- **Secret Separation:** The secrets boundary must be distinct from the configuration boundary.
- **Strict Constraint:** NO secret managers have been selected; NO key hierarchies or rotation policies are authorized.

## 3. Explicitly Forbidden Actions and Artifacts
The following are **STRICTLY FORBIDDEN** in Phase J.4.3:
- **Infrastructure-as-Code (IaC):** Use of Terraform, OpenTofu, CDK, Pulumi, or CloudFormation.
- **Provider Structure:** Any cloud account structure or organization hierarchy.
- **Regional Selection:** Any specific region or Availability Zone (AZ) selection.
- **Sizing & Costing:** Any cost modeling, sizing estimates, or resource allocations.
- **Security Policies:** Authoring IAM roles, security groups, or firewall rules.
- **Delivery Pipelines:** CI/CD pipeline definitions or automation logic.
- **Orchestration Platforms:** Any decisions regarding Kubernetes, ECS, or EKS.
- **Observability:** Selection of observability or monitoring tooling.
- **Naming Conventions:** Provider-specific resource naming or tagging.
- **Technical Diagrams:** Diagrams containing ports, arrows, or CIDR blocks.

## 4. Architectural Invariants
- **Absolute Environment Isolation:** Environment boundaries are non-porous.
- **Stateless Runtime:** Runtime components must not persist state locally.
- **Centralized Persistence:** Persistence is centralized and managed by the infrastructure.
- **Singular Ingress:** All external traffic enters via a singular, controlled boundary.
- **Semantic Neutrality:** Infrastructure choices must not affect the semantics of the runtime execution.
- **Portability via Discipline:** System portability is achieved through strict discipline and boundary enforcement, not through infrastructure abstraction.

## 5. Phase Boundaries and Advancement
- **Phase J.5** is REQUIRED before any Infrastructure-as-Code (IaC) is written.
- **Phase J.6** is REQUIRED before any secrets or environment wiring occurs.
- **No deployment or execution** is authorized in J.4.3.

## 6. Lock Statement
**Phase J.4.3 is hereby LOCKED.**
