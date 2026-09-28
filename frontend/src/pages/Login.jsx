import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Shield, Stethoscope, HeartPulse, UserCheck, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass = 'Password123!') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed. Make sure database is connected and seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Soft ambient background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-300/40 border border-white/60 p-7 sm:p-9">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-sky-500/40 mb-4 animate-scale-in">
              <Activity size={32} strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome to MediQueue
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Smart Hospital Queue & Appointment System
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
              <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mediqueue.demo"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-8 pt-6 border-t border-slate-100/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3.5">
              One-Click Demo Roles
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@mediqueue.demo')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 hover:bg-amber-100/80 hover:border-amber-300 transition-all duration-200 text-amber-900 group active:scale-95"
              >
                <Shield size={20} className="text-amber-600 mb-1.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-bold">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('doctor@mediqueue.demo')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-100/80 hover:border-emerald-300 transition-all duration-200 text-emerald-900 group active:scale-95"
              >
                <Stethoscope size={20} className="text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-bold">Doctor</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('receptionist@mediqueue.demo')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-violet-200/80 bg-violet-50/60 hover:bg-violet-100/80 hover:border-violet-300 transition-all duration-200 text-violet-900 group active:scale-95"
              >
                <UserCheck size={20} className="text-violet-600 mb-1.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-bold">Receptionist</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('patient@mediqueue.demo')}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-sky-200/80 bg-sky-50/60 hover:bg-sky-100/80 hover:border-sky-300 transition-all duration-200 text-sky-900 group active:scale-95"
              >
                <HeartPulse size={20} className="text-sky-600 mb-1.5 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs font-bold">Patient</span>
              </button>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-7 text-center text-sm text-slate-500 space-y-2">
            <div>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-sky-600 font-bold hover:text-sky-700 hover:underline underline-offset-2 transition-colors"
              >
                Register here
              </button>
            </div>
            <button
              onClick={() => onNavigate('landing')}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              ← Back to role picker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
