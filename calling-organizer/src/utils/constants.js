// Shared constants

export const PRIORITIES = [
  { key: 'high', label: 'High', className: 'badge-high' },
  { key: 'medium', label: 'Medium', className: 'badge-medium' },
  { key: 'low', label: 'Low', className: 'badge-low' },
];

export const STATUSES = [
  { key: 'not_started', label: 'Not Started' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'complete', label: 'Complete' },
];

export const CONTEXTS = [
  { key: 'at_church', label: 'At Church', icon: 'Church' },
  { key: 'home', label: 'Home', icon: 'Home' },
  { key: 'phone', label: 'Phone Call', icon: 'Phone' },
  { key: 'computer', label: 'Computer', icon: 'Monitor' },
  { key: 'visit', label: 'Visit', icon: 'Users' },
];

export const ACTION_VIEWS = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'by_context', label: 'By Context' },
  { key: 'all', label: 'All Active' },
  { key: 'completed', label: 'Completed' },
];

export const RECURRING_CADENCES = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'biweekly', label: 'Every 2 Weeks' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'quarterly', label: 'Quarterly' },
];
