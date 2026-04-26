// Riverton (site ID: RV) compensation rules — FILLED IN, rev 2.

module.exports = {
  siteId: 'RV',

  shiftRulesOverride: {
    // ----- OB call — same as UVH OB (production doubled). -----
    'RVTN_OB_call_24h': { label: 'RVTN OB Call 7AM-7AM', inherit_uvh: 'OB_restricted' },

    // ----- Call shifts -----
    'RVTN_1st_call': {
      label: 'RVTN 1st Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' }
    },
    'RVTN_2nd_call': {
      label: 'RVTN 2nd Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' }
    },

    // ----- Placement (single General OR replaces RVTN_OR_3..10) -----
    'RVTN_OR':       { label: 'RVTN General OR',         pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_float': { label: 'RVTN General OR - Float', inherit_uvh: 'OR_float' },

    // ----- CRNAs (collapsed to single supervision shift, rev 2) -----
    'RVTN_CRNA': { label: 'RVTN CRNA', inherit_uvh: 'CRNA_supervision' },

    // ----- Cardiac/Liver option (UVH default) -----
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ----- Off / vacation -----
    'RVTN_forced_off': { label: 'RVTN Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'RVTN_vacation':   { label: 'RVTN Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'RVTN_OR',
    'OR_float':                'RVTN_OR_float',
    'OB_restricted':           'RVTN_OB_call_24h',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'RVTN_1st_call',
    'forced_off':              'RVTN_forced_off',
    'vacation':                'RVTN_vacation'
  }

  // Removed in cleanup (rev 2):
  //   RVTN_OR_3..10 → RVTN_OR (single General OR)
  //   RVTN_CRNA_1, _2, _3 → RVTN_CRNA
};
