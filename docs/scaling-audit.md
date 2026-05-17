# Scaling Audit — Working Through Before Onboarding More Users

Snapshot of the user-count scaling review run on 2026-05-05. Items are ordered by impact. Each one needs a pros/cons review before implementation.

## Guiding principle

**Data preservation is the top priority.** Every Phase 2/3 step must be reversible, and no enabling step ships until we can prove data can't be lost. No silent auto-fixes — drift is detected and surfaced to admin for review, never repaired without explicit approval. Kill switches at every step (per-user + global). The blob stays as a safety net through Phase 2 and 3a; Phase 3b (blob removal) only after extended clean soak.

## Test harness contract

The **Scaling Test** admin tab runs isolated validation scenarios against shadow paths (`users/{uid}/scalingTestCases/...` and `users/{uid}/scalingTestData/blob`) that never touch production code paths or shared collections. It's the safety net for advancing rollout stages: **run it before every transition and after every code change to the dual-write logic**.

**Keep-in-sync rule**: whenever we modify a production function the harness mirrors (`writeCaseDoc`, `deleteCaseDoc`, `backfillCaseSubcollection`, `loadCasesPhase2`, `adminReconcileCasesToBlob`), update the corresponding shadow function in the harness in the same PR. Whenever we add a new phase capability (e.g., Phase 3 Cloud Functions trigger), add a scenario that exercises it. The point of the harness is that it continues to validate the system as it evolves.

## Status

- [x] **#1 — Dirty-track shared-shifts sync** ([index.html:7717](../index.html), [index.html:7903](../index.html)) — every save rewrites every shift the user has ever logged. Cut to write only what changed. _Done in PR #347 via diff cache primed once per session._
- [ ] **#2 — Migrate per-user data blob off the 1 MiB ceiling** ([index.html:7707](../index.html), [index.html:7768](../index.html)) — `users/{uid}/data/data` will silently fail at ~1,500 cases/year × 2–4 years. Move cases to a subcollection.
  - [x] **Phase 1: dual-write + backfill** — every case mutation mirrors to `users/{uid}/cases/{caseId}`; one-time backfill on login. Reads still on blob. Kill switch `settings.dualWriteCasesEnabled`.
  - [x] **Phase 1a: tooling & visibility** — admin Migration tab (PR #388), drift inspector + reconcile-to-blob (#389), force re-sign-in for stuck users (#390), running version display (#391), date-range User Data Lookup (#392), per-write failure logging + on-open drift detection + 30-min SW update nudge (#393), isolated Scaling Test harness (this PR).
  - [ ] **Phase 2: switch reads — global flag rollout** — `off` → `opted-in-only` (canary on own account, watch diagnostics) → `on` (everyone). Blob stays as the write target and safety net throughout.
  - [ ] **Phase 3 prerequisite: Cloud Functions server-side dual-write** — Firestore trigger on `users/{uid}/data/data` writes mirrors any `cases[]` changes into the subcollection regardless of client version. Closes the stale-cache loophole that would become data loss in Phase 3. Required before Phase 3 ships.
  - [ ] **Phase 3a: stop client-side blob writes for cases** — only after Cloud Functions trigger has been live + clean for an extended period. Blob's `cases[]` becomes derived state.
  - [ ] **Phase 3b: prune `cases[]` from existing blobs** — final cleanup, separate decision after Phase 3a soaks.
- [ ] **#3 — Bound `sharedCases` reads** ([index.html:7971](../index.html), [index.html:11617](../index.html), [index.html:29347](../index.html)) — entire site history re-pulled on tab change, 30s visibility refresh, and two retry timers. Add date bound + delta sync.
- [ ] **#4 — Admin views are N+1** ([index.html:5607](../index.html), [index.html:5805](../index.html)) — pulls every user's full data blob to render lists. Denormalize an `activitySummary` field.
- [ ] **#5 — `loadAllSiteProcedureSamples` fans out across all sites** ([index.html:8161](../index.html)) — queries `sharedCases` per site, unions client-side. Precompute aggregate stats doc.
- [ ] **#6 — `sharedCaseOverrides` last-write-wins** ([index.html:23698](../index.html)) — concurrent admin edits silently merge. Add transaction or `updatedAt` check.
- [ ] **#7 — `loadUserProfiles` full-collection on startup** ([index.html:8061](../index.html)) — pulls every user to label case rows. Lazy-resolve only referenced uids.
- [ ] **#8 — Lower priority** — `loadSites` cache TTL ([index.html:8077](../index.html)), `localStorage` blob bloat ([index.html:7707](../index.html)), consider `onSnapshot` instead of polling.

## Workflow

For each item: review pros/cons together → user approves approach → implement → squash-merge → check off.
