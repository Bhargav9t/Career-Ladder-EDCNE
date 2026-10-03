import React from 'react';

interface CRTOverlayProps {
  enabled: boolean;
}

export const CRTOverlay: React.FC<CRTOverlayProps> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden select-none">
      {/* Repeating fine scanlines */}
      <div className="absolute inset-0 crt-scanlines opacity-40 mix-blend-screen" />
      
      {/* Vignette curvature at edges */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Subtle phosphor glow corner indicators */}
      <div className="absolute top-2 left-2 text-[9px] font-mono-tech text-emerald-500/30 uppercase tracking-widest">
        REC: [LIVE] // FRAME: 60FPS
      </div>
      <div className="absolute top-2 right-2 text-[9px] font-mono-tech text-emerald-500/30 uppercase tracking-widest">
        CRT: PHOSPHOR_EMUL_P22
      </div>
    </div>
  );
};
