// LDS (LDS Hospital, site ID: LDS) compensation rules — fill in and send back.
//
// See scripts/site-rules-IMC.js for full format docs and examples.
// Shorthand: write `inherit_uvh: 'OB_restricted'` (or any UVH code) to
// copy UVH's rules verbatim.

module.exports = {
  siteId: 'LDS',
  shiftRulesOverride: {

    // ----- OB shifts (split day/night) -----
    'LDSH_OB_day':   { label: 'LDSH OB Day',   pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },
    'LDSH_OB_night': { label: 'LDSH OB Night', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },

    // ----- Pain / Call shifts -----
    'LDSH_acute_pain': { label: 'LDSH Acute Pain', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'LDSH_1st_call':   { label: 'LDSH 1st Call',   pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'LDSH_2nd_call':   { label: 'LDSH 2nd Call',   pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- OR rooms 3-16 -----
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

    // ----- Off / vacation -----
    'LDSH_forced_off': { label: 'LDSH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_off_grid':   { label: 'LDSH Off Grid',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LDSH_vacation':   { label: 'LDSH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for LDS:
// ================================================================
//
// 1. LDSH OB Day vs Night — what are the shift hours for each? Pager pay or
//    just AR rate within the shift? AR rate base 13/hr (OB) or 20/hr (general)?
//
// 2. LDSH Acute Pain — pager-style call (paged in for procedures), or a
//    placement shift (you're on-site)? Pager hours? Unrestricted call rate?
//
// 3. LDSH 1st Call / 2nd Call — pager hours weekday vs weekend? Same 17:00–07:00
//    weekday / 07:00–07:00 weekend pattern as UVH, or different?
//    Unrestricted call eligibility?
//
// 4. ORs 3–16, NORA, ASC 1/2 — confirm: placement shifts only, no pager,
//    no unrestricted call, AR rate base 20/hr?
//
// 5. LDSH Forced Off — flat point amount? UVH gives 56 pts. Same at LDS?
//
// 6. LDSH Off Grid — what is this? (vacation-style 0 pts, or something else?)
//
// 7. Any LDSH shifts that should inherit UVH rules verbatim?
