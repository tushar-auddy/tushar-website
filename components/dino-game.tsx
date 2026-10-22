'use client';
import { useEffect, useRef } from 'react';
import { assetPath } from '@/lib/site';

// Pixel sprites: '#' is a filled cell. Drawn at CELL logical px per cell.
const CELL = 2;
const BIRD_UP = [
  '      ##        ',
  '      ###       ',
  '      ####      ',
  '  #   #####     ',
  ' ###  ######    ',
  '################',
  '   ##########   ',
  '      #####     ',
];
const BIRD_DOWN = [
  '  #             ',
  ' ###            ',
  '################',
  '   ##########   ',
  '      ######    ',
  '      #####     ',
  '      ####      ',
  '      ###       ',
];
const CLOUD = [
  '      ######      ',
  '    ##      ##    ',
  ' ###          ### ',
  '#                #',
  '##################',
];

const HEIGHT = 190;
const MIN_WIDTH = 470;
const GROUND = 158;
// Tushar's pixel character, drawn at the original dino's height.
const RUNNER_SRC = '/images/tushar-runner.png';
const RUNNER_X = 40;
const RUNNER_H = 38;
const RUNNER_W = Math.round(RUNNER_H * 179 / 240);
// The sprite is split at the shirt hem so the legs can be animated on their own.
const HIP = 0.7;
const HIP_X = 0.525;
// Running cycle: stride, legs passing, mirrored stride, legs passing.
const LEG_FRAMES = [1, 0.45, -1, -0.45];
const TEAR = '#6fb6ff';
const GRAVITY = 2100;
const JUMP_VELOCITY = -640;
const START_SPEED = 380;
const MAX_SPEED = 920;
const HI_KEY = 'ta-dino-hi';

const COLORS = { ink: '#243761', soft: '#9aa6c4', cloud: '#d3dbec', text: '#737c8e' };

type Box = { x: number; y: number; w: number; h: number };
type Obstacle = { kind: 'cactus' | 'bird'; x: number; y: number; w: number; h: number; parts: { dx: number; w: number; h: number }[] };
type State = 'idle' | 'running' | 'over';

function drawSprite(ctx: CanvasRenderingContext2D, map: string[], x: number, y: number, cell = CELL) {
  // Fill each row as solid runs, overlapping slightly so no seams show at fractional scales.
  for (let r = 0; r < map.length; r++) {
    const row = map[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== '#') continue;
      const start = c;
      while (row[c + 1] === '#') c++;
      ctx.fillRect(x + start * cell, y + r * cell, (c - start + 1) * cell + 0.3, cell + 0.3);
    }
  }
}

function drawCactus(ctx: CanvasRenderingContext2D, x: number, w: number, h: number) {
  const trunk = Math.max(6, Math.round(w * 0.4));
  const tx = x + (w - trunk) / 2;
  ctx.fillRect(tx, GROUND - h, trunk, h);
  const armW = Math.max(3, Math.round(trunk * 0.55));
  const leftY = GROUND - h * 0.72;
  const rightY = GROUND - h * 0.82;
  ctx.fillRect(x, leftY, armW, h * 0.32);
  ctx.fillRect(x, leftY + h * 0.26, tx - x, armW);
  ctx.fillRect(x + w - armW, rightY, armW, h * 0.3);
  ctx.fillRect(tx + trunk, rightY + h * 0.24, x + w - tx - trunk, armW);
}

function overlaps(a: Box, b: Box) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function readHi() {
  try { return Number(localStorage.getItem(HI_KEY)) || 0; } catch { return 0; }
}
function writeHi(value: number) {
  try { localStorage.setItem(HI_KEY, String(value)); } catch { /* storage unavailable */ }
}

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let width = 600;
    let sky = 0;
    let state: State = 'idle';
    let y = GROUND - RUNNER_H;
    let vy = 0;
    let fastFall = false;
    let speed = START_SPEED;
    let distance = 0;
    let hi = readHi();
    let obstacles: Obstacle[] = [];
    let nextGap = 420;
    let clouds = [{ x: 180, y: 38 }, { x: 430, y: 62 }, { x: 640, y: 30 }];
    let groundOffset = 0;
    let legTimer = 0;
    let birdTimer = 0;
    let overAt = 0;
    let tears: { x: number; y: number; vx: number; vy: number }[] = [];
    let tearTimer = 0;
    let puddle = 0;
    let flashUntil = 0;
    let lastMilestone = 0;
    let raf = 0;
    let last = performance.now();
    const font = getComputedStyle(document.body).fontFamily;
    const runner = new Image();
    runner.src = assetPath(RUNNER_SRC);
    runner.onload = () => draw();
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      // Fill the height, but never show less than MIN_WIDTH of track; spare height becomes sky.
      const scale = Math.min(rect.height / HEIGHT, rect.width / MIN_WIDTH);
      width = rect.width / scale;
      sky = rect.height / scale - HEIGHT;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, dpr * scale * sky);
      ctx.imageSmoothingEnabled = false;
      draw();
    };

    const score = () => Math.floor(distance / 40);
    const onGround = () => y >= GROUND - RUNNER_H - 0.5;

    const reset = () => {
      state = 'running';
      y = GROUND - RUNNER_H;
      vy = 0;
      speed = START_SPEED;
      distance = 0;
      obstacles = [];
      nextGap = 360;
      lastMilestone = 0;
      flashUntil = 0;
    };

    const press = () => {
      if (state === 'idle') { reset(); vy = JUMP_VELOCITY; return; }
      if (state === 'over') { if (performance.now() - overAt > 450) reset(); return; }
      if (onGround()) vy = JUMP_VELOCITY;
    };
    // Releasing early cuts the jump short, like the original.
    const release = () => { if (state === 'running' && vy < -320) vy = -320; };

    const spawn = () => {
      const s = score();
      const canBird = s > 250 && Math.random() < 0.28;
      if (canBird) {
        const high = Math.random() < 0.45;
        const h = BIRD_UP.length * CELL;
        obstacles.push({ kind: 'bird', x: width + 10, y: high ? GROUND - RUNNER_H - h - 14 : GROUND - h - 18, w: 16 * CELL, h, parts: [] });
      } else {
        const count = Math.random() < 0.65 ? 1 : Math.random() < 0.7 ? 2 : 3;
        const large = Math.random() < 0.4;
        const w = large ? 24 : 16;
        const h = large ? 48 : 34;
        const parts = Array.from({ length: count }, (_, i) => ({ dx: i * (w - 2), w, h: h - (i % 2) * 6 }));
        obstacles.push({ kind: 'cactus', x: width + 10, y: GROUND - h, w: count * (w - 2) + 2, h, parts });
      }
      const minGap = 220 + speed * 0.55;
      nextGap = minGap + Math.random() * 260;
    };

    // Head, then body and legs; slightly inside the drawn outline so near misses feel fair.
    const runnerBoxes = (): Box[] => [
      { x: RUNNER_X + 9, y: y + 2, w: 15, h: 15 },
      { x: RUNNER_X + 4, y: y + 17, w: RUNNER_W - 8, h: RUNNER_H - 19 },
    ];
    const obstacleBoxes = (o: Obstacle): Box[] =>
      o.kind === 'bird'
        ? [{ x: o.x + 4, y: o.y + 4, w: o.w - 8, h: o.h - 8 }]
        : o.parts.map(p => ({ x: o.x + p.dx + 3, y: GROUND - p.h + 3, w: p.w - 6, h: p.h - 3 }));

    // Eye position on the sprite, in game units.
    const eye = () => ({ x: RUNNER_X + RUNNER_W * 0.78, y: y + RUNNER_H * 0.3 });
    const sob = () => (state === 'over' ? Math.sin((performance.now() - overAt) / 55) * 0.7 : 0);

    // A point along the tear's path from under the glasses down the cheek, t from 0 to 1.
    const cheek = (t: number) => {
      const e = eye();
      const s = sob();
      const a = { x: e.x - 1, y: e.y + 2.5 + s }, c = { x: e.x + 1.4, y: e.y + 5 + s }, b = { x: e.x + 0.6, y: e.y + 8 + s };
      const u = 1 - t;
      return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
    };

    const updateTears = (dt: number) => {
      tearTimer += dt;
      // A small drop falls from the chin every so often.
      while (tearTimer > 0.22) {
        tearTimer -= 0.22;
        const end = cheek(1);
        tears.push({ x: end.x, y: end.y, vx: 4 + Math.random() * 10, vy: 10 + Math.random() * 20 });
      }
      tears.forEach(t => { t.vy += 420 * dt; t.x += t.vx * dt; t.y += t.vy * dt; });
      tears = tears.filter(t => t.y < GROUND);
      puddle = Math.min(22, puddle + dt * 6);
    };

    const drawRunner = (top: number, legs: number) => {
      const iw = runner.naturalWidth, ih = runner.naturalHeight;
      const hipSrc = Math.round(ih * HIP);
      const hipDst = RUNNER_H * HIP;
      const hipX = RUNNER_X + RUNNER_W * HIP_X;
      // Legs first, flipped or squeezed around the hip, then the body on top to hide the join.
      ctx.save();
      ctx.translate(hipX, 0);
      ctx.scale(legs, 1);
      ctx.drawImage(runner, 0, hipSrc - 2, iw, ih - hipSrc + 2, -RUNNER_W * HIP_X, top + hipDst - 0.4, RUNNER_W, RUNNER_H - hipDst + 0.4);
      ctx.restore();
      ctx.drawImage(runner, 0, 0, iw, hipSrc, RUNNER_X, top, RUNNER_W, hipDst);
    };

    const drawTears = () => {
      ctx.fillStyle = TEAR;
      ctx.strokeStyle = TEAR;
      // Puddle at the feet.
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(RUNNER_X + RUNNER_W * 0.62, GROUND + 0.5, puddle, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // A faint wet trail down the cheek, with drops flowing along it one after another.
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 0.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const p = cheek(i / 10); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      const flow = (performance.now() - overAt) / 700;
      for (let k = 0; k < 3; k++) {
        const t = (flow + k / 3) % 1;
        const p = cheek(t);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.45 + t * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      tears.forEach(t => { ctx.beginPath(); ctx.arc(t.x, t.y, 0.6, 0, Math.PI * 2); ctx.fill(); });
      ctx.globalAlpha = 1;
    };

    const update = (dt: number) => {
      clouds = clouds.map(c => ({ ...c, x: c.x - (state === 'running' ? speed * 0.18 : 12) * dt }));
      clouds.forEach(c => { if (c.x < -50) { c.x = width + Math.random() * 120; c.y = 24 + Math.random() * 50; } });
      birdTimer += dt;
      if (state === 'over') updateTears(dt);
      if (state !== 'running') return;

      speed = Math.min(MAX_SPEED, speed + 7 * dt);
      distance += speed * dt;
      groundOffset = (groundOffset + speed * dt) % 1000;
      legTimer += dt;

      vy += GRAVITY * (fastFall && vy > -200 ? 3 : 1) * dt;
      y = Math.min(GROUND - RUNNER_H, y + vy * dt);
      if (onGround()) vy = 0;

      obstacles.forEach(o => { o.x -= speed * (o.kind === 'bird' ? 1.08 : 1) * dt; });
      obstacles = obstacles.filter(o => o.x + o.w > -20);
      const lastObstacle = obstacles[obstacles.length - 1];
      // A short run-up before the first obstacle.
      if (distance > 700 && (!lastObstacle || width - (lastObstacle.x + lastObstacle.w) > nextGap)) spawn();

      const s = score();
      if (s > 0 && s % 100 === 0 && s !== lastMilestone) { lastMilestone = s; flashUntil = performance.now() + 900; }

      const mine = runnerBoxes();
      if (obstacles.some(o => obstacleBoxes(o).some(b => mine.some(d => overlaps(d, b))))) {
        state = 'over';
        overAt = performance.now();
        tears = [];
        tearTimer = 0;
        puddle = 0;
        if (s > hi) { hi = s; writeHi(hi); }
      }
    };

    const draw = () => {
      ctx.clearRect(0, -sky, width, HEIGHT + sky);

      ctx.fillStyle = COLORS.cloud;
      clouds.forEach(c => drawSprite(ctx, CLOUD, c.x, c.y, 2));

      // Ground line with scrolling pebbles.
      ctx.fillStyle = COLORS.soft;
      ctx.fillRect(0, GROUND - 1, width, 1.5);
      for (let i = 0; i < width / 23 + 2; i++) {
        const x = ((i * 53 - groundOffset) % (width + 60) + width + 60) % (width + 60) - 30;
        ctx.fillRect(x, GROUND + 5 + (i % 3) * 4, 2 + (i % 4) * 2, 1.5);
      }

      ctx.fillStyle = COLORS.ink;
      obstacles.forEach(o => {
        if (o.kind === 'bird') drawSprite(ctx, Math.floor(birdTimer * 6) % 2 ? BIRD_UP : BIRD_DOWN, o.x, o.y);
        else o.parts.forEach(p => drawCactus(ctx, o.x + p.dx, p.w, p.h));
      });

      if (runner.complete && runner.naturalWidth) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (state === 'over') {
          // Standing with legs together, sobbing.
          drawRunner(y + sob(), 0.45);
        } else if (state === 'running' && onGround()) {
          const frame = Math.floor(legTimer * 14) % LEG_FRAMES.length;
          drawRunner(y - (frame % 2 ? 1 : 0), LEG_FRAMES[frame]);
        } else {
          // Mid-air (or waiting to start): legs in the stride pose.
          drawRunner(y, state === 'idle' ? 1 : 0.45);
        }
        ctx.restore();
        if (state === 'over') drawTears();
      }

      // Score, blinking briefly at every hundred.
      const s = String(score()).padStart(5, '0');
      const blinkOff = performance.now() < flashUntil && Math.floor(performance.now() / 150) % 2 === 0;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'right';
      ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      ctx.fillStyle = COLORS.text;
      ctx.fillText(`HI ${String(hi).padStart(5, '0')}`, width - 74, 14 - sky);
      if (!blinkOff) { ctx.fillStyle = COLORS.ink; ctx.fillText(s, width - 16, 14 - sky); }

      ctx.textAlign = 'center';
      if (state === 'idle') {
        ctx.fillStyle = COLORS.text;
        ctx.font = `500 14px ${font}`;
        ctx.fillText(touch ? 'Tap to start' : 'Press space or tap to start', width / 2, 70);
      } else if (state === 'over') {
        ctx.fillStyle = COLORS.ink;
        ctx.font = '600 18px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.fillText('G A M E   O V E R', width / 2, 52);
        // Restart icon.
        const cx = width / 2, cy = 102;
        ctx.strokeStyle = COLORS.ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 11, -Math.PI * 0.35, Math.PI * 1.45);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 4, cy - 16);
        ctx.lineTo(cx + 13, cy - 10);
        ctx.lineTo(cx + 4, cy - 4);
        ctx.fill();
      }
    };

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const ignoreTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement && target !== canvas && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName));
    const onKeyDown = (e: KeyboardEvent) => {
      if (ignoreTarget(e.target)) return;
      if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); if (!e.repeat) press(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); fastFall = true; }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') release();
      else if (e.key === 'ArrowDown') fastFall = false;
    };
    const onPointerDown = (e: PointerEvent) => { e.preventDefault(); press(); };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', release);
    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', release);
    };
  }, []);

  return <canvas ref={canvasRef} className="dino-canvas" tabIndex={0} role="img" aria-label="Runner game: help Tushar jump over cacti and birds with space, the up arrow or a tap"/>;
}
