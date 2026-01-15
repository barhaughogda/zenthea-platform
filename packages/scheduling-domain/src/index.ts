/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 *
 * ---
 *
 * Phase Y-02 Overview:
 *
 * This package implements the first executable-domain skeleton for the
 * Scheduling domain, strictly as non-operational scaffolding.
 *
 * This phase materializes previously locked design decisions from:
 * - Phase W-04: Scheduling and Orders Execution Design
 * - Phase X-05: Execution Control, Safeguards, and Rollback Semantics
 * - Phase Y: Execution Build Overview
 *
 * This phase DOES NOT introduce runtime behavior.
 *
 * ---
 *
 * Binding Authorities:
 *
 * | Document | Location |
 * |----------|----------|
 * | Architecture Baseline Declaration | architecture-baseline-declaration.md |
 * | Phase W-04: Scheduling and Orders Execution Design | phase-w-04-scheduling-and-orders-execution-design.md |
 * | Phase X-05: Execution Control and Safeguards | phase-x-05-execution-control-and-safeguards.md |
 * | Phase Y: Execution Build Overview | phase-y-execution-build-overview.md |
 *
 * ---
 *
 * Hard Constraints (per Phase Y Overview §5):
 *
 * - NO runtime execution or process activation
 * - NO deployment or activation of background workers or cron jobs
 * - NO persistent database writes or state modifications
 * - NO outbound or inbound network calls
 * - NO silent behavior changes to existing systems
 * - NO toggling feature flags to enable any form of execution
 *
 * ---
 *
 * What This Package Provides:
 *
 * 1. Type definitions for scheduling and order records (per W-04 §4, §6)
 * 2. State enumeration and classification (per W-04 §6.1, §6.4)
 * 3. Transition validation (per W-04 §6.2-6.3, §6.5-6.6)
 * 4. Human authority requirements (per W-04 §7)
 * 5. Domain-level execution controls (per X-05 §5.3)
 * 6. Safeguard definitions (per X-05 §6)
 * 7. Fail-closed execution block
 * 8. Audit evidence types (per W-04 §9)
 *
 * ---
 *
 * EXECUTION STATUS: BLOCKED
 *
 * All execution remains BLOCKED until:
 * - Explicit authorisation is issued through the established governance process
 * - Phase W-01 execution readiness entry criteria have been satisfied
 * - Phase W-03 (Identity & Consent) is executable
 * - Implementation has been reviewed for conformance with design
 * - Human authority structures are in place and operational
 * - Kill-switch and rollback mechanisms are operational
 * - Audit mechanisms are operational
 */

// Types
export * from './types';

// States
export * from './states';

// Transitions
export * from './transitions';

// Control
export * from './control';

// Execution Block
export * from './execution-block';

// Audit Types
export * from './audit-types';
