import React, { useEffect, useRef } from 'react';
import { drawPixelAsteroid, drawPixelRocket, PALETTE } from '../../utils/pixelSprites';

interface PixelSpaceCanvasProps {
  scrollProgress: number; // 0 to 1
}

interface PixelStar {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

interface PixelAsteroidEntity {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  rotSpeed: number;
}

interface Spark {
  x: number;
  y: number;
  life: number;
  color: string;
}

export const PixelSpaceCanvas: React.FC<PixelSpaceCanvasProps> = ({ scrollProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Initialize 8-bit Pixel Stars
    const starCount = 90;
    const starColors = [PALETTE.white, PALETTE.cyan, PALETTE.yellow, PALETTE.magenta];
    const stars: PixelStar[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        size: Math.random() > 0.8 ? 3 : 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        speed: Math.random() * 0.4 + 0.1,
      });
    }

    // Initialize Tumbling Pixel Asteroids
    const asteroids: PixelAsteroidEntity[] = [];
    for (let i = 0; i < 6; i++) {
      asteroids.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.floor(Math.random() * 2) + 2, // scale 2 or 3
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() * 0.4 + 0.2) * (i % 2 === 0 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const sparks: Spark[] = [];
    let animationId: number;
    let flameFrame = 1;
    let frameCounter = 0;

    const render = () => {
      animationId = requestAnimationFrame(render);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Force pixelated rendering
      ctx.imageSmoothingEnabled = false;

      // Pitch Black Arcade Canvas
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Frame cycle for stepped flame animation (every 8 frames)
      frameCounter++;
      if (frameCounter % 8 === 0) {
        flameFrame = (flameFrame % 3) + 1;
      }

      // 1. Draw 8-Bit Pixel Stars
      for (const s of stars) {
        s.y += s.speed + scrollRef.current * 0.8;
        if (s.y > height) {
          s.y = 0;
          s.x = Math.floor(Math.random() * width);
        }
        ctx.fillStyle = s.color;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }

      // 2. Draw Tumbling Pixel Asteroids (scaled 8-bit sprites)
      for (const ast of asteroids) {
        ast.x += ast.speedX;
        ast.y += ast.speedY + scrollRef.current * 0.5;
        ast.angle += ast.rotSpeed;

        if (ast.x < -40) ast.x = width + 40;
        if (ast.x > width + 40) ast.x = -40;
        if (ast.y < -40) ast.y = height + 40;
        if (ast.y > height + 40) ast.y = -40;

        drawPixelAsteroid(ctx, Math.floor(ast.x), Math.floor(ast.y), ast.size, ast.angle);
      }

      // 3. Draw Ascending Rocket Sprite linked to scroll!
      // Rocket sits on the right or center depending on viewport
      const rocketX = width > 768 ? width * 0.88 : width * 0.5;
      // Climbs up the screen as user scrolls (bounded from 85% to 15% height)
      const rocketY = height * 0.85 - scrollRef.current * (height * 0.65);

      // Spawn thruster sparks
      if (Math.random() < 0.7) {
        sparks.push({
          x: rocketX + (Math.random() - 0.5) * 8,
          y: rocketY + 36,
          life: 16,
          color: Math.random() > 0.5 ? PALETTE.yellow : PALETTE.orange,
        });
      }

      // Render sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.y += 2.5;
        sp.life--;
        ctx.fillStyle = sp.color;
        ctx.fillRect(Math.floor(sp.x), Math.floor(sp.y), 3, 3);
        if (sp.life <= 0) sparks.splice(i, 1);
      }

      // Render Rocket Sprite (scale 3 for desktop, 2.5 for mobile)
      const rocketScale = width > 768 ? 3 : 2.5;
      drawPixelRocket(ctx, Math.floor(rocketX), Math.floor(rocketY), rocketScale, flameFrame, 0);

      // Rocket altitude text tag next to ship
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillStyle = PALETTE.yellow;
      ctx.fillText(
        `${Math.round(scrollRef.current * 100000)}m`,
        Math.floor(rocketX) - 30,
        Math.floor(rocketY) - 35
      );
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] pixelated"
    />
  );
};
