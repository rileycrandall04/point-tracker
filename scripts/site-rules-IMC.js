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

    'IMC_aod': {
      label: 'IMC AOD',
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

    // ============================================================
    // PLACEMENT — single General OR entry (no pager pay, AR rate only,
    // 4hr/80pt min). Replaces the per-room IMC_OR_4..8 entries; the
    // Night Call AM side is also just General OR.
    // ============================================================

    'IMC_OR': {
      label: 'IMC General OR',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'general' }
    },

    // OR Float: same comp rules as UVH OR Float (general AR + 30 pt float bonus).
    'IMC_OR_float': { label: 'IMC General OR - Float', inherit_uvh: 'OR_float' },

    // ============================================================
    // OFF / VACATION — single forced off (56 pts) and single vacation (0 pts).
    // The vacation entry covers IMC Off / IMC No Call as well; forced off
    // covers Night Call and OB forced-off variants.
    // ============================================================

    'IMC_forced_off': {
      label: 'IMC Forced Off',
      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' },
      flatPoints: 56
    },
    'IMC_vacation': {
      label: 'IMC Vacation',
      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }
    }

    // Removed per user cleanup (rev 2):
    //   IMC_night_call_forced_off  -> IMC_forced_off
    //   IMC_OB_forced_off          -> IMC_forced_off
    //   IMC_OR_4 / 5 / 6 / 7 / 8   -> IMC_OR
    //   IMC_off / IMC_no_call      -> IMC_vacation
    //   IMC_aod_plus1              -> IMC_aod
  },

  otherMigrationMap: {
    'OR':                      'IMC_OR',
    'OR_float':                'IMC_OR_float',
    'OB_restricted':           'IMC_OB_24hr',
    'cardiac_liver':           'IMC_cv_1st_call',
    'unrestricted_call_entry': 'IMC_1st_call',
    'forced_off':              'IMC_forced_off',
    'vacation':                'IMC_vacation'
  }
};
