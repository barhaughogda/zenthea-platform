# Slice 18 – Policy & View Versioning – TODO

## 1. Infrastructure (CP-18)
- [x] Define Versioning Types (`packages/tool-gateway/src/versioning/types.ts`)
- [x] Implement Version Resolver (`packages/tool-gateway/src/versioning/resolvers.ts`)

## 2. Registry Enhancements (CP-18)
- [x] Update Policy Registry with versioning fields (`packages/tool-gateway/src/policy-registry.ts`)
- [x] Update Saved View Registry with versioning fields (`packages/tool-gateway/src/saved-view-registry.ts`)
- [x] Update Registry Validation Logic

## 3. API & DTO Extensions (CP-18)
- [x] Extend Operator DTOs with V2 versioning fields (`packages/tool-gateway/src/operator-dtos.ts`)
- [x] Update Audit Event types with versioning metadata (`packages/tool-gateway/src/types.ts`)
- [x] Implement V2 API methods in OperatorAPI (`packages/tool-gateway/src/operator-api.ts`)

## 4. Verification (CP-18)
- [x] Create mandatory test suite (`packages/tool-gateway/src/slice-18.test.ts`)
- [x] Verify resolution logic (latest vs explicit)
- [x] Verify backward compatibility with V1 APIs
- [x] Verify Audit emission with versioning metadata
- [x] Update ROADMAP.md
