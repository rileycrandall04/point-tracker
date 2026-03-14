import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Search, ChevronRight } from 'lucide-react';
import { getCallingList, getCallingConfig, getOrgLabel, ORGANIZATIONS } from '../data/callings';
import { saveProfile, addUserCalling, addResponsibility, addMeeting } from '../db';

const STEPS = ['name', 'callings', 'confirm'];

export default function Onboarding() {
  const [step, setStep] = useState('name');
  const [name, setName] = useState('');
  const [selectedCallings, setSelectedCallings] = useState([]);
  const [search, setSearch] = useState('');
  const [setting, setSetting] = useState(false);
  const navigate = useNavigate();

  const callingList = getCallingList();
  const grouped = ORGANIZATIONS.map(org => ({
    ...org,
    callings: callingList.filter(c => c.organization === org.key),
  })).filter(g => g.callings.length > 0);

  const filtered = search
    ? callingList.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        getOrgLabel(c.organization).toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const toggleCalling = (key) => {
    setSelectedCallings(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const setupCallings = async () => {
    setSetting(true);
    try {
      await saveProfile({ name });

      for (const callingKey of selectedCallings) {
        const config = getCallingConfig(callingKey);
        if (!config) continue;

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
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Setup failed:', err);
      setSetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-700 to-primary-900 flex flex-col">
      {/* Header */}
      <div className="text-center pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-white">Organize Yourselves</h1>
        <p className="text-primary-200 text-sm mt-1">
          Prepare every needful thing
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {STEPS.map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              s === step ? 'bg-white' : 'bg-primary-400'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-6 pb-8">
        {step === 'name' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Welcome</h2>
              <p className="text-sm text-gray-600 mt-1">
                Let's set up your personal calling organizer. What's your name?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                className="input-field text-lg"
                placeholder="e.g., Brother Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={!name.trim()}
              onClick={() => setStep('callings')}
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 'callings' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Callings</h2>
              <p className="text-sm text-gray-600 mt-1">
                Select your current calling(s). We'll set up responsibilities and meetings from the handbook.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search callings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Calling list */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto -mx-2 px-2">
              {filtered ? (
                <div className="space-y-1">
                  {filtered.map(c => (
                    <CallingOption
                      key={c.key}
                      calling={c}
                      selected={selectedCallings.includes(c.key)}
                      onToggle={() => toggleCalling(c.key)}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No callings match your search</p>
                  )}
                </div>
              ) : (
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
                          selected={selectedCallings.includes(c.key)}
                          onToggle={() => toggleCalling(c.key)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn-secondary flex-1" onClick={() => setStep('name')}>
                Back
              </button>
              <button
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={selectedCallings.length === 0}
                onClick={() => setStep('confirm')}
              >
                Continue ({selectedCallings.length}) <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ready to Go</h2>
              <p className="text-sm text-gray-600 mt-1">
                We'll set up the following for you:
              </p>
            </div>

            <div className="space-y-3">
              {selectedCallings.map(key => {
                const config = getCallingConfig(key);
                return (
                  <div key={key} className="card">
                    <h3 className="font-medium text-gray-900">{config.title}</h3>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <p>{config.responsibilities.length} responsibilities</p>
                      <p>{config.meetings.length} meeting types</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep('callings')}>
                Back
              </button>
              <button
                className="btn-primary flex-1"
                disabled={setting}
                onClick={setupCallings}
              >
                {setting ? 'Setting up...' : 'Set Up My Callings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CallingOption({ calling, selected, onToggle }) {
  return (
    <button
      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
        selected ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50 border border-transparent'
      }`}
      onClick={onToggle}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-primary-700' : 'border-2 border-gray-300'
      }`}>
        {selected && <Check size={14} className="text-white" />}
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900">{calling.title}</span>
        {calling.handbook && (
          <span className="text-xs text-gray-400 ml-2">Handbook {calling.handbook}</span>
        )}
      </div>
    </button>
  );
}
