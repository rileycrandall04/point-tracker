// Riverton (site ID: RV) compensation rules — fill in and send back.
//
// See scripts/site-rules-IMC.js for full format docs and examples.
// Shorthand: write `inherit_uvh: 'OB_restricted'` to copy UVH's rules verbatim.

module.exports = {
  siteId: 'RV',
  shiftRulesOverride: {

    // ----- OB call — 24h (07:00-07:00 next day = 420-1860) -----
    'RVTN_OB_call_24h': {
      label: 'RVTN OB Call 7AM-7AM',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: /* TODO */ null,
      arRate: /* TODO ob? */ { mode: 'ob' }
    },

    // ----- Call shifts -----
    'RVTN_1st_call': { label: 'RVTN 1st Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'RVTN_2nd_call': { label: 'RVTN 2nd Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- OR rooms -----
    'RVTN_OR_3':  { label: 'RVTN OR 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_4':  { label: 'RVTN OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_5':  { label: 'RVTN OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_6':  { label: 'RVTN OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_7':  { label: 'RVTN OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_8':  { label: 'RVTN OR 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_9':  { label: 'RVTN OR 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_OR_10': { label: 'RVTN OR 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- CRNAs (supervision shifts?) -----
    'RVTN_CRNA_1': { label: 'RVTN CRNA 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_CRNA_2': { label: 'RVTN CRNA 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_CRNA_3': { label: 'RVTN CRNA 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Off / vacation -----
    'RVTN_forced_off': { label: 'RVTN Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'RVTN_vacation':   { label: 'RVTN Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for RV:
// ================================================================
//
// 1. RVTN OB Call 7AM-7AM — confirm: 24h pager window weekday + weekend.
//    AR rate base 13/hr (OB)?
//    Unrestricted call eligibility — entire shift, or just nights?
//
// 2. RVTN 1st Call / 2nd Call — pager hours weekday vs weekend?
//    Unrestricted call eligibility?
//
// 3. ORs 3-10 — confirm: placement only, no pager, AR base 20/hr.
//
// 4. RVTN CRNA 1/2/3 — supervision shifts? Should these inherit UVH's
//    CRNA_supervision rules?
//
// 5. RVTN Forced Off — flat point amount (UVH = 56)?
//
// 6. Any RV shifts that should inherit UVH rules verbatim?
