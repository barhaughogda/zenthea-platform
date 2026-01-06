# Slice 06: Step 06.1 Agent Permission Model

Status: Completed

## Evidence
- `packages/tool-gateway/src/governance.ts`: Implements `AGENT_REGISTRY` and `TOOL_SCOPE_MAPPING` for explicit permission declarations.
- `packages/tool-gateway/src/governance.ts`: `PolicyEvaluator` handles the core "deny-by-default" logic.
- `packages/tool-gateway/src/governance.test.ts`: Unit tests asserting strict enforcement of registered agents and scopes.
Owner: Platform Architecture  
Phase: Governance  
Prerequisite: Slice 06 planning doc exists and is locked

---

## Purpose

Introduce a deny-by-default, explicit permission model for agent tool usage.

This step makes it impossible for an agent to call a tool unless:
- The agent is explicitly registered
- The tool is explicitly allowed for that agent
- The request context matches policy constraints

---

## Scope

Implement in Tool Gateway only:
- Agent registry
- Tool allowlists
- Policy evaluation and enforcement

No tool behavior changes.
No new tools.
No UI changes.

---

## Policy Model

### Agent Registration
- agentId: stable string identifier for each agent service
- agentType: patient-facing | clinical | platform | unknown (unknown denied)

### Tool Scopes
Define stable scopes for existing tools:
- consent.read, consent.write
- chat.read, chat.write
- appointment.read, appointment.write
- medical_advisor.read
- other existing tool domains as needed

Mapping toolName to scope must be explicit and centralized.

### Permission Declaration
For each agentId, declare allowed scopes.
Example:
- patient-portal-agent: consent.read, chat.read, appointment.read, medical_advisor.read
- consent-agent: consent.read, consent.write
- chat-agent: chat.read, chat.write
- appointment-booking-agent: appointment.read, appointment.write

Actual list must match your current architecture.

---

## Enforcement

Tool Gateway must enforce:
- Unknown agentId: deny
- ToolName with no scope mapping: deny
- Scope not allowed for agent: deny

Denied responses must return:
- FORBIDDEN

And include a reasonCode internally:
- UNKNOWN_AGENT
- UNKNOWN_TOOL
- SCOPE_DENIED

No reasonCode should leak PHI.

---

## Observability

On deny decisions, emit a governance event (metadata only):
- agentType
- toolName
- reasonCode
- timestamp

No payloads. No request IDs. No tenant IDs.

---

## Validation

- Unit tests for policy evaluator
- pnpm lint, pnpm typecheck, pnpm build pass
- No changes to tool execution behavior for allowed invocations

---

## Completion Criteria

- Deny-by-default enforced
- Explicit allowlists per agentId in place
- Policy evaluator covered by tests
- One commit:
  "Slice 06 Step 06.1 - Agent permission model"

---