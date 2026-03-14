const PRIORITY_CLASSES = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

const PRIORITY_LABELS = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export default function PriorityBadge({ priority }) {
  const cls = PRIORITY_CLASSES[priority] || PRIORITY_CLASSES.medium;
  const label = PRIORITY_LABELS[priority] || 'Medium';

  return (
    <span className={`badge ${cls}`}>
      {label}
    </span>
  );
}
