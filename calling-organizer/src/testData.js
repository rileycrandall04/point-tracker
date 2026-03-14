import db from './db';

// All test records get this flag so they can be removed without touching user data
const TEST_FLAG = { _isTestData: true };

// ── Check if test data currently exists ──────────────────────
export async function hasTestData() {
  const count = await db.actionItems.filter(i => i._isTestData).count();
  return count > 0;
}

// ── Remove all test data ─────────────────────────────────────
export async function removeTestData() {
  const tables = [
    'actionItems', 'inbox', 'journal', 'meetingInstances',
    'meetings', 'responsibilities', 'people', 'events', 'receipts',
  ];
  for (const table of tables) {
    const ids = await db[table].filter(r => r._isTestData).primaryKeys();
    if (ids.length > 0) await db[table].bulkDelete(ids);
  }
}

// ── Load test data ───────────────────────────────────────────
export async function loadTestData() {
  // First remove any existing test data to avoid duplicates
  await removeTestData();

  const callings = await db.userCallings.toArray();
  if (callings.length === 0) return;

  const callingId = callings[0].id;
  const callingKey = callings[0].callingKey;

  // Get existing active meetings to attach instances to
  const existingMeetings = await db.meetings
    .where('callingId').equals(callingId)
    .filter(m => !m.archived)
    .toArray();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const yesterday = offsetDate(now, -1);
  const twoDaysAgo = offsetDate(now, -2);
  const threeDaysAgo = offsetDate(now, -3);
  const lastWeek = offsetDate(now, -7);
  const twoWeeksAgo = offsetDate(now, -14);
  const tomorrow = offsetDate(now, 1);
  const inThreeDays = offsetDate(now, 3);
  const nextWeek = offsetDate(now, 7);

  // ── Action Items ─────────────────────────────────────────
  await db.actionItems.bulkAdd([
    {
      ...TEST_FLAG,
      title: 'Follow up with Brother Johnson about ministering assignment',
      description: 'He mentioned wanting to be reassigned closer to his neighborhood.',
      ownerId: null,
      status: 'not_started',
      priority: 'high',

      context: 'phone',
      dueDate: today,
      isRecurring: false,
      createdAt: lastWeek,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Prepare agenda for next presidency meeting',
      description: 'Include discussion on upcoming service project and new member fellowshipping.',
      ownerId: null,
      status: 'in_progress',
      priority: 'high',

      context: 'computer',
      dueDate: tomorrow,
      isRecurring: true,
      recurringCadence: 'weekly',
      createdAt: twoDaysAgo,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Visit the Martinez family',
      description: 'They recently moved in. Bring a welcome gift and introduce them to the ward.',
      ownerId: null,
      status: 'not_started',
      priority: 'medium',

      context: 'visit',
      dueDate: inThreeDays,
      isRecurring: false,
      createdAt: yesterday,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Coordinate temple trip for next month',
      description: 'Check with the temple scheduler and send sign-up to the ward.',
      ownerId: null,
      status: 'not_started',
      priority: 'medium',

      context: 'computer',
      dueDate: nextWeek,
      isRecurring: false,
      createdAt: threeDaysAgo,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Review Come Follow Me lesson for Sunday',
      description: '',
      ownerId: null,
      status: 'not_started',
      priority: 'medium',

      context: 'home',
      dueDate: nextWeek,
      isRecurring: true,
      recurringCadence: 'weekly',
      createdAt: twoDaysAgo,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Call Sister Ramirez about teaching assignment',
      description: 'She was asked to teach the 3rd Sunday lesson next month.',
      ownerId: null,
      status: 'waiting',
      priority: 'low',

      context: 'phone',
      dueDate: inThreeDays,
      isRecurring: false,
      createdAt: lastWeek,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Update missionary teaching records',
      description: 'Record progress for the Garcia and Chen families.',
      ownerId: null,
      status: 'in_progress',
      priority: 'medium',

      context: 'computer',
      dueDate: yesterday,
      isRecurring: false,
      createdAt: twoWeeksAgo,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Order supplies for ward activity',
      description: 'Need tablecloths, plates, and cups for the ward potluck.',
      ownerId: null,
      status: 'complete',
      priority: 'medium',

      context: 'computer',
      dueDate: lastWeek,
      isRecurring: false,
      createdAt: twoWeeksAgo,
      completedAt: threeDaysAgo,
      targetMeetingIds: [],
    },
    {
      ...TEST_FLAG,
      title: 'Send thank-you notes to speakers',
      description: 'Thank Brother Lee and Sister Park for their sacrament meeting talks.',
      ownerId: null,
      status: 'complete',
      priority: 'low',

      context: 'home',
      dueDate: twoDaysAgo,
      isRecurring: false,
      createdAt: lastWeek,
      completedAt: yesterday,
      targetMeetingIds: [],
    },
  ]);

  // ── Inbox (Quick Thoughts) ──────────────────────────────
  await db.inbox.bulkAdd([
    {
      ...TEST_FLAG,
      text: 'Brother Thompson mentioned he\'s struggling — reach out this week',
      createdAt: yesterday,
      processed: 0,
    },
    {
      ...TEST_FLAG,
      text: 'Idea: ward service project at the food bank next month',
      createdAt: twoDaysAgo,
      processed: 0,
    },
    {
      ...TEST_FLAG,
      text: 'Need to check on youth camp registration deadline',
      createdAt: threeDaysAgo,
      processed: 0,
    },
    {
      ...TEST_FLAG,
      text: 'Sister Kim volunteered to help with family history class',
      createdAt: lastWeek,
      processed: 0,
    },
  ]);

  // ── Journal Entries ─────────────────────────────────────
  await db.journal.bulkAdd([
    {
      ...TEST_FLAG,
      text: 'Felt prompted during prayer to reach out to the Wilson family. They may be going through a difficult time.',
      date: yesterday,
      tags: ['prompting', 'ministering'],
    },
    {
      ...TEST_FLAG,
      text: 'During ward council, had a strong impression that we should focus more on welcoming new move-ins. The Spirit confirmed this is a priority right now.',
      date: lastWeek,
      tags: ['ward council', 'new members'],
    },
    {
      ...TEST_FLAG,
      text: 'Grateful for the faith of the youth in our ward. Their testimonies during testimony meeting were powerful.',
      date: twoWeeksAgo,
      tags: ['gratitude', 'youth'],
    },
  ]);

  // ── Extra Responsibilities ──────────────────────────────
  await db.responsibilities.bulkAdd([
    {
      ...TEST_FLAG,
      callingId,
      callingKey,
      title: 'Coordinate quarterly ward service project',

      isCustom: true,
      isRecurring: true,
      recurringCadence: 'quarterly',
    },
    {
      ...TEST_FLAG,
      callingId,
      callingKey,
      title: 'Review and update ward directory info',

      isCustom: true,
      isRecurring: false,
      recurringCadence: null,
    },
  ]);

  // ── Extra Meetings ──────────────────────────────────────
  const testMeetingId = await db.meetings.add({
    ...TEST_FLAG,
    callingId,
    callingKey,
    name: 'Welfare Committee',
    cadence: 'monthly',
    agendaTemplate: ['Opening prayer', 'Member needs', 'Fast offering review', 'Self-reliance update', 'Closing prayer'],
    handbook: null,
  });

  // ── Meeting Instances (notes for existing meetings) ─────
  // Add instances to the first existing meeting if available, otherwise to the test meeting
  const targetMeetingId = existingMeetings[0]?.id || testMeetingId;

  await db.meetingInstances.bulkAdd([
    {
      ...TEST_FLAG,
      meetingId: targetMeetingId,
      date: lastWeek,
      status: 'completed',
      notes: {
        general: 'Good discussion on upcoming activities. Need to follow up on several items.',
        agenda: {
          0: 'Brother Davis offered prayer.',
          1: 'Discussed 3 Nephi 18 — importance of ministering to the one.',
          3: 'Reviewed ministering interviews — 60% completion for the quarter.',
        },
      },
      attendees: [],
    },
    {
      ...TEST_FLAG,
      meetingId: targetMeetingId,
      date: twoWeeksAgo,
      status: 'completed',
      notes: {
        general: 'Focused on planning the ward activity. Assignments given to several leaders.',
        agenda: {
          0: 'Sister Lopez offered prayer.',
          2: 'Reviewed open action items — 3 of 5 completed.',
        },
      },
      attendees: [],
    },
  ]);

  // Add an instance to the test meeting too
  await db.meetingInstances.add({
    ...TEST_FLAG,
    meetingId: testMeetingId,
    date: threeDaysAgo,
    status: 'completed',
    notes: {
      general: 'Reviewed current member needs. Two families need temporary food assistance.',
      agenda: {
        0: 'Brother Hall offered prayer.',
        1: 'Discussed the Thompson and Rivera family situations.',
        2: 'Fast offerings are sufficient for current needs.',
      },
    },
    attendees: [],
  });

  // ── People ──────────────────────────────────────────────
  await db.people.bulkAdd([
    { ...TEST_FLAG, name: 'David Thompson', phone: '555-0101', email: 'david.t@example.com' },
    { ...TEST_FLAG, name: 'Maria Garcia', phone: '555-0102', email: 'garcia.m@example.com' },
    { ...TEST_FLAG, name: 'James Wilson', phone: '555-0103', email: '' },
    { ...TEST_FLAG, name: 'Sarah Kim', phone: '555-0104', email: 'skim@example.com' },
    { ...TEST_FLAG, name: 'Robert Martinez', phone: '555-0105', email: 'r.martinez@example.com' },
  ]);
}

// ── Helpers ──────────────────────────────────────────────────
function offsetDate(base, days) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
