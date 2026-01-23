<!--
This document defines the authoritative branch hygiene policy for the zenthea-platform repository.
It provides a deterministic decision process for branch retention, archival, and deletion.
-->

# Branch Hygiene Policy & Runbook

## 1. Purpose
Maintain a clean, high-signal repository by ensuring only active development and critical safety branches persist. Historical context is preserved via immutable tags rather than mutable branches.

### Non-Goals
- Automatic deletion of unmerged work.
- Modification of branch history.
- Enforcement of branch naming conventions (handled via other policies).

## 2. Branch Classes

### Class A: KEEP (Protected)
These branches are never deleted.
- `main`: The production-grade trunk.
- `safety/*`: Critical recovery points (e.g., `safety/pre-ad-push`, `safety/pre-north-star-recovery`).

### Class B: ARCHIVE THEN DELETE
Historical governance and documentation branches.
- `governance/*`
- `docs/*`
**Policy**: Once verified as merged into `main`, these must be tagged for history and then deleted.

### Class C: DELETE
Transient development branches.
- `feat/*`, `feature/*`
- `fix/*`
- `mig/*`, `phase-*`
**Policy**: Delete once merged into `origin/main`. Obsolete/stale branches require manual review or explicit force-deletion.

## 3. Deterministic Decision Process

### Pre-flight Checks
1. **Clean Tree**: `git status` must show no unstaged or uncommitted changes.
2. **Sync**: `git fetch --prune origin` to ensure local view matches remote.

### Merged Status Verification
Run:
```bash
git branch --merged origin/main
```
If a branch appears in this list and is NOT Class A, it is a candidate for deletion.

### Manual Review Required
Branches that are NOT merged into `origin/main` but are no longer active must be:
1. Verified for any unique commits: `git log origin/main..[branch-name]`.
2. If unique commits exist but are obsolete, use Class B archival process before deletion.
3. If unsure, **KEEP** the branch.

## 4. Safe Sequence (Runbook)

### Step 1: Archival (For Class B or Stale Class C)
Before deleting a branch that contains historical value:
```bash
# Example for governance/sl-04-final-seal
git tag archive/governance-sl-04-final-seal-2026-01-23 governance/sl-04-final-seal
git push origin archive/governance-sl-04-final-seal-2026-01-23
```

### Step 2: Local Cleanup
Delete local branches already merged into origin/main:
```bash
git branch -d [branch-name]
```

### Step 3: Remote Cleanup
Delete remote branches already merged into origin/main:
```bash
git push origin --delete [branch-name]
```

## 5. Recovery
If a branch is deleted accidentally:
1. **From Tag**: `git checkout -b [branch-name] archive/[tag-name]`
2. **From Reflog**: `git reflog` to find the last commit hash of the branch, then `git checkout -b [branch-name] [hash]`.

## 6. Concrete Examples (Current State)

Based on current repository state, the following actions are recommended:

| Branch Name | Class | Recommended Action |
| :--- | :--- | :--- |
| `main` | A | **KEEP** |
| `safety/pre-ad-push` | A | **KEEP** |
| `safety/pre-north-star-recovery` | A | **KEEP** |
| `governance/sl-08-final-seal` | B | Tag `archive/governance-sl-08-final-seal-2026-01-23` then delete |
| `docs/phase-e-demo-ui` | B | Tag `archive/docs-phase-e-demo-ui-2026-01-23` then delete |
| `feat/slice-02-contract-tests` | C | Delete if `git branch --merged origin/main` confirms |
| `fix/infra-workspace-compat` | C | Delete if merged |
