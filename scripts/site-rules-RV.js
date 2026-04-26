// Riverton (site ID: RV) compensation rules — FILLED IN, rev 3.

module.exports = {
  siteId: 'RV',

  shiftRulesOverride: {
    // ----- OB call — same comp rules as UVH OB (production doubled). -----
    'RVTN_OB': { label: 'RVTN OB', inherit_uvh: 'OB_restricted' },

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
    'RVTN_OR':       { label: 'General OR',         pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_float': { label: 'General OR - Float', inherit_uvh: 'OR_float' },

    // ----- Supervision (treated like UVH SF2 — general AR + production
    //       doubled on non-OR cases — but no pager pay). -----
    'RVTN_Supervision': {
      label: 'RVTN Supervision',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'general' },
      productionMultiplier: 2
    },

    // ----- Cardiac/Liver option (UVH default) -----
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ----- Off / vacation -----
    'RVTN_forced_off': { label: 'RVTN Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'RVTN_vacation':   { label: 'RVTN Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'RVTN_OR',
    'OR_float':                'RVTN_OR_float',
    'OB_restricted':           'RVTN_OB',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'RVTN_1st_call',
    'forced_off':              'RVTN_forced_off',
    'vacation':                'RVTN_vacation',
    // Legacy RV keys retired in rev 2/3.
    'RVTN_OR_3':  'RVTN_OR', 'RVTN_OR_4':  'RVTN_OR', 'RVTN_OR_5':  'RVTN_OR',
    'RVTN_OR_6':  'RVTN_OR', 'RVTN_OR_7':  'RVTN_OR', 'RVTN_OR_8':  'RVTN_OR',
    'RVTN_OR_9':  'RVTN_OR', 'RVTN_OR_10': 'RVTN_OR',
    'RVTN_OB_call_24h': 'RVTN_OB',
    'RVTN_CRNA':   'RVTN_Supervision',
    'RVTN_CRNA_1': 'RVTN_Supervision',
    'RVTN_CRNA_2': 'RVTN_Supervision',
    'RVTN_CRNA_3': 'RVTN_Supervision'
  }

  // Removed in cleanup:
  //   rev 2: RVTN_OR_3..10 → RVTN_OR; RVTN_CRNA_1/_2/_3 → RVTN_CRNA.
  //   rev 3: RVTN_OB_call_24h renamed RVTN_OB (label "RVTN OB").
  //          RVTN_CRNA renamed RVTN_Supervision; rules now mirror UVH SF2
  //          (general AR + non-OR-case doubling) WITHOUT pager pay.
  //          RVTN_OR label "RVTN General OR" → "General OR";
  //          RVTN_OR_float label simplified similarly.
};
