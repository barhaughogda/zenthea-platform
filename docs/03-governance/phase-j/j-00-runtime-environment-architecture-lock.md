# Phase J.0: Runtime & Environment Architecture Lock

## Status
- **Phase**: J.0
- **State**: LOCKED
- **Scope**: Runtime Definition, Environment Boundaries, Configuration Principles
- **Date**: 2026-01-19

## Preconditions Verification
- [x] Current branch is `main`
- [x] Working tree is clean
- [x] Local `main` is aligned with `origin/main` (Local is ahead by 1 lock commit: `gov: lock Phase I transport layer baseline`)
- [x] No feature branches checked out

## 1. Runtime Definition
The "Runtime" for the Zenthea Platform is defined as the immutable execution context in which application services operate. Application code must remain agnostic of the specific environment (local vs. production) beyond receiving standard configuration inputs.

### 1.1 Allowed Environments
- **Local**: Development environment for individual engineers. Uses mock or containerized dependencies.
- **Staging**: Pre-production environment for integration and validation. Mirror of production topology.
- **Production**: Live environment serving actual traffic. Highest level of security and isolation.

### 1.2 Environment Boundaries
- **Strict Isolation**: Environments must not share databases, message queues, or secret providers.
- **Unidirectional Flow**: Configuration flows into the runtime; the runtime does not "reach out" to infer its identity.

## 2. Configuration & Secret Handling
- **Externalization**: All configuration must be provided from outside the application process (Environment Variables or Configuration Files).
- **Secret Management**: Secrets must NEVER be stored in source control, hardcoded, or logged.
- **Fail-Closed Startup**: Services MUST fail to start immediately if required configuration is missing or cryptographically invalid.
- **No Implicit Access**: Applications must not have implicit permissions to environment metadata services unless explicitly configured.

## 3. Locked Invariants
1. **Runtime Agnosticism**: Application code MUST NOT contain logic like `if (env === 'production')`. Behavior is toggled via explicit configuration values only.
2. **Configuration Immutability**: Once a service starts, its core configuration must be treated as immutable. Dynamic mutation of core infrastructure parameters at runtime is prohibited.
3. **No Feature Flags**: Phase J.0 explicitly prohibits feature flag logic within application code. All code paths in the runtime must be deterministic based on the provided configuration.
4. **Separation of Concerns**: Runtime provisioning (Terraform, K8s, etc.) and CI/CD pipelines are strictly OUTSIDE the application domain.

## 4. Forbidden Post-Lock
- Hardcoding secrets or API keys.
- Runtime environment inference (detecting "where am I" via shell commands or metadata).
- Hidden or dynamic configuration overrides that bypass the standard configuration path.
- "Hot-swapping" configuration without process restart.

## 5. Out of Scope for J.0
- Observability, logging, and monitoring architecture (deferred).
- CI/CD pipeline definitions (deferred).
- Specific cloud provider selection or provisioning (deferred).

## 6. Phase Transition
This document completes Phase J.0. Phase J.1 (Runtime Implementation & Validation) is required before any code can be executed in a non-local environment. NO deployment or cloud provisioning is authorized at this stage.
