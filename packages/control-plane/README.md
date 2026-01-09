# Control Plane Boundary

## Responsibility
This package defines the explicit, non-behavioral entrypoints for the Zenthea Platform Control Plane. It serves as the authoritative interface-only boundary that all services and adapters must use to interact with governance, audit, and policy logic.

## Non-Goals
- **No Implementation**: This package MUST NOT contain any behavioral logic.
- **No Framework Coupling**: No dependencies on external frameworks or runtimes.
- **No Policy/Audit Logic**: The actual logic for evaluating policies or storing audits resides elsewhere.
- **No Imports**: This package MUST NOT import from services, adapters, or runtime code.

## Core Interfaces
1. **Policy Evaluation**: Interface for requesting permission decisions.
2. **Audit Emission**: Interface for signaling auditable events.
3. **Controlled Mutations**: Interface for wrapping state changes in governance.
4. **Orchestration Lifecycle**: Interface for signaling the lifecycle of multi-step processes.
