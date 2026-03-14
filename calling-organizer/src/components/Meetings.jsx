import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Plus, Archive } from 'lucide-react';
import { useMeetings, useArchivedMeetings, useUserCallings } from '../hooks/useDb';
import { getCallingConfig, MEETING_CADENCES } from '../data/callings';
import { addMeeting } from '../db';
import Modal from './shared/Modal';

export default function Meetings() {
  const { callings } = useUserCallings();
  const { meetings } = useMeetings(); // active only (archived filtered at DB layer)
  const { meetings: archivedMeetings } = useArchivedMeetings();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCadence, setNewCadence] = useState('weekly');
  const [newCallingId, setNewCallingId] = useState('');

  // Group active meetings by calling
  const grouped = callings.map(c => {
    const config = getCallingConfig(c.callingKey);
    return {
      callingId: c.id,
      callingKey: c.callingKey,
      callingTitle: config?.title || c.callingKey,
      meetings: meetings.filter(m => m.callingId === c.id),
    };
  }).filter(g => g.meetings.length > 0 || callings.length > 0);

  // Group archived meetings by former calling title
  const archivedGrouped = {};
  archivedMeetings.forEach(m => {
    const label = m.archivedCallingTitle || 'Previous Calling';
    if (!archivedGrouped[label]) archivedGrouped[label] = [];
    archivedGrouped[label].push(m);
  });

  const handleAdd = async () => {
    if (!newName.trim() || !newCallingId) return;
    const calling = callings.find(c => c.id === parseInt(newCallingId));
    const id = await addMeeting({
      callingId: parseInt(newCallingId),
      callingKey: calling?.callingKey || '',
      name: newName.trim(),
      cadence: newCadence,
      agendaTemplate: [],
      handbook: null,
    });
    setNewName('');
    setShowAdd(false);
    navigate(`/meetings/${id}`);
  };

  const openAdd = () => {
    setNewCallingId(callings[0]?.id?.toString() || '');
    setNewName('');
    setNewCadence('weekly');
    setShowAdd(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Meetings</h1>
            <p className="text-xs text-gray-500 mt-0.5">Your meeting types by calling</p>
          </div>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-1 py-1.5 px-3">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {grouped.map(group => (
          <div key={group.callingId}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group.callingTitle}
            </h2>
            <div className="space-y-2">
              {group.meetings.map(mtg => (
                <button
                  key={mtg.id}
                  className="card w-full text-left flex items-center gap-3"
                  onClick={() => navigate(`/meetings/${mtg.id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{mtg.name}</div>
                    <div className="text-xs text-gray-500">
                      {MEETING_CADENCES[mtg.cadence] || mtg.cadence}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                </button>
              ))}
              {group.meetings.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No meetings yet</p>
              )}
            </div>
          </div>
        ))}

        {callings.length === 0 && archivedMeetings.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No meetings set up yet</p>
          </div>
        )}

        {/* Archived meetings from removed callings */}
        {Object.entries(archivedGrouped).length > 0 && (
          <div className="pt-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Archive size={12} />
              Past Callings
            </h2>
            {Object.entries(archivedGrouped).map(([label, mtgs]) => (
              <div key={label} className="mb-3">
                <h3 className="text-xs text-gray-400 mb-1">{label}</h3>
                <div className="space-y-2">
                  {mtgs.map(mtg => (
                    <button
                      key={mtg.id}
                      className="card w-full text-left flex items-center gap-3 opacity-70"
                      onClick={() => navigate(`/meetings/${mtg.id}`)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Calendar size={20} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700">{mtg.name}</div>
                        <div className="text-xs text-gray-400">
                          {MEETING_CADENCES[mtg.cadence] || mtg.cadence}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Meeting Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Meeting Type">
        <div className="space-y-4">
          {callings.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Calling</label>
              <select
                className="input-field"
                value={newCallingId}
                onChange={(e) => setNewCallingId(e.target.value)}
              >
                {callings.map(c => {
                  const config = getCallingConfig(c.callingKey);
                  return <option key={c.id} value={c.id}>{config?.title || c.callingKey}</option>;
                })}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meeting Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Missionary Huddle"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cadence</label>
            <select
              className="input-field"
              value={newCadence}
              onChange={(e) => setNewCadence(e.target.value)}
            >
              {Object.entries(MEETING_CADENCES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary flex-1" onClick={handleAdd} disabled={!newName.trim()}>Add</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
