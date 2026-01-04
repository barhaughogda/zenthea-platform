# Auth Package (`@starter/auth`)

## Purpose
The `@starter/auth` package centralizes identity management and access control primitives across the platform. It ensures that every request is authenticated and authorized according to the platform's Zero Trust model.

## Responsibilities
- **Identity Primitives**: Defines the standard identity types (User, Service, AI Context) used across the system.
- **Authentication Logic**: Provides helpers for token verification, session management, and identity extraction.
- **Authorization Enforcement**: Implements RBAC/ABAC primitives for checking permissions at service and tool boundaries.
- **Identity Propagation**: Ensures authentication context flows correctly through the distributed system.
- **Security Defaults**: Enforces "deny by default" and least-privilege access patterns.

## Explicit Non-Goals
- **User Profile Storage**: This package handles identity; user profile data belongs to the user domain within a backend service.
- **UI Components**: Login screens and UI widgets belong in `@starter/ui` or specific apps.
- **Business Rules**: Permission checks are security-focused, not business-rule-focused.
- **Credential Storage**: No passwords or secrets are stored here. It relies on secure secret management systems.
- **AI Execution Logic**: Auth governs *who* can run AI, not *how* the AI runs.
