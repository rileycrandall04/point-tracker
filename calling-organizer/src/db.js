import Dexie from 'dexie';

const db = new Dexie('CallingOrganizer');

db.version(1).stores({
  // User profile and settings
  profile: '++id, name',

  // User's active callings
  userCallings: '++id, callingKey, startDate',

  // Responsibilities per calling (handbook defaults + custom)
  responsibilities: '++id, callingId, title, pillar, isCustom, isRecurring, recurringCadence',

  // People (manually entered as relevant — NOT a full ward list)
  people: '++id, name, phone, email',

  // Callings org chart (calling slots in the ward)
  callingSlots: '++id, organization, roleName, personId, status, assignedTo',

  // Meeting types (recurring templates)
  meetings: '++id, callingId, name, cadence, agendaTemplate, participants',

  // Individual meeting instances
  meetingInstances: '++id, meetingId, date, notes, attendees, status',

  // Action items — the heart of the system
  actionItems: '++id, title, description, ownerId, sourceMeetingInstanceId, status, priority, pillar, context, dueDate, isRecurring, recurringCadence, createdAt, completedAt, *targetMeetingIds',

  // Quick capture inbox
  inbox: '++id, text, createdAt, processed',

  // Lessons, talks, training materials
  lessons: '++id, title, content, type, *tags, date, audience',

  // Events (3-month calendar)
  events: '++id, title, date, organization, status, budget, notes',

  // Receipts
  receipts: '++id, amount, vendor, date, organization, purpose, imageData, status',

  // Private spiritual impressions journal
  journal: '++id, text, date, *tags',
});

// ── Helper functions ────────────────────────────────────────

// Profile
export async function getProfile() {
  return await db.profile.toCollection().first();
}

export async function saveProfile(profile) {
  const existing = await getProfile();
  if (existing) {
    return await db.profile.update(existing.id, profile);
  }
  return await db.profile.add(profile);
}

// User Callings
export async function getUserCallings() {
  return await db.userCallings.toArray();
}

export async function addUserCalling(calling) {
  return await db.userCallings.add({
    ...calling,
    startDate: new Date().toISOString(),
  });
}

export async function removeUserCalling(id) {
  return await db.userCallings.delete(id);
}

// Responsibilities
export async function getResponsibilities(callingId) {
  return await db.responsibilities.where('callingId').equals(callingId).toArray();
}

export async function addResponsibility(resp) {
  return await db.responsibilities.add(resp);
}

export async function updateResponsibility(id, changes) {
  return await db.responsibilities.update(id, changes);
}

export async function deleteResponsibility(id) {
  return await db.responsibilities.delete(id);
}

// People
export async function getPeople() {
  return await db.people.orderBy('name').toArray();
}

export async function addPerson(person) {
  return await db.people.add(person);
}

export async function updatePerson(id, changes) {
  return await db.people.update(id, changes);
}

// Meetings (excludes archived by default)
export async function getMeetings(callingId) {
  const all = callingId
    ? await db.meetings.where('callingId').equals(callingId).toArray()
    : await db.meetings.toArray();
  return all.filter(m => !m.archived);
}

// Archived meetings only (from removed callings)
export async function getArchivedMeetings() {
  const all = await db.meetings.toArray();
  return all.filter(m => m.archived);
}

export async function addMeeting(meeting) {
  return await db.meetings.add(meeting);
}

export async function updateMeeting(id, changes) {
  return await db.meetings.update(id, changes);
}

export async function deleteMeeting(id) {
  return await db.meetings.delete(id);
}

// Meeting Instances
export async function getMeetingInstances(meetingId, limit = 10) {
  return await db.meetingInstances
    .where('meetingId').equals(meetingId)
    .reverse()
    .sortBy('date');
}

export async function addMeetingInstance(instance) {
  return await db.meetingInstances.add({
    ...instance,
    status: instance.status || 'scheduled',
  });
}

export async function updateMeetingInstance(id, changes) {
  return await db.meetingInstances.update(id, changes);
}

// Action Items
export async function getActionItems(filters = {}) {
  let collection = db.actionItems.toCollection();

  const items = await collection.toArray();

  return items.filter(item => {
    if (filters.status && item.status !== filters.status) return false;
    if (filters.priority && item.priority !== filters.priority) return false;
    if (filters.pillar && item.pillar !== filters.pillar) return false;
    if (filters.context && item.context !== filters.context) return false;
    if (filters.excludeComplete && item.status === 'complete') return false;
    if (filters.overdue) {
      const now = new Date().toISOString().split('T')[0];
      if (!item.dueDate || item.dueDate >= now || item.status === 'complete') return false;
    }
    if (filters.dueBy) {
      if (!item.dueDate || item.dueDate > filters.dueBy) return false;
    }
    return true;
  }).sort((a, b) => {
    // Sort: overdue first, then by priority, then by due date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const now = new Date().toISOString().split('T')[0];
    const aOverdue = a.dueDate && a.dueDate < now && a.status !== 'complete';
    const bOverdue = b.dueDate && b.dueDate < now && b.status !== 'complete';
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    if ((priorityOrder[a.priority] || 2) !== (priorityOrder[b.priority] || 2)) {
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    }
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}

export async function addActionItem(item) {
  return await db.actionItems.add({
    ...item,
    status: item.status || 'not_started',
    priority: item.priority || 'medium',
    createdAt: new Date().toISOString(),
    targetMeetingIds: item.targetMeetingIds || [],
  });
}

export async function updateActionItem(id, changes) {
  if (changes.status === 'complete' && !changes.completedAt) {
    changes.completedAt = new Date().toISOString();
  }
  return await db.actionItems.update(id, changes);
}

export async function deleteActionItem(id) {
  return await db.actionItems.delete(id);
}

// Quick Capture Inbox
export async function getInboxItems() {
  return await db.inbox.where('processed').equals(0).sortBy('createdAt');
}

export async function addInboxItem(text) {
  return await db.inbox.add({
    text,
    createdAt: new Date().toISOString(),
    processed: 0,
  });
}

export async function markInboxProcessed(id) {
  return await db.inbox.update(id, { processed: 1 });
}

export async function deleteInboxItem(id) {
  return await db.inbox.delete(id);
}

// Calling Slots (org chart)
export async function getCallingSlots(organization) {
  if (organization) {
    return await db.callingSlots.where('organization').equals(organization).toArray();
  }
  return await db.callingSlots.toArray();
}

export async function addCallingSlot(slot) {
  return await db.callingSlots.add(slot);
}

export async function updateCallingSlot(id, changes) {
  return await db.callingSlots.update(id, changes);
}

// Journal
export async function getJournalEntries(limit = 20) {
  return await db.journal.orderBy('date').reverse().limit(limit).toArray();
}

export async function addJournalEntry(entry) {
  return await db.journal.add({
    ...entry,
    date: new Date().toISOString(),
  });
}

// Lessons
export async function getLessons(filters = {}) {
  let items = await db.lessons.toArray();
  if (filters.type) items = items.filter(l => l.type === filters.type);
  if (filters.search) {
    const s = filters.search.toLowerCase();
    items = items.filter(l =>
      l.title.toLowerCase().includes(s) ||
      (l.content && l.content.toLowerCase().includes(s)) ||
      (l.tags && l.tags.some(t => t.toLowerCase().includes(s)))
    );
  }
  return items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function addLesson(lesson) {
  return await db.lessons.add(lesson);
}

// ── Individual / People helpers ──────────────────────────────

export async function deletePerson(id) {
  return await db.people.delete(id);
}

export async function getActionItemsForPerson(personId) {
  return await db.actionItems.where('ownerId').equals(personId).toArray();
}

export async function addActionItemUpdate(itemId, update) {
  const item = await db.actionItems.get(itemId);
  const updates = item.updates || [];
  updates.push({
    text: update.text,
    date: new Date().toISOString(),
    meetingInstanceId: update.meetingInstanceId || null,
  });
  return await db.actionItems.update(itemId, { updates });
}

export async function getMeetingNotesForPerson(personId) {
  const instances = await db.meetingInstances.toArray();
  const results = [];
  for (const inst of instances) {
    const individualNotes = (inst.individuals || []).find(
      ind => ind.personId === personId
    );
    if (individualNotes) {
      const meeting = await db.meetings.get(inst.meetingId);
      results.push({
        ...inst,
        meetingName: meeting?.name || 'Unknown Meeting',
        individualNotes: individualNotes.notes,
      });
    }
  }
  return results.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

// Stats helpers
export async function getDashboardStats() {
  const allItems = await db.actionItems.toArray();
  const now = new Date().toISOString().split('T')[0];
  const active = allItems.filter(i => i.status !== 'complete');
  const overdue = active.filter(i => i.dueDate && i.dueDate < now);
  const dueToday = active.filter(i => i.dueDate === now);
  const inboxCount = await db.inbox.where('processed').equals(0).count();

  return {
    totalActive: active.length,
    overdue: overdue.length,
    dueToday: dueToday.length,
    inboxCount,
    highPriority: active.filter(i => i.priority === 'high').length,
  };
}

export default db;
