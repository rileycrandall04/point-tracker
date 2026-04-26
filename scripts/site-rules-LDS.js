// LDS Hospital (site ID: LDS) compensation rules — FILLED IN.
//
// See scripts/site-rules-IMC.js for full format docs.
// Shorthand: write `inherit_uvh: '1st_call'` (or any UVH code) on a shift
// to copy UVH's rules verbatim.
//
// Extra fields used here (need wiring in comp engine + UI):
//   productionMultiplier: N — multiplies AR/production points on this shift
//   flatPoints: N           — flat point award regardless of duration
//   pagerOptional: true     — UI shows checkbox at shift entry. When checked,
//                             pagerWindow + unrestrictedCall apply. When
//                             unchecked, no pager pay.
//
// Note: ORs/NORA/ASCs (placement shifts) get the same 4hr / 80pt minimum
// that UVH OR uses. Wired generically in the engine.

module.exports = {
  siteId: 'LDS',
  shiftRulesOverride: {

    // ----- OB shifts (same comp rules as UVH OB; production doubled, no pager) -----
    'LDSH_OB_day': {
      label: 'LDSH OB Day',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },
    'LDSH_OB_night': {
      label: 'LDSH OB Night',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },

    // ----- Acute Pain — pager pay is user-toggled at shift entry.
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

    // ----- OR rooms 3-16 (placement only) -----
    'LDSH_OR_3':  { label: 'LDSH OR 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_4':  { label: 'LDSH OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_5':  { label: 'LDSH OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_6':  { label: 'LDSH OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_7':  { label: 'LDSH OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_8':  { label: 'LDSH OR 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_9':  { label: 'LDSH OR 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_10': { label: 'LDSH OR 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_11': { label: 'LDSH OR 11', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_12': { label: 'LDSH OR 12', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_13': { label: 'LDSH OR 13', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_14': { label: 'LDSH OR 14', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_15': { label: 'LDSH OR 15', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_OR_16': { label: 'LDSH OR 16', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- NORA / ASC -----
    'LDSH_NORA':  { label: 'LDSH NORA',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_ASC_1': { label: 'LDSH ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_ASC_2': { label: 'LDSH ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Off / vacation (Off Grid behaves identically to vacation: 0 pts) -----
    'LDSH_forced_off': { label: 'LDSH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'LDSH_off_grid':   { label: 'LDSH Off Grid',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_vacation':   { label: 'LDSH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};
