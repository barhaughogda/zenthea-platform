# Observability Package (`@starter/observability`)

## Purpose
The `@starter/observability` package provides the unified telemetry and monitoring primitives required to understand system behavior. It ensures that every action is traceable, measurable, and auditable.

## Responsibilities
- **Structured Logging**: Provides standard interfaces for JSON logging with mandatory correlation and tenant context.
- **Metric Emission**: Defines the standard metrics for traffic, errors, latency, cost, and AI token usage.
- **Distributed Tracing**: Implements the hooks and propagation logic for end-to-end request tracing.
- **AI Tracing Hooks**: Specializes in capturing AI-specific metadata like prompt versions, tool calls, and model providers.
- **Compliance Auditing**: Provides the base for tamper-resistant logs and audit events for sensitive actions.

## Explicit Non-Goals
- **Log Storage/Aggregation**: This package emits signals; it does not store or search them (e.g., it is not a database).
- **Dashboarding & Alerting**: Monitoring configuration lives in the DevOps infrastructure, not in this package.
- **Business Logic**: Observability is a cross-cutting concern, not a domain rule implementation.
- **PII/PHI Management**: This package provides the *mechanism* for redaction, but the orchestration layer must decide *what* to redact.
