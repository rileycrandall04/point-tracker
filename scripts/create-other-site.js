#!/usr/bin/env node
/*
 * One-shot: create the "Other" site for users whose actual site
 * isn't unlocked yet.
 *
 * Other is a parking lot with a small whitelist of generic shift
 * types so users can still track their work. Once their real site
 * is unlocked, an admin invites them and the migration moves all
 * their data to the new site (using the same global shift type IDs,
 * so nothing breaks on the rules side).
 *
 * Run from Cloud Shell:
 *   cd ~/point-tracker && git pull && cd scripts
 *   node create-other-site.js
 *
 * Idempotent: re-running updates fields without clobbering members/owner.
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'mwa-point-tracker';
const OTHER_ID = 'OTHER';

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

    const ref = db.collection('sites').doc(OTHER_ID);
    const existing = await ref.get();
    const now = new Date().toISOString();

    // visibleShiftTypes whitelists the assignment-type dropdown for Other
    // users. All four IDs exist in DEFAULT_SHIFT_RULES so they remain valid
    // after a future migration to any other site.
    const visibleShiftTypes = [
      'OR',                       // General OR placement (UVH default)
      'OB_restricted',            // OB at OB rate (UVH default)
      'cardiac_liver',            // Cardiac (UVH default; subspec checkbox)
      'unrestricted_call_entry',  // User enters hours; pays 3.5/hr pager pay
      'forced_off',
      'vacation'
    ];

    const payload = {
      id: OTHER_ID,
      name: 'Other (Site Pending)',
      unlocked: true,
      visibleShiftTypes: visibleShiftTypes,
      owner: owner,
      updatedAt: now
    };

    if (existing.exists) {
      // Preserve members/createdAt; merge our fields
      await ref.set(payload, { merge: true });
      console.log(`Updated sites/${OTHER_ID} (preserved existing members/createdAt).`);
    } else {
      payload.members = [];
      payload.createdAt = now;
      await ref.set(payload);
      console.log(`Created sites/${OTHER_ID}.`);
    }

    console.log('\nFields set:');
    console.log('  name:               ', payload.name);
    console.log('  unlocked:           ', payload.unlocked);
    console.log('  visibleShiftTypes:  ', visibleShiftTypes.join(', '));
    console.log('\nNew users on locked sites will now see "Other (Site Pending)" in their site picker.');
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();
