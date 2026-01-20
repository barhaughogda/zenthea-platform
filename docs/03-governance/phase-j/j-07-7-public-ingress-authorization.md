# Phase J.7.7 — Public Ingress Authorization

## 1. Purpose
- Authorize the first controlled public exposure of the application runtime.
- Establish ingress as a strictly bounded infrastructure concern.
- Preserve fail-closed, deterministic execution guarantees.

## 2. Authorized Scope

### 2.1 Ingress Layer
Authorize EXACTLY ONE ingress class:
- Managed cloud L7 HTTP/S load balancer

Authorize:
- External HTTP/S traffic routed to the runtime substrate authorized in Phase J.7.4.
- Traffic routed exclusively to the transport bound in Phase J.7.6.
- Single ingress entry point per environment.

Explicitly forbid:
- Multiple ingress paths
- East–west routing
- Service meshes
- API gateways with transformation logic

### 2.2 TLS Termination
Authorize:
- TLS termination at the ingress layer only
- Managed certificates only
- HTTPS enforced with redirect from HTTP

Explicitly forbid:
- Application-level TLS
- Certificate or key handling in application code

### 2.3 Network Exposure Rules
Authorize:
- Public ingress to HTTP transport only
- Explicit static port mapping

Explicitly forbid:
- Direct exposure of containers or tasks
- SSH, admin ports, or non-HTTP protocols
- Ingress to persistence layers or internal services

### 2.4 Request Flow Constraints
Mandate:
- ingress → transport → service layer request flow
- No bypass paths

Ingress MUST NOT:
- Perform authentication or authorization
- Mutate requests beyond TLS and routing
- Inspect or log request bodies

### 2.5 Security & Privacy Guarantees
Mandate:
- No PHI or PII at ingress configuration level
- No request/response logging beyond minimal access metadata
- Fail-closed behavior if ingress configuration is invalid or incomplete

## 3. Explicitly Forbidden (Hard Boundaries)
Explicitly forbid:
- WAF or threat detection rules
- Rate limiting or throttling
- DDoS mitigation configuration
- Identity providers or API keys
- Observability pipelines
- CDN integration
- Any executable IaC
- Provider-specific identifiers

## 4. Required Artifacts
- EXACTLY ONE governance document (this file)
- NO executable code
- NO IaC
- NO environment-specific identifiers

## 5. Phase Boundary and Lock
- Phase J.7.7 authorizes public ingress ONLY
- Authentication, authorization, protection, and traffic shaping require subsequent phases
- This phase is hereby AUTHORIZED and LOCKED
