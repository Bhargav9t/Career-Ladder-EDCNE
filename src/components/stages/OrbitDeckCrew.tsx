import React from 'react';
import { CREW_ROSTER } from '../../data/rocketryData';

export const OrbitDeckCrew: React.FC = () => {
  const facultyAdvisor =
    CREW_ROSTER.find((c) => c.status === 'FACULTY ADVISOR') || CREW_ROSTER[0];
  const activeCrew = CREW_ROSTER.filter((c) => c.id !== facultyAdvisor.id);

  return (
    <section
      id="crew"
      className="relative min-h-screen flex flex-col justify-center px-4 py-24 border-t-4 border-[#ff007f]/30 select-none"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Stage 7 Arcade Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-white/20">
          <div>
            <div className="font-pixel text-[10px] text-[#ff007f] mb-2 tracking-widest">
              ★ STAGE 07 // ORBIT DECK & STATION DOCK (100,000m+) ★
            </div>
            <h2 className="font-pixel text-xl sm:text-3xl text-white tracking-wide">
              FLIGHT CREW & ADVISORY
            </h2>
          </div>
          <div className="font-pixel text-[9px] text-[#00f0ff] bg-black border-2 border-[#00f0ff] px-3 py-1.5 self-start sm:self-auto">
            STATION STATUS: DOCKED // LEO
          </div>
        </div>

        {/* Motilal Sir Feature Card (Arcade Mentor Box) */}
        <div className="arcade-box-magenta p-6 sm:p-8 mb-10 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Pixel Mentor Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-black border-4 border-[#ff007f] p-2 flex flex-col items-center justify-center text-center shrink-0">
              <span className="text-3xl mb-1">👨‍🏫</span>
              <span className="font-pixel text-[10px] text-white">
                {facultyAdvisor.avatarInitials}
              </span>
              <span className="font-pixel text-[7px] text-[#ffe600] mt-1">
                FACULTY
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-2 py-0.5 bg-black border border-[#ffe600] font-pixel text-[8px] text-[#ffe600]">
                  {facultyAdvisor.callsign}
                </span>
                <span className="font-pixel text-[8px] text-white/50">
                  // {facultyAdvisor.subsystem}
                </span>
                <span className="font-pixel text-[8px] text-[#00ff66] ml-auto">
                  ● FLIGHT DIRECTOR
                </span>
              </div>

              <h3 className="font-pixel text-lg sm:text-2xl text-white mb-2">
                {facultyAdvisor.name}
              </h3>
              <div className="font-pixel text-[9px] text-[#00f0ff] mb-4">
                {facultyAdvisor.role}
              </div>

              <p className="font-mono-tech text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {facultyAdvisor.bio}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-[#ff007f] font-pixel text-[8px]">
                <div className="bg-black p-2 border border-white/10">
                  <span className="text-white/50 block">ROLE</span>
                  <span className="text-white">FACULTY ADVISOR</span>
                </div>
                <div className="bg-black p-2 border border-white/10">
                  <span className="text-white/50 block">ORGANIZATION</span>
                  <span className="text-white">HITAM AEROSPACE</span>
                </div>
                <div className="bg-black p-2 border border-white/10">
                  <span className="text-white/50 block">TENURE</span>
                  <span className="text-[#ffe600]">SINCE {facultyAdvisor.since}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flat Roster Table */}
        <div className="arcade-box p-6">
          <div className="flex items-center justify-between pb-3 border-b-2 border-white/20 mb-4 font-pixel text-[9px]">
            <span className="text-[#00f0ff]">CREW MANIFEST // ACTIVE LEADERSHIP</span>
            <span className="text-white/50">ORBIT ROSTER</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-pixel text-[9px] border-collapse">
              <thead>
                <tr className="border-b-2 border-white/10 text-white/50 uppercase">
                  <th className="py-2.5 px-3">CALLSIGN</th>
                  <th className="py-2.5 px-3">OFFICER</th>
                  <th className="py-2.5 px-3">ROLE</th>
                  <th className="py-2.5 px-3">SUBSYSTEM</th>
                  <th className="py-2.5 px-3">SINCE</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeCrew.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-[#ffe600] font-bold">
                      {m.callsign}
                    </td>
                    <td className="py-3 px-3 text-white">
                      <div>{m.name}</div>
                      <div className="font-mono-tech text-[10px] text-slate-400 mt-0.5">
                        {m.bio}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#00f0ff]">{m.role}</td>
                    <td className="py-3 px-3 text-slate-300">{m.subsystem}</td>
                    <td className="py-3 px-3 text-white/50">{m.since}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[#00ff66] bg-black px-2 py-0.5 border border-[#00ff66]/40 text-[8px]">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
