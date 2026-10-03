// Pixel Art Sprite Matrix Generator
// Draws crisp 16x16 and 16x24 pixel art sprites directly onto 2D Canvas without antialiasing

export const PALETTE = {
  black: '#000000',
  white: '#ffffff',
  greyLight: '#c0c0c0',
  greyDark: '#606060',
  cyan: '#00f0ff',
  magenta: '#ff007f',
  yellow: '#ffe600',
  orange: '#ff6600',
  red: '#ff3333',
  green: '#00ff66',
};

// 16x24 Pixel Art Rocket Matrix: 1 = White hull, 2 = Red accents, 3 = Yellow canopy, 4 = Dark grey shadow, 5 = Cyan trim, 6 = Flame Orange, 7 = Flame Yellow
const ROCKET_MATRIX: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 3, 3, 1, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 3, 3, 3, 3, 1, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 3, 3, 1, 1, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 5, 1, 1, 1, 1, 5, 4, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 5, 1, 1, 1, 1, 5, 4, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0],
  [0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 4, 0],
  [1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 4],
  [2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 2],
  [2, 2, 0, 0, 1, 1, 4, 4, 4, 4, 1, 1, 0, 0, 2, 2],
  [2, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2],
];

// Flame frames (stepped sprite animation)
const FLAME_FRAME_1: number[][] = [
  [0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0],
];

const FLAME_FRAME_2: number[][] = [
  [0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 6, 7, 7, 6, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0],
];

const FLAME_FRAME_3: number[][] = [
  [0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 6, 7, 7, 7, 7, 6, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 6, 7, 7, 6, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0],
];

const COLOR_MAP: { [key: number]: string } = {
  1: PALETTE.white,
  2: PALETTE.red,
  3: PALETTE.cyan,
  4: PALETTE.greyDark,
  5: PALETTE.yellow,
  6: PALETTE.orange,
  7: PALETTE.yellow,
};

export const drawPixelRocket = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize = 3,
  flameCycle = 1,
  angle = 0
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const width = ROCKET_MATRIX[0].length * pixelSize;
  const height = ROCKET_MATRIX.length * pixelSize;
  const startX = -width / 2;
  const startY = -height / 2;

  // Draw Hull
  for (let r = 0; r < ROCKET_MATRIX.length; r++) {
    for (let c = 0; c < ROCKET_MATRIX[r].length; c++) {
      const val = ROCKET_MATRIX[r][c];
      if (val !== 0) {
        ctx.fillStyle = COLOR_MAP[val];
        ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  // Draw Stepped Flame Frame
  let flameMatrix: number[][] = [];
  if (flameCycle === 1) flameMatrix = FLAME_FRAME_1;
  else if (flameCycle === 2) flameMatrix = FLAME_FRAME_2;
  else if (flameCycle === 3) flameMatrix = FLAME_FRAME_3;

  for (let r = 0; r < flameMatrix.length; r++) {
    for (let c = 0; c < flameMatrix[r].length; c++) {
      const val = flameMatrix[r][c];
      if (val !== 0) {
        ctx.fillStyle = COLOR_MAP[val];
        ctx.fillRect(
          startX + c * pixelSize,
          startY + (ROCKET_MATRIX.length + r) * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }

  ctx.restore();
};

// 12x12 Pixel Asteroid Matrix
const ASTEROID_1: number[][] = [
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 3, 3, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 0, 0],
  [1, 1, 2, 2, 1, 3, 3, 1, 1, 1, 1, 0],
  [1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1],
  [1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
];

// 1 = Light Grey/Cyan rock, 2 = Dark Crater Grey, 3 = White Highlight
const ASTEROID_COLOR_MAP: { [key: number]: string } = {
  1: '#8899aa',
  2: '#334455',
  3: '#ccddee',
};

export const drawPixelAsteroid = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize = 3,
  rotation = 0
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const w = ASTEROID_1[0].length * pixelSize;
  const h = ASTEROID_1.length * pixelSize;
  const startX = -w / 2;
  const startY = -h / 2;

  for (let r = 0; r < ASTEROID_1.length; r++) {
    for (let c = 0; c < ASTEROID_1[r].length; c++) {
      const val = ASTEROID_1[r][c];
      if (val !== 0) {
        ctx.fillStyle = ASTEROID_COLOR_MAP[val];
        ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  ctx.restore();
};
