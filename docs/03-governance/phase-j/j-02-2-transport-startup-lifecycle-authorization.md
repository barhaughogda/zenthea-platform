# Phase J.2.2: Transport Startup & Lifecycle Management Authorization

## A) PURPOSE
This artifact authorizes the mechanisms for starting and stopping the HTTP transport layer within the Zenthea Platform. It ensures that the application lifecycle is managed deterministically, securely, and independently of business logic.

- **Authority:** This document authorizes the instantiation, binding, and graceful termination of the transport server.
- **Dependency:** This phase explicitly depends on the validated, immutable `RuntimeConfig` produced and authorized in Phase J.2.1.
- **Scope:** Lifecycle management is strictly defined as a runtime concern, decoupled from domain or service logic.

## B) AUTHORIZED SCOPE
The following actions are formally authorized for implementation:

1.  **Fastify Server Instantiation:** Creation of the Fastify server instance.
2.  **Network Binding:** Binding the server to the network interface and port using the provided `RuntimeConfig`.
3.  **Route Registration:** Registration of HTTP routes strictly via dependency injection of route handlers.
4.  **Deterministic Startup Sequence:**
    - **Bootstrap:** Initialize runtime environment and config (Phase J.2.1).
    - **Server Creation:** Instantiate the transport framework.
    - **Route Registration:** Inject dependencies and map routes.
    - **Listen:** Begin accepting network connections.
5.  **Graceful Shutdown Handling:**
    - Explicit handling of OS signals: `SIGTERM` and `SIGINT`.
6.  **Ordered Shutdown Sequence:**
    - **Stop Accepting:** Cease accepting new incoming requests.
    - **Drain:** Allow in-flight requests to complete within a defined timeout.
    - **Close:** Close the server and release resources (e.g., file descriptors, network ports).
7.  **Exit Codes:** Use of explicit process exit codes (e.g., `0` for clean exit, `1` for startup/runtime failure).

## C) REQUIRED INPUTS
Implementation must use the following inputs via explicit injection:

- **Immutable RuntimeConfig:** Validated configuration from Phase J.2.1.
- **Transport Implementation:** HTTP transport structures defined in Phase I.3.
- **Service Interfaces:** Service layer abstractions defined in Phase H.

**Constraint:** No global variables or hidden state may be used. All inputs must be passed through constructor or factory injection.

## D) FORBIDDEN (EXPLICIT LIMITATIONS)
The following activities are strictly **PROHIBITED** within the scope of this authorization:

- **Configuration Loading/Validation:** Must be performed in Phase J.2.1.
- **Direct Environment Access:** No reading of `process.env` (must use `RuntimeConfig`).
- **Database Operations:** No initialization of database connections or connection pools.
- **Persistence Logic:** No interaction with persistence adapters.
- **Service Orchestration:** No execution of cross-service business flows.
- **Business/Domain Logic:** No implementation of domain rules or logic.
- **Observability:** No logging, metrics, or tracing (authorized in Phase J.2.3).
- **Background Jobs:** No scheduling or execution of background tasks.
- **Feature Flags:** No evaluation of feature toggles.
- **Hot Reload:** No implementation of runtime code swapping or hot-reloading.
- **Runtime Mutation:** No modification of configuration or service state after startup.
- **Health Orchestration:** No complex health checking beyond basic transport liveness.
- **Framework Inference:** No reliance on "magic" auto-wiring or framework-specific inference.

## E) OWNERSHIP & BOUNDARIES
- **Transport Layer Ownership:** The transport layer maintains exclusive ownership of the server lifecycle, signal handling, and process exit codes.
- **Isolation:** No other architectural layer (Domain, Service, or Persistence) may start, stop, or otherwise control the application process lifecycle.

## F) ACCEPTANCE CRITERIA
1.  **Configuration Guard:** The transport layer cannot initialize or start without a successfully validated `RuntimeConfig`.
2.  **Fail-Fast Startup:** Any failure during the startup sequence (e.g., port conflict) must result in a non-zero process exit code.
3.  **Bounded Shutdown:** Shutdown procedures must be deterministic and complete within a configurable timeout period.
4.  **Import Integrity:** No cross-layer imports allowed (e.g., transport layer importing domain entities or persistence implementations directly).
5.  **Side-Effect Isolation:** No side effects (e.g., file writing, network calls) are permitted outside the defined transport boundary during startup/shutdown.

## G) PHASE TRANSITION
- **Next Step:** Phase J.2.3 (Observability & Health Instrumentation) is required before enabling logging, metrics, or advanced health monitoring.
- **Completion Declaration:** Phase J.2.2 is considered **COMPLETE** once the lifecycle control is deterministic and adheres to the sequences defined herein.
