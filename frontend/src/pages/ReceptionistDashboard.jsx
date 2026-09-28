import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import {
  UserCheck, Stethoscope, Clock, Users, Plus, X, AlertCircle,
  CheckCircle2, RefreshCw, Phone, User, Calendar, Zap, CreditCard,
  Search, ChevronRight, Activity
} from 'lucide-react';

export default function ReceptionistDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [error, setError] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [search, setSearch] = useState('');

  // Booking form
  const [form, setForm] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    doctor_id: '',
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    is_urgent: false,
    payment_status: 'pending',
  });

  const loadData = useCallback(async () => {
    try {
      const [ov, depts] = await Promise.all([
        api.getOverview(),
        api.getDepartments(),
      ]);
      setOverview(Array.isArray(ov) ? ov : ov?.doctors || []);
      setDepartments(depts || []);
      if (depts?.length && !selectedDept) setSelectedDept(depts[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDept]);

  useEffect(() => {
    loadData();
    const t = setInterval(loadData, 8000);
    return () => clearInterval(t);
  }, [loadData]);

  useEffect(() => {
    async function fetchDocs() {
      if (!selectedDept) return;
      try {
        const docs = await api.getPublicDoctors(selectedDept);
        setDoctors(docs || []);
        if (docs?.length) {
          setForm((f) => ({ ...f, doctor_id: docs[0].id }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchDocs();
  }, [selectedDept]);

  const openBooking = (doctorId = null) => {
    setSuccessTicket(null);
    setError('');
    setForm((f) => ({
      ...f,
      doctor_id: doctorId || f.doctor_id || (doctors[0]?.id ?? ''),
      patient_name: '',
      patient_phone: '',
      patient_email: '',
      symptoms: '',
      is_urgent: false,
      payment_status: 'pending',
      date: new Date().toISOString().split('T')[0],
    }));
    setShowBooking(true);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.patient_name.trim() || !form.doctor_id) {
      setError('Patient name and doctor are required.');
      return;
    }
    setBookingLoading(true);
    setError('');
    try {
      const result = await api.bookWalkIn({
        doctor_id: form.doctor_id,
        date: form.date,
        time_slot: 'Walk-in Queue',
        symptoms: form.symptoms,
        patient_name: form.patient_name.trim(),
        patient_phone: form.patient_phone,
        patient_email: form.patient_email,
        is_urgent: form.is_urgent,
        payment_status: form.payment_status,
      });
      setSuccessTicket(result);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create walk-in booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredOverview = overview.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.doctor_name?.toLowerCase().includes(q) ||
      d.department_name?.toLowerCase().includes(q) ||
      d.room_number?.toLowerCase().includes(q)
    );
  });

  const statusBadge = (status) => {
    const map = {
      available: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
      in_consultation: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
      on_break: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
    };
    const label = {
      available: 'Available',
      in_consultation: 'In Consultation',
      on_break: 'On Break',
    };
    const key = status || 'available';
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[key] || map.available}`}>
        {label[key] || 'Available'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-7 h-7 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck size={18} className="text-violet-500" />
            <span className="text-[11px] font-bold uppercase tracking-caption text-violet-600">
              Reception Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, {user?.full_name?.split(' ')[0] || 'Receptionist'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Register walk-ins, check doctor availability, and manage live queues
          </p>
        </div>
        <button
          onClick={() => openBooking()}
          className="btn-press inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-violet-500/25"
        >
          <Plus size={18} />
          New Walk-in Booking
        </button>
      </div>

      {/* Search + stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        <div className="sm:col-span-2 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors, departments, rooms…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
          />
        </div>
        <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Stethoscope size={16} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctors Live</p>
            <p className="text-lg font-extrabold text-slate-800">{overview.length}</p>
          </div>
        </div>
        <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
            <Users size={16} className="text-sky-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waiting Total</p>
            <p className="text-lg font-extrabold text-slate-800">
              {overview.reduce((s, d) => s + (d.waiting_count || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Availability Grid */}
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
        Real-time Doctor Availability
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {filteredOverview.length === 0 ? (
          <div className="col-span-full glass-panel rounded-3xl p-10 text-center text-slate-400">
            <Activity size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No doctor queues found for today</p>
          </div>
        ) : (
          filteredOverview.map((doc) => (
            <div
              key={doc.doctor_id}
              className="glass-panel rounded-3xl p-5 card-lift border border-slate-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{doc.doctor_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {doc.department_name} · {doc.room_number}
                  </p>
                </div>
                {statusBadge(doc.status || (doc.now_serving ? 'in_consultation' : 'available'))}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Waiting</p>
                  <p className="text-lg font-extrabold text-slate-800">{doc.waiting_count ?? 0}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Wait</p>
                  <p className="text-lg font-extrabold text-slate-800">
                    {doc.avg_wait_mins ?? doc.estimated_wait_mins ?? 15}m
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Done</p>
                  <p className="text-lg font-extrabold text-slate-800">{doc.completed_count ?? 0}</p>
                </div>
              </div>

              {doc.now_serving && (
                <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-xs">
                  <span className="font-bold text-amber-800">Now: </span>
                  <span className="text-amber-700">
                    {doc.now_serving.patient_name} ({doc.now_serving.ticket_number})
                  </span>
                </div>
              )}

              <button
                onClick={() => openBooking(doc.doctor_id)}
                className="w-full flex items-center justify-center gap-1.5 text-sm font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl py-2.5 transition-colors"
              >
                <Plus size={15} />
                Add Patient to Queue
              </button>
            </div>
          ))
        )}
      </div>

      {/* ===== Booking Modal (Patient-Mirror) ===== */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => !bookingLoading && setShowBooking(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in max-h-[92vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Walk-in / Phone Booking</h2>
                <p className="text-xs text-slate-500">Receptionist patient registration</p>
              </div>
              <button
                onClick={() => setShowBooking(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {successTicket ? (
                <div className="text-center py-6 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">Patient Added to Queue</h3>
                  <p className="text-sm text-slate-500 mb-5">Ticket issued successfully</p>
                  <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Number</p>
                    <p className="text-3xl font-black text-violet-700 tracking-tight">
                      {successTicket.ticket_number}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      {successTicket.patient_name} · Pos. #{successTicket.queue_position} · ~{successTicket.estimated_wait_mins}m wait
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowBooking(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setSuccessTicket(null);
                        setForm((f) => ({
                          ...f,
                          patient_name: '',
                          patient_phone: '',
                          patient_email: '',
                          symptoms: '',
                          is_urgent: false,
                          payment_status: 'pending',
                        }));
                      }}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800 animate-shake">
                      <AlertCircle size={15} className="shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  {/* Patient details */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</p>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        value={form.patient_name}
                        onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                        placeholder="Full name *"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={form.patient_phone}
                          onChange={(e) => setForm({ ...form, patient_phone: e.target.value })}
                          placeholder="Phone"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                        />
                      </div>
                      <input
                        type="email"
                        value={form.patient_email}
                        onChange={(e) => setForm({ ...form, patient_email: e.target.value })}
                        placeholder="Email (optional)"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      />
                    </div>
                  </div>

                  {/* Department + Doctor */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Queue Assignment</p>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <select
                      required
                      value={form.doctor_id}
                      onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                    >
                      {doctors.length === 0 && <option value="">No doctors in department</option>}
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} · {d.room_number}
                        </option>
                      ))}
                    </select>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                      />
                    </div>
                    <textarea
                      value={form.symptoms}
                      onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                      placeholder="Symptoms / notes (optional)"
                      rows={2}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                    />
                  </div>

                  {/* Receptionist controls */}
                  <div className="space-y-3 pt-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reception Controls</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, is_urgent: !form.is_urgent })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                          form.is_urgent
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Zap size={15} />
                        {form.is_urgent ? 'Urgent Priority' : 'Mark Urgent'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {['pending', 'paid', 'waived'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm({ ...form, payment_status: s })}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                            form.payment_status === s
                              ? 'bg-violet-50 border-violet-300 text-violet-700'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <CreditCard size={12} className="inline mr-1 -mt-0.5" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-violet-500/25 disabled:opacity-60 btn-press"
                  >
                    {bookingLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating ticket…
                      </>
                    ) : (
                      <>
                        Add to Doctor Queue
                        <ChevronRight size={17} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
