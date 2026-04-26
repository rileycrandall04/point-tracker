#!/usr/bin/env node
/*
 * One-shot Firestore backfill for multi-site rollout (step 2b).
 *
 * What it does:
 *   1. Stamps siteId='UVH' on every doc in `sharedCases` that lacks one.
 *   2. Stamps siteId='UVH' on every doc in `sharedCaseOverrides` that lacks one.
 *   3. Copies `surgeonMappings/canonical` to `surgeonMappings/UVH` (if UVH not yet present).
 *
 * Run BEFORE deploying the 2b client code. After this completes, queries
 * filtered by siteId='UVH' will return existing data correctly.
 *
 * Run from Cloud Shell:
 *   gcloud config set project mwa-point-tracker
 *   node backfill-siteid-2b.js
 *
 * Idempotent — safe to run more than once.
 *
 * Requires the firebase-admin npm package. In Cloud Shell:
 *   npm install firebase-admin
 *
 * Authentication uses Application Default Credentials (Cloud Shell auto-auths
 * as your Google account; locally, run `gcloud auth application-default login`).
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'mwa-point-tracker';
const DEFAULT_SITE_ID = 'UVH';

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

async function backfillCollection(name) {
  console.log(`\n=== ${name} ===`);
  const snap = await db.collection(name).get();
  console.log(`  ${snap.size} docs total`);
  let stamped = 0, skipped = 0;
  let batch = db.batch();
  let inBatch = 0;
  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.siteId) { skipped++; continue; }
    batch.update(doc.ref, { siteId: DEFAULT_SITE_ID });
    stamped++;
    inBatch++;
    if (inBatch >= 400) {
      await batch.commit();
      batch = db.batch();
      inBatch = 0;
    }
  }
  if (inBatch > 0) await batch.commit();
  console.log(`  ${stamped} stamped with siteId='${DEFAULT_SITE_ID}', ${skipped} already had siteId`);
}

async function migrateSurgeonMappings() {
  console.log('\n=== surgeonMappings ===');
  const canonRef = db.collection('surgeonMappings').doc('canonical');
  const uvhRef = db.collection('surgeonMappings').doc(DEFAULT_SITE_ID);
  const [canonSnap, uvhSnap] = await Promise.all([canonRef.get(), uvhRef.get()]);

  if (uvhSnap.exists) {
    console.log(`  surgeonMappings/${DEFAULT_SITE_ID} already exists — skipping`);
    return;
  }
  if (!canonSnap.exists) {
    console.log('  surgeonMappings/canonical does not exist — nothing to migrate');
    return;
  }
  const canonData = canonSnap.data();
  await uvhRef.set({
    mappings: canonData.mappings || {},
    siteId: DEFAULT_SITE_ID,
    updatedAt: new Date().toISOString(),
    migratedFromCanonicalAt: new Date().toISOString()
  });
  const count = Object.keys(canonData.mappings || {}).length;
  console.log(`  copied ${count} mappings from /canonical to /${DEFAULT_SITE_ID}`);
  console.log('  /canonical left in place; delete manually after verifying.');
}

(async () => {
  try {
    await backfillCollection('sharedCases');
    await backfillCollection('sharedCaseOverrides');
    await migrateSurgeonMappings();
    console.log('\nDone.');
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();
