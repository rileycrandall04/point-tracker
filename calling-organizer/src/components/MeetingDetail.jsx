import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, FileText, Clock, Pencil, Trash2, User, ChevronRight } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { addMeetingInstance, updateMeeting, deleteMeeting, getActionItemsForPerson } from '../db';
import { useMeetingInstances, usePeople } from '../hooks/useDb';
import { MEETING_CADENCES } from '../data/callings';
import { formatDateFull } from '../utils/dates';
import Modal from './shared/Modal';

export default function MeetingDetail() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [showNewInstance, setShowNewInstance] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [editName, setEditName] = useState('');
  const [editCadence, setEditCadence] = useState('');

  const id = parseInt(meetingId);
  const meeting = useLiveQuery(() => db.meetings.get(id), [id]);
  const { instances } = useMeetingInstances(id);
  const { people } = usePeople();

  // Pre-meeting review: individuals from past instances
  const preMeetingReview = useMemo(() => {
    const seen = new Map();
    for (const inst of instances) {
      for (const ind of (inst.individuals || [])) {
        if (!seen.has(ind.personId)) {
          const person = people.find(p => p.id === ind.personId);
          if (person) {
            seen.set(ind.personId, {
              person,
              lastDiscussed: inst.date,
              lastNotes: ind.notes,
            });
          }
        }
      }
    }
    return Array.from(seen.values());
  }, [instances, people]);

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const handleCreateInstance = async () => {
    const instanceId = await addMeetingInstance({
      meetingId: id,
      date: newDate,
      notes: '',
      agendaItems: (meeting.agendaTemplate || []).map(item => ({
        text: item,
        notes: '',
        done: false,
      })),
      attendees: [],
      individuals: [],
      status: 'scheduled',
    });
    setShowNewInstance(false);
    navigate(`/meetings/${id}/notes/${instanceId}`);
  };

  const openEdit = () => {
    setEditName(meeting.name);
    setEditCadence(meeting.cadence);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    await updateMeeting(id, {
      name: editName.trim(),
      cadence: editCadence,
    });
    setShowEdit(false);
  };

  const handleDelete = async () => {
    await deleteMeeting(id);
    navigate('/meetings', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/meetings')} className="flex items-center gap-1 text-primary-700 text-sm">
            <ArrowLeft size={16} /> Meetings
          </button>
          <button onClick={openEdit} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Pencil size={18} />
          </button>
        </div>
        <h1 className="text-lg font-bold text-gray-900 mt-2">{meeting.name}</h1>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {MEETING_CADENCES[meeting.cadence] || meeting.cadence}
          </span>
          {meeting.handbook && (
            <span>Handbook {meeting.handbook}</span>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* New Instance */}
        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={() => setShowNewInstance(true)}
        >
          <Plus size={18} /> Start New Meeting
        </button>

        {/* Pre-Meeting Review */}
        {preMeetingReview.length > 0 && (
          <div className="card bg-blue-50 border-blue-200">
            <h2 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1.5">
              <User size={16} className="text-blue-600" />
              Individuals in This Meeting
            </h2>
            <div className="space-y-2">
              {preMeetingReview.map(({ person, lastDiscussed, lastNotes }) => (
                <button
                  key={person.id}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => navigate(`/people/${person.id}`)}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900">{person.name}</span>
                    {lastNotes && (
                      <p className="text-xs text-gray-500 truncate">{lastNotes}</p>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Agenda Template */}
        {meeting.agendaTemplate?.length > 0 && (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <FileText size={16} className="text-gray-500" />
              Agenda Template
            </h2>
            <ol className="space-y-1.5">
              {meeting.agendaTemplate.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-xs text-gray-400 mt-0.5 w-4 text-right flex-shrink-0">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Past Instances */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Past Meetings ({instances.length})
          </h2>
          {instances.length > 0 ? (
            <div className="space-y-2">
              {instances.map(inst => (
                <button
                  key={inst.id}
                  className="card w-full text-left flex items-center gap-3"
                  onClick={() => navigate(`/meetings/${id}/notes/${inst.id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateFull(inst.date)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{inst.status === 'finalized' ? 'Finalized' : 'In progress'}</span>
                      {(inst.individuals || []).length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <User size={10} /> {inst.individuals.length}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No past meetings recorded</p>
          )}
        </div>
      </div>

      {/* New Instance Modal */}
      <Modal open={showNewInstance} onClose={() => setShowNewInstance(false)} title="Start New Meeting">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meeting Date</label>
            <input
              type="date"
              className="input-field"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowNewInstance(false)}>Cancel</button>
            <button className="btn-primary flex-1" onClick={handleCreateInstance}>Start Meeting</button>
          </div>
        </div>
      </Modal>

      {/* Edit Meeting Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Meeting">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meeting Name</label>
            <input
              type="text"
              className="input-field"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cadence</label>
            <select
              className="input-field"
              value={editCadence}
              onChange={(e) => setEditCadence(e.target.value)}
            >
              {Object.entries(MEETING_CADENCES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="text-red-600 text-sm font-medium flex items-center gap-1"
              onClick={() => { setShowEdit(false); setShowDelete(true); }}
            >
              <Trash2 size={14} /> Delete
            </button>
            <div className="flex-1" />
            <button className="btn-secondary" onClick={() => setShowEdit(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSaveEdit} disabled={!editName.trim()}>Save</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Meeting?">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will delete the meeting type "{meeting.name}" and all its past meeting notes. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowDelete(false)}>Cancel</button>
            <button
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
