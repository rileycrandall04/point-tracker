import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Inbox, ArrowRight, Trash2, BookOpen, CheckSquare } from 'lucide-react';
import { useInbox } from '../hooks/useDb';
import { addInboxItem, markInboxProcessed, deleteInboxItem, addActionItem, addJournalEntry } from '../db';
import { formatRelative } from '../utils/dates';
import Modal from './shared/Modal';
import ActionItemForm from './ActionItemForm';

export default function InboxView() {
  const { items } = useInbox();
  const [capture, setCapture] = useState('');
  const [processing, setProcessing] = useState(null); // item being processed
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionTitle, setActionTitle] = useState('');

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!capture.trim()) return;
    await addInboxItem(capture.trim());
    setCapture('');
  };

  const convertToAction = (item) => {
    setActionTitle(item.text);
    setProcessing(item);
    setShowActionForm(true);
  };

  const convertToJournal = async (item) => {
    await addJournalEntry({ text: item.text, tags: [] });
    await markInboxProcessed(item.id);
    setProcessing(null);
  };

  const discard = async (item) => {
    await deleteInboxItem(item.id);
  };

  const handleActionFormClose = async () => {
    setShowActionForm(false);
    if (processing) {
      await markInboxProcessed(processing.id);
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4">
        <h1 className="text-lg font-bold text-gray-900">Inbox</h1>
        <p className="text-xs text-gray-500 mt-0.5">Capture thoughts, process later</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Capture input */}
        <form onSubmit={handleCapture} className="card flex gap-2">
          <input
            type="text"
            className="flex-1 text-sm border-0 bg-transparent focus:ring-0 placeholder-gray-400 p-0"
            placeholder="What's on your mind?"
            value={capture}
            onChange={(e) => setCapture(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            disabled={!capture.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-700 text-white flex items-center justify-center disabled:opacity-30"
          >
            <Plus size={18} />
          </button>
        </form>

        {/* Inbox items */}
        {items.length > 0 ? (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Unprocessed ({items.length})
            </h2>
            {items.map(item => (
              <div key={item.id} className="card">
                <p className="text-sm text-gray-900 mb-2">{item.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{formatRelative(item.createdAt)}</span>
                  <div className="flex gap-1">
                    <button
                      className="btn-ghost text-xs flex items-center gap-1 py-1 px-2"
                      onClick={() => convertToAction(item)}
                      title="Convert to action item"
                    >
                      <CheckSquare size={14} /> Action
                    </button>
                    <button
                      className="btn-ghost text-xs flex items-center gap-1 py-1 px-2"
                      onClick={() => convertToJournal(item)}
                      title="Move to journal"
                    >
                      <BookOpen size={14} /> Journal
                    </button>
                    <button
                      className="btn-ghost text-xs flex items-center gap-1 py-1 px-2 text-red-500 hover:bg-red-50"
                      onClick={() => discard(item)}
                      title="Discard"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Inbox size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Inbox is empty</p>
            <p className="text-xs text-gray-400 mt-1">Capture thoughts above — process them when you're ready</p>
          </div>
        )}
      </div>

      <ActionItemForm
        open={showActionForm}
        onClose={handleActionFormClose}
        editItem={actionTitle ? { title: actionTitle, priority: 'medium', pillar: 'admin' } : null}
      />
    </div>
  );
}
