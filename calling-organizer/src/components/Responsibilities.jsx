import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useAllResponsibilities, useUserCallings } from '../hooks/useDb';
import { addResponsibility } from '../db';
import { getCallingConfig, PILLARS } from '../data/callings';
import PillarBadge from './shared/PillarBadge';
import Modal from './shared/Modal';

export default function Responsibilities() {
  const { responsibilities } = useAllResponsibilities();
  const { callings } = useUserCallings();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPillar, setNewPillar] = useState('admin');
  const [newCallingId, setNewCallingId] = useState('');

  // Group by calling, then by pillar
  const grouped = callings.map(c => {
    const config = getCallingConfig(c.callingKey);
    const resps = responsibilities.filter(r => r.callingId === c.id);
    const byPillar = {};
    resps.forEach(r => {
      const p = r.pillar || 'admin';
      if (!byPillar[p]) byPillar[p] = [];
      byPillar[p].push(r);
    });
    return {
      callingId: c.id,
      callingKey: c.callingKey,
      callingTitle: config?.title || c.callingKey,
      pillars: Object.entries(byPillar).map(([key, items]) => ({
        key,
        label: PILLARS[key]?.label || key,
        items,
      })),
    };
  });

  const handleAdd = async () => {
    if (!newTitle.trim() || !newCallingId) return;
    const calling = callings.find(c => c.id === parseInt(newCallingId));
    await addResponsibility({
      callingId: parseInt(newCallingId),
      callingKey: calling?.callingKey || '',
      title: newTitle.trim(),
      pillar: newPillar,
      isCustom: true,
      isRecurring: false,
      recurringCadence: null,
    });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Responsibilities</h1>
          <button onClick={() => { setNewCallingId(callings[0]?.id || ''); setShowAdd(true); }} className="btn-primary text-sm flex items-center gap-1 py-1.5 px-3">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {grouped.map(group => (
          <div key={group.callingId}>
            <h2 className="text-sm font-bold text-gray-900 mb-3">{group.callingTitle}</h2>
            {group.pillars.map(pillar => (
              <div key={pillar.key} className="mb-3">
                <div className="mb-1">
                  <PillarBadge pillar={pillar.key} />
                </div>
                <div className="card space-y-2">
                  {pillar.items.map(r => (
                    <div key={r.id} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        r.isCustom ? 'bg-primary-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700">{r.title}</span>
                      {r.isCustom && (
                        <span className="text-xs text-primary-600 font-medium ml-auto flex-shrink-0">Custom</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No responsibilities yet</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Responsibility">
        <div className="space-y-4">
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
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Update new move-in list weekly"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Pillar</label>
            <select
              className="input-field"
              value={newPillar}
              onChange={(e) => setNewPillar(e.target.value)}
            >
              {Object.values(PILLARS).map(p => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn-primary flex-1" onClick={handleAdd} disabled={!newTitle.trim()}>Add</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
