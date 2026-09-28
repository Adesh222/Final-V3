import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MeshBackground from '../components/MeshBackground';
import {
  Activity, Shield, Stethoscope, HeartPulse, UserCheck,
  ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';

const ROLES = [
  {
    id: 'patient',
    email: 'patient@mediqueue.demo',
    label: 'Patient',
    description: 'Book appointments & track your live queue ticket',
    icon: HeartPulse,
    accent: 'from-sky-400 to-cyan-500',
    ring: 'ring-sky-400/40',
    bg: 'bg-sky-500/10',
    border: 'border-sky-400/25',
  },
  {
    id: 'doctor',
    email: 'doctor@mediqueue.demo',
    label: 'Doctor',
    description: 'Manage your consultation queue & call patients',
    icon: Stethoscope,
    accent: 'from-emerald-400 to-teal-500',
    ring: 'ring-emerald-400/40',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/25',
  },
  {
    id: 'receptionist',
    email: 'receptionist@mediqueue.demo',
    label: 'Receptionist',
    description: 'Register walk-ins, book patients & manage queues',
    icon: UserCheck,
    accent: 'from-violet-400 to-purple-500',
    ring: 'ring-violet-400/40',
    bg: 'bg-violet-500/10',
    border: 'border-violet-400/25',
  },
  {
    id: 'admin',
    email: 'admin@mediqueue.demo',
    label: 'Admin',
    description: 'Hospital-wide stats, departments & audit logs',
    icon: Shield,
    accent: 'from-amber-400 to-orange-500',
    ring: 'ring-amber-400/40',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/25',
  },
];

export default function Landing({ onNavigate }) {
  const { login } = useAuth();
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState('');

  const handleRoleLogin = async (role) => {
    setError('');
    setLoadingRole(role.id);
    try {
      await login(role.email, 'Password123!');
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed. Ensure the database is seeded.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col text-white">
      <MeshBackground />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
            <Activity size={22} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">MediQueue</span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-caption text-sky-300/80 border border-sky-400/30 px-1.5 py-0.5 rounded">
              Smart Queue
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('login')}
          className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
        >
          Sign in manually
        </button>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-caption uppercase text-sky-300/90 bg-sky-500/10 border border-sky-400/20 rounded-full px-3 py-1 mb-5">
            <Sparkles size={12} />
            Hospital Queue System
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            Choose your{' '}
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
              role
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/55 font-medium max-w-md mx-auto">
            One-click demo access. Explore the full experience as Patient, Doctor, Receptionist or Admin.
          </p>
        </div>

        {error && (
          <div className="mb-6 max-w-md w-full p-3.5 glass rounded-2xl flex items-start gap-2.5 text-sm text-rose-200 animate-shake">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-5xl">
          {ROLES.map((role, i) => {
            const Icon = role.icon;
            const isLoading = loadingRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleLogin(role)}
                disabled={!!loadingRole}
                className={`
                  role-card group relative text-left p-5 sm:p-6 rounded-3xl
                  glass border ${role.border}
                  hover:ring-2 ${role.ring}
                  disabled:opacity-60 disabled:cursor-not-allowed
                  animate-fade-in-up stagger-${i + 1}
                `}
              >
                <div
                  className={`
                    w-12 h-12 rounded-2xl bg-gradient-to-br ${role.accent}
                    flex items-center justify-center mb-4 shadow-lg
                    group-hover:scale-110 transition-transform duration-300
                  `}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <Icon size={24} className="text-white" strokeWidth={2.2} />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{role.label}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-5 min-h-[36px]">
                  {role.description}
                </p>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Entering…
                    </>
                  ) : (
                    <>
                      Enter as {role.label}
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-10 text-[11px] text-white/30 tracking-wide">
          Demo accounts use a shared secure password · Data resets on reseed
        </p>
      </main>
    </div>
  );
}
