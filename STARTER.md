# AI-Platform Monorepo Starter Kit

This repository is the canonical starter kit for building new products, services, or client applications within the AI-platform-monorepo-starter ecosystem. It provides the architectural foundation, guardrails, and reference implementations required to maintain consistency across the platform.

## What this is
- **Architectural Blueprint**: A pre-configured monorepo following the AI-platform-monorepo-starter Layered Architecture.
- **Guardrail Enforcer**: Includes the core packages (`ai-runtime`, `auth`, `observability`, `sdk`) that enforce platform constraints.
- **Reference Implementation**: Includes example applications (`chat-ui`, `client-demo`) and services (`chat-agent`, `billing`) to demonstrate best practices.
- **Documentation Hub**: Contains the comprehensive platform documentation, ADRs, and build guides.

## What this is NOT
- **A Template for Deletion**: Do not delete the core `packages/` unless you are replacing them with a different platform-approved implementation.
- **A Single-Tenant App**: This is a multi-tenant platform starter by design.
- **A Deployment-Ready App**: This provides the structure, but you must configure your own CI/CD, secrets, and environment-specific parameters.

## How to use it
1. **Duplicate**: Clone or fork this repository to start a new project.
2. **Explore**: Read `docs/00-overview/vision.md` and `docs/01-architecture/layered-architecture.md`.
3. **Learn from Examples**:
   - `apps/chat-ui`: Example Product Frontend.
   - `apps/client-demo`: Example Composition Layer application.
   - `services/chat-agent`: Example AI-driven Domain Service.
   - `services/billing`: Example core platform service.
4. **Build Your First Service**:
   - Follow `docs/08-build-guides/service-build-guide.md`.
   - Use the `services/chat-agent` as a reference.
5. **Build Your First Frontend**:
   - Follow `docs/08-build-guides/frontend-build-guide.md`.
   - Use `apps/chat-ui` as a reference.

## What should NEVER be modified in the starter
- **Core Guardrails**: Any logic that enforces security, compliance, or architectural boundaries.
- **ADRs**: Existing ADRs in `docs/10-decisions/` should be preserved for historical context. New decisions should be added as new ADRs.
- **Folder Structure**: The top-level folder structure (`apps/`, `packages/`, `services/`, `docs/`) must remain intact to ensure tooling compatibility.

## Getting Started
Refer to the root `README.md` for local development setup instructions.
