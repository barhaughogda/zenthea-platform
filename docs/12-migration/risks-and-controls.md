# Risks and Controls

This document enumerates known risks during migration and the controls in place
to prevent architectural, security, or compliance regressions.

## Identified Risks

| Risk | Area | Control |
|-----|------|---------|
| Accidental PHI exposure | Frontend apps | Consent-agent gating, read-only mode |
| Unauthorized data access | Services | Centralized consent enforcement |
| AI overreach | Agents | AI eval hard gates, draft-only outputs |
| Silent architectural drift | Monorepo | ESLint guardrails, CI checks |
| Broken migration rollback | Execution | Slice-based migration, tagging |

## Migration Controls

- No service may write to patient records during early slices
- All AI outputs must remain advisory or draft-only
- All service changes must pass lint, test, typecheck, eval:ai
- Each migration slice must end with a git tag

## Non-Negotiables

- No bypassing the Tool Execution Gateway
- No direct model SDK usage in services
- No frontend business logic