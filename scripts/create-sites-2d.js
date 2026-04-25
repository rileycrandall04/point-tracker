#!/usr/bin/env node
/*
 * One-shot: create the remaining site docs (step 2d).
 *
 * Reads the owner uid from sites/UVH (already set), then creates each
 * site below if it doesn't already exist. Members start empty — the
 * admin moves users in via the Firebase console (or a future admin UI).
 *
 * Run from Cloud Shell:
 *   cd ~/point-tracker && git pull && cd scripts
 *   node create-sites-2d.js
 *
 * Idempotent: skips any site doc that already exists (preserves manual
 * edits like name/members/owner).
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'mwa-point-tracker';

const SITES_TO_CREATE = [
  { id: 'IMC', name: 'IMC' },
  { id: 'AV',  name: 'Alta View' },
  { id: 'RV',  name: 'Riverton' },
  { id: 'SG',  name: 'St. George' },
  { id: 'MD',  name: 'Mckay Dee' },
  { id: 'LDS', name: 'LDS' },
  { id: 'PC',  name: 'Park City' }
];

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

(async () => {
  try {
    const uvhSnap = await db.collection('sites').doc('UVH').get();
    if (!uvhSnap.exists) {
      console.error('sites/UVH not found — run seed-sites-2c.js first.');
      process.exit(1);
    }
    const owner = uvhSnap.data().owner;
    if (!owner) {
      console.error('sites/UVH.owner is empty — set it in Firebase console first.');
      process.exit(1);
    }
    console.log(`Using owner uid from sites/UVH: ${owner}`);

    const now = new Date().toISOString();
    let created = 0, skipped = 0;
    for (const site of SITES_TO_CREATE) {
      const ref = db.collection('sites').doc(site.id);
      const existing = await ref.get();
      if (existing.exists) {
        console.log(`  skip ${site.id} (already exists)`);
        skipped++;
        continue;
      }
      await ref.set({
        id: site.id,
        name: site.name,
        members: [],
        owner: owner,
        createdAt: now
      });
      console.log(`  created sites/${site.id} (${site.name})`);
      created++;
    }

    console.log(`\nDone. ${created} created, ${skipped} skipped.`);
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();
