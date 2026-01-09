# UI → Service Adapter

## Purpose
This package defines the explicit, non-behavioral boundary between User Interface surfaces and backend Domain Services. It ensures that UIs interact with services through a strictly defined contract that supports governance, auditability, and non-cacheability.

## Responsibility
- Define the shape of data crossing the UI-Service boundary.
- Ensure all service interactions are explicitly typed.
- Support fail-closed governance at the entry point.

## Non-Goals
- No implementation of service logic.
- No data fetching or HTTP client logic.
- No UI components or state management.
- No imports from `apps/` or `services/`.
- No side effects.
