import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity, LogOut, Monitor, Shield, Stethoscope, HeartPulse, UserCheck
} from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, role, logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <span className="bg-amber-50 text-amber-800 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-amber-200">
            <Shield size={11} /> Admin
          </span>
        );
      case 'doctor':
        return (
          <span className="bg-emerald-50 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
            <Stethoscope size={11} /> Doctor
          </span>
        );
      case 'receptionist':
      case 'staff':
        return (
          <span className="bg-violet-50 text-violet-800 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-violet-200">
            <UserCheck size={11} /> Receptionist
          </span>
        );
      case 'patient':
        return (
          <span className="bg-sky-50 text-sky-800 text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-sky-200">
            <HeartPulse size={11} /> Patient
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView(user ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 group-hover:shadow-sky-500/40 transition-all duration-200">
              <Activity size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 to-indigo-800 bg-clip-text text-transparent">
                  MediQueue
                </span>
                <span className="text-[10px] tracking-wider font-extrabold uppercase bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-md border border-sky-200/80">
                  SMART QUEUE
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block leading-tight">
                Hospital Queue & Appointment System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentView(currentView === 'tv' ? (user ? 'dashboard' : 'landing') : 'tv')}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 ${
                currentView === 'tv'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
              }`}
              title="Hospital Lobby Live Screen"
            >
              <Monitor size={16} />
              <span className="hidden md:inline">
                {currentView === 'tv' ? 'Back to App' : 'Waiting Lobby TV'}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/80 flex items-center justify-center text-slate-700 font-bold text-sm shadow-sm">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                      {user.full_name}
                    </p>
                    <div className="mt-0.5">{getRoleBadge()}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setCurrentView('landing');
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl shadow-md shadow-sky-500/25 transition-all duration-200"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
