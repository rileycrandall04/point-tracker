// FROZEN: original seed. Live edits now happen via Admin → Shift Rules in-app
// and write directly to Firestore. Running scripts/load-site-rules.js --force
// will OVERWRITE the live rules with this file. Don't edit unless you've
// coordinated with whoever may be editing live.
//
// Alta View (site ID: AV) compensation rules — FILLED IN, rev 3.
//
// AVH = Alta View Hospital.
// See scripts/site-rules-IMC.js for full format docs.
// Shorthand: write `inherit_uvh: '1st_call'` (or any UVH code) to copy
// UVH's rules verbatim.

module.exports = {
  siteId: 'AV',

  shiftRulesOverride: {
    // ----- Call shifts -----
    'AVH_OB_call':         { label: 'AVH OB Call', inherit_uvh: 'OB_restricted' },
    'AVH_1st_backup_call': { label: 'AVH 1st/Backup Call', inherit_uvh: '1st_call' },
    'AVH_2nd_call':        { label: 'AVH 2nd Call',        inherit_uvh: '2nd_call' },
    'AVH_3rd_call':        { label: 'AVH 3rd Call',        inherit_uvh: '3rd_call' },

    // ----- Placement (single General OR — covers AVH_OR_4..11 AND ASC) -----
    'AVH_OR':              { label: 'General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_OR_float':        { label: 'General OR - Float', inherit_uvh: 'OR_float' },

    // ----- Cardiac/Liver option (UVH default; rarely used here, but selectable) -----
    'cardiac_liver':       { label: 'Cardiac / Liver' },

    // ----- Off / vacation -----
    'AVH_forced_off':      { label: 'AVH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'AVH_vacation':        { label: 'AVH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  otherMigrationMap: {
    'OR':                      'AVH_OR',
    'OR_float':                'AVH_OR_float',
    'OB_restricted':           'AVH_OB_call',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'AVH_1st_backup_call',
    'forced_off':              'AVH_forced_off',
    'vacation':                'AVH_vacation',
    // Legacy AV-specific keys retired in rev 2/3 — point them at General OR.
    'AVH_OR_4':                'AVH_OR',
    'AVH_OR_5':                'AVH_OR',
    'AVH_OR_6':                'AVH_OR',
    'AVH_OR_7':                'AVH_OR',
    'AVH_OR_8':                'AVH_OR',
    'AVH_OR_9':                'AVH_OR',
    'AVH_OR_10':               'AVH_OR',
    'AVH_OR_11':               'AVH_OR',
    'AVH_ASC_1':               'AVH_OR'
  }

  // Removed in cleanup:
  //   rev 2: AVH_OR_4..11 → AVH_OR (single General OR)
  //   rev 3: AVH_ASC_1   → AVH_OR (folded under General OR per user spec)
  //          AVH_OR label changed from "AVH General OR" to "General OR".
};
