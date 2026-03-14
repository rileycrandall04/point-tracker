import { useLiveQuery } from 'dexie-react-hooks';
import { useState, useCallback } from 'react';
import db, {
  getProfile, saveProfile,
  getUserCallings, addUserCalling, removeUserCalling,
  getResponsibilities, addResponsibility, updateResponsibility, deleteResponsibility,
  getMeetings, getArchivedMeetings, addMeeting, updateMeeting, deleteMeeting,
  getMeetingInstances, addMeetingInstance, updateMeetingInstance,
  getActionItems, addActionItem, updateActionItem, deleteActionItem,
  getInboxItems, addInboxItem, markInboxProcessed, deleteInboxItem,
  getJournalEntries, addJournalEntry,
  getPeople, addPerson, updatePerson, deletePerson,
  getActionItemsForPerson, getMeetingNotesForPerson, addActionItemUpdate,
  getDashboardStats,
} from '../db';

// Live-updating profile
export function useProfile() {
  const profile = useLiveQuery(() => getProfile());
  return { profile, saveProfile };
}

// Live-updating user callings
export function useUserCallings() {
  const callings = useLiveQuery(() => getUserCallings()) || [];
  return { callings, addUserCalling, removeUserCalling };
}

// Live-updating responsibilities for a calling
export function useResponsibilities(callingId) {
  const responsibilities = useLiveQuery(
    () => callingId ? getResponsibilities(callingId) : db.responsibilities.toArray(),
    [callingId]
  ) || [];
  return { responsibilities, addResponsibility, updateResponsibility, deleteResponsibility };
}

// Live-updating all responsibilities
export function useAllResponsibilities() {
  const responsibilities = useLiveQuery(() => db.responsibilities.toArray()) || [];
  return { responsibilities, addResponsibility, updateResponsibility, deleteResponsibility };
}

// Live-updating active meetings (excludes archived)
export function useMeetings(callingId) {
  const meetings = useLiveQuery(
    () => getMeetings(callingId),
    [callingId]
  ) || [];
  return { meetings, addMeeting, updateMeeting, deleteMeeting };
}

// Live-updating archived meetings (from removed callings)
export function useArchivedMeetings() {
  const meetings = useLiveQuery(() => getArchivedMeetings()) || [];
  return { meetings };
}

// Live-updating meeting instances
export function useMeetingInstances(meetingId) {
  const instances = useLiveQuery(
    () => meetingId ? getMeetingInstances(meetingId) : Promise.resolve([]),
    [meetingId]
  ) || [];
  return { instances, addMeetingInstance, updateMeetingInstance };
}

// Live-updating action items with filters
export function useActionItems(filters = {}) {
  const items = useLiveQuery(
    () => getActionItems(filters),
    [JSON.stringify(filters)]
  ) || [];
  return { items, addActionItem, updateActionItem, deleteActionItem };
}

// Live-updating inbox
export function useInbox() {
  const items = useLiveQuery(() => getInboxItems()) || [];
  return { items, addInboxItem, markInboxProcessed, deleteInboxItem };
}

// Live-updating journal
export function useJournal(limit = 20) {
  const entries = useLiveQuery(() => getJournalEntries(limit), [limit]) || [];
  return { entries, addJournalEntry };
}

// Live-updating people
export function usePeople() {
  const people = useLiveQuery(() => getPeople()) || [];
  return { people, addPerson, updatePerson, deletePerson };
}

// Action items for a specific person
export function usePersonActionItems(personId) {
  const items = useLiveQuery(
    () => personId ? getActionItemsForPerson(personId) : Promise.resolve([]),
    [personId]
  ) || [];
  return { items, addActionItem, updateActionItem, addActionItemUpdate };
}

// Meeting notes mentioning a specific person
export function usePersonMeetingNotes(personId) {
  const notes = useLiveQuery(
    () => personId ? getMeetingNotesForPerson(personId) : Promise.resolve([]),
    [personId]
  ) || [];
  return { notes };
}

// Live-updating dashboard stats
export function useDashboardStats() {
  const stats = useLiveQuery(() => getDashboardStats()) || {
    totalActive: 0, overdue: 0, dueToday: 0, inboxCount: 0, highPriority: 0,
  };
  return stats;
}

// Check if onboarding is complete
export function useOnboardingStatus() {
  // Map "not found" (undefined) to null so we can distinguish from
  // useLiveQuery's "still loading" (also undefined)
  const profile = useLiveQuery(() => getProfile().then(p => p ?? null));
  const callings = useLiveQuery(() => getUserCallings());

  // useLiveQuery returns undefined while the query is still pending
  if (profile === undefined || callings === undefined) return { loading: true, complete: false };

  return {
    loading: false,
    complete: !!(profile?.name && callings?.length > 0),
  };
}
