# Scaling Audit — Working Through Before Onboarding More Users

Snapshot of the user-count scaling review run on 2026-05-05. Items are ordered by impact. Each one needs a pros/cons review before implementation.

## Status

- [ ] **#1 — Dirty-track shared-shifts sync** ([index.html:7717](../index.html), [index.html:7903](../index.html)) — every save rewrites every shift the user has ever logged. Cut to write only what changed.
- [ ] **#2 — Migrate per-user data blob off the 1 MiB ceiling** ([index.html:7707](../index.html), [index.html:7768](../index.html)) — `users/{uid}/data/data` will silently fail at ~1,500 cases/year × 2–4 years. Move cases to a subcollection.
- [ ] **#3 — Bound `sharedCases` reads** ([index.html:7971](../index.html), [index.html:11617](../index.html), [index.html:29347](../index.html)) — entire site history re-pulled on tab change, 30s visibility refresh, and two retry timers. Add date bound + delta sync.
- [ ] **#4 — Admin views are N+1** ([index.html:5607](../index.html), [index.html:5805](../index.html)) — pulls every user's full data blob to render lists. Denormalize an `activitySummary` field.
- [ ] **#5 — `loadAllSiteProcedureSamples` fans out across all sites** ([index.html:8161](../index.html)) — queries `sharedCases` per site, unions client-side. Precompute aggregate stats doc.
- [ ] **#6 — `sharedCaseOverrides` last-write-wins** ([index.html:23698](../index.html)) — concurrent admin edits silently merge. Add transaction or `updatedAt` check.
- [ ] **#7 — `loadUserProfiles` full-collection on startup** ([index.html:8061](../index.html)) — pulls every user to label case rows. Lazy-resolve only referenced uids.
- [ ] **#8 — Lower priority** — `loadSites` cache TTL ([index.html:8077](../index.html)), `localStorage` blob bloat ([index.html:7707](../index.html)), consider `onSnapshot` instead of polling.

## Workflow

For each item: review pros/cons together → user approves approach → implement → squash-merge → check off.
