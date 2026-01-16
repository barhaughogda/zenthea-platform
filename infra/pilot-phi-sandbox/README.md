# Pilot PHI Sandbox Boundary

- **Purpose**: Pilot PHI Sandbox boundary (infra only)
- **Authorized by**: Phase AP-01
- **Status**: Infrastructure provisioned (Apply pending)
- **Restrictions**: 
  - No PHI ingestion authorized
  - No application runtime/execution authorized
  - No compute resources authorized
- **Kill switch**: IAM disable + SG lockdown
- **Destruction**: `terraform destroy`
