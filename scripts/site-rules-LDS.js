// FROZEN: original seed. Live edits now happen via Admin → Shift Rules in-app
// and write directly to Firestore. Running scripts/load-site-rules.js --force
// will OVERWRITE the live rules with this file. Don't edit unless you've
// coordinated with whoever may be editing live.
//
// LDS Hospital (site ID: LDS) compensation rules — FILLED IN, rev 3.
//
// LDSH = LDS Hospital.
// See scripts/site-rules-IMC.js for full format docs.

module.exports = {
  siteId: 'LDS',

  shiftRulesOverride: {
    // ----- OB: single entry. Inherits UVH OB (production doubled, OB AR rate). -----
    'LDSH_OB': { label: 'LDSH OB', inherit_uvh: 'OB_restricted' },

    // ----- Acute Pain — pager pay user-toggled at shift entry. -----
    'LDSH_acute_pain': {
      label: 'LDSH Acute Pain',
      pagerWindow: {
        weekday: { start: 1020, end: 1860 },
        weekend: { start: 420,  end: 1860 }
      },
      unrestrictedCall: {
        weekday: { afterMin: 1020 },
        weekend: 'all'
      },
      arRate: { mode: 'general' },
      pagerOptional: true
    },

    // ----- Call shifts (inherit UVH 1st/2nd call rules) -----
    'LDSH_1st_call': { label: 'LDSH 1st Call', inherit_uvh: '1st_call' },
    'LDSH_2nd_call': { label: 'LDSH 2nd Call', inherit_uvh: '2nd_call' },

    // ----- Placement (single General OR — covers LDSH_OR_3..16, NORA, ASC 1/2) -----
    'LDSH_OR':       { label: 'General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_float': { label: 'General OR - Float', inherit_uvh: 'OR_float' },

    // ----- Cardiac/Liver option (UVH default; not commonly used here) -----
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ----- Off / vacation (single Vacation covers Off Grid as well) -----
    'LDSH_forced_off': { label: 'LDSH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'LDSH_vacation':   { label: 'LDSH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'LDSH_OR',
    'OR_float':                'LDSH_OR_float',
    'OB_restricted':           'LDSH_OB',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'LDSH_1st_call',
    'forced_off':              'LDSH_forced_off',
    'vacation':                'LDSH_vacation',
    // Legacy LDS-specific keys retired in rev 2/3 — point them at General OR / Vacation.
    'LDSH_OR_3':   'LDSH_OR',
    'LDSH_OR_4':   'LDSH_OR',
    'LDSH_OR_5':   'LDSH_OR',
    'LDSH_OR_6':   'LDSH_OR',
    'LDSH_OR_7':   'LDSH_OR',
    'LDSH_OR_8':   'LDSH_OR',
    'LDSH_OR_9':   'LDSH_OR',
    'LDSH_OR_10':  'LDSH_OR',
    'LDSH_OR_11':  'LDSH_OR',
    'LDSH_OR_12':  'LDSH_OR',
    'LDSH_OR_13':  'LDSH_OR',
    'LDSH_OR_14':  'LDSH_OR',
    'LDSH_OR_15':  'LDSH_OR',
    'LDSH_OR_16':  'LDSH_OR',
    'LDSH_NORA':   'LDSH_OR',
    'LDSH_ASC_1':  'LDSH_OR',
    'LDSH_ASC_2':  'LDSH_OR',
    'LDSH_OB_day':   'LDSH_OB',
    'LDSH_OB_night': 'LDSH_OB',
    'LDSH_off_grid': 'LDSH_vacation'
  }

  // Removed in cleanup:
  //   rev 2: LDSH_OB_day / LDSH_OB_night → LDSH_OB; LDSH_OR_3..16 → LDSH_OR.
  //   rev 3: LDSH_NORA, LDSH_ASC_1, LDSH_ASC_2 → LDSH_OR (folded under
  //          General OR per user spec). LDSH_off_grid → LDSH_vacation.
  //          LDSH_OR label "LDSH General OR" → "General OR".
};
