# Sales Agent Service

## Purpose

The Sales Agent is a domain-specific AI service responsible for managing and optimizing sales workflows.

It provides:
- Lead qualification and scoring
- Deal progression guidance
- AI-assisted outreach and follow-ups
- Pipeline insights and forecasting support
- Policy-governed automation of sales actions

This document answers the question: **“How do we implement sales as an AI-native, composable service?”**

---

## Domain Definition

### Domain Scope

The Sales Agent owns:
- Leads and prospects
- Sales stages and pipeline state
- Sales-related AI reasoning and recommendations
- Sales interaction summaries and insights

The Sales Agent does not own:
- Marketing content creation
- Accounting or billing logic
- CRM UI concerns
- Final authority over financial records

---

## Core Responsibilities

The Sales Agent must:
- Ingest and normalize lead and deal data
- Qualify and score leads using AI and deterministic rules
- Recommend next-best actions
- Assist with outreach content generation
- Coordinate sales workflows through tools and events
- Provide explainable reasoning for AI-driven recommendations

---

## API Surface

### Key Endpoints

Typical endpoints include:

- `POST /leads`
  - Create or ingest a new lead
- `POST /leads/{id}/qualify`
  - Qualify and score a lead
- `POST /leads/{id}/recommendations`
  - Generate next-best-action recommendations
- `POST /deals/{id}/progress`
  - Advance or update deal state
- `GET /pipeline/summary`
  - Retrieve pipeline insights and forecasts

All endpoints must:
- Be tenant-aware
- Validate inputs strictly
- Support idempotency for state changes

---

## Sales Lifecycle

A typical sales lifecycle includes:

1. Lead created or ingested
2. Lead qualified and scored
3. Lead converted to deal
4. Deal progressed through stages
5. Deal closed or lost

Each transition is validated by domain logic and recorded explicitly.

---

## Internal Structure

The Sales Agent follows the canonical service structure:

/services/sales-agent
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
- Expose sales-related endpoints
- Validate payloads and parameters
- Extract authentication and tenant context

Rules:
- No AI calls
- No direct persistence

---

### Orchestration Layer (`/orchestration`)

Responsibilities:
- Coordinate lead and deal workflows
- Apply policy and budget checks
- Invoke AI runtime for scoring and recommendations
- Trigger tool usage (for example: outreach scheduling)
- Emit sales-related events

This layer defines how sales logic flows.

---

### Domain Layer (`/domain`)

Responsibilities:
- Lead and deal models
- Sales stage definitions
- Deterministic scoring rules
- Validation of state transitions

Domain logic defines what is allowed, regardless of AI output.

---

### AI Layer (`/ai`)

Responsibilities:
- Define sales-specific prompt layers
- Perform AI-based lead qualification and scoring
- Generate outreach drafts and summaries
- Provide explainable reasoning and confidence scores

Rules:
- AI outputs are proposals, not authority
- All outputs are validated before use

---

### Data Layer (`/data`)

Responsibilities:
- Persistence of leads, deals, and scores
- Storage of AI-generated insights
- Encryption and retention policies

Sales data is tenant-scoped and auditable.

---

### Integrations Layer (`/integrations`)

Responsibilities:
- CRM integrations
- Email and messaging providers
- Calendar and scheduling tools
- Webhook publishing

All integrations must be policy- and compliance-aware.

---

## AI Behavior Specification

### Lead Qualification

AI may:
- Analyze lead attributes and interaction history
- Classify lead intent and readiness
- Produce a qualification score and explanation

AI must not:
- Override disqualification rules
- Access data outside the sales domain

---

### Recommendations and Next Actions

AI may recommend:
- Outreach timing and channels
- Messaging tone and content
- Deal progression strategies

Recommendations must include:
- Rationale
- Confidence indicators
- Suggested actions, not commands

---

## Tool Availability

Typical tools include:
- `sendOutreachEmail`
- `scheduleFollowUp`
- `updateDealStage`
- `logSalesActivity`

Tool access depends on:
- User role
- Tenant configuration
- Compliance mode

---

## Event Emission

The Sales Agent emits events such as:
- `sales.lead.created`
- `sales.lead.qualified`
- `sales.deal.updated`
- `sales.recommendation.generated`
- `sales.deal.closed`

Events follow the eventing model and enable downstream automation.

---

## Observability

Required telemetry includes:
- Lead and deal identifiers
- Scoring inputs and outputs
- Prompt and model versions
- Tool usage and outcomes
- Cost and latency metrics

Sales decisions must be explainable and traceable.

---

## Security and Compliance

The Sales Agent must:
- Enforce tenant isolation
- Apply role-based access control
- Respect HIPAA mode when applicable
- Redact sensitive personal data when required

Sales automation must never bypass authorization.

---

## Testing and Evaluation

The Sales Agent must include:
- Unit tests for sales rules
- AI scoring evaluation tests
- Regression tests for recommendations
- Integration tests for CRM and messaging tools

AI outputs must be evaluated for bias, consistency, and quality.

---

## Known Constraints and Non-Goals

The Sales Agent does not:
- Close deals autonomously
- Perform billing or invoicing
- Replace human judgment
- Guarantee revenue outcomes

Its role is to **augment**, not replace, sales teams.

---

## Summary

The Sales Agent is an AI-native service that:
- Improves sales effectiveness
- Provides explainable intelligence
- Integrates safely with external systems
- Scales across clients and industries

It serves as the reference for outcome-oriented AI agents in the platform.