# Platform Mapping

This document defines the exact target location for each legacy component
within the platform repository.

## App Mappings

| Legacy Component | Target Location | Notes |
|------------------|-----------------|-------|
| Marketing site | apps/marketing | Public, non-clinical |
| Website builder UI | apps/website-builder | First migration slice |
| Patient portal UI | apps/patient-portal | Patient-scoped UI |
| Provider portal UI | apps/provider-portal | Clinician workflows |
| Company settings UI | apps/admin | Tenant configuration |

## Service Mappings

| Legacy Component | Target Location | Notes |
|------------------|-----------------|-------|
| Scheduling | services/appointment-booking-agent | Proposal-only |
| Clinical AI (advisor, docs) | services/medical-advisor-agent, services/clinical-documentation-agent | Draft-only |
| Patient-facing summaries (AI) | services/patient-portal-agent | Read-only |
| Patient models | services/patient-records | Domain owner (future) |
| Access rules | services/consent-agent | Centralized enforcement |
| Query/repository logic | services/*/data | Service-owned |

## Package Mappings

| Legacy Component | Target Location | Notes |
|------------------|-----------------|-------|
| Auth | packages/auth | Shared primitive |
| CMS | packages/cms | Shared content |
| Audit logging | packages/observability | Compliance-critical |
| Clinical templates/forms | packages/clinical-templates | Structured content |

## External Systems

| Component | Handling Strategy |
|----------|------------------|
| FHIR APIs | Adapter in services/*/integrations |
| Lab systems | Adapter in services/*/integrations |
| Scheduling vendors | Adapter in services/appointment-booking-agent/integrations |