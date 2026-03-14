import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, Clock, CheckSquare, Inbox, Calendar, Star, ChevronRight, User } from 'lucide-react';
import { useProfile, useDashboardStats, useActionItems, useMeetings, useInbox, usePeople } from '../hooks/useDb';
import { addInboxItem } from '../db';
import ActionItemRow from './shared/ActionItemRow';
import { formatDate, todayStr, endOfWeekStr } from '../utils/dates';

export default function Dashboard() {
  const { profile } = useProfile();
  const stats = useDashboardStats();
  const { items: focusItems } = useActionItems({ excludeComplete: true });
  const { items: inboxItems } = useInbox();
  const { meetings } = useMeetings();
  const { people } = usePeople();
  const [capture, setCapture] = useState('');
  const navigate = useNavigate();

  // Focus items: starred + high priority, limited to 5
  const starred = focusItems.filter(i => i.starred || i.priority === 'high').slice(0, 5);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!capture.trim()) return;
    await addInboxItem(capture.trim());
    setCapture('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-700 text-white px-4 pt-10 pb-6">
        <h1 className="text-xl font-bold">{greeting}, {profile?.name?.split(' ')[0] || ''}</h1>
        <p className="text-primary-200 text-sm mt-0.5">Organize yourselves; prepare every needful thing</p>
      </div>

      {/* Quick Capture */}
      <div className="px-4 -mt-4">
        <form onSubmit={handleCapture} className="card flex gap-2">
          <input
            type="text"
            className="flex-1 text-sm border-0 bg-transparent focus:ring-0 placeholder-gray-400 p-0"
            placeholder="Quick capture — what's on your mind?"
            value={capture}
            onChange={(e) => setCapture(e.target.value)}
          />
          <button
            type="submit"
            disabled={!capture.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center disabled:opacity-30"
          >
            <Plus size={18} />
          </button>
        </form>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <StatCard
            icon={AlertCircle}
            label="Overdue"
            value={stats.overdue}
            color="text-red-600"
            bgColor="bg-red-50"
            onClick={() => navigate('/actions')}
          />
          <StatCard
            icon={Clock}
            label="Today"
            value={stats.dueToday}
            color="text-amber-600"
            bgColor="bg-amber-50"
            onClick={() => navigate('/actions')}
          />
          <StatCard
            icon={CheckSquare}
            label="Active"
            value={stats.totalActive}
            color="text-blue-600"
            bgColor="bg-blue-50"
            onClick={() => navigate('/actions')}
          />
          <StatCard
            icon={Inbox}
            label="Inbox"
            value={stats.inboxCount}
            color="text-purple-600"
            bgColor="bg-purple-50"
            onClick={() => navigate('/inbox')}
          />
        </div>

        {/* Focus Items */}
        {starred.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Star size={16} className="text-amber-400" />
                Focus Items
              </h2>
              <button
                className="text-xs text-primary-700 font-medium"
                onClick={() => navigate('/actions')}
              >
                View all
              </button>
            </div>
            <div className="-mx-1">
              {starred.map(item => (
                <ActionItemRow
                  key={item.id}
                  item={item}
                  compact
                  onEdit={() => navigate('/actions')}
                />
              ))}
            </div>
          </div>
        )}

        {/* Individuals — Compact List */}
        {people.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <User size={16} className="text-primary-600" />
                Individuals
              </h2>
            </div>
            <div className="space-y-0.5">
              {people.map(person => (
                <button
                  key={person.id}
                  className="w-full flex items-center gap-2 py-1.5 px-1 rounded hover:bg-gray-50 text-left"
                  onClick={() => navigate(`/people/${person.id}`)}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User size={12} className="text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-900 truncate">{person.name}</span>
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        {meetings.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Calendar size={16} className="text-primary-600" />
                Meetings
              </h2>
              <button
                className="text-xs text-primary-700 font-medium"
                onClick={() => navigate('/meetings')}
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {meetings.slice(0, 4).map(mtg => (
                <button
                  key={mtg.id}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left"
                  onClick={() => navigate(`/meetings/${mtg.id}`)}
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">{mtg.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{mtg.cadence}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {starred.length === 0 && stats.totalActive === 0 && (
          <div className="card text-center py-8">
            <CheckSquare size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">You're all caught up!</p>
            <p className="text-xs text-gray-400 mt-1">Create action items or capture thoughts above</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor, onClick }) {
  return (
    <button
      className={`${bgColor} rounded-xl p-3 text-center transition-transform active:scale-95`}
      onClick={onClick}
    >
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </button>
  );
}
