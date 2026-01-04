# Legacy Migration Strategy

This strategy governs moving an existing product codebase into this platform without importing architectural debt.

## Guiding Principles
- Extract behavior, not structure.
- Rewrite into the canonical template.
- Migrate one domain at a time.
- Keep frontends thin and SDK-driven.
- Compliance is designed in, not bolted on.

## What Not To Do
- Do not copy-paste entire folders from the legacy repo into /services.
- Do not keep legacy routing, state management, or auth patterns if they violate the platform rules.
- Do not bypass the Tool Execution Gateway.
- Do not embed entitlements or plan logic in frontends.

## Migration Sequence Per Domain
1. Create new service skeleton using template
2. Implement domain core and invariants
3. Implement data interfaces and schemas
4. Integrate observability and backups
5. Add AI capabilities and prompts
6. Add AI evals and CI gates
7. Create SDK package
8. Integrate UI via SDK

## Recommended Domain Order (Typical for EHR)
1. Identity and tenant model (if missing)
2. Patient and chart core
3. Scheduling and calendar workflows
4. Documents and forms
5. Billing and claims surfaces (if applicable)
6. Website builder and marketing surfaces