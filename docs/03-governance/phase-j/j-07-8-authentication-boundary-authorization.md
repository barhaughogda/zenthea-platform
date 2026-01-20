# Phase J.7.8 — Authentication Boundary Authorization

## 1. Purpose
- Define where authentication begins and ends in the platform
- Establish authentication as a boundary concern, not business logic
- Preserve deterministic, fail-closed execution guarantees

## 2. Authorized Scope

### 2.1 Authentication Boundary Definition
Authorize:
- Authentication strictly at the transport layer
- Authentication evaluated before any service-layer invocation
- Exactly one authentication decision per request

Explicitly forbid:
- Authentication inside services
- Authentication inside persistence
- Re-authentication or chained auth checks

### 2.2 Authentication Inputs
Authorize:
- Authentication tokens supplied via HTTP headers only
- Explicit tenant context required (no inference)

Explicitly forbid:
- Cookies
- Query parameters
- Session-based authentication
- Implicit tenant resolution

### 2.3 Authentication Outputs
Authorize:
- Creation of an AuthorityContext object on success
- Downstream propagation only (transport → service)

Explicitly forbid:
- Mutation of AuthorityContext
- Storage of AuthorityContext
- Caching of authentication results

### 2.4 Failure Semantics
Mandate:
- Fail-closed behavior on missing, invalid, expired, or ambiguous credentials
- No partial success states

## 3. Security & Privacy Constraints
Mandate:
- No PHI or PII in authentication configuration
- No logging of credentials or tokens
- Error responses must not reveal authentication internals

## 4. Explicitly Forbidden (Hard Boundaries)
Explicitly forbid:
- Identity provider selection (OIDC, Cognito, Auth0, etc.)
- Token formats (JWT, opaque tokens, etc.)
- Key management or secrets storage
- Refresh flows or MFA
- User lifecycle management
- Authorization logic (RBAC, ABAC, scopes)
- Any executable code
- Any IaC

## 5. Required Artifacts
- EXACTLY ONE governance document
- NO executable code
- NO configuration files
- NO provider-specific identifiers

## 6. Phase Boundary and Lock
- Phase J.7.8 defines where authentication lives, not how it works
- Concrete identity providers require a future Phase J.8.x
- This phase is DESIGN-ONLY and LOCKED
