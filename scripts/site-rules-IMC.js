// IMC site compensation rules — fill in and send back.
//
// Each entry below is one IMC shift type. For each, fill in:
//   pagerWindow:    pager pay eligibility, weekday vs weekend (in minutes from
//                   midnight; e.g. 17:00 = 1020, 07:00 next day = 1860).
//                   Set to null on either side if no pager pay applies.
//                   Use null at top level if this shift never has pager pay.
//   unrestrictedCall: when the 3.5/hr unrestricted-call rate applies.
//                   Either:  null  (never eligible)
//                            'all' (entire shift eligible)
//                            { afterMin: 1020 }  (eligible after that minute)
//                   Specify weekday and weekend separately.
//   arRate.mode:    'general' (base 20/hr — default for OR-type shifts)
//                   'ob'      (base 13/hr — for OB shifts)
//                   'sf1'     (base 13/hr daytime weekday only, 20 otherwise)
//
// If multiple IMC shifts share identical rules, you can copy/paste freely.
// If a UVH-style rule already does the job exactly, just write
//    rules: 'inherit_uvh:OB_restricted'
// and I'll wire it up.
//
// ===== EXAMPLES (for reference, delete before sending back) =====
//
// 1) UVH-style 1st call (weekday 17:00–07:00, weekend 07:00–07:00):
//   IMC_1st_call: {
//     label: 'IMC 1st Call',
//     pagerWindow: {
//       weekday: { start: 1020, end: 1860 },
//       weekend: { start: 420,  end: 1860 }
//     },
//     unrestrictedCall: {
//       weekday: { afterMin: 1020 },
//       weekend: 'all'
//     },
//     arRate: { mode: 'general' }
//   }
//
// 2) IMC's 12-hr-weekend OB (the example you mentioned):
//   IMC_OB_24hr: {
//     label: 'IMC OB 24hr',
//     pagerWindow: {
//       weekday: null,
//       weekend: { start: 420, end: 1140 }   // 07:00–19:00 = 12 hrs
//     },
//     unrestrictedCall: { weekday: null, weekend: null },
//     arRate: { mode: 'ob' }
//   }
//
// ================================================================
// Fill in the values for each shift below. Leave the keys; change values.
// ================================================================

module.exports = {
  siteId: 'IMC',
  shiftRulesOverride: {

    // ----- OR / placement shifts (no pager pay, AR rate only) -----
    'IMC_OR_4':  { label: 'IMC OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_5':  { label: 'IMC OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_6':  { label: 'IMC OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_7':  { label: 'IMC OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_OR_8':  { label: 'IMC OR 8 (Night Call AM)', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Tiered shifts (need your input — same comp across all sub-tiers?) -----
    'IMC_tier_2': { label: 'Tier 2 IMC', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_3': { label: 'Tier 3 IMC', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_4': { label: 'Tier 4 IMC', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_5': { label: 'Tier 5 IMC', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_6': { label: 'Tier 6 IMC', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- Tier 5 post shifts -----
    // Are these distinct shift types from regular Tier 5, or just labels?
    'IMC_tier_5_post_1st':       { label: 'Tier 5 IMC - Post 1st',       pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_5_post_cv1':       { label: 'Tier 5 IMC - Post CV1',       pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_5_post_liver_1':   { label: 'Tier 5 IMC - Post Liver 1',   pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- Tier 4 specific named shifts -----
    'IMC_tier_4_cv2':    { label: 'Tier 4 IMC (CV 2)',    pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_tier_4_liver_2':{ label: 'Tier 4 IMC (Liver 2)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- Tier 3 (APS) -----
    'IMC_tier_3_aps': { label: 'Tier 3 IMC (APS)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- OB -----
    'IMC_OB_24hr':    { label: 'IMC OB 24hr',         pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },
    'IMC_OB_forced_off': { label: 'Forced Off IMC OB', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Call shifts -----
    'IMC_1st_call':       { label: 'IMC 1st Call',       pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_2nd_call':       { label: 'IMC 2nd Call',       pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_3rd_call':       { label: 'IMC 3rd Call',       pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_4th_call':       { label: 'IMC 4th Call',       pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_night_call':     { label: 'IMC Night Call',     pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_night_call_forced_off': { label: 'Forced Off Night Call', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Specialty calls -----
    'IMC_cv_1st_call':    { label: 'IMC CV 1st Call',    pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_cv_2nd_call':    { label: 'IMC CV 2nd Call',    pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_liver_1st_call': { label: 'IMC Liver 1st Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_liver_2nd_call': { label: 'IMC Liver 2nd Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_acute_pain_call':{ label: 'IMC Acute Pain Call',pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_endo_call':      { label: 'IMC Endo Call',      pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- Special-purpose -----
    'IMC_aod_plus1':  { label: 'IMC AOD (Plus 1)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'IMC_cpru':       { label: 'IMC CPRU',          pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_icu_day':    { label: 'IMC ICU Day',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_icu_night':  { label: 'IMC ICU Night',     pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ----- Off / vacation (no pay calc) -----
    'IMC_off':        { label: 'IMC Off',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_vacation':   { label: 'IMC Vacation',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'IMC_no_call':    { label: 'IMC No Call',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for you to answer alongside this file:
// ================================================================
//
// 1. Are the multiple "Tier 2 IMC" / "Tier 3 IMC" etc. rows in your screenshot
//    just multiple OR rooms with identical comp, or do they have different rules?
//
// 2. Are "Tier 5 IMC - Post 1st/CV1/Liver 1" actual paid shifts, or just labels
//    on Tier 5 that signal "yesterday was call" for fatigue tracking?
//
// 3. Float bonus equivalent: UVH gives a 30-pt float bonus on OR_float shifts
//    (`floatBonus: 30` in code). Does IMC have anything analogous? Which shifts?
//
// 4. Subspecialty doubling: at UVH, `cardiac_liver` gets a 2x bonus on certain
//    case points. Does IMC handle CV/Liver Calls similarly?
//
// 5. AR rate "OB" (base 13/hr) — does IMC apply this to ANY shifts beyond OB,
//    or anything else with a non-standard base rate?
//
// 6. Are there any IMC shifts you'd expect to inherit UVH's rules verbatim?
//    (If yes, list them — I'll wire it up directly.)
