import { useState } from 'react';
import { Plus, BookOpen, Search, ChevronDown, ChevronUp, Tag, Wrench } from 'lucide-react';
import { useJournal } from '../hooks/useDb';
import { addJournalEntry } from '../db';
import { formatDateFull } from '../utils/dates';

export default function Journal() {
  const { entries } = useJournal(50);
  const [showNew, setShowNew] = useState(false);
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');
  const [search, setSearch] = useState('');
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'tools'

  const handleSave = async () => {
    if (!text.trim()) return;
    await addJournalEntry({
      text: text.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setText('');
    setTags('');
    setShowNew(false);
    setActiveTab('content');
  };

  const filtered = search
    ? entries.filter(e =>
        e.text.toLowerCase().includes(search.toLowerCase()) ||
        (e.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : entries;

  return (
    <div className={`min-h-screen bg-gray-50 ${showNew ? 'pb-36' : ''}`}>
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Spiritual Impressions</h1>
            <p className="text-xs text-gray-500">Private — never shared</p>
          </div>
          <button onClick={() => setShowNew(!showNew)} className="btn-primary text-sm flex items-center gap-1 py-1.5 px-3">
            <Plus size={16} /> New
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* New entry form */}
        {showNew && (
          <div className="card space-y-3">
            {/* Tabs: Content / Tools */}
            <div className="flex gap-1 border-b border-gray-100 -mx-4 -mt-4 px-4">
              <button
                className={`text-xs font-medium px-3 py-2 border-b-2 transition-colors ${
                  activeTab === 'content'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('content')}
              >
                Content
              </button>
              <button
                className={`text-xs font-medium px-3 py-2 border-b-2 transition-colors flex items-center gap-1 ${
                  activeTab === 'tools'
                    ? 'border-primary-700 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('tools')}
              >
                <Wrench size={12} /> Tools
              </button>
            </div>

            {activeTab === 'content' && (
              <textarea
                className="w-full text-sm border-0 bg-gray-50 rounded-lg p-3 focus:ring-1 focus:ring-primary-500 resize-none"
                rows={6}
                placeholder="Record your impression..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
            )}

            {activeTab === 'tools' && (
              <div className="space-y-3">
                {/* Tag entry field */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1">
                    <Tag size={12} /> Tags
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Tags (comma-separated, optional)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Separate multiple tags with commas
                  </p>
                </div>
                {tags && (
                  <div className="flex flex-wrap gap-1">
                    {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="badge bg-sage-100 text-sage-700">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search */}
        {entries.length > 3 && (
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="input-field pl-9"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Entries */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(entry => (
              <div key={entry.id} className="card">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{entry.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">{formatDateFull(entry.date)}</span>
                  {(entry.tags || []).map(tag => (
                    <span key={tag} className="badge bg-sage-100 text-sage-700">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showNew && (
            <div className="text-center py-12">
              <BookOpen size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {search ? 'No entries match your search' : 'No entries yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Record spiritual impressions as they come
              </p>
            </div>
          )
        )}
      </div>

      {/* Anchored Bottom Toolbar — visible when writing a new entry */}
      {showNew && (
        <div className="fixed bottom-14 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
          <button
            className="w-full flex items-center justify-center gap-1 py-1 text-xs text-gray-400"
            onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
          >
            {toolbarCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {toolbarCollapsed ? 'Show toolbar' : 'Hide toolbar'}
          </button>
          {!toolbarCollapsed && (
            <div className="px-4 pb-3 pt-1">
              {/* Tag entry field anchored above toolbar buttons */}
              {activeTab === 'content' && (
                <div className="mb-2">
                  <input
                    type="text"
                    className="input-field text-xs"
                    placeholder="Tags (comma-separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <button className="btn-secondary flex-1 text-sm" onClick={() => { setShowNew(false); setActiveTab('content'); }}>Cancel</button>
                <button className="btn-primary flex-1 text-sm" onClick={handleSave} disabled={!text.trim()}>Save</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
