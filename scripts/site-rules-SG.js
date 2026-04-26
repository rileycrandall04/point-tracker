// St. George (site ID: SG) compensation rules — FILLED IN, rev 2.
//
// SGH = St. George Hospital.
// See scripts/site-rules-IMC.js for full format docs.

module.exports = {
  siteId: 'SG',

  shiftRulesOverride: {
    // ============================================================
    // CALL SHIFTS
    // ============================================================

    // Day Call = UVH 1st Call's weekend pattern (24h pager, all-day unrestricted).
    // Typically worked on weekends; rules force weekend behavior even on weekdays.
    'SGH_day_call': {
      label: 'SGH Day Call',
      pagerWindow: { weekday: { start: 420, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },

    // Night Call = UVH Mole (weekday 19:00-07:00, unrestricted)
    'SGH_night_call': { label: 'SGH Night Call', inherit_uvh: 'mole' },

    // Heart Call = 1st-call-style shift + cardiac bonus
    'SGH_heart_call': {
      label: 'SGH Heart Call',
      pagerWindow: { weekday: { start: 1020, end: 1860 }, weekend: { start: 420, end: 1860 } },
      unrestrictedCall: { weekday: { afterMin: 1020 }, weekend: 'all' },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },

    // Backup physicians (typically weekend; inherit UVH 2nd/3rd call rules)
    'SGH_backup_1_phys': { label: 'SGH Backup 1 Physician', inherit_uvh: '2nd_call' },
    'SGH_backup_2_phys': { label: 'SGH Backup 2 Physician', inherit_uvh: '3rd_call' },

    // OB: single entry (rev 2 collapses Day/Night). Inherits UVH OB.
    'SGH_OB': { label: 'SGH OB', inherit_uvh: 'OB_restricted' },

    // 1st/2nd Call — typically weekday at SG; inherit UVH 1st/2nd verbatim
    'SGH_1st_call': { label: 'SGH 1st Call', inherit_uvh: '1st_call' },
    'SGH_2nd_call': { label: 'SGH 2nd Call', inherit_uvh: '2nd_call' },

    // ============================================================
    // PLACEMENT SHIFTS — single General OR per facility (rev 2)
    // ============================================================

    'SGH_OR':   { label: 'SGH General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_ASC':  { label: 'SGH ASC',        pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_NORA': { label: 'SGH NORA',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // Cardiac/Liver option (UVH default; SGH_heart_call covers cardiac)
    'cardiac_liver': { label: 'Cardiac / Liver' },

    // ============================================================
    // OFF / VACATION (Off Grid / Off Post Call / Vacation all = 0 pts)
    // ============================================================

    'SGH_forced_day_off': { label: 'SGH Forced Day Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'SGH_off_grid':       { label: 'SGH Off Grid',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_off_post_call':  { label: 'SGH Off Post Call',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_vacation':       { label: 'SGH Vacation',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'SGH_OR',
    'OR_float':                'SGH_OR',
    'OB_restricted':           'SGH_OB',
    'cardiac_liver':           'SGH_heart_call',
    'unrestricted_call_entry': 'SGH_1st_call',
    'forced_off':              'SGH_forced_day_off',
    'vacation':                'SGH_vacation'
  }

  // Removed in cleanup (rev 2):
  //   SGH_OR_3..28 → SGH_OR (single General OR)
  //   SGH_OB_day_call / SGH_OB_night_call → SGH_OB (inherits UVH OB)
  //   SGH_ASC_1..5 → SGH_ASC
};
