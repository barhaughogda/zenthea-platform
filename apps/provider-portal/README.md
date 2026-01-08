# Provider Portal (Clinical)

## Purpose

The Provider Portal is the clinical-facing application for Zenthea.

This phase (MIG-03 Phase 1) scaffolds the application only:
- Next.js App Router
- Tailwind + TypeScript + ESLint
- Shared UI via `@starter/ui`

No legacy migration, no mocks, and no service integration yet.

## Target Users

- Clinicians and clinical staff (providers)

## Services / SDKs

TBD (Phase 2+).

## Local Development

From repo root:

```bash
pnpm -C apps/provider-portal dev
```

## Build

```bash
pnpm -C apps/provider-portal build
```

## Security & Compliance Notes

- This app must avoid handling PHI until auth, tenant context, and policy gates are implemented.
- No secrets belong in frontend code.

