import { useNavigate } from 'react-router-dom';
import { BookOpen, ListChecks, LogOut, Trash2, ChevronRight, Users, FlaskConical } from 'lucide-react';
import { useProfile, useUserCallings } from '../hooks/useDb';
import { getCallingConfig } from '../data/callings';
import { auth, logOut } from '../firebase';
import db from '../db';
import { useState, useEffect, useCallback } from 'react';
import Modal from './shared/Modal';
import { hasTestData, loadTestData, removeTestData } from '../testData';

export default function MoreMenu() {
  const { profile } = useProfile();
  const { callings } = useUserCallings();
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [testDataLoaded, setTestDataLoaded] = useState(false);
  const [testDataBusy, setTestDataBusy] = useState(false);

  // Check current test data state on mount and after changes
  const refreshTestDataState = useCallback(async () => {
    setTestDataLoaded(await hasTestData());
  }, []);

  useEffect(() => { refreshTestDataState(); }, [refreshTestDataState]);

  const handleToggleTestData = async () => {
    setTestDataBusy(true);
    try {
      if (testDataLoaded) {
        await removeTestData();
      } else {
        await loadTestData();
      }
      await refreshTestDataState();
    } finally {
      setTestDataBusy(false);
    }
  };

  const handleReset = async () => {
    await db.delete();
    window.location.href = '/onboarding';
  };

  const menuItems = [
    {
      icon: Users,
      label: 'Manage Callings',
      description: 'Add or remove callings',
      onClick: () => navigate('/more/callings'),
    },
    {
      icon: ListChecks,
      label: 'Responsibilities',
      description: 'View and manage calling responsibilities',
      onClick: () => navigate('/responsibilities'),
    },
    {
      icon: BookOpen,
      label: 'Spiritual Impressions',
      description: 'Private journal for impressions',
      onClick: () => navigate('/journal'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4">
        <h1 className="text-lg font-bold text-gray-900">More</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile card */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-900">{profile?.name || 'User'}</h2>
          {auth.currentUser?.email && (
            <p className="text-xs text-gray-500 mt-0.5">{auth.currentUser.email}</p>
          )}
          <div className="mt-2 space-y-1">
            {callings.map(c => {
              const config = getCallingConfig(c.callingKey);
              return (
                <span key={c.id} className="badge bg-primary-50 text-primary-700 mr-1">
                  {config?.title || c.callingKey}
                </span>
              );
            })}
          </div>
        </div>

        {/* Menu items */}
        <div className="card divide-y divide-gray-100 p-0">
          {menuItems.map(item => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors"
              onClick={item.onClick}
            >
              <item.icon size={20} className="text-gray-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <div className="card p-0">
          <button
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors"
            onClick={logOut}
          >
            <LogOut size={20} className="text-gray-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Sign Out</div>
              <div className="text-xs text-gray-500">Your data stays synced in the cloud</div>
            </div>
          </button>
        </div>

        {/* Test data toggle */}
        <div className="card p-0">
          <button
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left transition-colors disabled:opacity-50"
            onClick={handleToggleTestData}
            disabled={testDataBusy}
          >
            <FlaskConical size={20} className="text-indigo-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {testDataBusy ? 'Working...' : testDataLoaded ? 'Remove Test Data' : 'Load Test Data'}
              </div>
              <div className="text-xs text-gray-500">
                {testDataLoaded
                  ? 'Remove sample data (your data is preserved)'
                  : 'Add sample meetings, actions, notes, etc.'}
              </div>
            </div>
          </button>
        </div>

        {/* Danger zone */}
        <div className="card border-red-100 p-0">
          <button
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 text-left transition-colors"
            onClick={() => setShowReset(true)}
          >
            <Trash2 size={20} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-red-600">Reset All Data</div>
              <div className="text-xs text-gray-500">Delete everything and start over</div>
            </div>
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center pt-4">
          Organize Yourselves v0.1.0
        </p>
      </div>

      {/* Reset confirmation */}
      <Modal open={showReset} onClose={() => setShowReset(false)} title="Reset All Data?">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This will permanently delete all your data including action items, meeting notes, journal entries, and settings. This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={() => setShowReset(false)}>Cancel</button>
            <button
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              onClick={handleReset}
            >
              Delete Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
