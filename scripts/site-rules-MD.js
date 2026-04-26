// Mckay Dee (site ID: MD) compensation rules — fill in and send back.
//
// MDH = Mckay Dee Hospital, LH = Layton Hospital (same site).
// See scripts/site-rules-IMC.js for full format docs and examples.
// Shorthand: write `inherit_uvh: 'OB_restricted'` (or any UVH code) to copy
// UVH's rules verbatim.

module.exports = {
  siteId: 'MD',
  shiftRulesOverride: {

    // ============================================================
    // CALL SHIFTS
    // ============================================================

    // Split AM/PM calls — likely the pager window splits at 19:00 (07-19 / 19-07).
    // Confirm in the questions below.
    'MDH_1st_call_AM': { label: 'MDH 1st Call AM', pagerWindow: /* TODO 07-19? */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_1st_call_PM': { label: 'MDH 1st Call PM', pagerWindow: /* TODO 19-07? */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_2nd_call_AM': { label: 'MDH 2nd Call AM', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_2nd_call_PM': { label: 'MDH 2nd Call PM', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_3rd_call_AM': { label: 'MDH 3rd Call AM', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_3rd_call_PM': { label: 'MDH 3rd Call PM', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // Weekend single-block call
    'MDH_weekend':  { label: 'MDH weekend (MDH OR)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // Non-AM/PM calls (presumably for shifts that span the whole 24h)
    'MDH_1st_call': { label: 'MDH 1st Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_2nd_call': { label: 'MDH 2nd Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'MDH_3rd_call': { label: 'MDH 3rd Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // CV / Heart calls — times are in the labels (1140 = 19:00, 420 = 07:00)
    'MDH_CV_am_call': {
      label: 'MDH CV am Call 07:00-19:00 (MDH Heart Call 07:00-19:00)',
      pagerWindow: { weekday: { start: 420, end: 1140 }, weekend: { start: 420, end: 1140 } },
      unrestrictedCall: /* TODO */ null,
      arRate: { mode: 'general' }
    },
    'MDH_CV_pm_call': {
      label: 'MDH CV pm Call 19:00-07:00',
      pagerWindow: { weekday: { start: 1140, end: 1860 }, weekend: { start: 1140, end: 1860 } },
      unrestrictedCall: /* TODO */ null,
      arRate: { mode: 'general' }
    },

    // OB call — 24h
    'MDH_OB_call': {
      label: 'MDH OB Call 07:00-07:00',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: /* TODO */ null,
      arRate: /* TODO ob? */ { mode: 'ob' }
    },

    // Layton OB / OR
    'LH_OB': { label: 'Layton OB (LH OB)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },
    'LH_OR': { label: 'Layton OR (LH OR)', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Post call / forced off / vacation
    'MDH_post_call':       { label: 'MDH Post Call',                pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_forced_off':      { label: 'MDH Forced Off - 1st Available', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_vacation':        { label: 'MDH Vacation',                 pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_locums_coverage': { label: 'Locums Coverage',              pagerWindow: /* TODO */ null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_half_timer':      { label: 'Part Timer in town (1/2 timer)', pagerWindow: /* TODO */ null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_no_call':         { label: 'MDH No Call',                  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_request_call':    { label: 'Request Call',                 pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ============================================================
    // PLACEMENT SHIFTS (ORs / NORA / TOCR / CRNA / ASC / Endo)
    // ============================================================

    'MDH_TOCR': { label: 'MDH TOCR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_NORA': { label: 'MDH NORA', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_UCR':  { label: 'MDH UCR',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Layton CRNAs
    'LH_CRNA_1':  { label: 'Layton CRNA 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_CRNA_2':  { label: 'Layton CRNA 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH CRNAs
    'MDH_CRNA_1': { label: 'MDH CRNA 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_CRNA_2': { label: 'MDH CRNA 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH OR rooms 3-25, 31, 34, 35
    'MDH_3':  { label: 'MDH 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_4':  { label: 'MDH 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_5':  { label: 'MDH 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_6':  { label: 'MDH 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_7':  { label: 'MDH 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_8':  { label: 'MDH 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_9':  { label: 'MDH 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_10': { label: 'MDH 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_11': { label: 'MDH 11', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_12': { label: 'MDH 12', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_13': { label: 'MDH 13', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_14': { label: 'MDH 14', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_15': { label: 'MDH 15', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_16': { label: 'MDH 16', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_17': { label: 'MDH 17', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_18': { label: 'MDH 18', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_19': { label: 'MDH 19', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_20': { label: 'MDH 20', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_21': { label: 'MDH 21', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_22': { label: 'MDH 22', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_23': { label: 'MDH 23', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_24': { label: 'MDH 24', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_25': { label: 'MDH 25', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_31': { label: 'MDH 31', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_34': { label: 'MDH 34', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_35': { label: 'MDH 35', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH Endo ASCs
    'MDH_endo_ASC_1': { label: 'MDH Endo ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_endo_ASC_2': { label: 'MDH Endo ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // MDH ASCs 1-8
    'MDH_ASC_1': { label: 'MDH ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_2': { label: 'MDH ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_3': { label: 'MDH ASC 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_4': { label: 'MDH ASC 4', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_5': { label: 'MDH ASC 5', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_6': { label: 'MDH ASC 6', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_7': { label: 'MDH ASC 7', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'MDH_ASC_8': { label: 'MDH ASC 8', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Layton OR rooms 1-3
    'LH_1': { label: 'LH 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_2': { label: 'LH 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_3': { label: 'LH 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Layton Endo / ASCs
    'LH_endo_1': { label: 'LH Endo 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_1':  { label: 'LH ASC 1',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_2':  { label: 'LH ASC 2',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_3':  { label: 'LH ASC 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'LH_ASC_4':  { label: 'LH ASC 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for MD:
// ================================================================
//
// 1. Are MDH 1st/2nd/3rd Call AM and PM split at 07:00-19:00 / 19:00-07:00?
//    Same split for all 3 call levels?
//    Unrestricted call eligibility for these — entire shift, just nighttime, etc?
//
// 2. The non-AM/PM shifts MDH 1st/2nd/3rd Call — when do these get used vs the
//    AM/PM splits? 24-hour weekend coverage? Pager hours?
//
// 3. MDH weekend (MDH OR) — what's this? Saturday/Sunday OR placement, or
//    something call-related? Pager pay or AR rate only?
//
// 4. MDH OB Call 07:00-07:00 — confirm: 24h pager window, AR rate base 13/hr (OB)?
//
// 5. Layton OB (LH OB) — pager hours? AR rate base 13/hr?
//
// 6. MDH Post Call — flat point amount? Or just zero with no AR? At UVH this
//    just blocks pager pay; here it's a distinct shift type.
//
// 7. MDH Forced Off - 1st Available — flat point amount (UVH = 56)? Or different?
//
// 8. Locums Coverage / Part Timer in town — pager pay applies? Special pay
//    handling? Or essentially treated as "off" with some availability marker?
//
// 9. Request Call — paid as call, paid as something else, or just a marker?
//
// 10. MDH UCR — what does UCR stand for? Pager hours / AR rate base?
//
// 11. ORs 3-25, 31, 34, 35 — confirm: placement only, no pager, AR rate 20/hr.
//     Are 31, 34, 35 special-purpose ORs or just gapped numbering?
//
// 12. MDH/LH ASCs and Endo ASCs — placement only, AR rate 20/hr?
//
// 13. MDH/LH CRNA 1/2 — supervision shifts? At UVH there's CRNA_supervision —
//     should these inherit UVH's CRNA_supervision rules?
//
// 14. Any MD shifts that should inherit UVH rules verbatim?
