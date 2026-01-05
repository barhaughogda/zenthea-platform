# Platform Mapping

## Mapping Rules
- Apps compose services via SDKs
- Services do not import services
- Packages contain no business logic

## Mapping Table

| Legacy Component | Target Location |
|------------------|-----------------|
| Website builder | apps/marketing |
| CMS logic | packages/cms |
| Scheduling | services/appointment-booking-agent |
| Patient chat | services/patient-portal-agent |