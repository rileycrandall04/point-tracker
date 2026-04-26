// Mckay Dee + Layton (site ID: MD) compensation rules — FILLED IN, rev 2.
//
// MDH = Mckay Dee Hospital, LH = Layton Hospital (same site).
// See scripts/site-rules-IMC.js for full format docs.

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
      label: 'MDH Weekend (MDH OR)',
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
      label: 'MDH CV AM Call (07:00-19:00)',
      pagerWindow: { weekday: { start: 420, end: 1140 }, weekend: { start: 420, end: 1140 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },
    'MDH_CV_pm_call': {
      label: 'MDH CV PM Call (19:00-07:00)',
      pagerWindow: { weekday: { start: 1140, end: 1860 }, weekend: { start: 1140, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },

    // OB call (McKay Dee) — exactly like UVH OB (per user spec rev 2).
    // Inherits OB rate + production doubling.
    'MDH_OB_call': { label: 'MD OB', inherit_uvh: 'OB_restricted' },

    // Layton OB — "Unrestricted OB". Treated like SF1 (per user spec rev 2):
    // 13/hr weekday-daytime base, 20/hr at all other times, with SF1's
    // pager window + unrestricted call windows.
    'LH_OB': { label: 'Unrestricted OB', inherit_uvh: 'SF1' },

    // ----- Off / vacation / status markers -----
    'MDH_post_call':       { label: 'MDH Post Call',                  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_forced_off':      { label: 'MDH Forced Off - 1st Available', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'MDH_vacation':        { label: 'MDH Vacation',                   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_locums_coverage': { label: 'Locums Coverage',                pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_half_timer':      { label: 'Part Timer in town (1/2 timer)', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_no_call':         { label: 'MDH No Call',                    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ============================================================
    // PLACEMENT SHIFTS — single General OR per facility (rev 2)
    // ============================================================

    'MDH_OR':   { label: 'MDH General OR',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_OR':    { label: 'Layton General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_TOCR': { label: 'MDH TOCR',         pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_NORA': { label: 'MDH NORA',         pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_UCR':  { label: 'MDH UCR',          pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH ASCs (collapsed: rev 2)
    'MDH_ASC':  { label: 'MDH ASC',          pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    // Layton ASCs (collapsed: rev 2)
    'LH_ASC':   { label: 'Layton ASC',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_endo_1': { label: 'LH Endo 1',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Cardiac/Liver option (UVH default; CV/Heart calls above are MD-specific)
    'cardiac_liver': { label: 'Cardiac / Liver' }
  },

  otherMigrationMap: {
    'OR':                      'MDH_OR',
    'OR_float':                'MDH_OR',
    'OB_restricted':           'MDH_OB_call',
    'cardiac_liver':           'MDH_CV_am_call',
    'unrestricted_call_entry': 'MDH_1st_call',
    'forced_off':              'MDH_forced_off',
    'vacation':                'MDH_vacation'
  }

  // Removed in cleanup (rev 2):
  //   MDH_3..25, 31, 34, 35 → MDH_OR (single General OR)
  //   LH_1, LH_2, LH_3 → LH_OR (single Layton General OR)
  //   MDH_endo_ASC_1, _2, MDH_ASC_1..8 → MDH_ASC
  //   LH_ASC_1..4 → LH_ASC
  //   MDH_OB_call rules: now inherit_uvh: 'OB_restricted' (per user spec)
  //   LH_OB: now labeled "Unrestricted OB" and inherits SF1 (per user spec)
};
