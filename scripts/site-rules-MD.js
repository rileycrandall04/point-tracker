// Mckay Dee (site ID: MD) compensation rules — FILLED IN.
//
// MDH = Mckay Dee Hospital, LH = Layton Hospital (same site).
// See scripts/site-rules-IMC.js for full format docs.
// Shorthand: write `inherit_uvh: 'OB_restricted'` (or any UVH code) to copy
// UVH's rules verbatim.
//
// Extra fields used here (need wiring in comp engine + UI):
//   productionMultiplier: N   — multiplies production points (OB shifts only)
//   flatPoints: N             — flat point award regardless of duration
//   cardiacBonus: true        — exposes UVH-style "Subspecialty coverage"
//                               checkbox at shift entry (45 pts/day flat add)
//   unrestrictedCallEntry: true — UI: checkbox + hours field at shift entry;
//                                 hours x 3.5/hr added when enabled
//
// Note: ORs/ASCs/NORA/etc (placement shifts) get the same 4hr / 80pt
// minimum that UVH OR uses. Wired generically in the engine.

module.exports = {
  siteId: 'MD',
  shiftRulesOverride: {

    // ============================================================
    // CALL SHIFTS
    // ============================================================

    // Weekend AM/PM split calls — full 24h pager + unrestricted call.
    // (One person typically holds two slots/day, e.g. 1st AM + 3rd PM.)
    // Forces weekend behavior even on accidental weekday entry.
    'MDH_1st_call_AM': {
      label: 'MDH 1st Call AM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'MDH_1st_call_PM': {
      label: 'MDH 1st Call PM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'MDH_2nd_call_AM': {
      label: 'MDH 2nd Call AM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'MDH_2nd_call_PM': {
      label: 'MDH 2nd Call PM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'MDH_3rd_call_AM': {
      label: 'MDH 3rd Call AM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'MDH_3rd_call_PM': {
      label: 'MDH 3rd Call PM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },

    // Saturday/Sunday OR placement — optional user-entered unrestricted call hours
    'MDH_weekend': {
      label: 'MDH weekend (MDH OR)',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'general' },
      unrestrictedCallEntry: true
    },

    // Weekday call shifts — inherit UVH 1st/2nd/3rd call rules
    'MDH_1st_call': { label: 'MDH 1st Call', inherit_uvh: '1st_call' },
    'MDH_2nd_call': { label: 'MDH 2nd Call', inherit_uvh: '2nd_call' },
    'MDH_3rd_call': { label: 'MDH 3rd Call', inherit_uvh: '3rd_call' },

    // CV / Heart calls — pager windows from labels; cardiac subspec bonus
    // available; unrestricted weekday after 17:00, weekend all day.
    'MDH_CV_am_call': {
      label: 'MDH CV am Call 07:00-19:00 (MDH Heart Call 07:00-19:00)',
      pagerWindow: { weekday: { start: 420, end: 1140 }, weekend: { start: 420, end: 1140 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },
    'MDH_CV_pm_call': {
      label: 'MDH CV pm Call 19:00-07:00',
      pagerWindow: { weekday: { start: 1140, end: 1860 }, weekend: { start: 1140, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },  // shift entirely after 17:00
      arRate: { mode: 'general' },
      cardiacBonus: true
    },

    // OB call — 24h pager, OB rate, production doubled
    'MDH_OB_call': {
      label: 'MDH OB Call 07:00-07:00',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },

    // Layton OB — exactly like UVH OB
    'LH_OB': { label: 'Layton OB (LH OB)', inherit_uvh: 'OB_restricted' },

    // Layton OR (placement)
    'LH_OR': { label: 'Layton OR (LH OR)', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Off / vacation / status markers -----
    'MDH_post_call':       { label: 'MDH Post Call',                  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_forced_off':      { label: 'MDH Forced Off - 1st Available', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'MDH_vacation':        { label: 'MDH Vacation',                   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_locums_coverage': { label: 'Locums Coverage',                pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },  // treat as vacation
    'MDH_half_timer':      { label: 'Part Timer in town (1/2 timer)', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },  // treat as vacation
    'MDH_no_call':         { label: 'MDH No Call',                    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ============================================================
    // PLACEMENT SHIFTS (ORs / NORA / TOCR / UCR / ASC / Endo)
    // ============================================================

    'MDH_TOCR': { label: 'MDH TOCR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_NORA': { label: 'MDH NORA', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_UCR':  { label: 'MDH UCR',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH OR rooms 3-25, 31, 34, 35
    'MDH_3':  { label: 'MDH 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_4':  { label: 'MDH 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_5':  { label: 'MDH 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_6':  { label: 'MDH 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_7':  { label: 'MDH 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_8':  { label: 'MDH 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_9':  { label: 'MDH 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_10': { label: 'MDH 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_11': { label: 'MDH 11', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_12': { label: 'MDH 12', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_13': { label: 'MDH 13', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_14': { label: 'MDH 14', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_15': { label: 'MDH 15', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_16': { label: 'MDH 16', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_17': { label: 'MDH 17', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_18': { label: 'MDH 18', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_19': { label: 'MDH 19', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_20': { label: 'MDH 20', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_21': { label: 'MDH 21', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_22': { label: 'MDH 22', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_23': { label: 'MDH 23', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_24': { label: 'MDH 24', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_25': { label: 'MDH 25', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_31': { label: 'MDH 31', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_34': { label: 'MDH 34', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_35': { label: 'MDH 35', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH Endo ASCs
    'MDH_endo_ASC_1': { label: 'MDH Endo ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_endo_ASC_2': { label: 'MDH Endo ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH ASCs 1-8
    'MDH_ASC_1': { label: 'MDH ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_2': { label: 'MDH ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_3': { label: 'MDH ASC 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_4': { label: 'MDH ASC 4', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_5': { label: 'MDH ASC 5', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_6': { label: 'MDH ASC 6', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_7': { label: 'MDH ASC 7', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_8': { label: 'MDH ASC 8', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Layton OR rooms 1-3
    'LH_1': { label: 'LH 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_2': { label: 'LH 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_3': { label: 'LH 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Layton Endo / ASCs
    'LH_endo_1': { label: 'LH Endo 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_1':  { label: 'LH ASC 1',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_2':  { label: 'LH ASC 2',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_3':  { label: 'LH ASC 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_4':  { label: 'LH ASC 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

    // Removed per user feedback:
    //   MDH_request_call (not a shift)
    //   MDH_CRNA_1, MDH_CRNA_2, LH_CRNA_1, LH_CRNA_2 (not shifts)

  }
};
