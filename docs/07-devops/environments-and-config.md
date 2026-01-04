# Environments and Configuration

## Purpose

This document defines how environments and configuration are managed across the platform.

It explains:
- The environment model and guarantees
- How configuration is structured and loaded
- How secrets are handled safely
- How AI configuration is governed
- How compliance and tenant-specific settings are enforced

This document answers the question: **“How do we change behavior safely across environments without redeploying chaos?”**

---

## Environment Model

The platform uses a fixed set of environments:

- Local
- Dev
- Staging
- Production

Rules:
- Every service and frontend supports all environments
- Environments behave the same, with different strictness
- Production is never “special-cased” in code

Environment parity is mandatory.

---

## Environment Guarantees

Each environment guarantees:

### Local
- Fast feedback
- Developer overrides allowed
- Mocked or sandboxed external dependencies

### Dev
- Shared environment
- Real integrations where possible
- Relaxed rate and cost limits

### Staging
- Production-like configuration
- Strict policy enforcement
- Real integrations
- Used for validation and sign-off

### Production
- Strictest security and compliance
- Locked configuration
- Full observability
- No experimental behavior

If something only works in production, it is broken.

---

## Configuration Categories

Configuration is split into four explicit categories.

### 1. Build-Time Configuration

Used only during build.

Examples:
- Feature toggles for bundling
- Framework-specific build flags

Rules:
- Build-time config must not affect runtime behavior
- Build-time config must not contain secrets

---

### 2. Runtime Configuration

Controls behavior at runtime.

Examples:
- API base URLs
- Feature flags
- AI model selection
- Prompt versions
- Tool availability

Rules:
- Runtime config is environment-scoped
- Runtime config is auditable
- Runtime config can change without code deployment

---

### 3. Secrets

Secrets include:
- API keys
- Credentials
- Tokens
- Certificates

Rules:
- Secrets are never stored in code
- Secrets are injected at runtime
- Secrets are rotated regularly
- Access to secrets is logged

Secrets leakage is a critical incident.

---

### 4. Policy Configuration

Policy configuration defines what is allowed.

Examples:
- Compliance mode (for example HIPAA)
- Vendor eligibility
- Data retention rules
- AI budget limits

Policy config overrides other configuration.

---

## Configuration Loading Rules

Configuration loading must follow a strict order:

1. Defaults (safe, minimal)
2. Environment-specific config
3. Tenant-specific overrides
4. Runtime feature flags

Rules:
- Later layers override earlier ones
- All overrides are explicit
- No implicit environment detection logic

Configuration resolution must be deterministic.

---

## Service Configuration Structure

Each service must define a configuration schema.

Typical structure:

- Service settings
- AI runtime settings
- Compliance flags
- Feature flags
- Limits and thresholds

Rules:
- Configuration is typed and validated at startup
- Invalid config fails fast
- Unknown config keys are rejected

---

## Frontend Configuration Structure

Frontends support runtime configuration for:

- API endpoints
- Feature flags
- Compliance-related UI behavior
- Tenant-specific branding

Rules:
- Frontends must not receive secrets
- Sensitive config must be handled server-side
- Frontend config must be minimal

---

## AI Configuration Governance

AI behavior is controlled via configuration, not code.

Configurable elements include:
- Model provider and version
- Prompt versions per layer
- Tool availability
- Cost and rate limits
- Fallback behavior

Rules:
- AI config changes are auditable
- AI config changes are reversible
- AI config changes may be tenant-scoped
- AI config changes must not bypass policy

AI config drift is a defect.

---

## Feature Flags

Feature flags are used for:
- Gradual rollouts
- Experimental features
- Tenant-specific behavior
- Kill switches

Rules:
- Flags must be documented
- Flags must have an owner
- Flags must be removed when obsolete

Permanent flags are technical debt.

---

## Tenant-Specific Configuration

Tenants may have scoped configuration.

Examples:
- Enabled services
- AI budgets
- Approved integrations
- Branding and theming

Rules:
- Tenant config must not break shared behavior
- Tenant config must be auditable
- Defaults must be safe

Tenant overrides are configuration, not forks.

---

## Compliance Mode Configuration

Compliance modes (for example HIPAA) are enforced via config.

Rules:
- Compliance mode is explicit
- Compliance mode affects AI, vendors, logging, and UI
- Compliance mode cannot be partially enabled

If compliance mode is on, it is on everywhere.

---

## Secrets Management Strategy

Secrets must be managed via a secure secrets manager.

Rules:
- No secrets in Git
- No secrets in logs
- No secrets in frontend code
- Secret access is role-based

Local development uses sandbox secrets only.

---

## Configuration Validation and Testing

Configuration must be validated.

Requirements:
- Schema validation at startup
- Tests for critical config combinations
- Smoke tests per environment
- Validation of AI config before promotion

Misconfiguration must fail fast.

---

## Configuration Changes and Auditability

All configuration changes must be auditable.

This includes:
- Who changed what
- When it changed
- Why it changed
- What environments were affected

Configuration without audit is not acceptable.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Environment-specific logic in code
- Hidden defaults
- Secrets in environment files committed to Git
- Runtime mutation of configuration
- Undocumented flags

If it cannot be explained, it should not exist.

---

## Summary

The environment and configuration strategy ensures:
- Predictable behavior across environments
- Safe and auditable AI control
- Strong separation of secrets and config
- Enforceable compliance and tenant isolation

Configuration is treated as code, but safer.

All services and frontends must adhere to this model.