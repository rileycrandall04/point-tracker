// Park City (site ID: PC) compensation rules — FILLED IN, rev 2.

module.exports = {
  siteId: 'PC',

  shiftRulesOverride: {
    // ----- Call shifts (UVH-style: weekday 17:00-07:00, weekend 07:00-07:00) -----
    'PC_1st_call': {
      label: 'Park City 1st Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'PC_2nd_call': {
      label: 'Park City 2nd Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' }
    },

    // ----- Placement (single General OR replaces PC_OR_3..12) -----
    'PC_OR':   { label: 'Park City General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_ASC':  { label: 'Park City ASC',        pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- OB option (per user spec rev 2: keep selectable even if rarely used) -----
    'PC_OB':   { label: 'Park City OB', inherit_uvh: 'OB_restricted' },

    // ----- Cardiac/Liver option (UVH default; not commonly used here) -----
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ----- Off / vacation -----
    'PC_forced_off':    { label: 'Park City Forced Off',    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'PC_job_share_off': { label: 'Park City Job Share Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_vacation':      { label: 'Park City Vacation',      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'PC_OR',
    'OR_float':                'PC_OR',
    'OB_restricted':           'PC_OB',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'PC_1st_call',
    'forced_off':              'PC_forced_off',
    'vacation':                'PC_vacation'
  }

  // Removed in cleanup (rev 2):
  //   PC_OR_3..12 → PC_OR (single General OR)
  //   PC_ASC_1..4 → PC_ASC
  // Added in cleanup (rev 2):
  //   PC_OB (inherits UVH OB) — selectable option
};
