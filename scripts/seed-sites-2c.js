#!/usr/bin/env node
/*
 * Seed the `sites` Firestore collection (step 2c).
 *
 * Creates `sites/UVH` if it doesn't already exist, and populates its
 * `members` array with every existing user uid (anyone with a
 * `users/{uid}/data/data` doc).
 *
 * Run from Cloud Shell AFTER step 2b backfill has been applied:
 *   gcloud config set project mwa-point-tracker
 *   node seed-sites-2c.js
 *
 * Idempotent — safe to run more than once. Does not overwrite an
 * existing UVH site doc (so manual edits to name/owner survive).
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'mwa-point-tracker';
const DEFAULT_SITE_ID = 'UVH';
const DEFAULT_SITE_NAME = 'UVH';

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

async function listAllUserUids() {
  // Each user has a doc at users/{uid}/data/data. We pull the user-level
  // collection by listing documents (via listDocuments).
  const userRefs = await db.collection('users').listDocuments();
  return userRefs.map(ref => ref.id);
}

(async () => {
  try {
    const uids = await listAllUserUids();
    console.log(`Found ${uids.length} existing users.`);

    const siteRef = db.collection('sites').doc(DEFAULT_SITE_ID);
    const existing = await siteRef.get();

    if (existing.exists) {
      console.log(`sites/${DEFAULT_SITE_ID} already exists — merging members only.`);
      const cur = existing.data();
      const merged = Array.from(new Set([...(cur.members || []), ...uids]));
      await siteRef.set({ members: merged }, { merge: true });
      console.log(`  members count: ${merged.length}`);
    } else {
      await siteRef.set({
        id: DEFAULT_SITE_ID,
        name: DEFAULT_SITE_NAME,
        members: uids,
        owner: null,
        createdAt: new Date().toISOString()
      });
      console.log(`Created sites/${DEFAULT_SITE_ID} with ${uids.length} members.`);
      console.log('  set the `owner` field manually in Firebase console to your uid.');
    }

    console.log('\nDone.');
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();
