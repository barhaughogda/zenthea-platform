# Risks and Controls

## Identified Risks

| Risk | Area | Control |
|-----|------|---------|
| PHI leakage | Patient UI | Consent-agent gating |
| Logic drift | Services | Guardrails + CI |
| AI overreach | Agents | Eval hard gates |
| Broken UX | Frontend | Feature flags |

## Hard Rules
- No clinical writes in early slices
- No AI without eval coverage
- No service imports