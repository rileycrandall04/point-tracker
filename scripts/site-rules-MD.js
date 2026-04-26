// Mckay Dee + Layton (site ID: MD) compensation rules — FILLED IN, rev 3.
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

    // OB call (McKay Dee) — exactly like UVH OB.
    'MDH_OB_call': { label: 'MD OB', inherit_uvh: 'OB_restricted' },

    // Layton OB — "Unrestricted OB". Treated like UVH SF1.
    'LH_OB': { label: 'Unrestricted OB', inherit_uvh: 'SF1' },

    // ============================================================
    // PLACEMENT — single General OR + General OR Float (rev 3 collapses
    // MDH_<n>, MDH_ASC_<n>, LH_<n>, LH_ASC_<n> all into MDH_OR).
    // TOCR / NORA / UCR / LH_endo_1 retained as their own entries.
    // ============================================================

    'MDH_OR':         { label: 'General OR',         pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_OR_float':   { label: 'General OR - Float', inherit_uvh: 'OR_float' },
    'MDH_TOCR':       { label: 'MDH TOCR',           pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_NORA':       { label: 'MDH NORA',           pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_UCR':        { label: 'MDH UCR',            pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_endo_1':      { label: 'LH Endo 1',          pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Cardiac/Liver option (UVH default; CV/Heart calls above are MD-specific).
    'cardiac_liver':  { label: 'Cardiac / Liver' },

    // ----- Off / vacation / status markers -----
    'MDH_post_call':  { label: 'MDH Post Call',                  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_forced_off': { label: 'MDH Forced Off - 1st Available', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'MDH_vacation':   { label: 'MDH Vacation',                   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_no_call':    { label: 'MDH No Call',                    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'MDH_OR',
    'OR_float':                'MDH_OR_float',
    'OB_restricted':           'MDH_OB_call',
    'cardiac_liver':           'MDH_CV_am_call',
    'unrestricted_call_entry': 'MDH_1st_call',
    'forced_off':              'MDH_forced_off',
    'vacation':                'MDH_vacation',
    // Legacy MD keys retired in rev 2/3 — point them at General OR / Vacation.
    'MDH_3':  'MDH_OR', 'MDH_4':  'MDH_OR', 'MDH_5':  'MDH_OR', 'MDH_6':  'MDH_OR',
    'MDH_7':  'MDH_OR', 'MDH_8':  'MDH_OR', 'MDH_9':  'MDH_OR', 'MDH_10': 'MDH_OR',
    'MDH_11': 'MDH_OR', 'MDH_12': 'MDH_OR', 'MDH_13': 'MDH_OR', 'MDH_14': 'MDH_OR',
    'MDH_15': 'MDH_OR', 'MDH_16': 'MDH_OR', 'MDH_17': 'MDH_OR', 'MDH_18': 'MDH_OR',
    'MDH_19': 'MDH_OR', 'MDH_20': 'MDH_OR', 'MDH_21': 'MDH_OR', 'MDH_22': 'MDH_OR',
    'MDH_23': 'MDH_OR', 'MDH_24': 'MDH_OR', 'MDH_25': 'MDH_OR', 'MDH_31': 'MDH_OR',
    'MDH_34': 'MDH_OR', 'MDH_35': 'MDH_OR',
    'LH_1':   'MDH_OR', 'LH_2':   'MDH_OR', 'LH_3':   'MDH_OR',
    'LH_OR':  'MDH_OR',
    'MDH_ASC':       'MDH_OR',
    'MDH_ASC_1': 'MDH_OR', 'MDH_ASC_2': 'MDH_OR', 'MDH_ASC_3': 'MDH_OR',
    'MDH_ASC_4': 'MDH_OR', 'MDH_ASC_5': 'MDH_OR', 'MDH_ASC_6': 'MDH_OR',
    'MDH_ASC_7': 'MDH_OR', 'MDH_ASC_8': 'MDH_OR',
    'MDH_endo_ASC_1': 'MDH_OR',
    'MDH_endo_ASC_2': 'MDH_OR',
    'LH_ASC':        'MDH_OR',
    'LH_ASC_1': 'MDH_OR', 'LH_ASC_2': 'MDH_OR',
    'LH_ASC_3': 'MDH_OR', 'LH_ASC_4': 'MDH_OR',
    'MDH_locums_coverage': 'MDH_vacation',
    'MDH_half_timer':      'MDH_vacation',
    'MDH_aod_plus1':       'MDH_post_call'
  }

  // Removed in cleanup:
  //   rev 2: MDH_3..25/31/34/35 → MDH_OR; LH_1..3 → LH_OR;
  //          MDH_ASC_1..8 → MDH_ASC; LH_ASC_1..4 → LH_ASC;
  //          MDH_endo_ASC_1/_2 dropped.
  //          MDH_OB_call now inherits UVH OB; LH_OB renamed
  //          "Unrestricted OB" inheriting SF1.
  //   rev 3: LH_OR / MDH_ASC / LH_ASC → MDH_OR (single General OR
  //          per user spec). MDH_OR label "MDH General OR" → "General OR".
  //          MDH_locums_coverage and MDH_half_timer removed (no longer
  //          needed; legacy entries remap to MDH_vacation).
  //          New MDH_OR_float (inherits UVH OR_float — same +30 bonus).
};
