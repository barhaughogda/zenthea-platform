# HIPAA Strategy

## Purpose

This document defines how the platform is designed to support HIPAA-aligned use cases.

It explains:
- How HIPAA influences system architecture
- How Protected Health Information (PHI) is handled
- How AI usage is constrained in healthcare contexts
- How vendors and infrastructure are selected
- How compliance is maintained over time

This document answers the question: **“How can this platform safely operate in healthcare and other regulated environments?”**

---

## HIPAA as an Architectural Constraint

HIPAA compliance is not treated as an add-on.

It is treated as a **hard architectural constraint** that shapes:
- Data flow
- Storage strategy
- AI execution
- Vendor selection
- Observability and auditability

If a design cannot support HIPAA cleanly, it is not acceptable for regulated deployments.

---

## Scope and Responsibility

The platform is designed to support HIPAA-compliant systems, but **compliance is contextual**.

Key distinctions:
- The platform provides HIPAA-aligned capabilities
- Actual compliance depends on deployment, configuration, and operational controls
- Responsibilities are shared between platform and operator

This document defines what the platform guarantees and what must be handled operationally.

---

## PHI Definition and Classification

Protected Health Information (PHI) includes any data that:
- Identifies an individual
- Relates to health status, care, or payment

The platform requires explicit data classification.

Rules:
- Data must be classified at ingestion
- PHI classification propagates with the data
- Unclassified data defaults to non-PHI and must be reviewed

PHI classification is not inferred implicitly.

---

## Data Minimization Strategy

The platform enforces strict data minimization.

Principles:
- Collect only what is necessary
- Process only what is required
- Store only what must be retained

AI systems must not receive PHI unless explicitly required for the task.

---

## PHI in AI Execution

AI execution involving PHI is tightly controlled.

Rules:
- PHI exposure to AI is opt-in per service and per execution
- Only approved models and vendors may receive PHI
- Prompts must be constructed to minimize PHI exposure
- Outputs must be validated to prevent unintended disclosure

If PHI is not required, it must be excluded.

---

## Vendor Eligibility and BAAs

HIPAA compliance depends on vendor eligibility.

Rules:
- Any vendor that processes PHI must have a signed Business Associate Agreement (BAA)
- Vendors without a BAA must never receive PHI
- Vendor eligibility is enforced programmatically

This applies to:
- AI model providers
- Data storage providers
- Logging and monitoring services
- Third-party integrations

Vendor trust is explicit, not assumed.

---

## AI Model Constraints Under HIPAA

When operating in HIPAA mode:
- Model providers must be explicitly approved
- Training on customer data must be disabled unless explicitly permitted
- Data retention behavior must be documented
- Model invocation logs must be auditable

Model selection logic must respect compliance mode at runtime.

---

## Data Storage and Retention

PHI storage follows strict rules.

Requirements:
- Encryption at rest is mandatory
- Access is role- and tenant-scoped
- Retention policies are explicit and enforced
- Deletion and right-to-erasure workflows are supported

PHI must not be stored indefinitely by default.

---

## Audit Logging and Traceability

HIPAA requires auditability.

The platform must support:
- Logging of all PHI access
- Logging of AI executions involving PHI
- Logging of tool invocations that affect PHI
- Correlation of actions to identities and tenants

Audit logs must be tamper-resistant and retained according to policy.

---

## Access Controls and Least Privilege

Access to PHI is restricted by default.

Rules:
- Least privilege is enforced
- Access is role-based and context-aware
- Emergency access paths are explicit and logged
- All access is auditable

AI systems are treated as privileged actors and constrained accordingly.

---

## Incident Response and Breach Handling

The platform supports HIPAA-aligned incident response.

Capabilities include:
- Detection of unauthorized access
- Alerts on anomalous behavior
- Ability to revoke access immediately
- Ability to disable AI features selectively
- Forensic audit trails

The platform must support timely breach investigation and reporting.

---

## Environment Segmentation

HIPAA deployments require environment isolation.

Rules:
- Production PHI environments are isolated
- Non-production environments must not contain real PHI
- Test data must be synthetic or de-identified

Environment boundaries are enforced technically, not procedurally.

---

## Documentation and Evidence

Compliance requires evidence.

The platform supports:
- Configuration documentation
- Audit log exports
- Access reports
- Change histories

Documentation must be sufficient to support audits and risk assessments.

---

## What HIPAA Mode Explicitly Disables

When operating in HIPAA mode:
- Unapproved AI providers are disabled
- Unvetted integrations are blocked
- Non-essential logging of PHI is disabled
- Experimental features are gated

HIPAA mode is restrictive by design.

---

## Shared Responsibility Model

The platform provides:
- Architectural guardrails
- Enforcement mechanisms
- Observability and auditability

Operators are responsible for:
- Policies and procedures
- Training and access governance
- Incident response processes
- Legal and regulatory interpretation

HIPAA compliance is a shared responsibility.

---

## Summary

The HIPAA strategy ensures that:
- PHI is handled deliberately
- AI usage is constrained and auditable
- Vendors are vetted and enforced
- Security and compliance are built into the system

HIPAA is not a feature.  
It is a constraint that shapes everything.

All HIPAA-aligned deployments must adhere to this strategy.