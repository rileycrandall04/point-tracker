import { db as firestore } from './firebase';
import {
  collection, doc, setDoc, deleteDoc, getDocs, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import localDb from './db';

// Collections we sync to Firestore (under users/{uid}/...)
const SYNC_TABLES = [
  'profile', 'userCallings', 'responsibilities', 'meetings',
  'meetingInstances', 'actionItems', 'inbox', 'journal',
];

// ── Upload all local data to Firestore ──────────────────────
export async function uploadAllToFirestore(uid) {
  for (const tableName of SYNC_TABLES) {
    const table = localDb[tableName];
    if (!table) continue;

    const items = await table.toArray();
    for (const item of items) {
      const docId = String(item.id);
      const docRef = doc(firestore, `users/${uid}/${tableName}`, docId);
      await setDoc(docRef, {
        ...item,
        _syncedAt: serverTimestamp(),
      });
    }
  }
}

// ── Download all Firestore data to local DB ─────────────────
export async function downloadAllFromFirestore(uid) {
  for (const tableName of SYNC_TABLES) {
    const table = localDb[tableName];
    if (!table) continue;

    const colRef = collection(firestore, `users/${uid}/${tableName}`);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) continue;

    // Clear local table and replace with cloud data
    await table.clear();
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      // Remove Firestore-only fields
      delete data._syncedAt;
      await table.put(data);
    }
  }
}

// ── Sync a single item to Firestore ─────────────────────────
export async function syncItemToFirestore(uid, tableName, item) {
  if (!uid || !SYNC_TABLES.includes(tableName)) return;
  const docId = String(item.id);
  const docRef = doc(firestore, `users/${uid}/${tableName}`, docId);
  await setDoc(docRef, {
    ...item,
    _syncedAt: serverTimestamp(),
  });
}

// ── Delete a single item from Firestore ─────────────────────
export async function deleteItemFromFirestore(uid, tableName, itemId) {
  if (!uid || !SYNC_TABLES.includes(tableName)) return;
  const docRef = doc(firestore, `users/${uid}/${tableName}`, String(itemId));
  await deleteDoc(docRef);
}

// ── Hook into Dexie to auto-sync writes ─────────────────────
let currentUid = null;

export function startAutoSync(uid) {
  currentUid = uid;

  // Hook into Dexie's creating/updating/deleting events for each table
  for (const tableName of SYNC_TABLES) {
    const table = localDb[tableName];
    if (!table) continue;

    table.hook('creating', function (primKey, obj) {
      // After the item is created locally, sync to Firestore
      this.onsuccess = function (id) {
        const item = { ...obj, id };
        syncItemToFirestore(currentUid, tableName, item).catch(console.error);
      };
    });

    table.hook('updating', function (modifications, primKey, obj) {
      this.onsuccess = function () {
        const updated = { ...obj, ...modifications };
        syncItemToFirestore(currentUid, tableName, updated).catch(console.error);
      };
    });

    table.hook('deleting', function (primKey, obj) {
      this.onsuccess = function () {
        deleteItemFromFirestore(currentUid, tableName, primKey).catch(console.error);
      };
    });
  }
}

export function stopAutoSync() {
  currentUid = null;
  // Note: Dexie hooks persist, but with currentUid=null they become no-ops
}
