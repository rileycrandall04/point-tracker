// Riverton (site ID: RV) compensation rules — FILLED IN.
//
// See scripts/site-rules-IMC.js for full format docs and examples.
// Shorthand: write `inherit_uvh: 'CRNA_supervision'` (or any UVH code) to
// copy UVH's rules verbatim.
//
// Extra fields used here (need wiring in comp engine):
//   productionMultiplier: N  — multiplies AR/production points on this shift
//   flatPoints: N            — flat point award regardless of duration

module.exports = {
  siteId: 'RV',
  shiftRulesOverride: {

    // ----- OB call — 24h restricted call (07:00-07:00). Production doubled. -----
    'RVTN_OB_call_24h': {
      label: 'RVTN OB Call 7AM-7AM',
      pagerWindow: {
        weekday: { start: 420, end: 1860 },
        weekend: { start: 420, end: 1860 }
      },
      unrestrictedCall: null,        // restricted call only — 3.5/hr never applies
      arRate: { mode: 'ob' },        // 13/hr base
      productionMultiplier: 2        // production points doubled on this shift
    },

    // ----- Call shifts (UVH-style: weekday 17:00-07:00, weekend 07:00-07:00) -----
    'RVTN_1st_call': {
      label: 'RVTN 1st Call',
      pagerWindow: {
        weekday: { start: 1020, end: 1860 },
        weekend: { start: 420,  end: 1860 }
      },
      unrestrictedCall: {
        weekday: { afterMin: 1020 },
        weekend: 'all'
      },
      arRate: { mode: 'general' }
    },
    'RVTN_2nd_call': {
      label: 'RVTN 2nd Call',
      pagerWindow: {
        weekday: { start: 1020, end: 1860 },
        weekend: { start: 420,  end: 1860 }
      },
      unrestrictedCall: {
        weekday: { afterMin: 1020 },
        weekend: 'all'
      },
      arRate: { mode: 'general' }
    },

    // ----- OR rooms (placement only — same as UVH OR) -----
    'RVTN_OR_3':  { label: 'RVTN OR 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_4':  { label: 'RVTN OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_5':  { label: 'RVTN OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_6':  { label: 'RVTN OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_7':  { label: 'RVTN OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_8':  { label: 'RVTN OR 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_9':  { label: 'RVTN OR 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_10': { label: 'RVTN OR 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- CRNAs (supervision shifts — inherit UVH supervision rules) -----
    'RVTN_CRNA_1': { label: 'RVTN CRNA 1', inherit_uvh: 'CRNA_supervision' },
    'RVTN_CRNA_2': { label: 'RVTN CRNA 2', inherit_uvh: 'CRNA_supervision' },
    'RVTN_CRNA_3': { label: 'RVTN CRNA 3', inherit_uvh: 'CRNA_supervision' },

    // ----- Off / vacation (forced off = 56 pts like UVH; vacation = 0) -----
    'RVTN_forced_off': { label: 'RVTN Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'RVTN_vacation':   { label: 'RVTN Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};
