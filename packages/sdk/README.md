# Service SDK Package (`@starter/sdk`)

## Purpose
The `@starter/sdk` package provides the typed interface and communication primitives for interacting with platform services. It acts as the stable contract boundary between frontends and backend services.

## Responsibilities
- **Type-Safe API Clients**: Defines the interfaces and clients for all service endpoints.
- **Contract Enforcement**: Ensures that frontends adhere to the request and response schemas defined by services.
- **Correlation Propagation**: Automatically attaches and manages correlation IDs across service calls for end-to-end observability.
- **Transport Logic**: Handles retries, timeouts, and transport-level error normalization.
- **Authentication Injection**: Provides hooks for injecting authentication tokens into requests (using `@starter/auth`).

## Explicit Non-Goals
- **Business Logic**: SDKs are transport layers; they should not embed domain rules or complex logic.
- **UI Components**: This is a headless package. No React components or styling allowed.
- **AI Reasoning**: SDKs transmit data; they do not perform reasoning or prompt engineering.
- **Direct Database Access**: SDKs only communicate with services via public or internal APIs.
- **State Management**: SDKs do not manage application state beyond the lifecycle of a single request.
