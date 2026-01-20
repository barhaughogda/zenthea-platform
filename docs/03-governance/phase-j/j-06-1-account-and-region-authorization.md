# Phase J.6.1 — Account and Region Authorization

## 1. Purpose
This governance artifact defines and authorizes the conceptual account and region model for the Zenthea platform. This phase is strictly for DESIGN-ONLY authorization and establishes the architectural boundaries for future infrastructure implementation.

## 2. Design-Only Confirmation
This document is a governance-only authorization. It strictly adheres to the following constraints:
- No Infrastructure-as-Code (IaC) implementation.
- No provider blocks or backend configurations.
- No account IDs or numerical identifiers.
- No concrete region identifiers (e.g., us-east-1).
- No credentials, secrets, or authentication tokens.

## 3. Account Model (Conceptual)
The platform authorizes the use of distinct, isolated accounts to manage lifecycle stages:
- **Production Account**: Dedicated exclusively to production workloads and state.
- **Non-Production Account**: Dedicated to development, staging, and testing workloads.
- **Mandatory Isolation**: Account isolation is strictly required. There shall be no shared state, shared credentials, or shared blast radius between the Production and Non-Production accounts.

## 4. Region Model (Conceptual)
The platform authorizes a primary/secondary region model for high availability and disaster recovery:
- **Primary Region**: The default deployment target for all services.
- **Secondary Region**: The failover and redundancy target.
- **Abstract Identification**: Regions are treated as abstract labels only. No concrete regional identifiers are authorized at this stage.

## 5. Environment Mapping Rules
Environments map deterministically to accounts to ensure strict logical separation:
- Each environment (e.g., dev, staging, prod) must map to exactly one account.
- Each environment must have its own isolated state.
- Cross-environment access is strictly prohibited at the account level.

## 6. Human Geography Statement
Developer physical location is NOT an authorization factor for system access or resource deployment. All access decisions are based strictly on authenticated identity and authorized roles, independent of geographic location.

## 7. Safety Invariants
- **Fail-Closed**: All authorization and routing must default to a "fail-closed" state.
- **No Implicit Defaults**: Every configuration must be explicitly defined in future phases.
- **Explicit Requirement**: No infrastructure may be provisioned without explicit configuration that adheres to these authorized models.

## 8. Explicit Prohibitions
The following actions and artifacts are strictly prohibited in this phase:
- No execution of any scripts or commands.
- No CI/CD pipeline configuration.
- No IAM role or policy definitions.
- No account or region literals/names.
- No provider credentials or service account keys.

## 9. Phase Boundaries
- **J.6.1 (Current)**: Authorizes the conceptual model for accounts and regions.
- **J.6.2 (Next)**: Will authorize the selection of the state backend.
- **Dependency**: Phase J.6.2 cannot be authorized until J.6.1 is completed and locked.

## 10. Lock Statement
Phase J.6.1 is hereby AUTHORIZED and LOCKED.
