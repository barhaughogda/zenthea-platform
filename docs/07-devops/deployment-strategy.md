# Deployment Strategy

## Purpose

This document defines the deployment strategy for the platform.

It explains:
- How services and apps are deployed independently
- How environments are managed
- How changes are promoted safely
- How AI runtime configuration is deployed and rolled back
- How multi-tenant and regulated deployments are handled

This document answers the question: **“How do we ship continuously without breaking trust, uptime, or compliance?”**

---

## Deployment Principles

All deployment decisions follow these principles:

- Independent deployability
- Safe change promotion
- Fast rollback paths
- Environment parity
- Observability before optimization
- Secure defaults

Deployment is part of the product.

---

## What Gets Deployed

The platform deploys three main artifact types:

- Backend services in `/services`
- Frontend apps in `/apps`
- Shared packages in `/packages` (not deployed directly, but bundled)

Documentation in `/docs` is versioned and shipped via Git, not runtime.

---

## Independent Deployability

Each backend service is independently deployable.

Rules:
- No shared database
- No cross-service imports
- No deployment ordering assumptions
- Stable APIs and events

Each frontend app is independently deployable.

Rules:
- Calls services via SDKs only
- No reliance on other frontend deployments

---

## Environment Model

The platform uses a consistent environment model:

- Local
- Dev
- Staging
- Production

Rules:
- Environment parity is prioritized
- Production settings are strictest
- Changes are promoted forward, not hotfixed in place

---

## Configuration Strategy

### Configuration Types

Configuration is split into:

- Build-time configuration
- Runtime configuration

Rules:
- Build-time config affects bundling only
- Runtime config controls behavior and is environment-scoped
- Secrets are never stored in the repo

---

### AI Runtime Configuration

AI behavior is controlled via runtime configuration, including:
- Model selection and versions
- Prompt versions
- Tool availability
- Cost and rate limits
- Compliance mode flags

AI configuration changes must be:
- Auditable
- Reversible
- Observable

---

## Promotion Strategy

Changes are promoted through environments.

Canonical path:
1. Local
2. Dev
3. Staging
4. Production

Rules:
- Promotion is gated by automated checks
- Staging is production-like
- No manual “it seems fine” promotions

---

## Deployment Units

### Services

Each service deploys as a separate unit:
- Individual build artifact
- Individual runtime config
- Individual scaling settings
- Individual observability

### Frontends

Each frontend deploys as a separate unit:
- Independent build
- Independent release cadence
- Environment-specific config for API base URLs and feature flags

---

## Release Safety Mechanisms

The platform uses multiple safety mechanisms:

- Feature flags
- Canary releases
- Tenant-scoped rollouts
- A/B testing where relevant
- Rapid rollback

For AI behavior changes, tenant-scoped rollouts are strongly preferred.

---

## Rollback Strategy

Rollback must be fast and safe.

Rules:
- Code rollbacks must be possible per service or app
- AI configuration rollbacks must not require code changes
- Rollbacks must be observable

AI rollbacks are especially important due to model and prompt volatility.

---

## CI/CD Requirements

CI/CD is mandatory.

Pipelines must include:
- Lint and typecheck
- Unit tests
- Integration tests
- AI evaluation tests
- Security scans

Production deployment must be blocked if:
- Tests fail
- Evaluations regress materially
- Security checks fail

---

## Database and Migration Strategy

Each service owns its migrations.

Rules:
- Migrations are versioned and reversible where possible
- Migrations run as part of service deployment
- Backward compatibility is maintained during rollout
- No cross-service migration dependencies

Migration failures must fail fast and abort deployment.

---

## Observability as a Deployment Gate

Observability must be present before scaling.

Minimum requirements:
- Structured logs
- Metrics
- Traces
- Error monitoring
- Audit logging for sensitive actions

Deployments that reduce observability are not allowed.

---

## Multi-Tenant Deployment Considerations

Multi-tenancy affects deployment:

- Tenant-scoped config and feature flags
- Tenant-specific rollouts for risky changes
- Per-tenant budgets and rate limits for AI usage

Tenant isolation must remain intact through all deployments.

---

## Regulated Deployment Considerations

For regulated environments (for example HIPAA mode):

Rules:
- Only approved vendors are enabled
- PHI handling constraints are enforced
- Logging is filtered and retention is controlled
- Strict access controls are applied

Regulated deployment configs must be reviewed and locked down.

---

## Summary

The deployment strategy ensures:
- Services and apps ship independently
- Changes are promoted safely
- AI behavior is configurable and reversible
- Compliance modes are enforceable
- Observability supports trust and debugging

Deployment is designed to scale with minimal coordination and maximum safety.