# Phase D Final Seal: CP-21 Application Surface Governance Closure

## Executive Summary
Phase D of the Zenthea Platform governance rollout is hereby declared **COMPLETE and SEALED**. 

The primary objective of this phase was the comprehensive application of CP-21 (Mechanical Enforcement over Conventional Enforcement) across all critical application surfaces. This transition ensures that governance is no longer a matter of policy adherence but a structural requirement of the platform's runtime.

## CP-21 Mechanical Enforcement
The platform now mechanically enforces the presence and validity of `ControlPlaneContext` for all governed mutations. This is achieved through:
1. **Frontend Hook Integration**: `useControlPlaneContext` is required for all state-changing operations in `apps/patient-portal` and `apps/website-builder`.
2. **Backend Gate Enforcement**: Every mutation in the Convex backend (including `careTeam`, `patients`, `patientProfile`, `users`, and `websiteBuilder`) utilizes `GovernanceGuard.enforce(args.controlPlaneContext)` as its first instruction.
3. **Fail-Closed Default**: Any mutation attempt lacking a valid governance context will terminate immediately, preventing unauthorized or un-audited state changes.

## Inventory of Enforced Surfaces
The following surfaces are now officially governed under Phase D:
- **apps/patient-portal/**: All patient-facing mutations.
- **apps/website-builder/**: All clinic management and site configuration mutations.
- **packages/control-plane**: The authoritative source of governance types and mutation logic.
- **packages/service-control-adapter**: The bridge enforcing context requirements.
- **packages/tool-gateway**: The central gateway for all tool-based execution.
- **all *-agent-sdk packages**: All SDKs communicating with platform agents.

## Non-Goals
This seal pertains strictly to the application surface closure of Phase D. It does not include:
- Phase E (Data Persistence and Advanced Policy Evaluation).
- Refactoring of legacy read-only queries.
- Implementation of complex multi-agent orchestration beyond basic SDK enforcement.

## Governance Lock
This document serves as a formal lock on Phase D.
- All new governed execution paths **MUST** route through the Control Plane.
- Direct mutations bypassing the governance layer are strictly prohibited.
- Any exception or modification to this enforcement model requires a formal governance decision to reopen Phase D.

## Reopen Conditions
Reopening Phase D requires a majority governance decision and must be justified by:
- Discovery of a fundamental bypass in the mechanical enforcement layer.
- Significant architectural shifts requiring a re-baselining of the application surface governance.
- Expansion of the governance model to previously out-of-scope services that require unique enforcement patterns.

---
**Date**: 2026-01-10  
**Owner**: Principal Software Architect  
**Authority**: Zenthea Platform Governance Committee
