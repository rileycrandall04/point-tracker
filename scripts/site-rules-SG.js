// St. George (site ID: SG) compensation rules — FILLED IN.
//
// SGH = St. George Hospital.
// See scripts/site-rules-IMC.js for full format docs.
// Shorthand: write `inherit_uvh: '1st_call'` (or any UVH code) to copy
// UVH's rules verbatim.
//
// Extra fields used here (need wiring in comp engine):
//   productionMultiplier: N — multiplies AR/production points on this shift
//   flatPoints: N           — flat point award regardless of duration
//   cardiacBonus: true      — apply UVH cardiac_liver-style 2x case point bonus
//                             on cardiac cases (Heart Call doubles as cardiac call)
//
// Note: ORs/ASCs/NORA (placement shifts) get the same 4hr / 80pt minimum
// that UVH OR uses. Wired generically in the engine.
//
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
      pagerWindow: {
        weekday: { start: 420, end: 1860 },
        weekend: { start: 420, end: 1860 }
      },
      unrestrictedCall: { weekday: 'all', weekend: 'all' },
      arRate: { mode: 'general' }
    },

    // Night Call = UVH Mole (weekday 19:00-07:00, unrestricted)
    'SGH_night_call': { label: 'SGH Night Call', inherit_uvh: 'mole' },

    // Heart Call = 1st-call-style shift + cardiac bonus
    // (one of the call people doubles as cardiac call; gets unrestricted call
    // + UVH cardiac_liver-style 2x case point multiplier).
    'SGH_heart_call': {
      label: 'SGH Heart Call',
      pagerWindow: {
        weekday: { start: 1020, end: 1860 },
        weekend: { start: 420,  end: 1860 }
      },
      unrestrictedCall: {
        weekday: { afterMin: 1020 },
        weekend: 'all'
      },
      arRate: { mode: 'general' },
      cardiacBonus: true
    },

    // Backup physicians (typically weekend; inherit UVH 2nd/3rd call rules)
    'SGH_backup_1_phys': { label: 'SGH Backup 1 Physician (SGH Backup 1 Phys)', inherit_uvh: '2nd_call' },
    'SGH_backup_2_phys': { label: 'SGH Backup 2 Physician (SGH Backup 2 Phys)', inherit_uvh: '3rd_call' },

    // OB Day/Night — same comp as UVH OB: 13/hr base + UVH AR multipliers.
    // Production doubled. No pager pay (scheduled shifts).
    // OB Day typically 07:00-19:00, OB Night typically 19:00-07:00 (not hard limits).
    'SGH_OB_day_call': {
      label: 'SGH OB Day Call',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },
    'SGH_OB_night_call': {
      label: 'SGH OB Night Call',
      pagerWindow: null,
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },

    // 1st/2nd Call — typically weekday at SG; inherit UVH 1st/2nd verbatim
    'SGH_1st_call': { label: 'SGH 1st Call', inherit_uvh: '1st_call' },
    'SGH_2nd_call': { label: 'SGH 2nd Call', inherit_uvh: '2nd_call' },

    // ============================================================
    // PLACEMENT SHIFTS (ORs / ASCs / NORA — same as UVH General OR)
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
    // OFF / VACATION (Off Grid / Off Post Call / Vacation all = 0 pts)
    // ============================================================

    'SGH_forced_day_off': { label: 'SGH Forced Day Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'SGH_off_grid':       { label: 'SGH Off Grid',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_off_post_call':  { label: 'SGH Off Post Call',  pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'SGH_vacation':       { label: 'SGH Vacation',       pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};
