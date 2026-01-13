# L-04 — Demo Environment Configuration

## 1. Purpose and Scope
This document defines the configuration requirements for the Zenthea Phase L demo environment. It establishes the design boundaries for where and how the non-executing demo assets are staged and presented.

**Strict Governance Posture:**
- This is a **design-only** artifact.
- It is **explicitly non-executing**.
- It **does not authorize** implementation, execution, automation, or deployment.
- Its purpose is to define environment types and their constraints, not to configure live systems.

## 2. Relationship to Prior Phase L Artifacts
This configuration plan builds upon the foundational design established in previous Phase L documents:
- **Trace to L-01 (UI Constraints):** Ensures environment configurations enforce the execution block at the infrastructure/staging level.
- **Trace to L-02 (Interaction Flows):** Provides the environment context required for the choreographed interaction moments.
- **Trace to L-03 (Demo Assembly):** Defines the "containers" (local/hosted) where the demo assembly resides.

## 3. Definition of “Demo Environment”
A "Demo Environment" is a strictly isolated, narrative-controlled staging area used exclusively for displaying the Phase L non-executing UI. It is decoupled from all production or development pipelines that involve active system logic.

## 4. Supported Demo Environments
Three tiers of environment are designed for stakeholder engagement:

### 4.1 Local (Single-Machine)
- **Context:** Individual developer or presenter laptop.
- **Method:** Local file system serving static HTML/JS or a local-only dev server with mock data.
- **Boundary:** No network egress; all assets must be self-contained.

### 4.2 Hosted (Controlled Demo Instance)
- **Context:** A static-only hosting service (e.g., Vercel Preview, GitHub Pages) for shared reviews.
- **Method:** Deployment of static builds containing zero backend references.
- **Boundary:** No database connectivity; no API endpoints; "Execution Block" enforced via build-time stripping of functional components.

### 4.3 Presentation-only (Screenshare / Video)
- **Context:** Recorded walkthroughs or live video presentations.
- **Method:** Capture of the Local or Hosted environment in a controlled state.
- **Boundary:** Narrative-only; no viewer interaction with the underlying code.

## 5. Data Constraints and Fixtures
Environment data must adhere to strict safety protocols:
- **Static Data Only:** All views are populated by local JSON files or hardcoded strings.
- **No PII:** Use only the approved "Zenthea Personas" (e.g., "Patient: Sarah Miller"). Real patient data is strictly prohibited.
- **No Live Integrations:** Zero calls to external APIs (LLM providers, EHRs, or billing systems).

## 6. Configuration Boundaries

### 6.1 What may be configured
- Narrative sequence (order of screens).
- Persona metadata (name, age, simulated history).
- Visual themes (Zenthea brand colors, typography).
- Speed of simulated "typing" for assistant responses.

### 6.2 What must never be configurable
- Execution state (cannot be toggled "on").
- Database connection strings (must not exist).
- API credentials (must not exist).
- User authentication logic (must remain a hardcoded session).

## 7. Operator Responsibilities and Access
Access to the demo environment is limited to authorized operators who understand the non-executing constraints. Operators are responsible for ensuring that the demo environment is never represented as a "live" system to stakeholders.

## 8. Environment Safety Guards

### 8.1 Execution Block Enforcement
Environments must be designed such that they *cannot* execute. If a functional component is accidentally included, the environment must fail to load rather than attempting to connect to a backend.

### 8.2 Visual Indicators
Every environment must render a persistent "NON-EXECUTING DESIGN DEMO" watermark on every surface, regardless of the device type.

## 9. Failure and Misconfiguration Handling
If an environment configuration error occurs (e.g., a missing JSON fixture), the UI must display a "Design Mockup Unavailable" message. It must never attempt to "fall back" to a real service or generic error handler that implies system execution.

## 10. Audit and Observability (Metadata-only)
Auditability in the demo environment is limited to tracking narrative progression:
- Logging which "Moment" was reached.
- Versioning of the static asset bundle used for the demo.
- No collection of user/viewer telemetry.

## 11. Explicit Prohibitions
- **No Persistence:** No data entered during a demo shall be saved to any database.
- **No Secrets:** No environment variables containing real API keys shall be present.
- **No Inter-environment Communication:** Demo environments must not talk to each other or external systems.

## 12. Out of Scope
- Implementation of deployment scripts or CI/CD pipelines.
- Configuration of SSL certificates or domain names (beyond basic static hosting).
- Stress testing or performance monitoring.

## 13. Demo Readiness Checklist
- [ ] Environment is confirmed to be isolated from all production networks.
- [ ] No API keys or connection strings exist in the environment configuration.
- [ ] Static data fixtures are verified for PII compliance.
- [ ] "NON-EXECUTING" watermark is visible on all surfaces.
- [ ] Operator has confirmed they can navigate the assembly locally.

## 14. Exit Criteria
- Completion of this document marks the end of the Phase L Design Artifact series.
- Readiness for a formal "Design-to-Build" transition review (under a separate phase).

## 15. Closing Governance Statement
This document authorizes understanding and design alignment only. It does not authorize implementation, execution, automation, or deployment.
