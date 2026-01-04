# Accounting Agent Service

## Purpose

The Accounting Agent is a domain-specific AI service responsible for accounting workflows, financial records, and compliance-aware automation.

It provides:
- Transaction ingestion and classification
- Reconciliation assistance
- Financial summaries and insights
- Compliance-aware automation and checks
- Audit-ready observability and reporting

This document answers the question: **“How do we apply AI to accounting without compromising correctness, auditability, or compliance?”**

---

## Domain Definition

### Domain Scope

The Accounting Agent owns:
- Financial transactions and journals
- Account classification and chart-of-accounts mapping
- Period close workflows (supporting, not deciding)
- Financial summaries and reports
- Accounting-specific AI insights

The Accounting Agent does not own:
- Payment processing
- Revenue recognition policy definition
- Tax filing or legal determinations
- UI or ERP-specific behavior

---

## Core Responsibilities

The Accounting Agent must:
- Ingest financial transactions from approved sources
- Classify transactions deterministically, with AI assistance
- Assist reconciliation through explainable suggestions
- Generate financial summaries and variance analysis
- Enforce strict policy and compliance constraints
- Emit auditable events for all material actions

Correctness and traceability are non-negotiable.

---

## API Surface

### Key Endpoints

Typical endpoints include:

- `POST /transactions`
  - Ingest or sync transactions
- `POST /transactions/{id}/classify`
  - Classify or reclassify a transaction
- `POST /reconciliations/run`
  - Assist reconciliation for a period
- `GET /reports/{period}`
  - Retrieve financial summaries
- `POST /periods/{period}/close-support`
  - Support period close workflows

All endpoints must:
- Be tenant-aware
- Be idempotent where applicable
- Validate all inputs strictly

---

## Accounting Lifecycle

A typical accounting lifecycle includes:

1. Transaction ingestion
2. Classification and validation
3. Reconciliation
4. Period summaries
5. Close support and reporting

State transitions are explicit and validated by domain rules.

---

## Internal Structure

The Accounting Agent follows the canonical service structure:

/services/accounting-agent
/api
/orchestration
/domain
/ai
/data
/integrations
/config
/tests
README.md

---

## Layer Responsibilities

### API Layer (`/api`)

Responsibilities:
- Expose accounting endpoints
- Validate payloads and parameters
- Extract authentication and tenant context

Rules:
- No AI calls
- No direct persistence

---

### Orchestration Layer (`/orchestration`)

Responsibilities:
- Coordinate accounting workflows
- Enforce policy and compliance checkpoints
- Invoke AI runtime for analysis and suggestions
- Persist validated outcomes
- Emit accounting events

This layer governs all side effects.

---

### Domain Layer (`/domain`)

Responsibilities:
- Transaction and ledger models
- Accounting rules and invariants
- Chart-of-accounts definitions
- Deterministic validation logic

Rules:
- Domain logic is authoritative
- AI may not override domain constraints

---

### AI Layer (`/ai`)

Responsibilities:
- Define accounting-specific prompt layers
- Propose transaction classifications
- Suggest reconciliation matches
- Generate variance explanations and summaries

Rules:
- AI outputs are suggestions only
- All outputs require validation
- AI never posts journal entries directly

---

### Data Layer (`/data`)

Responsibilities:
- Persistence of transactions and ledgers
- Audit logs and immutable records
- Encryption and retention policies
- Period snapshots

Accounting data is append-only where possible.

---

### Integrations Layer (`/integrations`)

Responsibilities:
- Bank feeds and financial APIs
- ERP or accounting system connectors
- Webhook publishing for accounting events

All integrations must be approved and auditable.

---

## AI Behavior Specification

### Transaction Classification

AI may:
- Analyze transaction descriptions and metadata
- Propose account mappings
- Provide confidence scores and explanations

AI must not:
- Bypass mandatory accounting rules
- Modify posted transactions without review

---

### Reconciliation Assistance

AI may:
- Suggest matches between transactions and statements
- Flag anomalies or duplicates
- Explain discrepancies

Final reconciliation decisions are validated by domain logic.

---

## Tool Availability

Typical tools include:
- `classifyTransaction`
- `suggestReconciliationMatch`
- `generateFinancialSummary`
- `flagAnomaly`

Tool access depends on:
- User role
- Compliance mode
- Tenant configuration

---

## Event Emission

The Accounting Agent emits events such as:
- `accounting.transaction.ingested`
- `accounting.transaction.classified`
- `accounting.reconciliation.suggested`
- `accounting.period.summary.generated`
- `accounting.anomaly.detected`

Events are immutable and audit-ready.

---

## Observability

Required telemetry includes:
- Transaction and journal identifiers
- Classification inputs and outputs
- Prompt and model versions
- Tool usage and outcomes
- Cost, latency, and error metrics

Accounting AI behavior must be fully explainable.

---

## Security and Compliance

The Accounting Agent must:
- Enforce strict access controls
- Maintain tenant isolation
- Support HIPAA mode when PHI-adjacent data exists
- Support SOC-style audit requirements
- Preserve immutable audit trails

Financial correctness overrides automation.

---

## Testing and Evaluation

The Accounting Agent must include:
- Unit tests for accounting rules
- Golden datasets for classification
- Regression tests for reconciliation
- Integration tests for financial APIs
- Audit log verification tests

AI tests must prioritize false-positive avoidance.

---

## Known Constraints and Non-Goals

The Accounting Agent does not:
- File taxes
- Perform payments
- Replace certified accountants
- Make legal or regulatory determinations

Its role is **augmentation with control**, not autonomy.

---

## Summary

The Accounting Agent is an AI-native accounting service that:
- Preserves financial correctness
- Enhances efficiency through explainable AI
- Maintains auditability and compliance
- Integrates safely with financial systems

It is the reference for **high-stakes, compliance-heavy AI services** in the platform.