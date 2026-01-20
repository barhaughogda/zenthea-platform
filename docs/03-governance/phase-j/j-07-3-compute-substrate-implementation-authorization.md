# Phase J.7.3: Compute Substrate Implementation Authorization

**Status:** AUTHORIZED AND LOCKED  
**Phase:** J.7.3  
**Mode:** EXECUTABLE INFRASTRUCTURE AUTHORIZATION (LIMITED)

## 1. Purpose
- Authorize the MINIMUM executable compute substrate required to run application workloads later.
- This phase establishes COMPUTE ONLY.
- No application services are deployed.

## 2. Dependencies
- Phase J.7.2 must be COMPLETE and LOCKED.
- Remote state backend from J.7.1 MUST be used.
- Networking substrate from J.7.2 MUST already exist.

## 3. Authorized Resources (ONLY)
- Compute platform: ECS on Fargate.
- Cluster definition (empty, no services/tasks).
- Base execution IAM roles for compute runtime ONLY.
- Internal-only load balancing primitives IF REQUIRED.
- Security groups strictly scoped to compute substrate.

## 4. Explicit ProHIBITIONS (MANDATORY)
- No application services, tasks, or containers.
- No databases or persistence layers.
- No secrets management (Secrets Manager, Parameter Store).
- No certificates or TLS.
- No public ingress.
- No CI/CD pipelines.
- No logging, tracing, or metrics.
- No environment variables or runtime configuration.
- No PHI or PII.
- No cross-environment or cross-account compute.
- No autoscaling policies beyond minimum safety defaults.

## 5. Execution Rules
- Executable IaC is authorized ONLY for listed compute substrate.
- Implementations MUST be deterministic and idempotent.
- Fail-closed on missing state, missing roles, or ambiguous configuration.
- Explicit naming and tagging required.
- No concrete identifiers (account IDs, ARNs) may appear in the document.

## 6. Safety & Compliance Invariants
- GDPR-safe by construction (no data).
- Least privilege IAM.
- Network isolation enforced.
- Full reversibility (resources can be destroyed safely).

## 7. Acceptance Checklist
- [ ] Only compute substrate resources are defined.
- [ ] No workloads are deployed.
- [ ] No public exposure exists.
- [ ] State backend and locking enforced.
- [ ] Zero non-governance files modified.

## 8. Phase Boundary
- J.7.3 authorizes COMPUTE SUBSTRATE ONLY.
- J.7.4 is required before:
  - Application services
  - Databases
  - Secrets
  - Certificates
  - Public ingress
  - Runtime configuration

## 9. Lock Statement
- This phase is AUTHORIZED AND LOCKED.
- Any deviation requires a new governance phase.
