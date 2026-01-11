# MIG-06 v2 — Design Outline (Conceptual Only; Non-Autonomous; Non-Regression)

**Authority:** GOVERNANCE / MIG-06 v2 DESIGN  
**Scope:** DESIGN ONLY (no implementation details).  

---

## 1. Relationship to MIG-06 v1 (Non-Regression Statement)

MIG-06 v2 MUST be a **strict non-regression** relative to MIG-06 v1 and the MIG-06 execution contract.

- v2 MUST NOT relax, reinterpret, or bypass any MIG-06 v1 invariants.
- v2 MUST NOT introduce autonomy (no self-triggering, no self-expansion, no self-resumption).
- v2 MUST preserve v1’s **deny-by-default** and **fail-closed** posture at every governance boundary.

The following v1 invariants are treated as **non-negotiable** and MUST remain true in any v2 evolution path:

- **Synchronous governance rail**: the orchestration rail remains synchronous-only; any dependency behavior that cannot be treated as synchronous/authoritative MUST fail closed.
- **Explicit invocation only**: attempts exist only when explicitly invoked by an approved caller context; v2 MUST NOT create background loops, daemons, workers, or self-initiated triggers.
- **No retries**: v2 MUST NOT introduce implicit or explicit retries for policy, execution, audit, or any downstream boundary.
- **Terminal determinism**: each attempt MUST end in a single, deterministic terminal state; unexpected conditions MUST remain fail-closed.
- **Single-step safety posture (v1 preserved)**: v2 MUST NOT retroactively broaden v1’s single-step guarantee; any multi-step concept MUST be treated as hazardous and gated as a separate, explicit design question (see §7).
- **Metadata-only / no PHI/PII**: orchestration artifacts, decision signals, audit material, correlation identifiers, and outputs MUST remain metadata-only; PHI/PII inclusion MUST remain an abort condition.
- **No durable orchestration state**: the orchestration rail MUST NOT become a durable workflow state store; persistence beyond the audit boundary remains forbidden.
- **No new Control Plane contracts and no runtime authoring**: v2 MUST NOT widen Control Plane interfaces or add runtime policy/view/workflow authoring surfaces.
- **No background platform and no queues**: v2 MUST NOT require or introduce message brokers, schedulers, queue workers, or deferred completion semantics.
- **No caching of sensitive paths**: execution/decision/mutation/audit paths MUST remain non-cacheable.
- **Draft-only doctrine preserved**: any clinical assistance output remains draft-only and MUST NOT imply signing/finalization/attestation/write-back.

---

## 2. Problems Explicitly Out of Scope for v1

v1 intentionally excludes several problem areas. v2 MAY explore conceptual approaches to reduce pressure in these areas, but MUST NOT violate v1 invariants while doing so.

- **Async dependency integration**: v1 treats Promise/async behavior at governance boundaries as non-authoritative and abort-worthy; “making it async” is out of scope.
- **Post-terminal actionability**: v1 terminalization prevents any “continuing work later” semantics within the same attempt.
- **Multi-step orchestration**: v1 forbids multi-step workflows and concurrent execution.
- **Background execution and scheduling**: v1 forbids queues, workers, cron, and daemons.
- **Retries and resilience loops**: v1 forbids retries and best-effort delivery.
- **Broader trigger taxonomy**: v1 accepts exactly one trigger classification; expansion is out of scope.
- **Write-controlled orchestration expansion**: v1 does not expand mutation surfaces; any broader mutation posture remains out of scope.
- **Operator surface changes**: v1 forbids new UI/operator product surfaces.

---

## 3. Design Pressures Identified from v1

The following pressures are observable from v1 behavior and constraints, and they motivate v2 *design exploration* (not implementation):

- **Pressure: “Async systems exist”**  
  - Many real-world dependencies behave asynchronously (including audit/logging systems). v1’s strict sync boundary correctly aborts in such cases, but the operational pressure to “do work anyway” tends to increase.
- **Pressure: “Terminal outcomes are final”**  
  - v1 terminalization prevents deferred completion. That protects governance, but creates pressure for a “continuation” concept that is still non-autonomous and still deterministic.
- **Pressure: “More steps seem useful”**  
  - Teams often want multi-step orchestration to perform validation → enrichment → decision → action sequences. This creates governance risk because it increases state, branching, and the temptation to add retries or background execution.
- **Pressure: “Operator expectations vs governance constraints”**  
  - Operators may expect progress despite transient boundary issues. v1 correctly refuses best-effort behavior; v2 needs conceptual language that explains why the refusal is a safety feature, not a defect.

---

## 4. Candidate v2 Capabilities (Conceptual Only)

All candidates below are **conceptual**. They MAY be discussed as evolution paths, but MUST NOT be interpreted as approved implementation scope.

### 4.1 Sync governance proxy for async systems (concept)

v2 MAY define a **sync governance proxy** concept for integrating with inherently async dependencies without making the orchestration rail async.

- The proxy conceptually acts as a **governance-controlled adapter** that exposes a *synchronous, authoritative surface* to the orchestration rail.
- If the proxy cannot provide synchronous, authoritative confirmation (e.g., returns a Promise-like ambiguity), the attempt MUST fail closed exactly as in v1.
- The proxy MUST NOT create hidden background completion loops on behalf of the orchestration rail.
- The proxy MUST NOT silently “buffer and deliver later” in a way that would simulate retries or deferred completion.

This concept exists to preserve the v1 invariant: **the orchestration rail can only proceed when governance boundaries are provably satisfied synchronously**.

### 4.2 Post-terminal continuations (concept)

v2 MAY introduce a strictly-governed concept of **post-terminal continuation** that does not violate v1 terminality.

Non-regression framing:

- A “continuation” MUST NOT be a resumption of a prior attempt.
- A “continuation” MUST be modeled conceptually as a **new attempt** that references prior terminal evidence (metadata-only) and is evaluated by policy as a fresh invocation.
- A “continuation” MUST NOT be automatic. It MUST require explicit invocation context (operator/service boundary) and a fresh policy gate.
- A “continuation” MUST NOT behave like a retry. It MUST NOT assume equivalence to “try again until it works”.

This concept exists to allow “what next?” decisions after a safe abort/deny, while keeping the invariant that v1 attempts remain terminal and deterministic.

### 4.3 Stronger “attempt provenance” as governance evidence (concept)

v2 MAY strengthen the conceptual notion of provenance for audit/decision review without adding new persistence surfaces.

- Provenance MAY be represented as metadata-only links between attempts (e.g., “this attempt was initiated as a continuation of attempt X”).
- Provenance MUST NOT include PHI/PII and MUST NOT become a durable workflow store.

### 4.4 Controlled trigger taxonomy expansion (concept)

v2 MAY discuss broadening trigger categories conceptually, but only under strict non-autonomy constraints:

- Any new trigger category MUST remain policy-driven, deny-by-default, and auditable (metadata-only).
- Triggers MUST NOT create background loops or implicit scheduling semantics inside the orchestration rail.

### 4.5 Why multi-step orchestration is dangerous (explicit conceptual note)

Multi-step orchestration is dangerous because it tends to introduce:

- **Implicit statefulness**: more steps typically require intermediate state, which pressures the system toward durable persistence (forbidden) or hidden caching (forbidden).
- **Branching and ambiguity**: multiple steps increase the chance of partially-completed work and “what should happen next?” forks that are hard to make deterministic.
- **Retry temptation**: partial failures often invite retries; retries are forbidden and can silently become autonomy if automated.
- **Concurrency pressure**: parallel steps and timeouts commonly emerge; concurrency and background execution are forbidden in v1 and remain high-risk in any v2.

v2 MUST treat multi-step orchestration as a governance hazard unless a design can prove it remains deterministic, synchronous at boundaries, and non-autonomous without retries or durable state. That proof MAY be non-trivial and remains an open question (see §7).

### 4.6 Why agent autonomy remains forbidden (explicit conceptual note)

Agent autonomy remains forbidden because it undermines the structural guarantees MIG-06 exists to enforce:

- **Loss of explicit invocation**: autonomy shifts control from policy-gated caller context to system-initiated behavior.
- **Unbounded scope expansion risk**: autonomous agents tend to chain actions (“while there is more to do…”) which becomes multi-step orchestration and/or retries in disguise.
- **Auditability degradation**: autonomous behavior increases the chance of non-deterministic sequences and ambiguous intent, weakening governance evidence.
- **Safety boundary erosion**: autonomy increases the likelihood of side effects without explicit approvals and without operator-visible decision points.

Therefore, v2 MUST NOT introduce self-triggering, self-resumption, self-scheduling, or self-directed expansion of steps or tools.

---

## 5. Explicit Non-Goals for v2

v2 MUST NOT pursue the following:

- **Autonomy of any kind** (including “limited” autonomy, background follow-ups, or automatic continuations).
- **Async orchestration rail** (no deferred completion, no awaiting, no background completion semantics).
- **Retries** (no implicit retry loops, no “eventual success” behaviors).
- **Background job infrastructure** (no queues, brokers, schedulers, workers, daemons).
- **Durable workflow state** (no persisted orchestration state beyond the audit boundary).
- **Multi-step execution as the default** (multi-step remains hazardous; if discussed, it MUST remain explicitly gated and unresolved by design).
- **Any PHI/PII presence in orchestration artifacts** (including logs, audits, decision signals, correlation identifiers, or “context payloads”).
- **Clinical finalization/signing/attestation/write-back**.
- **New Control Plane contracts** or **runtime authoring** of policy/view/workflow artifacts.
- **Caching** of execution/decision/mutation/audit paths.

---

## 6. Governance Risks Introduced by v2

Even as design exploration, v2 introduces conceptual risks that MUST be acknowledged:

- **Risk: “Continuation == retry” confusion**  
  - Continuations could be misinterpreted as a retry mechanism. v2 MUST preserve the distinction: a continuation is a new, explicitly invoked attempt, not an automated replay.
- **Risk: sync proxy becomes a hidden async engine**  
  - A “proxy” concept could drift into buffering, background delivery, or best-effort semantics. That would violate v1 invariants; v2 MUST explicitly forbid it.
- **Risk: multi-step pressure increases**  
  - Introducing continuations and proxies may make multi-step orchestration feel “close”. Without strict boundaries, this can lead to hidden state, retries, and autonomy.
- **Risk: evidence dilution**  
  - More conceptual surfaces (continuations, proxies) can make audits harder to interpret unless provenance rules remain metadata-only, deterministic, and deny-by-default.
- **Risk: boundary leakage**  
  - Additional abstraction can accidentally allow sensitive data (PHI/PII) to slip into correlation identifiers, logs, or audit events. v2 MUST maintain fail-closed data boundary enforcement.

---

## 7. Open Design Questions (Unanswered by Design)

The following questions remain intentionally unanswered in this outline:

- **Sync governance proxy definition**:
  - What constitutes “synchronous and authoritative confirmation” for a dependency that is natively async?
  - What evidence is sufficient to treat a dependency response as non-Promise / non-async in a way that remains deterministic?
- **Post-terminal continuation semantics**:
  - What metadata-only evidence is allowed/required to reference a prior attempt without creating durable workflow state?
  - How is “not a retry” enforced conceptually and governably (especially under operator pressure)?
- **Multi-step orchestration boundary**:
  - Is there any multi-step model that can remain deterministic, synchronous at governance boundaries, non-autonomous, non-retrying, and non-persistent?
  - If such a model exists, what is the minimum proof required before it could be considered?
- **Trigger taxonomy**:
  - Which trigger categories (if any) can be expanded without creating implicit scheduling or autonomy?
  - What is the minimal governance evidence required for any non-operator trigger to remain “policy-driven only”?
- **Failure taxonomy interaction**:
  - How should “blocked due to async boundary ambiguity” be represented in a way that stays deterministic and avoids prompting retries/autonomy?
- **Operator expectations**:
  - What operator-facing explanation patterns preserve safety without implying that the system will “eventually complete” in the background?

