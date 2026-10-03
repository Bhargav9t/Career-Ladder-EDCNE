import React from 'react';
import { ArrowUp, Compass, Radio, Shield } from 'lucide-react';
import { CLUB_METADATA } from '../../data/rocketryData';
import { soundFx } from '../../utils/audio';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundFx.playCoin();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t-4 border-[#00f0ff] bg-[#020204] px-4 py-16 text-slate-400 font-pixel text-[9px] select-none">
      <div className="max-w-6xl mx-auto w-full">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b-2 border-white/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🚀</span>
              <span className="text-white text-sm sm:text-base tracking-widest font-bold">
                {CLUB_METADATA.clubNamePrimary} // {CLUB_METADATA.clubNameAlt.toUpperCase()}
              </span>
            </div>
            <p className="font-mono-tech text-xs text-slate-400 max-w-md">
              {CLUB_METADATA.organization} • {CLUB_METADATA.tagline}
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="arcade-btn arcade-btn-yellow py-2 px-4 text-[9px] flex items-center gap-2"
          >
            <span>TOP OF DECK</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Column Spec Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-10 border-b-2 border-white/20">
          <div>
            <div className="text-[#ffe600] mb-3 flex items-center gap-1.5 uppercase">
              <Compass className="w-3.5 h-3.5" />
              GROUND STATION
            </div>
            <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400">
              <li>{CLUB_METADATA.missionControlRoom}</li>
              <li>LAT/LON: {CLUB_METADATA.coordinates}</li>
              <li>ELEV: {CLUB_METADATA.elevation}</li>
            </ul>
          </div>

          <div>
            <div className="text-[#00f0ff] mb-3 flex items-center gap-1.5 uppercase">
              <Radio className="w-3.5 h-3.5" />
              RF SPECTRUM
            </div>
            <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400">
              <li>LORA: 433.050 MHz</li>
              <li>APRS: 144.800 MHz</li>
              <li>VIDEO: 2.4 GHz 500mW</li>
            </ul>
          </div>

          <div>
            <div className="text-[#00ff66] mb-3 flex items-center gap-1.5 uppercase">
              <Shield className="w-3.5 h-3.5" />
              LAUNCH WINDOW
            </div>
            <ul className="space-y-1.5 font-mono-tech text-xs text-slate-400">
              <li>DATE: {CLUB_METADATA.launchTargetDisplay}</li>
              <li>CLASS: LEVEL 2 HPR</li>
              <li>NOTAM: AIRSPACE CLEAR</li>
            </ul>
          </div>

          <div>
            <div className="text-[#ff007f] mb-3 uppercase">
              STAGE JUMP
            </div>
            <div className="grid grid-cols-2 gap-2 text-[8px]">
              <a href="#cockpit" className="hover:text-[#ffe600]">STG 00</a>
              <a href="#pad" className="hover:text-[#ffe600]">STG 01</a>
              <a href="#checklist" className="hover:text-[#ffe600]">STG 02</a>
              <a href="#ignition" className="hover:text-[#ffe600]">STG 03</a>
              <a href="#mission" className="hover:text-[#ffe600]">STG 04</a>
              <a href="#builds" className="hover:text-[#ffe600]">STG 05</a>
              <a href="#records" className="hover:text-[#ffe600]">STG 06</a>
              <a href="#join" className="hover:text-[#ffe600]">STG 08</a>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[8px] text-white/50">
          <div>
            © {new Date().getFullYear()} HITAM ROCKETRY CLUB (HRC // ASTRA) • RETRO ARCADE EDITION
          </div>
          <div className="text-[#ffe600]">
            INSERT COIN TO CONTINUE • 1984 MISSION SYSTEM
          </div>
        </div>
      </div>
    </footer>
  );
};
