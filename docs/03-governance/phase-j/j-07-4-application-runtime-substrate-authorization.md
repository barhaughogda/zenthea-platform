# Phase J.7.4: Application Runtime Substrate Authorization

**Status:** AUTHORIZED AND LOCKED  
**Phase:** J.7.4  
**Mode:** DESIGN + EXECUTION AUTHORIZATION

## 1. Purpose
- Authorize the creation of ECS Task Definitions and ECS Services for application runtime.
- Establish the execution boundary between infrastructure substrate and application logic.
- Confirm this phase is the FIRST time application containers are allowed to run, strictly limited to infrastructure-level runtime concerns.

## 2. Authorized Scope (Explicit)
Authorize ONLY the following:
- **ECS Task Definitions (Fargate)**
  - CPU and memory sizing.
  - Runtime platform (Fargate).
  - Container definition skeleton (image may be placeholder or non-production).
  - Port declarations.
  - Container-level health checks.
  - CloudWatch Logs driver wiring (basic logs only).
- **ECS Services**
  - Desired count.
  - Deployment strategy and circuit breaker.
  - Attachment to existing clusters, subnets, and security groups from Phase J.7.3.
  - PRIVATE networking only (no public IPs).
- **Service Discovery**
  - Optional internal-only service discovery (Cloud Map private namespace OR none).

## 3. Explicitly Forbidden (Mandatory)
The following are STRICTLY FORBIDDEN in Phase J.7.4:
- Public ingress of any kind (ALB, NLB, API Gateway, CloudFront, public DNS).
- Persistence layers (RDS, Aurora, DynamoDB, S3 for app data).
- Secrets or configuration systems (Secrets Manager, SSM Parameter Store, KMS usage).
- Consumption of real runtime configuration (DATABASE_URL, tenant config, credentials).
- Deployment of application logic, domain routes, transport handlers, or services.
- CI/CD pipelines, build systems, or image publishing workflows.
- Observability systems beyond basic CloudWatch Logs.
- Cross-account or multi-region complexity.

## 4. Environment & Isolation Rules
- Must support environment-level namespacing (staging vs production).
- No concrete identifiers (account IDs, ARNs, regions, names) may appear in this document.
- All resources must remain within previously locked account and region boundaries.

## 5. Acceptance Criteria (Must be Testable)
- Infrastructure can be planned, applied, and destroyed independently.
- Running ECS tasks exist in private subnets with no public IPs.
- Logs are emitted to CloudWatch Logs.
- Destroy removes ONLY J.7.4 resources without impacting J.7.0–J.7.3.
- No drift introduced into existing state.

## 6. Phase Boundaries
- Phase J.7.4 authorizes runtime substrate ONLY.
- Phase J.7.5 or later is required for:
  - Secrets injection.
  - Persistence wiring.
  - Public ingress.
  - Application traffic.
  - CI/CD enablement.

## 7. Lock Statement
- Phase J.7.4 is AUTHORIZED AND LOCKED.
- No expansion beyond this scope is permitted without a new governance phase.
