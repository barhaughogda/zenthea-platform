# MIG-06 v1 → Zenthea Product Workflow Mapping

**Objective:** Map **MIG-06 v1** capabilities to concrete Zenthea product workflows to clarify where orchestration **SHOULD** and **SHOULD NOT** be used.

**Scope:** Documentation-only mapping of **v1 as implemented/defined** (no new orchestration features proposed).

---

## What MIG-06 is (plain English)

MIG-06 defines a **governance-locked orchestration execution model**: a constrained way to *coordinate* calls to already-governed platform surfaces (policies, decision hooks, and strictly-allowlisted side effects), with deterministic, auditable, fail-closed behavior.

In **v1**, MIG-06 is deliberately minimal: it exists primarily as a **verification rail** that proves a single orchestration attempt can be triggered, policy-gated, executed, audited, and terminated within sealed Phase E constraints.

---

## Non-negotiable framing (explicit)

- **MIG-06 is a permissioned execution gate, not a workflow engine.**
- **MIG-06 answers “may we do this now?”, not “how should we do this?”**

Practical implication: if a product workflow primarily needs *sequencing, state machines, retries, scheduling, background processing, or long-running multi-step progression*, that is **workflow-engine territory** and is explicitly **not** what MIG-06 v1 provides.

---

## MIG-06 v1 capabilities (what the slice actually supports)

MIG-06 v1 (as defined in the v1 plan/retro) is intentionally narrow:

- **Single trigger classification**: only `MIG06_V1_CLINICAL_DRAFT_ASSIST` is accepted; all other classifications are rejected (deny-by-default).
- **Single-step, synchronous execution**: one permitted step (`CLINICAL_DRAFT_GENERATION`), executed without background work.
- **Draft-only / no clinical write-back**: explicitly forbids clinical finalization, signing, attestation, write-back, or state advancement.
- **No background automation infrastructure**: forbids jobs/workers/queues/schedulers as execution mechanisms.
- **No retries** (implicit or explicit), **fail-closed** on policy/audit/dependency failures.
- **Metadata-only boundaries** and **no PHI/PII in orchestration artifacts**.

---

## Where MIG-06 v1 is appropriate (SHOULD be used)

These workflows benefit from MIG-06 v1 specifically because they need a **synchronous, deterministic, policy-gated “permission check + governed run”** for a *single attempt*.

| Product workflow | Use MIG-06 v1? | Reasoning (why it fits v1) |
|---|---:|---|
| **Clinical draft assist** (operator-initiated, single request → draft assistance output) | **Yes** | Matches the only accepted v1 trigger classification (`MIG06_V1_CLINICAL_DRAFT_ASSIST`) and the only permitted single-step execution (`CLINICAL_DRAFT_GENERATION`). This is the canonical “gate then run once” use case: determinism + audit + fail-closed without implying workflow progression or write-back. |

---

## Where MIG-06 must NOT be used (v1 hard NO)

These workflows either (a) require capabilities that MIG-06 v1 explicitly forbids, or (b) would misuse MIG-06 as a workflow engine instead of a permission gate.

| Product workflow | Use MIG-06 v1? | Reasoning (why it must NOT be used) |
|---|---:|---|
| **Clinical note finalization** (signing/attestation/locking/write-back) | **No** | MIG-06 v1 explicitly forbids clinical finalization, signing, attestation, and write-back. Using MIG-06 here would also blur the governance boundary by implying orchestration can advance clinical state, which is out of scope and prohibited. |
| **Medication suggestion** (clinical decision support) | **No** | v1 only supports the clinical *draft assist* trigger/step. Medication suggestions are high-risk and often imply patient-specific context handling and downstream clinical actions; MIG-06 v1 is not a general-purpose “run clinical intelligence” plane and must not be treated as such. |
| **Chat-based assistance** (interactive, multi-turn) | **No** | Multi-turn chat is a product interaction pattern, not an orchestration problem. Treating chat as “orchestration” invites workflow-engine behaviors (stateful progression, branching, persistence), all of which v1 disallows. MIG-06 should not be inserted into every inference call; it’s a gate for specific, permissioned execution attempts. |
| **Background enrichment jobs** (async enrichment, scheduled/queued processing) | **No** | MIG-06 v1 (and the MIG-06 orchestration model) explicitly rejects background jobs/workers/queues/schedulers as an execution engine. If a workflow requires background processing, MIG-06 v1 is the wrong tool by design. |

---

## Decision rule of thumb (to avoid “MIG-06 everywhere”)

Use MIG-06 v1 only when **all** of the following are true:

- The workflow is an explicit **one-shot attempt** that must be **policy-gated at execution time**.
- The workflow can run **synchronously** (no workers, no deferred completion).
- The workflow is **draft-only** (no clinical write-back/finalization).
- The orchestration layer can stay **metadata-only** (no PHI/PII in orchestration artifacts).

Otherwise, MIG-06 v1 should not be used, because it would either violate constraints or incorrectly treat a **permission gate** as a **workflow engine**.

