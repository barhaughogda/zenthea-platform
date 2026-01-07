# Operator UI Adapter (Headless)

## Purpose
This package provides a pure, headless adaptation layer between the Operator Control Plane (CP-14) and any future User Interface. It ensures that UI components consume standardized, safe, and flattened ViewModels rather than raw DTOs.

## Why this package exists
- **Decoupling**: Separates the Control Plane DTOs from UI-specific representation.
- **Security**: Strips sensitive identifiers (PHI, tenantIds, internal cursors) before they reach the UI layer.
- **Normalization**: Pre-computes labels, badges, and risk severities to ensure a consistent look and feel across different UI implementations.
- **Headless Architecture**: Ensures that adaptation logic is platform-agnostic and testable without a DOM or React.

## What it adapts
- `PolicyDto` → `PolicyUiModel`
- `ViewDto` → `ViewUiModel`
- `ExecutionResultDto` → `ExecutionResultUiModel`
- `OperatorAuditDto` → `AuditEventUiModel`

## Explicit Non-Goals
- No rendering or UI components.
- No data fetching or API calls.
- No business logic or permission checks.
- No mutation of input data.

## Security Guarantees
- Zero exposure of internal `tenantId`, `actorId`, or `PHI`.
- Strips internal pagination cursors.
- Only produces serializable ViewModels.

## Relationship
- **CP-14**: Consumes the authoritative DTOs from `@starter/tool-gateway`.
- **CP-16**: Provides the ViewModel foundation for future UI implementation.

## Why it is Headless
By remaining headless, this package can be shared across web, mobile, or CLI interfaces while maintaining a single source of truth for how Operator data should be presented to humans.
