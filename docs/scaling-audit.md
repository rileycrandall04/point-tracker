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
  - [x] **Phase 2: switch reads — global flag rollout** — `off` → `opted-in-only` (canary on own account ~2026-05-17, expanded to 5 high-volume users for a week) → `on` (everyone, 2026-05-22). Blob remains the write target + safety net.
  - [ ] **Phase 3 prerequisite: Cloud Functions server-side dual-write** — Firestore trigger on `users/{uid}/data/data` writes mirrors any `cases[]` changes into the subcollection regardless of client version. Closes the stale-cache loophole that would become data loss in Phase 3. Required before Phase 3 ships.
  - [ ] **Phase 3a: stop client-side blob writes for cases** — only after Cloud Functions trigger has been live + clean for an extended period. Blob's `cases[]` becomes derived state.
  - [ ] **Phase 3b: prune `cases[]` from existing blobs** — final cleanup, separate decision after Phase 3a soaks.
- [ ] **#3 — Bound `sharedCases` reads** ([index.html:7971](../index.html), [index.html:11617](../index.html), [index.html:29347](../index.html)) — entire site history re-pulled on tab change, 30s visibility refresh, and two retry timers. Add date bound + delta sync.
- [ ] **#4 — Admin views are N+1** ([index.html:5607](../index.html), [index.html:5805](../index.html)) — pulls every user's full data blob to render lists. Denormalize an `activitySummary` field.
- [ ] **#5 — `loadAllSiteProcedureSamples` fans out across all sites** ([index.html:8161](../index.html)) — queries `sharedCases` per site, unions client-side. Precompute aggregate stats doc.
- [ ] **#6 — `sharedCaseOverrides` last-write-wins** ([index.html:23698](../index.html)) — concurrent admin edits silently merge. Add transaction or `updatedAt` check.
- [ ] **#7 — `loadUserProfiles` full-collection on startup** ([index.html:8061](../index.html)) — pulls every user to label case rows. Lazy-resolve only referenced uids.
- [ ] **#8 — Lower priority** — `loadSites` cache TTL ([index.html:8077](../index.html)), `localStorage` blob bloat ([index.html:7707](../index.html)), consider `onSnapshot` instead of polling.

## Phase 3 prerequisite — refactor blob-reading code paths

Every code path below currently reads cases directly from `users/{uid}/data/data` (the blob), not from `data.cases` in-memory. These continue working through Phase 2 because the blob is still being maintained by dual-write. **They break in Phase 3a/3b** when blob writes stop and `cases[]` goes stale / empty. Each needs to be refactored to read from `users/{uid}/cases/` subcollection before Phase 3a ships.

Inventory as of 2026-05-17 (line numbers will drift as the file changes — search by function name):

| # | Function | Where | What it does | Refactor for Phase 3 |
|---|---|---|---|---|
| 1 | site-migration cases re-stamp (inside `adminMSSetUserSite`) | [index.html:5640](../index.html) | Re-stamps `siteId` on every case when admin moves user between sites | Iterate target user's `cases/` subcollection, update each doc's `siteId` via batch writes |
| 2 | `adminMigRunComparison` blob count | [index.html:5934](../index.html) | Reads `blob.cases.length` for the Migration tab comparison | Becomes redundant in Phase 3b. Until then, compare `cases/` count to itself or keep as historical signal of stale blob |
| 3 | `adminMSLoadActivity` per-user cases | [index.html:6782](../index.html) | Reads every user's blob `.cases[]` to compute totals + recent counts | Switch to per-user `cases/` count + `where('shiftDate', '>=', weekAgo)` query, or use a denormalized `userProfiles.activitySummary` (overlaps with audit item #4) |
| 4 | `adminLookupUser` (User Data Lookup) | [index.html:8513](../index.html) | Reads blob to display target user's today + 7-day + optional-range cases | Switch to subcollection queries by `shiftDate` |
| 5 | `adminForceCaseMigrate` blob read | [index.html:9282](../index.html) | Copies blob's cases into target's `cases/` subcollection | Becomes obsolete in Phase 3b when blob is canonical. Keep until then for stuck-user recovery |
| 6 | `adminInspectCaseDrift` | [index.html:9329](../index.html) | Reads blob + sub side-by-side for drift inspector | Becomes obsolete in Phase 3b. Keep through 3a as last-resort comparison |
| 7 | `adminReconcileCasesToBlob` (via inspect) | [index.html:9329](../index.html) | Uses inspector to drive write/delete plan | Same as #6 |
| 8 | `loadFromFirestore` initial cases load | [index.html:10070](../index.html) | Populates `data.cases` from blob on app open. In Phase 2, `loadCasesPhase2` immediately replaces with sub contents | In Phase 3a, blob's `cases[]` is stale → keep populating from sub via `loadCasesPhase2` ONLY (skip the blob fallback for cases). In 3b, ignore the field entirely |
| 9 | `readUserRangeDataForSandbox` | [index.html:14165](../index.html) | Reads blob for the Policy Sandbox feature | Switch to subcollection range queries by `shiftDate` |
| 10 | `checkCaseDriftOnOpen` (caller wires `blobCasesLength` in) | [index.html:33xxx](../index.html) | On-open drift detection | Becomes redundant when blob is no longer authoritative. Remove or repurpose to compare sub vs in-memory |
| 11 | User-deletion blob `.delete()` | [index.html:8255](../index.html), [index.html:8316](../index.html) | Both admin user-delete paths only delete the blob doc + settings | Also delete every doc under `users/{uid}/cases/` (batched) so deleted-user cleanup is complete |

**Process when we approach Phase 3:**
1. Walk this list, refactor each entry one PR at a time (one entry per PR is best — keeps blast radius small).
2. For each PR, add a matching scenario to the Scaling Test harness so the refactor is covered.
3. After all 11 are refactored AND the Cloud Functions server-side dual-write trigger is live + soaked, ship Phase 3a.
4. After 3a has been clean for an extended period, ship Phase 3b (prune `cases[]` from existing blobs).

## Future watch items (no action yet, watch for the trigger)

These aren't problems today. Note them so they aren't forgotten when growth eventually makes them ones.

### Shifts subcollection migration

After Phase 3b strips `cases[]` from the blob, **shifts becomes the dominant growth field**. Each shift object is ~200–400 bytes (date, siteId, assignmentType, timeEntries, flags). At ~25 shifts/month per user, that's roughly **90 KB/year of blob growth from shifts alone** — plus ~50 KB/year from `calendarAssignments`, paychecks, etc. Total post-Phase-3 blob growth ≈ 100–150 KB/year per active user.

At that rate, hitting the 1 MiB doc cap takes **10+ years** of continuous use. Not urgent.

**Trigger to start planning:** any user's blob document crosses **500 KB**. Check via Admin → User Data Lookup or the Run Comparison tool's blob count (which we'd repurpose to also show blob size). At 500 KB we still have years of runway, but should start the design / canary cycle.

**Migration shape (when we get there):** mirror exactly what we did for cases. `users/{uid}/shifts/{date}` subcollection — date string is a natural doc id. Three-phase rollout (dual-write → switch reads → strip from blob). Cloud Functions trigger as Phase 3 prerequisite. Scaling Test harness gets matching shift-mutation scenarios. The pattern is now proven; the only thing required is the time to do it carefully.

**Related fields that may need similar treatment eventually** (in order of likely growth pressure): `calendarAssignments`, `paychecks`. Same pattern would apply.

## Workflow

For each item: review pros/cons together → user approves approach → implement → squash-merge → check off.
