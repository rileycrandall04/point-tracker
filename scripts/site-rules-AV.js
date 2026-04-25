// Alta View (site ID: AV) compensation rules — fill in and send back.
//
// See scripts/site-rules-IMC.js for full format docs and examples.
// Quick recap of the field shapes:
//
//   pagerWindow: null,                                              // no pager pay
//   pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
//
//   unrestrictedCall: null,                                         // never eligible
//   unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
//
//   arRate.mode: 'general' (20 base) | 'ob' (13 base) | 'sf1' (13 weekday daytime, 20 otherwise)
//
// Shorthand: write `inherit_uvh: 'OB_restricted'` (or any UVH code) on a shift
// to copy UVH's rules verbatim. I'll wire it up.

module.exports = {
  siteId: 'AV',
  shiftRulesOverride: {

    // ----- OB / Call shifts (need rules) -----
    'AVH_OB_call':       { label: 'AVH OB Call',         pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },
    'AVH_1st_backup_call': { label: 'AVH 1st/Backup Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'AVH_2nd_call':      { label: 'AVH 2nd Call',         pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'AVH_3rd_call':      { label: 'AVH 3rd Call',         pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- OR rooms (no pager pay typically) -----
    'AVH_OR_4':  { label: 'AVH OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_5':  { label: 'AVH OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_6':  { label: 'AVH OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_7':  { label: 'AVH OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_8':  { label: 'AVH OR 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_9':  { label: 'AVH OR 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_10': { label: 'AVH OR 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_11': { label: 'AVH OR 11', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- ASC -----
    'AVH_ASC_1': { label: 'AVH ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Off / vacation -----
    'AVH_forced_off': { label: 'AVH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_vacation':   { label: 'AVH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for AV:
// ================================================================
//
// 1. AVH OB Call — pager hours (weekday vs weekend)?
//    AR rate base — same 13/hr OB rate as UVH, or different?
//    Unrestricted call eligibility?
//
// 2. AVH 1st/Backup Call — is this one shift slot covering both 1st and
//    backup roles, or is "Backup" a separate role you fill in differently?
//    Pager window weekday/weekend?
//
// 3. AVH 2nd Call / 3rd Call — pager hours (weekday/weekend)?
//    Unrestricted call eligibility?
//
// 4. ORs 4-11 + ASC 1 — confirm these are placement shifts only, no pager,
//    no unrestricted call (just AR rate during the shift). General base 20/hr?
//
// 5. AVH Forced Off — at UVH this is a 56-point flat day. Same at AVH?
//
// 6. Any AVH shifts that should inherit UVH rules verbatim
//    (e.g. AVH 2nd Call same as UVH 2nd Call)?
