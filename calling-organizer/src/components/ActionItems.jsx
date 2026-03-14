import { useState, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useActionItems, usePeople } from '../hooks/useDb';
import ActionItemRow from './shared/ActionItemRow';
import ActionItemForm from './ActionItemForm';
import { ACTION_VIEWS } from '../utils/constants';
import { todayStr, endOfWeekStr } from '../utils/dates';

export default function ActionItems() {
  const [view, setView] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch all non-complete for most views
  const filters = useMemo(() => {
    if (view === 'completed') return { status: 'complete' };
    if (view === 'overdue') return { overdue: true };
    if (view === 'today') return { dueBy: todayStr(), excludeComplete: true };
    if (view === 'week') return { dueBy: endOfWeekStr(), excludeComplete: true };
    return { excludeComplete: true };
  }, [view]);

  const { items } = useActionItems(filters);
  const { people } = usePeople();

  // Group by pillar or context if needed
  const grouped = useMemo(() => {
    if (view === 'by_context') {
      const groups = {};
      items.forEach(item => {
        const c = item.context || 'none';
        if (!groups[c]) groups[c] = [];
        groups[c].push(item);
      });
      return Object.entries(groups).map(([key, items]) => ({
        key,
        label: key === 'none' ? 'No Context' : key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        items,
      }));
    }
    return null;
  }, [view, items]);

  const handleEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditItem(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Action Items</h1>
          <button onClick={handleNew} className="btn-primary text-sm flex items-center gap-1 py-1.5 px-3">
            <Plus size={16} /> New
          </button>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 mt-3 overflow-x-auto -mx-4 px-4 pb-1">
          {ACTION_VIEWS.map(v => (
            <button
              key={v.key}
              className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                view === v.key
                  ? 'bg-primary-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setView(v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Item list */}
      <div className="px-4 py-3">
        {grouped ? (
          <div className="space-y-4">
            {grouped.map(group => (
              <div key={group.key}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {group.label} ({group.items.length})
                </h3>
                <div className="card -mx-1">
                  {group.items.map(item => (
                    <ActionItemRow key={item.id} item={item} onEdit={handleEdit} showUpdates people={people} />
                  ))}
                </div>
              </div>
            ))}
            {grouped.length === 0 && <EmptyState view={view} />}
          </div>
        ) : (
          <div>
            {items.length > 0 ? (
              <div className="card -mx-1">
                {items.map(item => (
                  <ActionItemRow key={item.id} item={item} onEdit={handleEdit} />
                ))}
              </div>
            ) : (
              <EmptyState view={view} />
            )}
          </div>
        )}
      </div>

      <ActionItemForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditItem(null); }}
        editItem={editItem}
      />
    </div>
  );
}

function EmptyState({ view }) {
  const messages = {
    today: 'Nothing due today',
    week: 'Nothing due this week',
    overdue: 'No overdue items — nice work!',
    completed: 'No completed items yet',
    all: 'No active items',
    by_context: 'No active items',
  };
  return (
    <div className="text-center py-12">
      <p className="text-sm text-gray-500">{messages[view] || 'No items'}</p>
    </div>
  );
}
