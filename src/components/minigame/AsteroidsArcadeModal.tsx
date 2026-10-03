import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, RotateCcw, Trophy, Crosshair, ArrowUp, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface AsteroidsArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimBadge?: (score: number) => void;
}

interface Ship {
  x: number;
  y: number;
  r: number; // radius
  a: number; // angle in radians
  rot: number; // rotation speed
  thrust: boolean;
  xv: number; // velocity x
  yv: number; // velocity y
}

interface Laser {
  x: number;
  y: number;
  xv: number;
  yv: number;
  life: number;
}

interface Asteroid {
  x: number;
  y: number;
  xv: number;
  yv: number;
  r: number;
  a: number;
  rot: number;
  vert: number;
  offsets: number[];
  tier: number; // 3: big, 2: medium, 1: small
}

interface Particle {
  x: number;
  y: number;
  xv: number;
  yv: number;
  life: number;
  color: string;
}

export const AsteroidsArcadeModal: React.FC<AsteroidsArcadeModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1280);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [missionQualified, setMissionQualified] = useState(false);

  // Ship and Game State Refs for smooth 60fps loop
  const gameState = useRef<{
    ship: Ship;
    lasers: Laser[];
    asteroids: Asteroid[];
    particles: Particle[];
    keys: { [key: string]: boolean };
    score: number;
    lives: number;
    wave: number;
    gameOver: boolean;
  }>({
    ship: { x: 300, y: 300, r: 12, a: -Math.PI / 2, rot: 0, thrust: false, xv: 0, yv: 0 },
    lasers: [],
    asteroids: [],
    particles: [],
    keys: {},
    score: 0,
    lives: 3,
    wave: 1,
    gameOver: false,
  });

  const initAsteroids = useCallback((waveNum: number, width: number, height: number) => {
    const asts: Asteroid[] = [];
    const count = 3 + waveNum * 2;
    for (let i = 0; i < count; i++) {
      let x: number, y: number;
      // Spawn away from ship center
      do {
        x = Math.random() * width;
        y = Math.random() * height;
      } while (Math.hypot(x - width / 2, y - height / 2) < 140);

      const r = 36;
      const vert = Math.floor(Math.random() * 4) + 8;
      const offsets: number[] = [];
      for (let j = 0; j < vert; j++) {
        offsets.push(Math.random() * 0.4 + 0.8);
      }

      asts.push({
        x,
        y,
        xv: (Math.random() - 0.5) * (1.2 + waveNum * 0.3),
        yv: (Math.random() - 0.5) * (1.2 + waveNum * 0.3),
        r,
        a: Math.random() * Math.PI * 2,
        rot: (Math.random() - 0.5) * 0.03,
        vert,
        offsets,
        tier: 3,
      });
    }
    return asts;
  }, []);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 700;
    const h = canvas ? canvas.height : 500;

    gameState.current = {
      ship: { x: w / 2, y: h / 2, r: 12, a: -Math.PI / 2, rot: 0, thrust: false, xv: 0, yv: 0 },
      lasers: [],
      asteroids: initAsteroids(1, w, h),
      particles: [],
      keys: {},
      score: 0,
      lives: 3,
      wave: 1,
      gameOver: false,
    };
    setScore(0);
    setLives(3);
    setWave(1);
    setGameOver(false);
    setMissionQualified(false);
  }, [initAsteroids]);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution
    const rect = canvas.parentElement?.getBoundingClientRect();
    const w = Math.min(rect?.width || 760, 760);
    const h = Math.min(rect?.height || 520, 520);
    canvas.width = w;
    canvas.height = h;

    resetGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.current.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        fireLaser();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.current.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;

    const fireLaser = () => {
      const gs = gameState.current;
      if (gs.gameOver || gs.lasers.length >= 6) return;
      soundFx.playPew();

      const laserSpeed = 8.5;
      gs.lasers.push({
        x: gs.ship.x + (4 / 3) * gs.ship.r * Math.cos(gs.ship.a),
        y: gs.ship.y + (4 / 3) * gs.ship.r * Math.sin(gs.ship.a),
        xv: laserSpeed * Math.cos(gs.ship.a) + gs.ship.xv * 0.5,
        yv: laserSpeed * Math.sin(gs.ship.a) + gs.ship.yv * 0.5,
        life: 55,
      });
    };

    const spawnParticles = (x: number, y: number, color = '#f59e0b', count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 3 + 1;
        gameState.current.particles.push({
          x,
          y,
          xv: Math.cos(angle) * spd,
          yv: Math.sin(angle) * spd,
          life: Math.floor(Math.random() * 20) + 15,
          color,
        });
      }
    };

    const render = () => {
      animationId = requestAnimationFrame(render);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const gs = gameState.current;
      const ship = gs.ship;

      // Handle Key Controls
      if (!gs.gameOver) {
        if (gs.keys['ArrowLeft'] || gs.keys['KeyA']) {
          ship.a -= 0.08;
        }
        if (gs.keys['ArrowRight'] || gs.keys['KeyD']) {
          ship.a += 0.08;
        }
        if (gs.keys['ArrowUp'] || gs.keys['KeyW']) {
          ship.thrust = true;
          const thrustPower = 0.16;
          ship.xv += Math.cos(ship.a) * thrustPower;
          ship.yv += Math.sin(ship.a) * thrustPower;

          // Thruster plume particles
          if (Math.random() < 0.6) {
            spawnParticles(
              ship.x - ship.r * Math.cos(ship.a),
              ship.y - ship.r * Math.sin(ship.a),
              '#fb923c',
              2
            );
          }
        } else {
          ship.thrust = false;
        }
      }

      // Physics Friction
      ship.xv *= 0.985;
      ship.yv *= 0.985;
      ship.x += ship.xv;
      ship.y += ship.yv;

      // Screen wrap for ship
      if (ship.x < -ship.r) ship.x = w + ship.r;
      if (ship.x > w + ship.r) ship.x = -ship.r;
      if (ship.y < -ship.r) ship.y = h + ship.r;
      if (ship.y > h + ship.r) ship.y = -ship.r;

      // Clear Canvas (Retro CRT Dark Slate)
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, w, h);

      // CRT Grid overlay background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Update and Draw Lasers
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let i = gs.lasers.length - 1; i >= 0; i--) {
        const l = gs.lasers[i];
        l.x += l.xv;
        l.y += l.yv;
        l.life--;

        // Screen wrap
        if (l.x < 0) l.x = w;
        if (l.x > w) l.x = 0;
        if (l.y < 0) l.y = h;
        if (l.y > h) l.y = 0;

        ctx.beginPath();
        ctx.arc(l.x, l.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();

        // Laser - Asteroid Collision
        for (let j = gs.asteroids.length - 1; j >= 0; j--) {
          const ast = gs.asteroids[j];
          if (Math.hypot(l.x - ast.x, l.y - ast.y) < ast.r) {
            soundFx.playExplosion();
            spawnParticles(ast.x, ast.y, ast.tier === 3 ? '#e2e8f0' : '#f59e0b', 16);

            // Points
            const pts = ast.tier === 3 ? 20 : ast.tier === 2 ? 50 : 100;
            gs.score += pts;
            setScore(gs.score);
            if (gs.score >= 500 && !missionQualified) {
              setMissionQualified(true);
            }

            // Split asteroid
            if (ast.tier > 1) {
              const newTier = ast.tier - 1;
              const newR = ast.r * 0.58;
              for (let k = 0; k < 2; k++) {
                const vert = Math.floor(Math.random() * 3) + 7;
                const offsets: number[] = [];
                for (let o = 0; o < vert; o++) offsets.push(Math.random() * 0.4 + 0.8);

                gs.asteroids.push({
                  x: ast.x,
                  y: ast.y,
                  xv: (Math.random() - 0.5) * (2.2 + gs.wave * 0.4),
                  yv: (Math.random() - 0.5) * (2.2 + gs.wave * 0.4),
                  r: newR,
                  a: Math.random() * Math.PI * 2,
                  rot: (Math.random() - 0.5) * 0.05,
                  vert,
                  offsets,
                  tier: newTier,
                });
              }
            }

            gs.asteroids.splice(j, 1);
            gs.lasers.splice(i, 1);
            break;
          }
        }

        if (l.life <= 0) {
          gs.lasers.splice(i, 1);
        }
      }

      // Check Next Wave
      if (gs.asteroids.length === 0 && !gs.gameOver) {
        gs.wave += 1;
        setWave(gs.wave);
        soundFx.playSuccess();
        gs.asteroids = initAsteroids(gs.wave, w, h);
      }

      // Update and Draw Asteroids (CAD Vector Outlines)
      for (let i = 0; i < gs.asteroids.length; i++) {
        const ast = gs.asteroids[i];
        ast.x += ast.xv;
        ast.y += ast.yv;
        ast.a += ast.rot;

        if (ast.x < -ast.r) ast.x = w + ast.r;
        if (ast.x > w + ast.r) ast.x = -ast.r;
        if (ast.y < -ast.r) ast.y = h + ast.r;
        if (ast.y > h + ast.r) ast.y = -ast.r;

        ctx.strokeStyle = ast.tier === 3 ? '#94a3b8' : ast.tier === 2 ? '#cbd5e1' : '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let j = 0; j < ast.vert; j++) {
          const angle = ast.a + (j * Math.PI * 2) / ast.vert;
          const radius = ast.r * ast.offsets[j];
          const px = ast.x + radius * Math.cos(angle);
          const py = ast.y + radius * Math.sin(angle);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Ship collision with asteroid
        if (!gs.gameOver && Math.hypot(ship.x - ast.x, ship.y - ast.y) < ship.r + ast.r * 0.8) {
          soundFx.playExplosion();
          spawnParticles(ship.x, ship.y, '#ef4444', 30);
          gs.lives -= 1;
          setLives(gs.lives);

          if (gs.lives <= 0) {
            gs.gameOver = true;
            setGameOver(true);
            setHighScore((prev) => Math.max(prev, gs.score));
          } else {
            // Respawn ship center
            ship.x = w / 2;
            ship.y = h / 2;
            ship.xv = 0;
            ship.yv = 0;
            ship.a = -Math.PI / 2;
          }
        }
      }

      // Update & Draw Particles
      for (let i = gs.particles.length - 1; i >= 0; i--) {
        const p = gs.particles[i];
        p.x += p.xv;
        p.y += p.yv;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
        if (p.life <= 0) gs.particles.splice(i, 1);
      }

      // Draw Ship (Vector Apollo / Space Capsule Silhouette)
      if (!gs.gameOver) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.a);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Sleek sharp rocket needle
        ctx.moveTo(ship.r * 1.5, 0); // Nosecone
        ctx.lineTo(-ship.r, -ship.r * 0.8); // Port fin
        ctx.lineTo(-ship.r * 0.5, 0); // Engine nozzle base
        ctx.lineTo(-ship.r, ship.r * 0.8); // Starboard fin
        ctx.closePath();
        ctx.stroke();

        // Cockpit window accent
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ship.r * 0.3, 0, 2, 0, Math.PI * 2);
        ctx.stroke();

        // Thruster flame when thrusting
        if (ship.thrust) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-ship.r * 0.5, -ship.r * 0.35);
          ctx.lineTo(-ship.r * 1.8, 0);
          ctx.lineTo(-ship.r * 0.5, ship.r * 0.35);
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, resetGame, initAsteroids, missionQualified]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl liquid-glass-regular border border-amber-500/40 p-5 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Crosshair className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-mono-tech font-bold text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
                HRC SIMULATOR // VECTOR ARCADE
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  ASTRA FLIGHT ENGINE
                </span>
              </h3>
              <p className="text-[11px] font-mono-tech text-slate-400">
                Rotate: [A/D or ←/→] • Thrust: [W or ↑] • Fire Laser: [SPACE]
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Telemetry Readout Bar */}
        <div className="grid grid-cols-4 gap-2 mb-3 font-mono-tech text-xs bg-black/40 p-2.5 rounded-lg border border-white/5">
          <div>
            <div className="text-[10px] text-slate-400">MISSION SCORE</div>
            <div className="text-amber-400 font-bold text-base tabular-nums">{score}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">HIGH SCORE</div>
            <div className="text-slate-200 font-semibold text-base tabular-nums">{highScore}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">WAVE STAGE</div>
            <div className="text-cyan-400 font-semibold text-base tabular-nums">0{wave}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">HULL SHIELDS</div>
            <div className="text-emerald-400 font-bold text-base flex gap-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block w-3 h-3 rounded-sm ${
                    idx < lives ? 'bg-emerald-400' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center bg-[#080a0f]">
          <canvas ref={canvasRef} className="block w-full max-h-[460px] aspect-[4/3] touch-none" />

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
              <div className="text-red-500 font-mono-tech text-xs tracking-widest mb-1">
                SYSTEM CRITICAL // VEHICLE DISINTEGRATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-mono-tech font-bold text-white mb-2">
                MISSION TERMINATED
              </h2>
              <p className="text-slate-400 font-mono-tech text-xs mb-4">
                FINAL SCORE: <span className="text-amber-400 font-bold">{score}</span> • APOGEE WAVE: {wave}
              </p>
              <button
                onClick={() => {
                  soundFx.playSuccess();
                  resetGame();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-tech font-bold text-xs tracking-wider transition-all"
              >
                <RotateCcw className="w-4 h-4" /> RE-ENGAGE SIMULATION
              </button>
            </div>
          )}

          {/* Mission Qualified Banner (500+ points) */}
          {missionQualified && !gameOver && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full liquid-glass-regular border border-emerald-500/60 text-emerald-300 font-mono-tech text-xs flex items-center gap-2 shadow-lg">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>DOCKING VELOCITY ACHIEVED (CREW BADGE UNLOCKED)</span>
            </div>
          )}
        </div>

        {/* Mobile On-Screen Controls */}
        <div className="sm:hidden grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
          <button
            onPointerDown={() => {
              gameState.current.keys['ArrowLeft'] = true;
            }}
            onPointerUp={() => {
              gameState.current.keys['ArrowLeft'] = false;
            }}
            className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-200 active:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => {
              gameState.current.keys['ArrowRight'] = true;
            }}
            onPointerUp={() => {
              gameState.current.keys['ArrowRight'] = false;
            }}
            className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-200 active:bg-white/20"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => {
              gameState.current.keys['ArrowUp'] = true;
            }}
            onPointerUp={() => {
              gameState.current.keys['ArrowUp'] = false;
            }}
            className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center text-amber-300 active:bg-amber-500/30"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              const e = new KeyboardEvent('keydown', { code: 'Space' });
              window.dispatchEvent(e);
            }}
            className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-lg flex items-center justify-center text-cyan-300 active:bg-cyan-500/30"
          >
            <Zap className="w-5 h-5" />
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono-tech text-slate-500">
          <span>VECTOR RENDERING ENGINE v1.2</span>
          <span>HRC FLIGHT TRAINER DECK</span>
        </div>
      </div>
    </div>
  );
};
