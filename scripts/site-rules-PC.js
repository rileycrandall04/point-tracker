// Park City (site ID: PC) compensation rules — fill in and send back.
//
// See scripts/site-rules-IMC.js for full format docs and examples.
// Per your note: PC_job_share_off uses identical rules to PC_vacation.

module.exports = {
  siteId: 'PC',
  shiftRulesOverride: {

    // ----- Call shifts (need rules) -----
    'PC_1st_call': { label: 'Park City 1st Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'PC_2nd_call': { label: 'Park City 2nd Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- OR rooms (note: no OR 11) -----
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

    // ----- Off / vacation (PC_job_share_off treated same as vacation) -----
    'PC_forced_off':    { label: 'Park City Forced Off',    pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_job_share_off': { label: 'Park City Job Share Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'PC_vacation':      { label: 'Park City Vacation',      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for PC:
// ================================================================
//
// 1. Park City 1st Call / 2nd Call — pager hours weekday vs weekend?
//    Unrestricted call eligibility (when does the 3.5/hr rate apply)?
//    AR rate base — 20/hr general, or different?
//
// 2. ORs 3-12 + ASCs 1-4 — confirm: placement only, no pager, AR base 20/hr.
//
// 3. Park City Forced Off — flat point amount (UVH = 56)?
//
// 4. Job Share Off / Vacation — both 0 pts, no comp impact (just calendar)?
//    (You confirmed they're the same — included separately so the labels
//    show correctly when shifts are listed.)
//
// 5. Any PC shifts that should inherit UVH rules verbatim?
