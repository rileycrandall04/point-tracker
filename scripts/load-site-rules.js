#!/usr/bin/env node
/*
 * Load each `site-rules-{XXX}.js` module in this directory into Firestore.
 *
 * For every module that exports `{ siteId, shiftRulesOverride }`, this writes:
 *   sites/{siteId}.shiftRulesOverride = override
 *   sites/{siteId}.visibleShiftTypes  = Object.keys(override)
 *
 * Other site-doc fields (name, members, owner, unlocked, etc.) are
 * preserved via `set(..., { merge: true })`.
 *
 * Run from Cloud Shell:
 *   gcloud config set project mwa-point-tracker
 *   node scripts/load-site-rules.js
 *
 * Idempotent — safe to re-run when site-rules-*.js files change.
 *
 * Optional: pass site IDs as args to limit the load:
 *   node scripts/load-site-rules.js IMC SG
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'mwa-point-tracker';
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const SCRIPTS_DIR = __dirname;
const FILE_PATTERN = /^site-rules-([A-Za-z0-9_-]+)\.js$/;

const argSiteIds = process.argv.slice(2).map(s => s.trim()).filter(Boolean);
const filterSet = argSiteIds.length > 0 ? new Set(argSiteIds) : null;

(async () => {
  try {
    const files = fs.readdirSync(SCRIPTS_DIR).filter(f => FILE_PATTERN.test(f));
    if (files.length === 0) {
      console.error('No site-rules-*.js files found in', SCRIPTS_DIR);
      process.exit(1);
    }

    let loaded = 0;
    let skipped = 0;
    for (const file of files.sort()) {
      const mod = require(path.join(SCRIPTS_DIR, file));
      const siteId = mod && mod.siteId;
      const override = mod && mod.shiftRulesOverride;
      if (!siteId || !override || typeof override !== 'object') {
        console.warn(`  SKIP ${file}: missing siteId or shiftRulesOverride export`);
        skipped++;
        continue;
      }
      if (filterSet && !filterSet.has(siteId)) {
        console.log(`  skip ${siteId} (not in filter)`);
        skipped++;
        continue;
      }

      const visibleShiftTypes = Object.keys(override);
      await db.collection('sites').doc(siteId).set({
        shiftRulesOverride: override,
        visibleShiftTypes
      }, { merge: true });

      console.log(`  loaded sites/${siteId}: ${visibleShiftTypes.length} shift type(s) from ${file}`);
      loaded++;
    }

    console.log(`\nDone. Loaded ${loaded}, skipped ${skipped}.`);
    process.exit(0);
  } catch (err) {
    console.error('FAILED:', err);
    process.exit(1);
  }
})();
