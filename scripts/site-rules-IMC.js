// IMC (Intermountain Medical Center, site ID: IMC) compensation rules — FILLED IN.
//
// See top of file for format docs in the original template; preserved here.
//
// Per user: ignore "Tier" designations entirely. Tier positions are general OR
// (placement) except for the named exceptions (APS, CV1/2, Liver 1/2) which
// are captured below as their own shift types.
//
// Extra fields used here (need wiring in comp engine + UI):
//   productionMultiplier: N   — multiplies production points (OB shifts only)
//   flatPoints: N             — flat point award regardless of duration
//   noProductivity: true      — disables AR rate + case point calc; pay = flatPoints
//   cardiacBonus: true        — exposes UVH "Subspecialty coverage" checkbox
//                               at shift entry (+45 pts/day flat when toggled)
//   liverBonus: true          — same idea but for liver subspecialty
//
// Note: ORs (placement shifts) get the same 4hr / 80pt minimum that UVH OR
// uses. Wired generically in the engine.

module.exports = {
  siteId: 'IMC',
  shiftRulesOverride: {

    // ============================================================
    // CALL SHIFTS — 1st-4th call inherit UVH equivalents.
    // (At IMC these are also referred to as "OR 1, 2, 3, 4" — same shift.)
    // ============================================================

    'IMC_1st_call': { label: 'IMC 1st Call', inherit_uvh: '1st_call' },
    'IMC_2nd_call': { label: 'IMC 2nd Call', inherit_uvh: '2nd_call' },
    'IMC_3rd_call': { label: 'IMC 3rd Call', inherit_uvh: '3rd_call' },
    'IMC_4th_call': { label: 'IMC 4th Call', inherit_uvh: '4th_call' },

    // Night Call: restricted in-house. AR rate only — no pager pay,
    // no unrestricted call. Standard time-of-day multipliers apply via AR engine.
    'IMC_night_call': {
      label: 'IMC Night Call',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'general' }
    },
    'IMC_night_call_forced_off': {
      label: 'Forced Off Night Call',
      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' },
      flatPoints: 56
    },

    // ============================================================
    // SUBSPECIALTY CALLS — pager + unrestricted (UVH 1st-call hours)
    // + 45-pt subspec bonus toggle. Total 94 weekday / 129 weekend
    // when subspec bonus is on (49/84 pager + 45 subspec).
    // ============================================================

    'IMC_cv_1st_call': {
      label: 'IMC CV 1st Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },
    'IMC_cv_2nd_call': {
      label: 'IMC CV 2nd Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },
    'IMC_liver_1st_call': {
      label: 'IMC Liver 1st Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      liverBonus: true
    },
    'IMC_liver_2nd_call': {
      label: 'IMC Liver 2nd Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      liverBonus: true
    },

    // ============================================================
    // APS / Acute Pain — weekday-only unrestricted call
    // (49 pts = 14hr × 3.5/hr; no weekend pager)
    // ============================================================

    'IMC_acute_pain_call': {
      label: 'IMC Acute Pain Call (APS)',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: null },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: null },
      arRate: { mode: 'general' }
    },

    // ============================================================
    // Endo Call / IP Endo — weekend-only unrestricted call (24hr)
    // ============================================================

    'IMC_endo_call': {
      label: 'IMC Endo Call (IP Endo)',
      pagerWindow: { weekday: null, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: null, weekend: 'all' },
      arRate: { mode: 'general' }
    },

    // ============================================================
    // AOD — weekday 07:00-17:00, no productivity, flat 235 pts
    // ============================================================

    'IMC_aod_plus1': {
      label: 'IMC AOD (Plus 1)',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'general' },
      flatPoints: 235,
      noProductivity: true
    },

    // ============================================================
    // OB 24hr — no pager, OB rate, production doubled
    // ============================================================

    'IMC_OB_24hr': {
      label: 'IMC OB 24hr',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },
    'IMC_OB_forced_off': {
      label: 'Forced Off IMC OB',
      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' },
      flatPoints: 56
    },

    // ============================================================
    // PLACEMENT — OR rooms (no pager pay, AR rate only, 4hr/80pt min)
    // OR_8 is the daytime side of a Night Call shift (in-house overnight after).
    // ============================================================

    'IMC_OR_4':  { label: 'IMC OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_5':  { label: 'IMC OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_6':  { label: 'IMC OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_7':  { label: 'IMC OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_8':  { label: 'IMC OR 8 (Night Call AM)', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ============================================================
    // OFF / VACATION — forced off = 56 pts; rest = 0
    // ============================================================

    'IMC_forced_off': { label: 'IMC Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'IMC_off':        { label: 'IMC Off',        pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_vacation':   { label: 'IMC Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_no_call':    { label: 'IMC No Call',    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

    // Removed per user feedback (Q1 — "ignore tier designations"):
    //   IMC_tier_2 / 3 / 4 / 5 / 6 (general OR — covered by IMC_OR_*)
    //   IMC_tier_5_post_1st / cv1 / liver_1 (general OR if clocked in)
    //   IMC_tier_4_cv2 (duplicate of IMC_cv_2nd_call)
    //   IMC_tier_4_liver_2 (duplicate of IMC_liver_2nd_call)
    //   IMC_tier_3_aps (duplicate of IMC_acute_pain_call)
    //
    // Removed per Q10 / Q11 (ignore for now):
    //   IMC_icu_day, IMC_icu_night
    //   IMC_cpru

  }
};
