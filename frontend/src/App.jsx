import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './api';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import LiveQueueDisplay from './pages/LiveQueueDisplay';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function MainLayout() {
  const { user, role, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // landing | dashboard | tv | login | register
  const [healthStatus, setHealthStatus] = useState(null);

  const checkDb = async () => {
    try {
      const h = await api.getHealth();
      setHealthStatus(h);
    } catch (err) {
      setHealthStatus({
        mongodb_connected: false,
        connection_error: 'Backend API is offline or unreachable.',
      });
    }
  };

  useEffect(() => {
    checkDb();
    const interval = setInterval(checkDb, 10000);
    return () => clearInterval(interval);
  }, []);

  // When user logs in, go to dashboard
  useEffect(() => {
    if (user && (currentView === 'landing' || currentView === 'login' || currentView === 'register')) {
      setCurrentView('dashboard');
    }
    if (!user && currentView === 'dashboard') {
      setCurrentView('landing');
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
          <RefreshCw className="w-6 h-6 text-white animate-spin" />
        </div>
        <p className="text-sm font-medium text-white/50">Loading MediQueue…</p>
      </div>
    );
  }

  // Full-screen Lobby Display TV View
  if (currentView === 'tv') {
    return <LiveQueueDisplay onExit={() => setCurrentView(user ? 'dashboard' : 'landing')} />;
  }

  // Landing (role picker) – full screen, no navbar
  if (!user && currentView === 'landing') {
    return <Landing onNavigate={setCurrentView} />;
  }

  const renderContent = () => {
    if (!user) {
      if (currentView === 'register') return <Register onNavigate={setCurrentView} />;
      return <Login onNavigate={setCurrentView} />;
    }

    switch (role) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'receptionist':
      case 'staff':
        return <ReceptionistDashboard />;
      case 'patient':
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {healthStatus && !healthStatus.mongodb_connected && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertTriangle size={18} className="shrink-0" />
            <span>
              <strong>MongoDB Status:</strong>{' '}
              {healthStatus.connection_error || 'Database password placeholder detected.'}
            </span>
          </div>
          <button
            onClick={checkDb}
            className="text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg ml-2 hover:bg-slate-800"
          >
            Retry Connection
          </button>
        </div>
      )}

      <main className="flex-1 pb-16">{renderContent()}</main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/70 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            © 2026 MediQueue Systems · Smart Hospital Queue & Appointment Management
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus?.mongodb_connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              {healthStatus?.mongodb_connected ? 'MongoDB Atlas Connected' : 'DB Configuration Needed'}
            </span>
            <span className="hidden sm:inline">FastAPI · React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
