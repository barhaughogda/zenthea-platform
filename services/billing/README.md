# Billing Service

The Billing Service is the authoritative domain for all monetization, plans, and entitlements within the platform.

## Purpose

This service centralizes all financial logic, ensuring that product services remain focused on their core functionality while the platform maintains a consistent and auditable billing model.

## Core Responsibilities

- **Source of Truth**: Authoritative state for plans, subscriptions, and entitlements.
- **Usage Metering**: Aggregates usage events reported by other services.
- **Entitlement Enforcement**: Provides the definitive "allow/deny" decision for feature access.
- **Payment Coordination**: Coordinates with external payment providers (e.g., Stripe) for execution.

## Usage Reporting

Domain services MUST report usage events whenever a billable action occurs. Reporting is declarative and asynchronous.

```typescript
import { UsageEvent } from '@starter/billing';

const event: UsageEvent = {
  tenantId: '<TENANT_ID>',
  serviceId: 'chat-agent',
  featureId: 'ai-tokens',
  quantity: 150,
  timestamp: new Date()
};

await billingService.reportUsage(event);
```

**Rules for Services:**
- Do NOT apply pricing logic locally.
- Do NOT aggregate usage locally.
- Do NOT check Stripe directly.

## Entitlements

Entitlements represent what a tenant is allowed to do. Services should check entitlements before performing restricted actions.

```typescript
const response = await billingService.checkEntitlement({
  tenantId: '<TENANT_ID>',
  featureId: 'premium-voice-model'
});

if (!response.allowed) {
  throw new Error(`Access denied: ${response.reason}`);
}
```

## Stripe Execution Boundary

Stripe (and other payment providers) are treated as **infrastructure executors**, not architectural authorities.

| Feature | Billing Service (Authority) | Stripe (Executor) |
|---------|---------------------------|-------------------|
| Pricing Logic | Owns and defines pricing | Executes charges based on input |
| Entitlements | Decides who gets what | Unaware of feature access |
| State | System of record for plans | System of record for payments |
| AI Access | Safety boundary for AI | No AI interaction |

**The Boundary:**
- Billing decides **what** to charge and **when**.
- Stripe executes **how** the money moves.
- Product services NEVER call Stripe directly.

## Compliance Considerations

- **Auditability**: Every billing transaction and entitlement change is logged with full context.
- **Data Retention**: Financial records are retained for a minimum of 7 years.
- **HIPAA/GDPR**: Payment data is handled by Stripe; platform only stores non-PHI entitlement state.

## Backup and Recovery

Each service owns its data and must define its backup configuration.

- **Backup Scope**: 
  - Operational Domain Data: Plans, Subscriptions, Entitlements.
  - Configuration: Feature flags and pricing metadata.
- **Backup Frequency**: 
  - Production: Daily full backup.
  - Staging: Weekly.
- **Restore Procedure**: 
  - Authoritative restore for the billing domain.
  - Supports single-tenant and full-service recovery.
  - Procedure: `scripts/restore-billing.sh` (documented process).

## Folder Structure

- `api/`: Public interfaces and entry points.
- `domain/`: Business logic, entities, and services.
- `data/`: Data persistence interfaces.
- `orchestration/`: Coordination logic (usage aggregation, payment cycles).
- `config/`: Service configuration.
- `integrations/`: External integrations (Stripe boundary).
- `tests/`: Unit and integration tests.
