import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Tv, Gamepad2, Rocket, Menu, X, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { CLUB_METADATA } from '../../data/rocketryData';

interface LiquidGlassNavProps {
  currentAltitude: number;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onOpenArcade: () => void;
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  currentAltitude,
  activeSection,
  onNavigate,
  crtEnabled,
  onToggleCrt,
  onOpenArcade,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Countdown to Oct 3, 2026 ~ 14:00 IST
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(CLUB_METADATA.launchTargetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeRemaining('T-00:00:00 (LAUNCH WINDOW ACTIVE)');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `T-${days > 0 ? `${days}D ` : ''}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    soundFx.enabled = nextState;
    if (nextState) {
      soundFx.playSuccess();
    }
  };

  const navItems = [
    { id: 'cockpit', label: '00_COCKPIT', short: '00' },
    { id: 'pad', label: '01_PAD', short: '01' },
    { id: 'checklist', label: '02_CHECK', short: '02' },
    { id: 'mission', label: '03_MISSION', short: '03' },
    { id: 'builds', label: '04_BUILDS', short: '04' },
    { id: 'records', label: '05_RECORDS', short: '05' },
    { id: 'crew', label: '06_CREW', short: '06' },
    { id: 'join', label: '07_JOIN', short: '07' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 pb-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand Identity & Active Stage HUD */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onNavigate('cockpit');
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full liquid-glass-regular hover:border-amber-400/50 transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/30 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-tech font-bold text-xs tracking-wider text-white">
                  {CLUB_METADATA.clubNamePrimary}
                </span>
                <span className="text-slate-500 text-[10px] font-mono-tech">//</span>
                <span className="font-mono-tech font-semibold text-xs tracking-widest text-amber-400">
                  {CLUB_METADATA.clubNameAlt.toUpperCase()}
                </span>
              </div>
              <div className="text-[9px] font-mono-tech text-slate-400 hidden sm:block tracking-tight">
                AEROSPACE RESEARCH LAB
              </div>
            </div>
          </button>

          {/* Telemetry Capsule Widget (Apple Liquid Glass pill) */}
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full liquid-glass-regular border-white/10 font-mono-tech text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 text-[10px]">ALT:</span>
              <span className="text-emerald-300 font-semibold tabular-nums">
                {Math.round(currentAltitude).toLocaleString()}m
              </span>
            </div>
            <div className="h-3 w-px bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[10px]">COUNTDOWN:</span>
              <span className="text-amber-400 font-semibold tabular-nums tracking-wide text-[11px]">
                {timeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Quick Jump Links */}
        <nav className="hidden xl:flex items-center p-1 rounded-full liquid-glass-regular border-white/10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onNavigate(item.id);
                }}
                className={`relative px-3 py-1 text-xs font-mono-tech tracking-wider rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/15 font-semibold shadow-inner border border-white/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Interactive Retro Arcade Launch */}
        <div className="flex items-center gap-2">
          {/* Retro Arcade Mini-Game Trigger */}
          <button
            onClick={() => {
              soundFx.playSuccess();
              onOpenArcade();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono-tech tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/10 hover:scale-105 active:scale-95"
            title="Launch Retro Arcade Mini-Game"
          >
            <Gamepad2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="hidden sm:inline font-semibold">SIMULATOR</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              soundFx.playToggle();
              onToggleCrt();
            }}
            className={`p-2 rounded-full liquid-glass-regular transition-all duration-200 border ${
              crtEnabled
                ? 'border-emerald-500/60 text-emerald-400 bg-emerald-500/10'
                : 'border-white/10 text-slate-400 hover:text-white'
            }`}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
            aria-label="Toggle CRT Scanline Overlay"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleAudioToggle}
            className={`p-2 rounded-full liquid-glass-regular transition-all duration-200 border ${
              audioEnabled
                ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                : 'border-white/10 text-slate-500 hover:text-white'
            }`}
            title={audioEnabled ? 'Mute 8-bit Audio FX' : 'Enable 8-bit Audio FX'}
            aria-label="Toggle Audio Effects"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 rounded-full liquid-glass-regular border-white/10 text-slate-300 hover:text-white"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Apple Liquid Glass overlay) */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-2 p-4 rounded-2xl liquid-glass-regular border border-white/15 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 font-mono-tech text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>FLIGHT SYSTEM TRAJECTORY</span>
            </div>
            <span className="text-amber-400 font-semibold">{timeRemaining}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono-tech transition-all ${
                  activeSection === item.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-slate-500">→</span>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>ALTITUDE: {Math.round(currentAltitude)}m</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenArcade();
              }}
              className="text-amber-400 underline font-semibold"
            >
              LAUNCH SIMULATOR
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
