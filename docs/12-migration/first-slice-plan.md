# First Migration Slice

## Slice Name
Website Builder UI Migration

## Scope
- Website builder UI only
- No PHI
- No clinical workflows
- No new backend services required
- No auth integration required unless the legacy website builder depends on it

## Objectives
- Validate app composition in `/apps`
- Validate shared UI reuse via `packages/ui`
- Validate builds, CI, and guardrails under real migration pressure
- Establish a repeatable migration workflow

## Execution Steps
1. Create `apps/website-builder`
2. Copy website builder UI code from the legacy repo into the new app
3. Replace any direct API calls with placeholders or local mocks (no new services in Slice 1)
4. Extract reusable presentational components into `packages/ui` (only if clearly reusable)
5. Ensure all imports follow monorepo conventions (no `.js` extensions in TS imports)
6. Run sanity:
   - `pnpm lint`
   - `pnpm test`
   - `pnpm typecheck`
   - `pnpm build`
7. Tag the slice completion

## Exit Criteria
- `apps/website-builder` builds in the platform repo
- CI is green
- No guardrail violations (service isolation, model isolation, tool execution boundary)
- No secrets or environment leakage introduced

## Rollback
- Revert the slice commit(s)
- Reset to `platform-baseline-v1.0.0`

## Post-Slice Tag
- `migration-slice-01-website-builder`