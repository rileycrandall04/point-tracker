import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Search, Trash2, X } from 'lucide-react';
import { useUserCallings } from '../hooks/useDb';
import {
  getCallingList, getCallingConfig, getOrgLabel, ORGANIZATIONS,
} from '../data/callings';
import {
  addUserCalling, removeUserCalling, addResponsibility, addMeeting,
} from '../db';
import localDb from '../db';
import Modal from './shared/Modal';

export default function ManageCallings() {
  const { callings } = useUserCallings();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(null); // calling to remove
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);

  const activeKeys = callings.map(c => c.callingKey);
  const callingList = getCallingList();

  // Available callings (not already added)
  const available = callingList.filter(c => !activeKeys.includes(c.key));

  const grouped = ORGANIZATIONS.map(org => ({
    ...org,
    callings: available.filter(c => c.organization === org.key),
  })).filter(g => g.callings.length > 0);

  const filtered = search
    ? available.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        getOrgLabel(c.organization).toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const handleAddCalling = async (callingKey) => {
    setAdding(true);
    try {
      const config = getCallingConfig(callingKey);
      if (!config) return;

      const callingId = await addUserCalling({ callingKey });

      for (const resp of config.responsibilities) {
        await addResponsibility({
          callingId,
          callingKey,
          title: resp.title,
          pillar: resp.pillar,
          isCustom: false,
          isRecurring: false,
          recurringCadence: null,
        });
      }

      for (const mtg of config.meetings) {
        await addMeeting({
          callingId,
          callingKey,
          name: mtg.name,
          cadence: mtg.cadence,
          agendaTemplate: mtg.agendaTemplate || [],
          handbook: mtg.handbook || null,
        });
      }

      setShowAdd(false);
      setSearch('');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveCalling = async (calling) => {
    // Remove responsibilities
    await localDb.responsibilities.where('callingId').equals(calling.id).delete();
    // Mark meetings as archived (keep them + their instances for history)
    const meetingsToArchive = await localDb.meetings.where('callingId').equals(calling.id).toArray();
    for (const mtg of meetingsToArchive) {
      await localDb.meetings.update(mtg.id, { archived: true, archivedCallingTitle: getCallingConfig(calling.callingKey)?.title || calling.callingKey });
    }
    // Remove the calling
    await removeUserCalling(calling.id);
    setShowRemove(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/more')} className="flex items-center gap-1 text-primary-700 text-sm">
            <ArrowLeft size={16} /> More
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-1 py-1.5 px-3">
            <Plus size={16} /> Add
          </button>
        </div>
        <h1 className="text-lg font-bold text-gray-900 mt-2">Manage Callings</h1>
      </div>

      <div className="px-4 py-4 space-y-3">
        {callings.length > 0 ? (
          callings.map(c => {
            const config = getCallingConfig(c.callingKey);
            return (
              <div key={c.id} className="card flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {config?.title || c.callingKey}
                  </div>
                  <div className="text-xs text-gray-500">
                    {config ? `${config.responsibilities.length} responsibilities, ${config.meetings.length} meetings` : ''}
                  </div>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => setShowRemove(c)}
                >
                  <X size={18} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No callings selected</p>
            <button
              className="btn-primary mt-3 text-sm"
              onClick={() => setShowAdd(true)}
            >
              Add a Calling
            </button>
          </div>
        )}
      </div>

      {/* Add Calling Modal */}
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setSearch(''); }} title="Add Calling" wide>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search callings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto -mx-2 px-2">
            {filtered ? (
              <div className="space-y-1">
                {filtered.map(c => (
                  <CallingOption
                    key={c.key}
                    calling={c}
                    onAdd={() => handleAddCalling(c.key)}
                    disabled={adding}
                  />
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No callings match your search</p>
                )}
              </div>
            ) : (
              available.length > 0 ? (
                grouped.map(group => (
                  <div key={group.key}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {group.label}
                    </h3>
                    <div className="space-y-1">
                      {group.callings.map(c => (
                        <CallingOption
                          key={c.key}
                          calling={c}
                          onAdd={() => handleAddCalling(c.key)}
                          disabled={adding}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">All available callings have been added</p>
              )
            )}
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation */}
      <Modal
        open={!!showRemove}
        onClose={() => setShowRemove(null)}
        title="Remove Calling?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will remove <strong>{getCallingConfig(showRemove?.callingKey)?.title || showRemove?.callingKey}</strong> and
            its associated responsibilities and meetings from your app. Action items and meeting notes will not be deleted.
          </p>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowRemove(null)}>Cancel</button>
            <button
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              onClick={() => handleRemoveCalling(showRemove)}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function CallingOption({ calling, onAdd, disabled }) {
  const config = getCallingConfig(calling.key);
  return (
    <button
      className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 border border-transparent transition-colors disabled:opacity-50"
      onClick={onAdd}
      disabled={disabled}
    >
      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
        <Plus size={16} className="text-primary-600" />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900">{calling.title}</span>
        {config && (
          <span className="text-xs text-gray-400 ml-2">
            {config.responsibilities.length} resp, {config.meetings.length} mtgs
          </span>
        )}
      </div>
    </button>
  );
}
