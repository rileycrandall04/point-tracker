import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckSquare, MessageSquare, Plus, Pencil } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { updatePerson, addActionItemUpdate } from '../db';
import { usePersonActionItems, usePersonMeetingNotes } from '../hooks/useDb';
import { formatDate, formatDateFull } from '../utils/dates';
import ActionItemRow from './shared/ActionItemRow';
import ActionItemForm from './ActionItemForm';
import Modal from './shared/Modal';

export default function IndividualDetail() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const pid = parseInt(personId);
  const [showActionForm, setShowActionForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [showAddUpdate, setShowAddUpdate] = useState(null); // taskId
  const [updateText, setUpdateText] = useState('');

  const person = useLiveQuery(() => db.people.get(pid), [pid]);
  const { items: actionItems, addActionItemUpdate: addUpdate } = usePersonActionItems(pid);
  const { notes: meetingNotes } = usePersonMeetingNotes(pid);

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const activeItems = actionItems.filter(i => i.status !== 'complete');
  const completedItems = actionItems.filter(i => i.status === 'complete');

  const openEdit = () => {
    setEditName(person.name);
    setEditPhone(person.phone || '');
    setEditEmail(person.email || '');
    setShowEdit(true);
  };

  const saveEdit = async () => {
    await updatePerson(pid, {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
    });
    setShowEdit(false);
  };

  const handleAddUpdate = async (taskId) => {
    if (!updateText.trim()) return;
    await addActionItemUpdate(taskId, { text: updateText.trim() });
    setUpdateText('');
    setShowAddUpdate(null);
  };

  const handleEditAction = (item) => {
    setEditItem(item);
    setShowActionForm(true);
  };

  // Get recent updates for a task (last 4 weeks)
  const getRecentUpdates = (task) => {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const cutoff = fourWeeksAgo.toISOString();
    return (task.updates || []).filter(u => u.date >= cutoff)
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-700 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={openEdit} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <Pencil size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={24} className="text-primary-700" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{person.name}</h1>
            {person.phone && <p className="text-xs text-gray-500">{person.phone}</p>}
            {person.email && <p className="text-xs text-gray-500">{person.email}</p>}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Active Tasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare size={14} />
              Tasks ({activeItems.length})
            </h2>
            <button
              className="text-xs text-primary-700 font-medium flex items-center gap-1"
              onClick={() => {
                setEditItem({ ownerId: pid, title: '' });
                setShowActionForm(true);
              }}
            >
              <Plus size={14} /> New
            </button>
          </div>

          {activeItems.length > 0 ? (
            <div className="space-y-2">
              {activeItems.map(item => {
                const recentUpdates = getRecentUpdates(item);
                return (
                  <div key={item.id} className="card py-3">
                    <ActionItemRow item={item} onEdit={handleEditAction} compact />
                    {/* Recent updates displayed inline */}
                    {recentUpdates.length > 0 && (
                      <div className="ml-8 mt-1 space-y-0.5">
                        {recentUpdates.map((u, idx) => (
                          <div key={idx} className="text-xs text-gray-500 italic">
                            {formatDate(u.date)}: {u.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Add update button */}
                    {showAddUpdate === item.id ? (
                      <div className="ml-8 mt-2 flex gap-2">
                        <input
                          type="text"
                          className="input-field text-xs flex-1"
                          placeholder="Add update..."
                          value={updateText}
                          onChange={(e) => setUpdateText(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAddUpdate(item.id)}
                        />
                        <button className="btn-primary text-xs py-1 px-2" onClick={() => handleAddUpdate(item.id)}>Add</button>
                        <button className="btn-ghost text-xs py-1 px-2" onClick={() => setShowAddUpdate(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button
                        className="ml-8 mt-1 text-xs text-primary-600 hover:text-primary-800"
                        onClick={() => { setShowAddUpdate(item.id); setUpdateText(''); }}
                      >
                        + Add update
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">No active tasks</p>
          )}
        </div>

        {/* Meeting Notes about this person */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MessageSquare size={14} />
            Meeting Notes ({meetingNotes.length})
          </h2>

          {meetingNotes.length > 0 ? (
            <div className="space-y-2">
              {meetingNotes.map(note => (
                <div key={note.id} className="card">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary-700">{note.meetingName}</span>
                    <span className="text-xs text-gray-400">{formatDateFull(note.date)}</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {note.individualNotes || 'No notes recorded'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">
              No meeting notes yet — add this person to a meeting to start taking notes
            </p>
          )}
        </div>

        {/* Completed Tasks */}
        {completedItems.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Completed ({completedItems.length})
            </h2>
            <div className="card opacity-60">
              {completedItems.slice(0, 5).map(item => (
                <ActionItemRow key={item.id} item={item} onEdit={handleEditAction} compact />
              ))}
              {completedItems.length > 5 && (
                <p className="text-xs text-gray-400 text-center py-1">
                  +{completedItems.length - 5} more
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Person Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Person">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input type="text" className="input-field" value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            <input type="tel" className="input-field" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input type="email" className="input-field" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowEdit(false)}>Cancel</button>
            <button className="btn-primary flex-1" onClick={saveEdit} disabled={!editName.trim()}>Save</button>
          </div>
        </div>
      </Modal>

      <ActionItemForm
        open={showActionForm}
        onClose={() => { setShowActionForm(false); setEditItem(null); }}
        editItem={editItem}
      />
    </div>
  );
}
