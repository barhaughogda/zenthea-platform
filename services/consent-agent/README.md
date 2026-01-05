# Consent Agent

## Overview
The Consent Agent is the **authoritative system of record for consent, authorization, and data-sharing permissions** across the Zenthea Platform. It governs who may access what data, for what purpose, for how long, and under which legal and regulatory constraints. All agents and services that access PHI or PII must operate **within the decisions enforced by this agent**.

**Enforcement is strictly deterministic. AI is advisory-only.**

## Primary Users
- Patients
- Clinicians
- Compliance officers
- Platform administrators

## Responsibilities
- Managing patient consent records
- Enforcing purpose-based access control
- Handling consent revocation and expiration
- Supporting HIPAA authorization flows
- Supporting GDPR consent and lawful basis tracking
- Providing explainable consent decisions to other services
- Producing auditable consent decision logs

## Explicit Non-Goals
- Generating medical advice
- Interpreting clinical data
- Executing external actions
- Overriding legal or regulatory requirements
- Inferring consent implicitly without explicit rules
- Allowing AI to autonomously grant or revoke consent

## Consent Model
The agent supports various consent types, including:
- Treatment
- Payment
- Healthcare operations
- Research
- Data sharing with third parties
- AI-assisted processing

Each consent record includes:
- Subject (patient)
- Actor (who requested access)
- Purpose
- Scope (data categories)
- Duration
- Jurisdiction
- Revocation status

## AI Behavior and Constraints
AI usage is limited to:
- Explaining consent implications in plain language
- Assisting users in understanding options
- Generating summaries of consent history
- Helping staff resolve consent-related workflows

**AI must not make consent decisions, grant access, revoke consent, or modify consent records.**

## HIPAA Compliance
The Consent Agent enforces:
- Minimum necessary access
- Purpose limitation
- Accounting of disclosures
- Authorization tracking
- Revocation enforcement

## GDPR Compliance
The Consent Agent supports:
- Lawful basis tracking
- Explicit consent capture
- Right to withdraw consent
- Right to access
- Right to explanation
- Purpose limitation

## API Expectations
The agent exposes APIs to:
- Query consent status
- Validate access requests
- Record consent grants
- Record consent revocations
- Retrieve consent history
- Explain consent decisions

## Orchestration Expectations
The orchestration layer enforces:
- Identity verification
- Role verification
- Jurisdiction resolution
- Policy evaluation
- Deterministic decision paths
- Audit logging

**AI is never in the enforcement path.**

## Observability and Auditability
The following are captured in immutable logs:
- Consent grants and revocations
- Consent checks and access denials
- Jurisdiction, purpose, and policy version applied

## Tool Usage Policy
- The Consent Agent does not execute tools.
- It does not call external systems directly.
- Downstream actions must go through Orchestration and the Tool Execution Gateway.

## Backup and Recovery
- **Backup Scope**: Consent records, policy definitions, jurisdiction mappings, and audit metadata.
- **Backup Frequency**: Daily (Production).
- **Restore Procedure**: Restore from encrypted snapshot; ensure policy versioning and revocation history integrity.
