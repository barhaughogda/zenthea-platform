# Platform Surface Inventory

This document identifies the explicit application surfaces that must be mediated by adapter boundaries.

## 1. UI Surfaces (Application Entrypoints)
These surfaces interact with backend services via the **UI → Service Adapter**.

| Surface | Description | Category |
| :--- | :--- | :--- |
| **Patient Portal** | Frontend for patients to manage appointments and records. | MIG-02B |
| **Provider Portal** | Frontend for clinicians and staff. | MIG-03 |
| **Website Builder** | Non-clinical public-facing site builder. | MIG-01 |
| **Company Settings** | Tenant-level configuration and administration. | MIG-00 |

## 2. Service Surfaces (Domain Logic)
These surfaces interact with the Control Plane via the **Service → Control Plane Adapter**.

| Surface | Description | Category |
| :--- | :--- | :--- |
| **Scheduling** | Appointment booking and availability logic. | MIG-05 |
| **Billing** | Payments, invoicing, and monetization. | MIG-05 |
| **Clinical Documentation** | Records, notes, and attestation. | MIG-04A/B |
| **Chat Agent** | AI-mediated patient/provider communication. | MIG-06 |
| **Medical Advisor** | AI-driven clinical advice and triage. | MIG-06 |

## 3. Operator Surfaces (Control & Governance)
These surfaces interact with the Control Plane via the **Operator UI → Control Plane Adapter**.

| Surface | Description | Category |
| :--- | :--- | :--- |
| **Operator UI** | Internal tool for governance, audit, and policy management. | CP-11/15 |
| **Policy Manager** | Interface for defining and versioning policies. | CP-18 |
| **Audit Viewer** | Interface for inspecting governance and audit logs. | CP-13 |
| **Decision Desk** | Interface for manual HITL (Human-in-the-Loop) approvals. | CP-16 |

## 4. Non-HTTP Surfaces
Scheduled tasks and background workers that must also comply with governance boundaries.

- **Scheduled Jobs**: Daily reports, billing cycles.
- **Message Consumers**: Event-driven domain updates.
- **CLI Tools**: Administrative maintenance scripts.
