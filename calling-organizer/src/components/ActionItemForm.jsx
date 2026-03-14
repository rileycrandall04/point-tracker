import { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { PRIORITIES, CONTEXTS, RECURRING_CADENCES } from '../utils/constants';
import { addActionItem, updateActionItem, deleteActionItem, addMeeting } from '../db';
import { useMeetings, usePeople, useUserCallings } from '../hooks/useDb';
import { getCallingConfig, MEETING_CADENCES } from '../data/callings';
import Modal from './shared/Modal';

export default function ActionItemForm({ open, onClose, editItem = null, sourceMeetingInstanceId = null }) {
  const { meetings } = useMeetings();
  const { people } = usePeople();
  const { callings } = useUserCallings();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    context: '',
    dueDate: '',
    starred: false,
    isRecurring: false,
    recurringCadence: '',
    targetMeetingIds: [],
    ownerId: null,
  });
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [newMeetingName, setNewMeetingName] = useState('');
  const [newMeetingCadence, setNewMeetingCadence] = useState('weekly');
  const [newMeetingCallingId, setNewMeetingCallingId] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editItem) {
      setForm({
        title: editItem.title || '',
        description: editItem.description || '',
        priority: editItem.priority || 'medium',
        context: editItem.context || '',
        dueDate: editItem.dueDate || '',
        starred: editItem.starred || false,
        isRecurring: editItem.isRecurring || false,
        recurringCadence: editItem.recurringCadence || '',
        targetMeetingIds: editItem.targetMeetingIds || [],
        ownerId: editItem.ownerId || null,
      });
    } else {
      // Default title to any currently selected text
      const selectedText = window.getSelection()?.toString()?.trim() || '';
      setForm({
        title: selectedText, description: '', priority: 'medium',
        context: '', dueDate: '', starred: false, isRecurring: false,
        recurringCadence: '', targetMeetingIds: [], ownerId: null,
      });
    }
  }, [editItem, open]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const isExistingItem = editItem && editItem.id;

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const data = { ...form };
    if (sourceMeetingInstanceId) {
      data.sourceMeetingInstanceId = sourceMeetingInstanceId;
    }
    if (data.ownerId === '') data.ownerId = null;
    if (isExistingItem) {
      await updateActionItem(editItem.id, data);
    } else {
      await addActionItem(data);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (isExistingItem) {
      await deleteActionItem(editItem.id);
      onClose();
    }
  };

  const handleAddMeeting = async () => {
    if (!newMeetingName.trim()) return;
    const callingId = parseInt(newMeetingCallingId) || callings[0]?.id;
    if (!callingId) return;
    const calling = callings.find(c => c.id === callingId);
    const id = await addMeeting({
      callingId,
      callingKey: calling?.callingKey || '',
      name: newMeetingName.trim(),
      cadence: newMeetingCadence,
      agendaTemplate: [],
      handbook: null,
    });
    // Auto-check the new meeting
    update('targetMeetingIds', [...form.targetMeetingIds, id]);
    setShowAddMeeting(false);
    setNewMeetingName('');
  };

  return (
    <Modal open={open} onClose={onClose} title={isExistingItem ? 'Edit Action Item' : 'New Action Item'}>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
          <input
            type="text"
            className="input-field"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            autoFocus
          />
        </div>

        {/* Individual (Person) */}
        {people.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Individual (optional)</label>
            <select
              className="input-field"
              value={form.ownerId || ''}
              onChange={(e) => update('ownerId', e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">None — general task</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
          <textarea
            className="input-field"
            rows={2}
            placeholder="Additional details..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        {/* Priority + Due Date + Context */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <select
              className="input-field"
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
            >
              {PRIORITIES.map(p => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={form.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Context</label>
            <select
              className="input-field"
              value={form.context}
              onChange={(e) => update('context', e.target.value)}
            >
              <option value="">Any</option>
              {CONTEXTS.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Starred */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
            checked={form.starred}
            onChange={(e) => update('starred', e.target.checked)}
          />
          <span className="text-sm text-gray-700">Star this item (shows on dashboard)</span>
        </label>

        {/* Recurring */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
            checked={form.isRecurring}
            onChange={(e) => update('isRecurring', e.target.checked)}
          />
          <span className="text-sm text-gray-700">Recurring item</span>
        </label>

        {form.isRecurring && (
          <select
            className="input-field"
            value={form.recurringCadence}
            onChange={(e) => update('recurringCadence', e.target.value)}
          >
            <option value="">Select cadence...</option>
            {RECURRING_CADENCES.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        )}

        {/* Report to meetings */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">Report to meetings</label>
            <button
              className="text-xs text-primary-700 font-medium flex items-center gap-1"
              onClick={() => {
                setNewMeetingCallingId(callings[0]?.id?.toString() || '');
                setNewMeetingCadence('weekly');
                setNewMeetingName('');
                setShowAddMeeting(true);
              }}
            >
              <Plus size={12} /> New Meeting
            </button>
          </div>
          {meetings.length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {meetings.map(mtg => (
                <label key={mtg.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                    checked={form.targetMeetingIds.includes(mtg.id)}
                    onChange={(e) => {
                      update('targetMeetingIds',
                        e.target.checked
                          ? [...form.targetMeetingIds, mtg.id]
                          : form.targetMeetingIds.filter(id => id !== mtg.id)
                      );
                    }}
                  />
                  <span className="text-sm text-gray-700">{mtg.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">No meetings set up yet</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {isExistingItem && (
            <button className="text-red-600 text-sm font-medium" onClick={handleDelete}>
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={!form.title.trim()}>
            {isExistingItem ? 'Save' : 'Create'}
          </button>
        </div>
      </div>

      {/* Add Meeting Inline Modal */}
      {showAddMeeting && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <h3 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Calendar size={14} /> Quick Add Meeting
          </h3>
          {callings.length > 1 && (
            <select
              className="input-field text-xs"
              value={newMeetingCallingId}
              onChange={(e) => setNewMeetingCallingId(e.target.value)}
            >
              {callings.map(c => {
                const config = getCallingConfig(c.callingKey);
                return <option key={c.id} value={c.id}>{config?.title || c.callingKey}</option>;
              })}
            </select>
          )}
          <input
            type="text"
            className="input-field text-xs"
            placeholder="Meeting name..."
            value={newMeetingName}
            onChange={(e) => setNewMeetingName(e.target.value)}
            autoFocus
          />
          <select
            className="input-field text-xs"
            value={newMeetingCadence}
            onChange={(e) => setNewMeetingCadence(e.target.value)}
          >
            {Object.entries(MEETING_CADENCES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button className="btn-ghost text-xs flex-1" onClick={() => setShowAddMeeting(false)}>Cancel</button>
            <button className="btn-primary text-xs flex-1" onClick={handleAddMeeting} disabled={!newMeetingName.trim()}>Add</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
