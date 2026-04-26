// LDS Hospital (site ID: LDS) compensation rules — FILLED IN, rev 2.
//
// LDSH = LDS Hospital.
// See scripts/site-rules-IMC.js for full format docs.

module.exports = {
  siteId: 'LDS',

  shiftRulesOverride: {
    // ----- OB: single entry (rev 2 collapses Day/Night). UVH-style OB
    //       rate + production doubled via inherit_uvh. AR rate naturally
    //       picks weekday/weekend/time-of-day multipliers. -----
    'LDSH_OB': { label: 'LDSH OB', inherit_uvh: 'OB_restricted' },

    // ----- Acute Pain — pager pay user-toggled at shift entry.
    //       When toggle is on: weekday 17:00-07:00, weekend 24h, general AR. -----
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

    // ----- Placement (single General OR replaces LDSH_OR_3..16) -----
    'LDSH_OR':       { label: 'LDSH General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_NORA':     { label: 'LDSH NORA',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_ASC_1':    { label: 'LDSH ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_ASC_2':    { label: 'LDSH ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Cardiac/Liver option (UVH default; not commonly used here) -----
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ----- Off / vacation (Off Grid behaves identically to vacation: 0 pts) -----
    'LDSH_forced_off': { label: 'LDSH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'LDSH_off_grid':   { label: 'LDSH Off Grid',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_vacation':   { label: 'LDSH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'LDSH_OR',
    'OR_float':                'LDSH_OR',
    'OB_restricted':           'LDSH_OB',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'LDSH_1st_call',
    'forced_off':              'LDSH_forced_off',
    'vacation':                'LDSH_vacation'
  }

  // Removed in cleanup (rev 2):
  //   LDSH_OB_day / LDSH_OB_night → LDSH_OB (single OB; AR rate handles
  //     weekday/weekend/time-of-day; OB inherits UVH OB rules)
  //   LDSH_OR_3..16 → LDSH_OR (single General OR)
};
