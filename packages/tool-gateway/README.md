# Tool Execution Gateway

## Purpose
The Tool Execution Gateway mediates the execution of approved tool actions. It enforces the critical boundary between AI intent (proposals) and real-world side effects (execution).

## Core Principles
1. **Mediation**: No AI agent or service executes external tools directly.
2. **Approved Commands Only**: The gateway only accepts fully validated and approved execution commands.
3. **Intent vs. Side Effect**: The gateway rejects raw AI output or tool proposals. It only deals with deterministic execution instructions.
4. **Tenant Awareness**: All execution is scoped to a specific tenant.
5. **Idempotency**: All commands require an idempotency key to prevent duplicate execution.

## Architecture
The gateway is a downstream executor. It receives commands from the AI Runtime (after validation and approval) and translates them into payloads for orchestration systems (e.g., n8n).

## Security & Compliance
- **Audit Trails**: Every execution is logged with correlation IDs to the original proposal.
- **Credential Isolation**: Credentials are managed at the orchestration layer, never exposed to the gateway or AI agents.
- **Validation**: Strict schema validation for all execution commands.

## Related Documents
- `docs/10-decisions/adr-007-external-tool-orchestration.md`
- `docs/03-ai-platform/tool-proposal-model.md`
- `docs/03-ai-platform/tooling-system.md`
