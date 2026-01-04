# Backup and Recovery

## Purpose

This document defines the **backup and recovery strategy** for the platform.

It explains:
- What data is backed up
- How often backups occur
- How backups are secured
- How long backups are retained
- How recovery is performed and tested
- How compliance requirements (GDPR, HIPAA) are enforced

This document answers the question:  
**“If something goes wrong, how do we restore safely, correctly, and compliantly?”**

---

## Core Principles

The backup and recovery strategy follows these principles:

- Backups are automated
- Backups are encrypted
- Backups are auditable
- Recovery is tested
- Compliance overrides convenience
- Ownership is explicit

A backup that cannot be restored is considered a failure.

---

## Backup Scope

Backups are defined by **data category**. Each category has different rules.

---

## 1. Operational Domain Data

### Description

Operational domain data includes:
- Service-owned databases
- Tenant-specific records
- Domain entities and state

This is the **highest priority backup category**.

---

### Ownership

- Each service owns its data
- Each service defines its backup configuration
- No shared database backups across services

Service-per-domain implies backup-per-domain.

---

### Requirements

- Automated backups only
- Encrypted at rest and in transit
- Tenant-aware where applicable
- Isolated per service

---

### Frequency (Baseline)

- Production: daily full backup
- Staging: daily or weekly
- Development: optional

Services with higher criticality may increase frequency.

---

## 2. Configuration and Metadata

### Description

Includes:
- Tenant configuration
- Feature flags
- Compliance mode configuration
- Prompt version selection
- Environment configuration (non-secret)

---

### Strategy

- Stored in version-controlled systems where possible
- Backed up alongside operational data where dynamic
- Must be recoverable to a known-good state

Configuration drift is a recovery risk.

---

## 3. AI Artifacts

### Description

Includes:
- Prompt files
- Evaluation definitions
- Model selection configuration
- AI runtime configuration

---

### Strategy

- Source of truth is Git
- Git repositories are backed up externally
- No need for separate AI artifact backups

---

### Exclusions

- Raw AI outputs are not backed up unless they are domain data
- Transient AI reasoning is never backed up

---

## 4. Logs and Audit Trails

### Description

Includes:
- Audit logs
- Tool execution logs
- Approval records
- Security and access logs

---

### Strategy

- Logs are backed up according to retention policies
- Logs are immutable once written
- Access is strictly controlled

Logs exist for accountability, not analytics.

---

## Encryption and Security

### Encryption Requirements

All backups must:
- Be encrypted at rest
- Be encrypted in transit
- Use approved encryption standards
- Be protected by access controls

Unencrypted backups are prohibited.

---

### Access Control

- Backup access is restricted to authorized roles
- Access is logged and auditable
- No AI agent may access backups
- No frontend or client access to backups

Backup access is a privileged operation.

---

## Retention Policies

Retention is driven by **compliance requirements**.

---

### GDPR Considerations

In GDPR mode:
- Backups must support data erasure semantics
- Personal data must not be retained indefinitely
- Retention periods must be documented
- Erased data must not be restored unintentionally

Backups are not an exception to GDPR.

---

### HIPAA Considerations

In HIPAA mode:
- Backups containing PHI must be encrypted
- Access must be tightly controlled
- Audit logs must be retained per regulation
- Retention periods must meet legal requirements

HIPAA overrides default retention rules.

---

## Restore Strategy

### Ownership

- Each service owns its restore procedures
- Restore procedures must be documented
- Restore procedures must be reproducible

No shared or ad-hoc restore processes.

---

### Restore Scenarios

Services must be able to restore:
- A single tenant
- A single service
- An entire environment (if required)

Partial restores must be supported where feasible.

---

## Restore Testing

### Requirements

- Restore tests must exist
- Restore tests must be documented
- Restore tests must be run periodically

At minimum:
- One service per environment must have a tested restore path

---

### What Restore Tests Validate

- Data integrity
- Schema compatibility
- Application startup
- Basic functionality

Restore tests are more important than backup frequency.

---

## Disaster Recovery vs Backup

Backups support **data recovery**.

Disaster recovery includes:
- Infrastructure recreation
- Environment provisioning
- Service redeployment

Disaster recovery plans may reference backups but are distinct documents.

---

## Observability and Monitoring

Backup systems must emit:
- Success and failure signals
- Backup duration
- Backup size
- Restore attempts and outcomes

Silent backup failures are unacceptable.

---

## Responsibilities Summary

| Responsibility | Owner |
|---------------|------|
| Data classification | Service |
| Backup configuration | Service |
| Encryption | Platform |
| Retention policy | Compliance |
| Restore procedure | Service |
| Restore testing | Service |
| Audit | Platform |

Ownership is explicit to avoid gaps.

---

## Anti-Patterns (Explicitly Disallowed)

The following are prohibited:
- Manual backups
- Unencrypted backups
- Untested restores
- Shared backups across services
- Backups without retention rules
- “Cloud provider default” assumptions

These create false confidence.

---

## Summary

The backup and recovery strategy ensures that:
- Data can be restored safely
- Compliance requirements are respected
- Failures are survivable
- Trust is maintained

Backups are not optional.  
Recovery is not theoretical.  
Discipline here protects everything else.