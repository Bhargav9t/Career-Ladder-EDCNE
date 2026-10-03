import React from 'react';
import { ChevronDown, Coins, Gamepad2, Play } from 'lucide-react';
import { CLUB_METADATA } from '../../data/rocketryData';
import { soundFx } from '../../utils/audio';

interface CockpitHeroProps {
  onScrollToNext: () => void;
  onOpenArcade: () => void;
  onInsertCoin: () => void;
  credits: number;
}

export const CockpitHero: React.FC<CockpitHeroProps> = ({
  onScrollToNext,
  onOpenArcade,
  onInsertCoin,
  credits,
}) => {
  const handleStart = () => {
    soundFx.playStart();
    setTimeout(() => {
      onScrollToNext();
    }, 400);
  };

  return (
    <section
      id="cockpit"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-16 overflow-hidden select-none"
    >
      {/* 8-bit Pixel Grid Background */}
      <div className="absolute inset-0 pixel-grid opacity-30 pointer-events-none" />

      {/* Main Arcade Cabinet Marquee Box */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
        {/* Arcade Cabinet Header Banner */}
        <div className="inline-block bg-[#140810] border-2 border-[#ff007f] px-4 py-2 mb-6 shadow-[0_0_15px_rgba(255,0,127,0.4)]">
          <span className="font-pixel text-[9px] sm:text-[11px] text-[#ff007f] tracking-widest uppercase">
            ★ HITAM ROCKETRY CLUB // MISSION DECK 1984 ★
          </span>
        </div>

        {/* Big Retro Arcade Title */}
        <h1 className="font-pixel text-3xl sm:text-6xl text-[#ffffff] tracking-wider mb-3 leading-tight drop-shadow-[0_4px_0px_#ff007f]">
          HRC<span className="text-[#ffe600]">/</span>ASTRA
        </h1>

        <div className="font-pixel text-xs sm:text-base text-[#00f0ff] tracking-widest uppercase mb-8">
          STUDENT AEROSPACE RESEARCH & SOUNDING VEHICLES
        </div>

        {/* 8-Bit Pixel Porthole Cockpit Box (Arcade Screen Bezel) */}
        <div className="arcade-box-cyan p-4 sm:p-6 mb-8 max-w-xl w-full text-left relative">
          <div className="flex items-center justify-between border-b-2 border-[#00f0ff] pb-2 mb-4">
            <span className="font-pixel text-[10px] text-[#ffe600]">
              COCKPIT VIEWPORT // BOW CAM
            </span>
            <span className="font-pixel text-[9px] text-[#00ff66] arcade-blink">
              ● RADAR LOCK
            </span>
          </div>

          {/* Pixel Ship Graphic Center */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
            <div className="flex flex-col items-center justify-center p-4 bg-black border-2 border-white/20 w-36 h-36 shrink-0 relative overflow-hidden">
              <div className="text-[28px] animate-bounce">🚀</div>
              <span className="font-pixel text-[8px] text-[#ffe600] mt-2">
                ASTRA-01
              </span>
            </div>

            {/* Retro 8-bit Telemetry Meters */}
            <div className="flex-1 w-full space-y-2.5 font-pixel text-[10px]">
              <div className="flex justify-between bg-black/80 p-2 border border-white/10">
                <span className="text-white/60">STATUS:</span>
                <span className="text-[#00ff66]">READY FOR LAUNCH</span>
              </div>
              <div className="flex justify-between bg-black/80 p-2 border border-white/10">
                <span className="text-white/60">ALTITUDE:</span>
                <span className="text-[#00f0ff]">00000m AGL</span>
              </div>
              <div className="flex justify-between bg-black/80 p-2 border border-white/10">
                <span className="text-white/60">FUEL LEVEL:</span>
                <span className="text-[#ffe600]">100% LOADED</span>
              </div>
              <div className="flex justify-between bg-black/80 p-2 border border-white/10">
                <span className="text-white/60">CABIN PRESS:</span>
                <span className="text-[#ff007f]">1.01 ATM</span>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#00f0ff] pt-2 text-[9px] font-pixel text-[#ffffff]/60 flex justify-between">
            <span>TARGET: {CLUB_METADATA.launchTargetDisplay}</span>
            <span>PAD: HYDERABAD</span>
          </div>
        </div>

        {/* Narrative Description in High-Legibility Font */}
        <p className="font-mono-tech text-sm sm:text-base text-slate-300 max-w-2xl mb-8 leading-relaxed">
          {CLUB_METADATA.description}
        </p>

        {/* Arcade Interaction Deck (Insert Coin & Press Start) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {/* Insert Coin */}
          <button
            onClick={() => {
              soundFx.playCoin();
              onInsertCoin();
            }}
            className="arcade-btn arcade-btn-yellow flex items-center gap-2 text-xs hover:scale-105"
          >
            <Coins className="w-4 h-4 text-black" />
            <span>INSERT COIN (CREDITS: {credits})</span>
          </button>

          {/* Press Start to Launch */}
          <button
            onClick={handleStart}
            className="arcade-btn arcade-btn-magenta flex items-center gap-2 text-xs hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span className="arcade-blink">PRESS START // SCROLL ASCENT</span>
          </button>

          {/* Flight Simulator Mini-game */}
          <button
            onClick={() => {
              soundFx.playStart();
              onOpenArcade();
            }}
            className="arcade-btn arcade-btn-cyan flex items-center gap-2 text-xs hover:scale-105"
          >
            <Gamepad2 className="w-4 h-4 text-black" />
            <span>PLAY SIMULATOR (EASTER EGG)</span>
          </button>
        </div>

        {/* Blinking Push Start prompt */}
        <div
          onClick={handleStart}
          className="cursor-pointer group flex flex-col items-center gap-1 font-pixel text-[10px] text-[#ffe600]"
        >
          <span className="arcade-blink">▼ SCROLL DOWN TO COMMENCE FLIGHT MISSION ▼</span>
          <ChevronDown className="w-4 h-4 text-[#ffe600] group-hover:translate-y-1 transition-transform" />
        </div>
      </div>
    </section>
  );
};
