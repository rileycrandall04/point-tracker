import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Calendar, Inbox, MoreHorizontal } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useOnboardingStatus } from './hooks/useDb';
import { onAuthChange } from './firebase';
import { startAutoSync, downloadAllFromFirestore } from './firestoreSync';

import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import ActionItems from './components/ActionItems';
import Meetings from './components/Meetings';
import MeetingDetail from './components/MeetingDetail';
import MeetingNotes from './components/MeetingNotes';
import InboxView from './components/InboxView';
import Responsibilities from './components/Responsibilities';
import Journal from './components/Journal';
import MoreMenu from './components/MoreMenu';
import ManageCallings from './components/ManageCallings';
import IndividualDetail from './components/IndividualDetail';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/actions', icon: CheckSquare, label: 'Actions' },
  { path: '/meetings', icon: Calendar, label: 'Meetings' },
  { path: '/inbox', icon: Inbox, label: 'Inbox' },
  { path: '/more', icon: MoreHorizontal, label: 'More' },
];

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive ? 'text-primary-700 font-medium' : 'text-gray-500'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not signed in
  const { loading: dbLoading, complete } = useOnboardingStatus();
  const location = useLocation();

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Start syncing local writes to Firestore
        startAutoSync(firebaseUser.uid);
        // Pull any existing cloud data on first sign-in
        try {
          await downloadAllFromFirestore(firebaseUser.uid);
        } catch (err) {
          console.error('Cloud sync failed:', err);
        }
      }
      setUser(firebaseUser);
    });
    return unsub;
  }, []);

  // Still checking auth state
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  // Not signed in — show login
  if (!user) {
    return <Login />;
  }

  // Signed in but still loading local DB
  if (dbLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!complete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  const showNav = complete && location.pathname !== '/onboarding';

  return (
    <div className={showNav ? 'pb-16' : ''}>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/actions" element={<ActionItems />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/meetings/:meetingId" element={<MeetingDetail />} />
        <Route path="/meetings/:meetingId/notes/:instanceId" element={<MeetingNotes />} />
        <Route path="/inbox" element={<InboxView />} />
        <Route path="/responsibilities" element={<Responsibilities />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/more" element={<MoreMenu />} />
        <Route path="/people/:personId" element={<IndividualDetail />} />
        <Route path="/more/callings" element={<ManageCallings />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  );
}
