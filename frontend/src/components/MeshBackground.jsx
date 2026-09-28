import React from 'react';

/**
 * Flowing multi-layer mesh gradient background.
 * Apple-inspired soft ambient motion (15–20s loops).
 */
export default function MeshBackground({ intensity = 'normal' }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base deep slate */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />

      {/* Layer 1 – indigo / teal wash */}
      <div
        className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full opacity-40 blur-[100px] animate-mesh-1"
        style={{
          background:
            'radial-gradient(circle at 30% 40%, rgba(99,102,241,0.55) 0%, rgba(20,184,166,0.25) 45%, transparent 70%)',
        }}
      />

      {/* Layer 2 – teal / sky */}
      <div
        className="absolute top-[10%] -right-[25%] w-[70%] h-[70%] rounded-full opacity-35 blur-[110px] animate-mesh-2"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(14,165,233,0.5) 0%, rgba(45,212,191,0.22) 50%, transparent 75%)',
        }}
      />

      {/* Layer 3 – soft violet accent */}
      <div
        className="absolute -bottom-[30%] left-[10%] w-[65%] h-[65%] rounded-full opacity-30 blur-[120px] animate-mesh-3"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, rgba(139,92,246,0.4) 0%, rgba(99,102,241,0.18) 50%, transparent 70%)',
        }}
      />

      {/* Subtle noise overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.55)_100%)]" />
    </div>
  );
}
