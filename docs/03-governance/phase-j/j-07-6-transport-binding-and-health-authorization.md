# Phase J.7.6 — Transport Binding and Health Checks Authorization

## 1. Purpose
- Authorize the first controlled runtime binding of the HTTP transport to the application runtime substrate authorized in Phase J.7.4.
- Authorize health and readiness signaling as runtime safety mechanisms.
- Maintain fail-closed, deterministic execution guarantees.

## 2. Authorized Scope

### 2.1 Transport Binding
Authorize, for EXACTLY ONE transport:
- `packages/transport-http/clinical-note-authoring/`

Authorize:
- Binding Fastify to a configured port.
- Starting a single HTTP server process per runtime unit.
- Explicit startup and graceful shutdown lifecycle handling.

### 2.2 Service Wiring
Authorize:
- Wiring ONLY to the Clinical Note Authoring Service.
- No direct imports or calls to persistence adapters.
- No domain logic inside transport beyond DTO validation and error mapping.

### 2.3 Configuration Usage
Authorize:
- Reading configuration exclusively via environment variables and runtime injection as defined in Phase J.7.5.
- Mandatory startup validation of all required configuration.
- Fail-closed startup if configuration is missing or invalid.
- NO default values for safety-critical configuration.

### 2.4 Health Checks
Authorize EXACTLY:
- GET /health (liveness): process-level only, no dependencies.
- GET /ready (readiness): returns ready ONLY if:
  - Configuration validation completed successfully.
  - Transport router initialized.
  - Service dependency injection completed.

Explicitly FORBID:
- Database checks
- Network calls
- External dependency checks

### 2.5 Response & Security Rules
Mandate:
- Health responses MUST NOT include PHI, PII, secrets, stack traces, or internal identifiers.
- Responses must be deterministic and non-sensitive.

## 3. Explicitly Forbidden (Hard Boundaries)
Explicitly forbid:
- Persistence connectivity checks
- Migrations execution
- AWS SDK calls from application runtime
- New business endpoints
- Authentication systems beyond existing AuthorityContext enforcement
- Public ingress, TLS termination, DNS, load balancers
- Observability pipelines (metrics, tracing)
- Background jobs, queues, cron, or workers

## 4. Required Artifacts
- EXACTLY ONE governance document (this file)
- NO executable code changes

## 5. Acceptance Checklist
- [ ] Scope containment: Only `packages/transport-http/clinical-note-authoring/` is authorized for transport.
- [ ] Non-sensitive health responses: Health and readiness responses are deterministic and leak no identifiers.
- [ ] No persistence or network readiness checks: Readiness is strictly local to the process lifecycle and configuration state.
- [ ] Configuration rules preserved: All configuration is validated at startup; missing config leads to immediate termination.
- [ ] No ingress or TLS authorization: This phase authorizes the runtime binding only, not external network exposure.

## 6. Phase Boundary and Lock
- Phase J.7.6 is hereby AUTHORIZED and LOCKED.
- Subsequent phases are required for ingress authorization, external exposure, or integration with external network infrastructure.
