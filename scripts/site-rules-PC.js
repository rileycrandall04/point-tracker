// Park City (site ID: PC) compensation rules — FILLED IN.
//
// See scripts/site-rules-IMC.js for full format docs and examples.
// Per your note: PC_job_share_off uses identical rules to PC_vacation.
//
// Extra field used here (needs wiring in comp engine):
//   flatPoints: N — flat point award regardless of duration

module.exports = {
  siteId: 'PC',
  shiftRulesOverride: {

    // ----- Call shifts (UVH-style: weekday 17:00-07:00, weekend 07:00-07:00) -----
    'PC_1st_call': {
      label: 'Park City 1st Call',
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
    'PC_2nd_call': {
      label: 'Park City 2nd Call',
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

    // ----- OR rooms (placement only — no OR 11) -----
    'PC_OR_3':  { label: 'Park City OR 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_4':  { label: 'Park City OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_5':  { label: 'Park City OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_6':  { label: 'Park City OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_7':  { label: 'Park City OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_8':  { label: 'Park City OR 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_9':  { label: 'Park City OR 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_10': { label: 'Park City OR 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_OR_12': { label: 'Park City OR 12', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- ASCs -----
    'PC_ASC_1': { label: 'Park City ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_ASC_2': { label: 'Park City ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_ASC_3': { label: 'Park City ASC 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_ASC_4': { label: 'Park City ASC 4', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Off / vacation (forced off = 56 pts like UVH; job share off = vacation = 0) -----
    'PC_forced_off':    { label: 'Park City Forced Off',    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'PC_job_share_off': { label: 'Park City Job Share Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_vacation':      { label: 'Park City Vacation',      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};
