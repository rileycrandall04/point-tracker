// Alta View (site ID: AV) compensation rules — FILLED IN, rev 2.
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

    // ----- Placement (single General OR replaces AVH_OR_4..11) -----
    'AVH_OR':              { label: 'AVH General OR', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },
    'AVH_ASC_1':           { label: 'AVH ASC 1',      pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } },

    // ----- Cardiac/Liver option (UVH default; rarely used here, but selectable) -----
    'cardiac_liver':       { label: 'Cardiac / Liver' },

    // ----- Off / vacation -----
    'AVH_forced_off':      { label: 'AVH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'AVH_vacation':        { label: 'AVH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }
  },

  // Other-site → AV remap when a user migrates from the parking-lot site.
  otherMigrationMap: {
    'OR':                      'AVH_OR',
    'OR_float':                'AVH_OR',
    'OB_restricted':           'AVH_OB_call',
    'cardiac_liver':           'cardiac_liver',
    'unrestricted_call_entry': 'AVH_1st_backup_call',
    'forced_off':              'AVH_forced_off',
    'vacation':                'AVH_vacation'
  }

  // Removed in cleanup (rev 2):
  //   AVH_OR_4..11 → AVH_OR (single General OR)
};
