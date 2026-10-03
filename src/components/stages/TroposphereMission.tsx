import React, { useState } from 'react';
import { Target, Layers, ArrowUpRight, Flame, Compass, Cpu, Shield, Activity } from 'lucide-react';
import { SUB_TEAMS, CLUB_METADATA } from '../../data/rocketryData';
import { soundFx } from '../../utils/audio';

export const TroposphereMission: React.FC = () => {
  const [activeTeamId, setActiveTeamId] = useState(SUB_TEAMS[0].id);

  const selectedTeam = SUB_TEAMS.find((t) => t.id === activeTeamId) || SUB_TEAMS[0];

  const getSubteamIcon = (id: string) => {
    switch (id) {
      case 'propulsion':
        return <Flame className="w-4 h-4 text-[#ff3333]" />;
      case 'aerodynamics':
        return <Compass className="w-4 h-4 text-[#00f0ff]" />;
      case 'avionics':
        return <Cpu className="w-4 h-4 text-[#00ff66]" />;
      case 'structures':
        return <Shield className="w-4 h-4 text-[#ffe600]" />;
      case 'payload':
        return <Activity className="w-4 h-4 text-[#ff007f]" />;
      default:
        return <Layers className="w-4 h-4 text-white" />;
    }
  };

  return (
    <section
      id="mission"
      className="relative min-h-screen flex flex-col justify-center px-4 py-24 border-t-4 border-[#00ff66]/30 select-none"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Stage 4 Arcade Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-white/20">
          <div>
            <div className="font-pixel text-[10px] text-[#ffe600] mb-2 tracking-widest">
              ★ STAGE 04 // TROPOSPHERE (0 - 12,000m) ★
            </div>
            <h2 className="font-pixel text-xl sm:text-3xl text-white tracking-wide">
              MISSION & SUB-TEAMS
            </h2>
          </div>
          <div className="font-pixel text-[9px] text-[#00ff66] bg-black border-2 border-[#00ff66] px-3 py-1.5 self-start sm:self-auto">
            SQUADRONS: 5 RESEARCH DIVISIONS
          </div>
        </div>

        {/* Mission Directive Box */}
        <div className="arcade-box-cyan p-6 sm:p-8 mb-10">
          <div className="flex items-center gap-2 font-pixel text-[10px] text-[#ffe600] mb-3">
            <Target className="w-4 h-4" />
            <span>PRIMARY MISSION DIRECTIVE</span>
          </div>

          <p className="font-mono-tech text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
            "{CLUB_METADATA.description}"
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-[#00f0ff] font-pixel text-[9px]">
            <div>
              <span className="text-white/50 block text-[8px]">HQ LAB</span>
              <span className="text-white">HITAM AERO LAB</span>
            </div>
            <div>
              <span className="text-white/50 block text-[8px]">ENGINEERS</span>
              <span className="text-[#00ff66]">25+ ACTIVE</span>
            </div>
            <div>
              <span className="text-white/50 block text-[8px]">SUB-TEAMS</span>
              <span className="text-[#ffe600]">5 DIVISIONS</span>
            </div>
            <div>
              <span className="text-white/50 block text-[8px]">TARGET</span>
              <span className="text-[#ff007f]">OCT 03 LAUNCH</span>
            </div>
          </div>
        </div>

        {/* Sub-teams Interactive Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sub-team Selector */}
          <div className="lg:col-span-4 flex flex-col gap-2 font-pixel text-[9px]">
            <div className="text-white/60 px-1 py-1 tracking-wider uppercase">
              SELECT SQUADRON:
            </div>
            {SUB_TEAMS.map((team) => {
              const isActive = activeTeamId === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTeamId(team.id);
                  }}
                  className={`flex items-center justify-between p-3 border-2 transition-all text-left ${
                    isActive
                      ? 'bg-[#ffe600] text-black border-white shadow-[0_0_12px_#ffe600]'
                      : 'bg-black/80 text-white/70 border-white/20 hover:border-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getSubteamIcon(team.id)}
                    <div>
                      <div className="text-[10px] leading-tight font-bold">{team.name}</div>
                      <div className="text-[8px] opacity-70 mt-0.5">{team.code}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Sub-team Spec Card */}
          <div className="lg:col-span-8 arcade-box-magenta p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#ff007f] mb-4 font-pixel text-[9px]">
                <span className="text-[#ffe600]">
                  [{selectedTeam.code}] // {selectedTeam.lead}
                </span>
                <span className="text-[#00ff66]">● RESEARCH ACTIVE</span>
              </div>

              <h3 className="font-pixel text-lg sm:text-xl text-white mb-3">
                {selectedTeam.name}
              </h3>

              <p className="font-mono-tech text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {selectedTeam.focus}
              </p>

              <div className="bg-black p-4 border-2 border-white/20 mb-6">
                <span className="font-pixel text-[9px] text-[#ffe600] block mb-1">
                  CURRENT RESEARCH BENCHMARK:
                </span>
                <p className="font-mono-tech text-xs text-slate-300">
                  {selectedTeam.currentResearch}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <span className="font-pixel text-[8px] text-white/50 block mb-2">
                  TOOLCHAIN & SKILLS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTeam.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-black border border-white/20 font-pixel text-[8px] text-[#00f0ff]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t-2 border-[#ff007f] font-pixel text-[9px]">
              {selectedTeam.specs.map((s) => (
                <div key={s.label} className="bg-black p-2.5 border border-white/10">
                  <span className="text-white/50 block text-[7px]">{s.label}</span>
                  <span className="text-white font-bold text-[9px] mt-0.5 block">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
