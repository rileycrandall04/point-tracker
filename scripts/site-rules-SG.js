// St. George (site ID: SG) compensation rules — fill in and send back.
//
// SGH = St. George Hospital.
// See scripts/site-rules-IMC.js for full format docs and examples.
// Shorthand: write `inherit_uvh: 'OB_restricted'` to copy UVH's rules verbatim.

module.exports = {
  siteId: 'SG',
  shiftRulesOverride: {

    // ============================================================
    // CALL SHIFTS
    // ============================================================

    'SGH_day_call':    { label: 'SGH Day Call',    pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'SGH_night_call':  { label: 'SGH Night Call',  pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'SGH_heart_call':  { label: 'SGH Heart Call',  pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // Backup physician shifts
    'SGH_backup_1_phys': { label: 'SGH Backup 1 Physician (SGH Backup 1 Phys)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'SGH_backup_2_phys': { label: 'SGH Backup 2 Physician (SGH Backup 2 Phys)', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // OB calls (split day/night)
    'SGH_OB_day_call':   { label: 'SGH OB Day Call',   pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },
    'SGH_OB_night_call': { label: 'SGH OB Night Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: /* TODO ob? */ { mode: 'ob' } },

    // 1st / 2nd call
    'SGH_1st_call': { label: 'SGH 1st Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },
    'SGH_2nd_call': { label: 'SGH 2nd Call', pagerWindow: /* TODO */ null, unrestrictedCall: /* TODO */ null, arRate: { mode: 'general' } },

    // ============================================================
    // PLACEMENT SHIFTS (ORs / ASCs / NORA)
    // ============================================================

    'SGH_OR_3':  { label: 'SGH OR 3',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_4':  { label: 'SGH OR 4',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_5':  { label: 'SGH OR 5',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_6':  { label: 'SGH OR 6',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_7':  { label: 'SGH OR 7',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_8':  { label: 'SGH OR 8',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_9':  { label: 'SGH OR 9',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_10': { label: 'SGH OR 10', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_11': { label: 'SGH OR 11', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_12': { label: 'SGH OR 12', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_13': { label: 'SGH OR 13', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_14': { label: 'SGH OR 14', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_15': { label: 'SGH OR 15', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_16': { label: 'SGH OR 16', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_17': { label: 'SGH OR 17', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_18': { label: 'SGH OR 18', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_19': { label: 'SGH OR 19', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_20': { label: 'SGH OR 20', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_21': { label: 'SGH OR 21', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_22': { label: 'SGH OR 22', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_23': { label: 'SGH OR 23', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_24': { label: 'SGH OR 24', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_25': { label: 'SGH OR 25', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_26': { label: 'SGH OR 26', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_27': { label: 'SGH OR 27', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_OR_28': { label: 'SGH OR 28', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    'SGH_ASC_1': { label: 'SGH ASC 1', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_ASC_2': { label: 'SGH ASC 2', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_ASC_3': { label: 'SGH ASC 3', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_ASC_4': { label: 'SGH ASC 4', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_ASC_5': { label: 'SGH ASC 5', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    'SGH_NORA':  { label: 'SGH NORA', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ============================================================
    // OFF / VACATION
    // ============================================================

    'SGH_forced_day_off': { label: 'SGH Forced Day Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_off_grid':       { label: 'SGH Off Grid',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_off_post_call':  { label: 'SGH Off Post Call',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_vacation':       { label: 'SGH Vacation',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};

// ================================================================
// QUESTIONS for SG:
// ================================================================
//
// 1. SGH Day Call vs Night Call vs 1st/2nd Call vs Heart Call vs Backup —
//    what's the relationship? Are Day Call and Night Call a single call
//    rotation split by time, or distinct shifts? Where do 1st/2nd fit in?
//    Pager hours for each? Unrestricted call eligibility?
//
// 2. SGH Backup 1 Physician / Backup 2 Physician — paid as call (pager pay)
//    or paid hourly when activated, or just a calendar marker?
//
// 3. SGH OB Day Call vs OB Night Call — what hours each? Both AR rate base
//    13/hr (OB)?
//
// 4. SGH Heart Call — pager hours? AR rate base — same as general (20/hr)
//    or is there something cardiac-specific?
//
// 5. ORs 3-28, ASCs 1-5, NORA — confirm: placement only, no pager,
//    AR base 20/hr.
//
// 6. SGH Forced Day Off — flat point amount (UVH = 56)?
//
// 7. SGH Off Post Call vs SGH Off Grid vs SGH Vacation — what distinguishes
//    these? All 0 pts, just different calendar labels?
//
// 8. Any SG shifts that should inherit UVH rules verbatim?
