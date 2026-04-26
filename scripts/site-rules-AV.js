// Alta View (site ID: AV) compensation rules — FILLED IN.
//
// See scripts/site-rules-IMC.js for full format docs.
// Shorthand: write `inherit_uvh: '1st_call'` (or any UVH code) on a shift
// to copy UVH's rules verbatim.
//
// Extra fields used here (need wiring in comp engine):
//   productionMultiplier: N — multiplies AR/production points on this shift
//   flatPoints: N           — flat point award regardless of duration
//
// Note: ORs/ASCs (placement shifts) get the same 4hr / 80pt minimum that
// UVH OR uses. Wired generically in the engine — no per-row field needed.

module.exports = {
  siteId: 'AV',
  shiftRulesOverride: {

    // ----- OB Call: typically 07:00-07:00 (24h restricted), can run longer.
    //                OB rate, no unrestricted call, production doubled. -----
    'AVH_OB_call': {
      label: 'AVH OB Call',
      pagerWindow: {
        weekday: { start: 420, end: 1860 },
        weekend: { start: 420, end: 1860 }
      },
      unrestrictedCall: null,
      arRate: { mode: 'ob' },
      productionMultiplier: 2
    },

    // ----- Call shifts (one slot for 1st+Backup; UVH-style hours) -----
    'AVH_1st_backup_call': { label: 'AVH 1st/Backup Call', inherit_uvh: '1st_call' },
    'AVH_2nd_call':        { label: 'AVH 2nd Call',        inherit_uvh: '2nd_call' },
    'AVH_3rd_call':        { label: 'AVH 3rd Call',        inherit_uvh: '3rd_call' },

    // ----- OR rooms (placement only — same as UVH OR, 4hr/80pt minimum) -----
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
    'AVH_forced_off': { label: 'AVH Forced Off', pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' }, flatPoints: 56 },
    'AVH_vacation':   { label: 'AVH Vacation',   pagerWindow: null, unrestrictedCall: null, arRate: { mode: 'general' } }

  }
};
