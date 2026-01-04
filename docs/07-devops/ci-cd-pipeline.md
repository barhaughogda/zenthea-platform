# CI/CD Pipeline

## Purpose

This document defines the CI/CD pipeline strategy for the platform.

It explains:
- What checks run on every change
- How services and apps are built and deployed independently
- How AI evaluations are integrated
- How security and compliance gates are enforced
- How promotions and rollbacks work

This document answers the question: **“How do we ship continuously without regressions, drift, or hidden risk?”**

---

## Pipeline Principles

All pipeline decisions follow these principles:

- Fast feedback for developers
- Strict gates for production
- Reproducible builds
- Deterministic tests
- AI behavior is evaluated, not assumed
- Security checks are mandatory

The pipeline is part of the platform contract.

---

## Pipeline Stages Overview

The CI/CD pipeline is organized into these stages:

1. Pre-merge validation (pull requests)
2. Build and test (main branch)
3. Staging deployment and verification
4. Production deployment and monitoring
5. Rollback and incident workflow

Each stage is explicit and independently observable.

---

## Stage 1: Pre-Merge Validation

Runs on every pull request.

### Required Checks

- Lint
- Format check
- Typecheck
- Unit tests
- Dependency rule enforcement
- Basic security scanning
- Documentation checks (if docs changed)

Rules:
- A PR cannot merge if any required check fails
- Checks must run in parallel where possible
- Results must be visible and reviewable

---

### Monorepo Optimization

The pipeline should use monorepo tooling to run only affected tasks.

Examples:
- Only build and test changed projects
- Only run service tests for changed services
- Only run frontend tests for changed apps

This keeps velocity high without reducing safety.

---

## Stage 2: Build and Test on Main

Runs on every merge to main.

### Required Outputs

- Build artifacts for changed services
- Build artifacts for changed frontends
- Packaged shared libraries

### Required Checks

- Full unit test suite for changed projects
- Integration tests where applicable
- AI evaluation suite for affected AI services
- Schema validation for APIs and events
- Configuration validation

Main must always be deployable.

---

## Stage 3: Staging Deployment and Verification

Staging is production-like and is the safety buffer.

### Deployment Rules

- Deploy only after Stage 2 succeeds
- Deploy changed services and apps independently
- Apply staging configuration and strict policy mode
- Run migrations for affected services

### Verification Checks

- Smoke tests for APIs
- End-to-end critical flow tests
- AI regression tests in staging mode
- Observability verification (logs, metrics, traces present)
- Compliance mode checks if enabled

Staging is where failures should happen, not production.

---

## Stage 4: Production Deployment and Monitoring

Production deployment is controlled and reversible.

### Deployment Strategies

Allowed strategies:
- Canary release
- Tenant-scoped rollout
- Gradual traffic shifting

Rules:
- Deploy services independently
- Deploy frontends independently
- Keep deployments small and frequent

---

### AI Configuration Deployment

AI behavior changes may happen via config.

Rules:
- Prompt version changes must be gated
- Model upgrades must be staged and evaluated
- Tool availability changes must be auditable
- Rollback must be immediate via config

AI config changes must produce observability signals.

---

### Production Gates

Before production deploy:
- Staging must be green
- Security scans must be clean
- AI evals must not regress beyond thresholds
- Migration plan must be safe and reversible

If any gate fails, production deploy is blocked.

---

## Stage 5: Rollback and Incident Workflow

Rollback must be fast.

### Rollback Types

- Code rollback: revert deployment artifact
- Config rollback: revert runtime config (especially AI)
- Feature flag rollback: disable capability

Rules:
- Rollbacks are treated as first-class pipeline actions
- Rollback actions are logged and auditable
- Post-incident review is required

---

## AI Evaluation in CI/CD

AI services must have evaluation suites.

Evaluations include:
- Golden input/output tests
- Schema and policy compliance tests
- Hallucination and safety checks
- Cost and latency regression checks

Rules:
- AI evals run on PRs for affected services
- Full evals run before production promotion
- Eval thresholds are explicit and versioned

AI behavior drift is treated as a regression.

---

## Security and Compliance Gates

Security checks are mandatory.

Minimum security checks:
- Dependency vulnerability scanning
- Secrets detection
- Static analysis
- Configuration validation

In regulated modes:
- Vendor allowlist enforcement
- Logging and redaction verification
- Audit event generation checks

Security failures block promotion.

---

## Artifact Strategy

Artifacts must be:
- Immutable
- Versioned
- Traceable to commits
- Signed or integrity-checked where possible

Each artifact must include metadata:
- Commit SHA
- Build timestamp
- Environment target
- Dependency snapshot or lockfile hash

---

## Documentation Gates

Docs are part of the platform.

Rules:
- Docs changes require passing markdown validation
- ADR changes require review
- Service contract changes require docs updates

If docs and code diverge, the system becomes unsafe.

---

## Observability Requirements for the Pipeline

The pipeline must emit:
- Build and test results
- Deployment outcomes
- Rollout progression
- Error rates and regressions
- AI cost and latency signals

Pipeline observability prevents silent failures.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Manual production deployments without logging
- Skipping AI evaluations to “move fast”
- Deploying without staging verification
- Environment-specific hacks in code
- Undocumented pipeline steps

These patterns create hidden risk.

---

## Summary

The CI/CD pipeline ensures that:
- Every change is validated
- Deployments are incremental and safe
- AI behavior is tested and observable
- Security and compliance are enforced
- Rollbacks are immediate and auditable

Ship fast, but never blind.