import { Star, Circle, CheckCircle2, Clock, Pause, User } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import { formatDate, isOverdue } from '../../utils/dates';
import { updateActionItem } from '../../db';

const STATUS_ICONS = {
  not_started: Circle,
  in_progress: Clock,
  waiting: Pause,
  complete: CheckCircle2,
};

export default function ActionItemRow({ item, onEdit, compact = false, showUpdates = false, people = [] }) {
  const StatusIcon = STATUS_ICONS[item.status] || Circle;
  const overdue = item.status !== 'complete' && isOverdue(item.dueDate);

  const cycleStatus = async (e) => {
    e.stopPropagation();
    const flow = ['not_started', 'in_progress', 'waiting', 'complete'];
    const idx = flow.indexOf(item.status);
    const next = flow[(idx + 1) % flow.length];
    await updateActionItem(item.id, { status: next });
  };

  const toggleStar = async (e) => {
    e.stopPropagation();
    await updateActionItem(item.id, { starred: !item.starred });
  };

  // Get recent updates (last 4 weeks)
  const recentUpdates = (showUpdates && item.updates) ? (() => {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const cutoff = fourWeeksAgo.toISOString();
    return item.updates.filter(u => u.date >= cutoff)
      .sort((a, b) => b.date.localeCompare(a.date));
  })() : [];

  const ownerName = item.ownerId && people.length > 0
    ? people.find(p => p.id === item.ownerId)?.name
    : null;

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
        item.status === 'complete' ? 'opacity-60' : ''
      }`}
      onClick={() => onEdit?.(item)}
    >
      <button onClick={cycleStatus} className="mt-0.5 flex-shrink-0">
        <StatusIcon
          size={20}
          className={
            item.status === 'complete' ? 'text-green-500' :
            item.status === 'in_progress' ? 'text-blue-500' :
            item.status === 'waiting' ? 'text-amber-500' :
            'text-gray-400'
          }
        />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            item.status === 'complete' ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {item.title}
          </span>
          {item.starred && (
            <button onClick={toggleStar}>
              <Star size={14} className="text-amber-400 fill-amber-400" />
            </button>
          )}
        </div>

        {!compact && (
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {ownerName && (
              <span className="badge bg-primary-50 text-primary-700 flex items-center gap-0.5">
                <User size={10} /> {ownerName}
              </span>
            )}
            {item.priority && item.priority !== 'medium' && (
              <PriorityBadge priority={item.priority} />
            )}
            {item.dueDate && (
              <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                {overdue ? 'Overdue: ' : ''}{formatDate(item.dueDate)}
              </span>
            )}
          </div>
        )}

        {/* Recent updates displayed inline */}
        {recentUpdates.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {recentUpdates.slice(0, 3).map((u, idx) => (
              <div key={idx} className="text-xs text-gray-500 italic">
                {formatDate(u.date)}: {u.text}
              </div>
            ))}
            {recentUpdates.length > 3 && (
              <span className="text-xs text-gray-400">+{recentUpdates.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      {!compact && !item.starred && (
        <button onClick={toggleStar} className="mt-0.5 flex-shrink-0">
          <Star size={14} className="text-gray-300 hover:text-amber-400" />
        </button>
      )}
    </div>
  );
}
