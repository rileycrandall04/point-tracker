import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Circle, CheckCircle2, ChevronDown, ChevronUp, User, MessageSquare, Clock } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db, { updateMeetingInstance, addActionItem, addActionItemUpdate, getActionItemsForPerson } from '../db';
import { usePeople } from '../hooks/useDb';
import { formatDate } from '../utils/dates';
import ActionItemForm from './ActionItemForm';
import Modal from './shared/Modal';

export default function MeetingNotes() {
  const { meetingId, instanceId } = useParams();
  const navigate = useNavigate();
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionFormDefaults, setActionFormDefaults] = useState(null);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [showAddIndividual, setShowAddIndividual] = useState(false);
  const { people } = usePeople();

  const instId = parseInt(instanceId);
  const mtgId = parseInt(meetingId);

  const meeting = useLiveQuery(() => db.meetings.get(mtgId), [mtgId]);
  const instance = useLiveQuery(() => db.meetingInstances.get(instId), [instId]);

  // Get previous instances for pre-meeting review
  const prevInstances = useLiveQuery(
    () => db.meetingInstances.where('meetingId').equals(mtgId).toArray(),
    [mtgId]
  ) || [];

  // Get action items for individuals in this meeting
  const individualIds = useMemo(() =>
    (instance?.individuals || []).map(ind => ind.personId),
    [instance?.individuals]
  );

  const individualActionItems = useLiveQuery(async () => {
    if (individualIds.length === 0) return {};
    const result = {};
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const cutoff = fourWeeksAgo.toISOString();

    for (const pid of individualIds) {
      const items = await getActionItemsForPerson(pid);
      result[pid] = items.filter(i => i.status !== 'complete');
    }
    return result;
  }, [individualIds.join(',')]) || {};

  if (!meeting || !instance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const agendaItems = instance.agendaItems || [];
  const individuals = instance.individuals || [];
  const isFinalized = instance.status === 'finalized';

  const updateAgendaItem = async (index, changes) => {
    const updated = [...agendaItems];
    updated[index] = { ...updated[index], ...changes };
    await updateMeetingInstance(instId, { agendaItems: updated });
  };

  const updateNotes = async (notes) => {
    await updateMeetingInstance(instId, { notes });
  };

  const finalizeNotes = async () => {
    await updateMeetingInstance(instId, { status: 'finalized' });
    navigate(`/meetings/${mtgId}`);
  };

  // Individual management
  const addIndividual = async (personId) => {
    const already = individuals.some(ind => ind.personId === personId);
    if (already) return;
    const updated = [...individuals, { personId, notes: '' }];
    await updateMeetingInstance(instId, { individuals: updated });
    setShowAddIndividual(false);
  };

  const updateIndividualNotes = async (personId, notes) => {
    const updated = individuals.map(ind =>
      ind.personId === personId ? { ...ind, notes } : ind
    );
    await updateMeetingInstance(instId, { individuals: updated });
  };

  const removeIndividual = async (personId) => {
    const updated = individuals.filter(ind => ind.personId !== personId);
    await updateMeetingInstance(instId, { individuals: updated });
  };

  const createActionForIndividual = (personId) => {
    const person = people.find(p => p.id === personId);
    const selectedText = window.getSelection()?.toString()?.trim() || '';
    setActionFormDefaults({
      title: selectedText || '',
      ownerId: personId,
      sourceMeetingInstanceId: instId,
      ownerName: person?.name,
    });
    setShowActionForm(true);
  };

  // Pre-meeting review: individuals from past instances
  const preMeetingIndividuals = useMemo(() => {
    const past = prevInstances.filter(inst => inst.id !== instId);
    const seen = new Map();
    for (const inst of past) {
      for (const ind of (inst.individuals || [])) {
        if (!seen.has(ind.personId)) {
          const person = people.find(p => p.id === ind.personId);
          if (person) seen.set(ind.personId, person);
        }
      }
    }
    return Array.from(seen.values());
  }, [prevInstances, people, instId]);

  // People not yet added to this meeting
  const availablePeople = people.filter(
    p => !individuals.some(ind => ind.personId === p.id)
  );

  // Get recent updates for a person's tasks (last 4 weeks)
  const getRecentUpdates = (personId) => {
    const items = individualActionItems[personId] || [];
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    const cutoff = fourWeeksAgo.toISOString();
    const updates = [];
    for (const item of items) {
      for (const u of (item.updates || [])) {
        if (u.date >= cutoff) {
          updates.push({ ...u, taskTitle: item.title, taskId: item.id });
        }
      }
    }
    return updates.sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3">
        <button
          onClick={() => navigate(`/meetings/${mtgId}`)}
          className="flex items-center gap-1 text-primary-700 text-sm mb-2"
        >
          <ArrowLeft size={16} /> {meeting.name}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Meeting Notes</h1>
            <p className="text-xs text-gray-500">{instance.date}</p>
          </div>
          {isFinalized && (
            <span className="badge bg-green-100 text-green-700">Finalized</span>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Pre-meeting Review */}
        {preMeetingIndividuals.length > 0 && !isFinalized && (
          <div className="card bg-blue-50 border-blue-200">
            <h2 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock size={14} />
              Pre-Meeting Review
            </h2>
            <div className="space-y-2">
              {preMeetingIndividuals.map(person => {
                const alreadyAdded = individuals.some(ind => ind.personId === person.id);
                const pendingItems = individualActionItems[person.id] || [];
                return (
                  <div key={person.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{person.name}</span>
                      {pendingItems.length > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          {pendingItems.length} pending item{pendingItems.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    {!alreadyAdded && (
                      <button
                        className="text-xs text-blue-700 font-medium"
                        onClick={() => addIndividual(person.id)}
                      >
                        + Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Agenda Items */}
        {agendaItems.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Agenda</h2>
            {agendaItems.map((item, i) => (
              <div key={i} className="card">
                <div className="flex items-start gap-2">
                  <button
                    className="mt-0.5 flex-shrink-0"
                    onClick={() => updateAgendaItem(i, { done: !item.done })}
                  >
                    {item.done ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                      {item.text}
                    </span>
                    <textarea
                      className="w-full mt-1 text-sm border-0 bg-gray-50 rounded p-2 focus:ring-1 focus:ring-primary-500 resize-none"
                      rows={2}
                      placeholder="Notes..."
                      value={item.notes || ''}
                      onChange={(e) => updateAgendaItem(i, { notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Individuals Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} />
              Individuals
            </h2>
            <button
              className="text-xs text-primary-700 font-medium flex items-center gap-1"
              onClick={() => setShowAddIndividual(true)}
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {individuals.length > 0 ? (
            <div className="space-y-2">
              {individuals.map(ind => {
                const person = people.find(p => p.id === ind.personId);
                const personTasks = individualActionItems[ind.personId] || [];
                const recentUpdates = getRecentUpdates(ind.personId);
                if (!person) return null;
                return (
                  <div key={ind.personId} className="card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{person.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xs text-primary-700 font-medium"
                          onClick={() => createActionForIndividual(ind.personId)}
                        >
                          + Task
                        </button>
                        <button
                          className="text-xs text-red-500"
                          onClick={() => removeIndividual(ind.personId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Pending tasks for this individual */}
                    {personTasks.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {personTasks.map(task => {
                          const taskUpdates = (task.updates || []).filter(u => {
                            const fourWeeksAgo = new Date();
                            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
                            return u.date >= fourWeeksAgo.toISOString();
                          });
                          return (
                            <div key={task.id} className="text-xs">
                              <div className="flex items-center gap-1.5">
                                <Circle size={10} className="text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{task.title}</span>
                                {task.dueDate && (
                                  <span className="text-gray-400 ml-auto">{formatDate(task.dueDate)}</span>
                                )}
                              </div>
                              {/* Recent updates auto-displayed */}
                              {taskUpdates.length > 0 && (
                                <div className="ml-4 mt-0.5 space-y-0.5">
                                  {taskUpdates.map((u, idx) => (
                                    <div key={idx} className="text-gray-500 italic">
                                      {formatDate(u.date)}: {u.text}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Notes about this individual */}
                    <textarea
                      className="w-full text-sm border-0 bg-gray-50 rounded p-2 focus:ring-1 focus:ring-primary-500 resize-none"
                      rows={2}
                      placeholder={`Notes about ${person.name}...`}
                      value={ind.notes || ''}
                      onChange={(e) => updateIndividualNotes(ind.personId, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">
              No individuals added — tap Add to discuss someone
            </p>
          )}
        </div>

        {/* General Notes */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">General Notes</h2>
          <textarea
            className="card w-full text-sm resize-none focus:ring-1 focus:ring-primary-500 border-0"
            rows={4}
            placeholder="Additional notes..."
            value={instance.notes || ''}
            onChange={(e) => updateNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Anchored Bottom Toolbar */}
      <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
        <button
          className="w-full flex items-center justify-center gap-1 py-1 text-xs text-gray-400"
          onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
        >
          {toolbarCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {toolbarCollapsed ? 'Show toolbar' : 'Hide toolbar'}
        </button>
        {!toolbarCollapsed && (
          <div className="px-4 pb-3 space-y-2">
            <button
              className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => {
                const selectedText = window.getSelection()?.toString()?.trim() || '';
                setActionFormDefaults(selectedText ? { title: selectedText } : null);
                setShowActionForm(true);
              }}
            >
              <Plus size={16} /> Create Action Item
            </button>
            {!isFinalized ? (
              <button
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                onClick={finalizeNotes}
              >
                <Check size={16} /> Finalize Meeting
              </button>
            ) : (
              <div className="text-center text-xs text-green-600 font-medium py-1">
                Meeting finalized — edits still save automatically
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Individual Modal */}
      <Modal open={showAddIndividual} onClose={() => setShowAddIndividual(false)} title="Add Individual">
        <div className="space-y-2">
          {availablePeople.length > 0 ? (
            availablePeople.map(person => (
              <button
                key={person.id}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-900 flex items-center gap-2"
                onClick={() => addIndividual(person.id)}
              >
                <User size={16} className="text-gray-400" />
                {person.name}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No more people available. Add people from More &gt; People first.
            </p>
          )}
        </div>
      </Modal>

      <ActionItemForm
        open={showActionForm}
        onClose={() => { setShowActionForm(false); setActionFormDefaults(null); }}
        editItem={actionFormDefaults}
        sourceMeetingInstanceId={instId}
      />
    </div>
  );
}
