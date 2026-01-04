# Next Phases

This folder defines the post-starter build plan for the active platform repository.

## Goals
- Complete the platform surface with consistent service and SDK scaffolds.
- Prepare legacy code migration without importing architectural debt.
- Migrate legacy domains by extraction, not copy-paste.
- Integrate products only after services and contracts are stable.

## Ground Rules
- No service-to-service imports.
- No direct model calls outside ai-runtime.
- No tool execution outside tool-gateway.
- Frontends are thin and use SDKs only.
- Each new service must include AI eval skeletons and Backup and Recovery docs.

## Generation Order
1. next-phases-plan.md
2. agent-scaffolding-checklist.md
3. agent-service-template-delta.md
4. migration-strategy.md
5. migration-inventory-template.md
6. migration-mapping-template.md
7. implementation-phases.md