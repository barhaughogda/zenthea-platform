# Vendor Selection

## Purpose

This document defines the vendor selection strategy for the platform.

It explains:
- How vendors are evaluated and approved
- How vendor risk is assessed and mitigated
- How compliance requirements influence vendor choice
- How vendors are abstracted and governed technically
- How vendor changes are managed safely over time

This document answers the question: **“Which external vendors can we trust, and under what conditions?”**

---

## Vendor Selection as a Security and Compliance Decision

Vendor selection is treated as a **security and compliance decision**, not a procurement convenience.

This means:
- Vendors influence system architecture
- Vendors influence data exposure risk
- Vendors influence regulatory posture
- Vendors influence long-term flexibility

No vendor is considered neutral.

---

## Vendor Categories

Vendors are grouped by the type of capability they provide.

Typical categories include:
- AI model providers
- Data storage providers
- Messaging and eventing providers
- Authentication and identity providers
- Observability and logging providers
- Third-party API integrations

Each category has different risk characteristics and approval criteria.

---

## Core Vendor Evaluation Criteria

All vendors must be evaluated against a common baseline.

### Mandatory Criteria

A vendor must satisfy all of the following:
- Clear security posture and documentation
- Support for encryption in transit and at rest
- Availability and reliability guarantees
- Transparent data handling policies
- Ability to support audit and incident response

Failure on any mandatory criterion disqualifies the vendor.

---

### Compliance Criteria

For regulated deployments, additional criteria apply:
- Ability to sign a Business Associate Agreement (BAA) when PHI is involved
- Documented compliance certifications where applicable
- Clear data residency and retention policies
- Explicit guarantees about data usage and training

Compliance requirements override cost and convenience.

---

## Vendor Risk Classification

Vendors are classified based on risk.

### Risk Levels

- **Low Risk**  
  Vendors that do not process sensitive data directly

- **Medium Risk**  
  Vendors that process operational data but not PHI

- **High Risk**  
  Vendors that process PHI or sensitive AI inputs

Risk level determines:
- Approval rigor
- Monitoring requirements
- Allowed usage scope

---

## Approved Vendor Registry

The platform maintains an explicit registry of approved vendors.

The registry includes:
- Vendor name
- Vendor category
- Risk level
- Approved use cases
- Compliance status
- BAA status if applicable
- Date of approval and review

Only vendors in the approved registry may be used.

---

## Vendor Abstraction and Isolation

All vendors must be abstracted behind internal interfaces.

Rules:
- No service depends directly on vendor-specific APIs
- Vendor SDKs are wrapped in integration layers
- Vendor-specific behavior is isolated

This enables:
- Vendor replacement
- Risk mitigation
- Controlled feature usage

Vendor lock-in is treated as a technical debt.

---

## Vendor Usage Enforcement

Vendor eligibility is enforced programmatically.

Mechanisms include:
- Runtime checks based on compliance mode
- Configuration-based vendor gating
- Policy enforcement before data transmission
- Environment-specific vendor allowlists

It must not be possible to accidentally use an unapproved vendor.

---

## AI Vendor Considerations

AI vendors receive special scrutiny.

Additional requirements include:
- Explicit guarantees on data usage and retention
- Controls over training on customer data
- Ability to disable logging or retention of prompts
- Clear model versioning and change management

AI vendors without acceptable controls must not receive sensitive data.

---

## Data Storage Vendor Considerations

Data storage vendors must support:
- Strong encryption
- Fine-grained access control
- Audit logging
- Backup and recovery
- Retention and deletion policies

Storage vendors are critical infrastructure and require careful selection.

---

## Observability and Logging Vendors

Observability vendors may receive sensitive metadata.

Rules:
- Logs must be classified and filtered
- PHI must be redacted or excluded
- Retention policies must be configurable
- Access to logs must be restricted and audited

Observability must not become a data leakage vector.

---

## Vendor Change Management

Vendors may change over time.

Rules for change:
- Vendor changes are treated as architectural changes
- Changes must be evaluated and tested
- Rollback paths must exist
- Changes must be documented

Emergency vendor changes must be logged and reviewed retrospectively.

---

## Vendor Monitoring and Review

Vendor approval is not permanent.

Ongoing responsibilities include:
- Periodic security reviews
- Monitoring for incidents or policy changes
- Reassessment after major vendor updates
- Revocation if trust assumptions change

Vendor trust is continuously earned.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Ad-hoc vendor usage
- Vendor selection based solely on convenience
- Direct vendor SDK usage in service logic
- Silent vendor changes
- Undocumented vendor dependencies

These patterns create unmanaged risk.

---

## Summary

Vendor selection is a foundational security and compliance concern.

By:
- Evaluating vendors rigorously
- Enforcing eligibility programmatically
- Abstracting vendor dependencies
- Reviewing vendors continuously

the platform maintains trust, flexibility, and regulatory readiness.

All external dependencies must adhere to this strategy.