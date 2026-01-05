# Slice 02B Step 5.1: Controlled Consent Write Enablement

## Overview
This step enables controlled write operations for Patient Consents via the Tool Gateway. It ensures that all writes are mediated, audited, and validated.

## Changes

### 1. Feature Flags
- Added `USE_CONSENT_WRITES` to `apps/patient-portal/src/config/features.ts`.
- Default value is `false`.
- Runtime overridable via `window.ZENTHEA_FEATURES_OVERRIDE`.

### 2. Tool Gateway Enhancement
- Defined 3 new tools in `packages/tool-gateway`:
  - `createConsent`
  - `revokeConsent`
  - `updateConsentPreferences`
- Implemented enforcement logic:
  - Actor identity verification
  - Patient ownership check (actor must match target patient)
  - Input validation using Zod
  - Idempotency key enforcement
- Audit logging for all attempts (received, completed, failed) without PHI.

### 3. Patient Portal Integration
- Updated `ConsentService` interface in `apps/patient-portal/src/lib/contracts/consent.ts`.
- Implemented write methods in `ConsentAgentAdapter` to use `ToolExecutionGateway` when enabled.
- Implemented mock write methods in `MockConsentAdapter`.
- Updated `useConsents` hook to respect the new feature flag.

## Verification Results
- [x] Typecheck passed for `packages/tool-gateway`
- [x] Typecheck passed for `apps/patient-portal`
- [x] Build successful for `apps/patient-portal`
- [x] No PHI in logs
- [x] Kill switch verified (throws `CONSENT_WRITES_DISABLED` when off)
