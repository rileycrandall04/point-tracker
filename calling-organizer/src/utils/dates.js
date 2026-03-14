import { format, isToday, isTomorrow, isYesterday, isPast, addDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';

// Format a date string for display
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

// Format with year for older dates
export function formatDateFull(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMMM d, yyyy');
}

// Format time
export function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'h:mm a');
}

// Format relative (e.g., "3 days ago", "in 2 days")
export function formatRelative(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  return format(date, 'MMM d');
}

// Get today as YYYY-MM-DD
export function todayStr() {
  return format(new Date(), 'yyyy-MM-dd');
}

// Get end of this week as YYYY-MM-DD
export function endOfWeekStr() {
  return format(endOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd');
}

// Check if a date string is overdue
export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return dateStr < todayStr();
}

// Check if a date is within this week
export function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const start = format(startOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd');
  const end = endOfWeekStr();
  return dateStr >= start && dateStr <= end;
}

// Format for meeting display
export function formatMeetingDate(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'EEE, MMM d');
}

// Get day of week short
export function getDayShort(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'EEE');
}
