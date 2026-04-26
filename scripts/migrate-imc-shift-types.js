#!/usr/bin/env node
/*
 * Remap legacy / UVH-style shift assignmentType keys to their IMC
 * equivalents for every user whose settings.siteId === 'IMC' (or the
 * site passed via --siteId).
 *
 * Run from Cloud Shell after the IMC rules have been loaded:
 *   gcloud config set project mwa-point-tracker
 *   node scripts/migrate-imc-shift-types.js
 *
 * Flags:
 *   --siteId=IMC       (default) only touch users currently on this site
 *   --uid=<uid>        only this user (skips siteId filter)
 *   --dry-run          show what would change, don't write
 *
 * Idempotent — keys already at their target value are skipped. Safe to
 * re-run if mappings are extended later.
 *
 * Mapping (per user spec):
 *
 *   UVH                      ->  IMC
 *   --------------------------------------
 *   OR                       ->  IMC_OR
 *   OR_float                 ->  IMC_OR_float
 *   OB_restricted            ->  IMC_OB_24hr
 *   1st_call                 ->  IMC_1st_call
 *   2nd_call                 ->  IMC_2nd_call
 *   3rd_call                 ->  IMC_3rd_call
 *   4th_call                 ->  IMC_4th_call
 *   cardiac_liver            ->  IMC_cv_1st_call
 *   mole                     ->  IMC_night_call
 *   endo                     ->  IMC_endo_call
 *   forced_off               ->  IMC_forced_off
 *   vacation                 ->  IMC_vacation
 *
 *   Prior IMC keys (rev-1)   ->  rev-2
 *   --------------------------------------
 *   IMC_OR_4 / 5 / 6 / 7 / 8 ->  IMC_OR
 *   IMC_off                  ->  IMC_vacation
 *   IMC_no_call              ->  IMC_vacation
 *   IMC_aod_plus1            ->  IMC_aod
 *   IMC_OB_forced_off        ->  IMC_forced_off
 *   IMC_night_call_forced_off->  IMC_forced_off
 *
 * SF1 / SF2 / ACS / NORA / pre_call / CRNA_supervision are NOT remapped:
 * they belong to other facilities or aren't IMC concepts. Shifts saved
 * with those keys keep their original value (and continue to calculate
 * via UVH defaults).
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'mwa-point-tracker';
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const REMAP = {
  // UVH -> IMC
  'OR':              'IMC_OR',
  'OR_float':        'IMC_OR_float',
  'OB_restricted':   'IMC_OB_24hr',
  '1st_call':        'IMC_1st_call',
  '2nd_call':        'IMC_2nd_call',
  '3rd_call':        'IMC_3rd_call',
  '4th_call':        'IMC_4th_call',
  'cardiac_liver':   'IMC_cv_1st_call',
  'mole':            'IMC_night_call',
  'endo':            'IMC_endo_call',
  'forced_off':      'IMC_forced_off',
  'vacation':        'IMC_vacation',
  // Prior IMC keys retired in rev-2 cleanup
  'IMC_OR_4':        'IMC_OR',
  'IMC_OR_5':        'IMC_OR',
  'IMC_OR_6':        'IMC_OR',
  'IMC_OR_7':        'IMC_OR',
  'IMC_OR_8':        'IMC_OR',
  'IMC_off':         'IMC_vacation',
  'IMC_no_call':     'IMC_vacation',
  'IMC_aod_plus1':   'IMC_aod',
  'IMC_OB_forced_off':         'IMC_forced_off',
  'IMC_night_call_forced_off': 'IMC_forced_off'
};

function parseArgs() {
  const out = { siteId: 'IMC', uid: null, dryRun: false };
  for (const a of process.argv.slice(2)) {
    if (a === '--dry-run') out.dryRun = true;
    else if (a.startsWith('--siteId=')) out.siteId = a.slice('--siteId='.length);
    else if (a.startsWith('--uid=')) out.uid = a.slice('--uid='.length);
  }
  return out;
}

async function listTargetUids({ siteId, uid }) {
  if (uid) return [uid];
  const userRefs = await db.collection('users').listDocuments();
  const uids = [];
  for (const ref of userRefs) {
    const settingsSnap = await ref.collection('data').doc('settings').get();
    const userSiteId = settingsSnap.exists ? (settingsSnap.data() || {}).siteId : null;
    if (userSiteId === siteId) uids.push(ref.id);
  }
  return uids;
}

async function migrateOne(uid, dryRun) {
  const ref = db.collection('users').doc(uid).collection('data').doc('data');
  const snap = await ref.get();
  if (!snap.exists) return { uid, shiftsChanged: 0, casesChanged: 0, skipped: 'no data doc' };
  const d = snap.data() || {};
  let shiftsChanged = 0;
  let casesChanged = 0;
  const sample = [];

  if (d.shifts && typeof d.shifts === 'object') {
    for (const date of Object.keys(d.shifts)) {
      const s = d.shifts[date];
      if (!s) continue;
      const cur = s.assignmentType;
      if (cur && Object.prototype.hasOwnProperty.call(REMAP, cur)) {
        const next = REMAP[cur];
        if (next !== cur) {
          if (sample.length < 3) sample.push(`${date}: ${cur} -> ${next}`);
          s.assignmentType = next;
          shiftsChanged++;
        }
      }
    }
  }

  // Cases also store assignmentType-ish references? No — cases use caseType,
  // which is site-agnostic ('standard', 'labor_epidural', etc.). Skip.

  if (shiftsChanged === 0) {
    return { uid, shiftsChanged: 0, casesChanged: 0 };
  }
  if (!dryRun) {
    await ref.set(d);
  }
  return { uid, shiftsChanged, casesChanged, sample };
}

(async () => {
  try {
    const args = parseArgs();
    console.log('Args:', args);
    const uids = await listTargetUids(args);
    if (uids.length === 0) {
      console.log(`No users found with siteId=${args.siteId}.`);
      process.exit(0);
    }
    console.log(`Targeting ${uids.length} user(s).`);
    let totalShifts = 0;
    let touched = 0;
    for (const uid of uids) {
      const res = await migrateOne(uid, args.dryRun);
      if (res.shiftsChanged > 0) {
        touched++;
        totalShifts += res.shiftsChanged;
        console.log(`  ${uid}: ${res.shiftsChanged} shift(s) remapped${args.dryRun ? ' (dry-run)' : ''}`);
        for (const s of res.sample || []) console.log('     ' + s);
      } else if (res.skipped) {
        console.log(`  ${uid}: skipped (${res.skipped})`);
      }
    }
    console.log(`\nDone. ${args.dryRun ? '(dry-run) ' : ''}${touched} user(s) touched, ${totalShifts} shift(s) remapped.`);
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();
