// Park City (site ID: PC) compensation rules — FILLED IN, rev 3.

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

    // ----- Placement (single General OR — covers PC_OR_3..12 AND ASC) -----
    'PC_OR':       { label: 'General OR',         pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_float': { label: 'General OR - Float', inherit_uvh: 'OR_float' },

    // ----- OB option (selectable even if rarely used) -----
    'PC_OB':       { label: 'Park City OB', inherit_uvh: 'OB_restricted' },

    // ----- Cardiac/Liver option (UVH default; not commonly used here) -----
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ----- Off / vacation (single Vacation covers Job Share Off as well) -----
    'PC_forced_off': { label: 'Park City Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'PC_vacation':   { label: 'Park City Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'PC_OR',
    'OR_float':                'PC_OR_float',
    'OB_restricted':           'PC_OB',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'PC_1st_call',
    'forced_off':              'PC_forced_off',
    'vacation':                'PC_vacation',
    // Legacy PC keys retired in rev 2/3 — point them at General OR / Vacation.
    'PC_OR_3':  'PC_OR', 'PC_OR_4':  'PC_OR', 'PC_OR_5':  'PC_OR', 'PC_OR_6':  'PC_OR',
    'PC_OR_7':  'PC_OR', 'PC_OR_8':  'PC_OR', 'PC_OR_9':  'PC_OR', 'PC_OR_10': 'PC_OR',
    'PC_OR_12': 'PC_OR',
    'PC_ASC':   'PC_OR',
    'PC_ASC_1': 'PC_OR', 'PC_ASC_2': 'PC_OR',
    'PC_ASC_3': 'PC_OR', 'PC_ASC_4': 'PC_OR',
    'PC_job_share_off': 'PC_vacation'
  }

  // Removed in cleanup:
  //   rev 2: PC_OR_3..12 → PC_OR; PC_ASC_1..4 → PC_ASC; new PC_OB.
  //   rev 3: PC_ASC → PC_OR (folded under General OR per user spec).
  //          PC_job_share_off → PC_vacation.
  //          PC_OR label "Park City General OR" → "General OR";
  //          PC_OR_float label "Park City General OR - Float" → "General OR - Float".
};
