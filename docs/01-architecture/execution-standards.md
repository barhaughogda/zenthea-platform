# Execution Standards (Slices & Phases)

## 1. Hierarchy of Work
Work on the Zenthea Platform is categorized into two tracks to ensure governance precedes capability:

- **Control Plane Slices (CP-xx)**: Infrastructure, governance, observability, and safety mechanisms.
- **Migration Slices (MIG-xx)**: Product features, domain logic, and legacy system extraction.

## 2. Legend & Status Definitions
| Status | Definition |
| :--- | :--- |
| **Completed** | Implemented, verified, and sealed. Docs, code, and tests are aligned. |
| **In Progress** | Actively being implemented on a feature branch. |
| **Planned** | Specified and approved, but execution has not started. |
| **Draft** | Placeholder/scaffolding only; not authoritative guidance. |
| **Unknown** | Not yet documented or scoped. |

## 3. Mandatory Process Checklist
For any slice moving from **Draft/Planned → In Progress → Completed**:
1. **Spec Finalization**: Update the slice specification with finalized acceptance criteria.
2. **Implementation**: Build code and tests behind existing governance boundaries.
3. **Verification**: Run all required validation commands and AI evals.
4. **Evidence**: Add links to code paths, test results, and closure statements.
5. **Sealing**: Mark as **Completed** in the Roadmap and seal the documentation.

## 4. Phase Definitions
- **Phase A**: Complete the Agent Surface (Scaffold Only).
- **Phase B**: Legacy Repository Analysis.
- **Phase C**: Migration by Extraction (Domain-by-Domain).
- **Phase D**: Integration, Hardening, and Readiness.
