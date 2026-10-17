import { useEffect, useRef } from "react";

// Click anywhere and a wave rolls out through a hidden grid of characters,
// after the background in the Claude desktop app: the wavefront reveals the
// characters, strongest at its leading edge, fading behind. Where Claude draws
// a heart every third click, this draws ॐ every second one: the symbol grows
// out from the click with a fading trail, in the same characters. Nothing draws, and the
// loop stops, once every wave has faded, so an idle page costs nothing.
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FONT_PX = 10;
const CELL_W = 7;       // px per column
const CELL_H = 12;      // px per row
const SPEED = 520;      // px per second the front travels
const TAIL = 170;       // px the reveal trails behind the front
const LIFE = 2.4;       // seconds before a wave has fully faded
const OM_EVERY = 2;
const OM_SIZE = 200;    // px the symbol is drawn at in its stencil
const OM_TRAIL = [[1, 1], [0.93, 0.55], [0.86, 0.3], [0.79, 0.15]]; // [scale, strength]

// One colour per theme, measured from screen recordings of the Claude app: a
// steel blue on dark, a slate blue-grey on light. Only the alpha varies.
const THEME = {
  dark: { rgb: "118,152,173", max: 0.85 },
  light: { rgb: "78,86,112", max: 0.68 },
};

// ॐ, the public-domain outline from Wikimedia Commons (File:Om_symbol.svg),
// in its 356×367 box. Used instead of a font, whose ॐ varies by device and
// rarely matches the classic shape.
const OM_PATH = "M 90.5,353.9 C 51.8,340.1 23.7,305.8 12.6,258.6 C 7.6,237.2 6.1,201.9 10.3,201.9 C 11.7,201.9 15.4,211.6 18.6,223.4 C 25.5,249.4 37.2,273.8 48.5,285.7 C 67.4,305.5 114,313.3 140.9,301.1 C 161.9,291.5 170.4,268.9 161.2,247 C 154.2,230 138.2,224.3 108.5,228.2 C 108.5,228.2 90.3,208.6 84.5,173.7 L 103.2,175.4 C 125.7,177.5 142.6,172.5 151.5,161.3 C 159.7,150.8 159.6,146.7 150.3,136 C 137,120.5 113.2,124.4 64.8,150 L 40.4,109.1 L 50.6,101.3 C 76.3,81.7 120.8,71.9 146.1,80.3 C 169.2,87.9 186.1,118.1 181.6,143.6 C 178.5,160.9 164.7,185 154.1,191.8 L 144.8,197.6 L 157.6,203.3 C 179.2,213.1 192.4,205.6 208.1,174.8 C 229.9,132.1 244.1,121 277,121 C 292.3,121 297.7,122.6 308.9,130.4 C 336.8,149.9 352,190.4 348.6,236.3 C 344.4,294.4 316.9,329.6 275.7,329.6 C 253.2,329.6 238.6,321.7 227,303.1 C 216.8,286.8 212.2,254.4 218.1,240.2 C 220.9,233.4 221.4,233.1 221.6,238.6 C 221.9,248.6 233.3,265 243.8,270.4 C 269.6,283.7 306.5,267 321.1,235.4 C 332.2,211.4 326.3,165.2 311,157.1 C 307.8,155.4 300,154 293.5,154 C 279.8,154 269.1,163.8 254,190.1 C 248.8,199.2 240.1,211 234.6,216.2 C 225.6,224.8 222.4,225.8 204.5,225.8 L 184.5,225.8 L 191,240.2 C 200.2,260.8 199.8,294.2 190,314.5 C 181.4,332.5 161.3,350.7 145.3,355.2 C 129.8,359.5 104.4,358.9 90.5,353.9 z M 165.8,75.9 C 157,60.8 151.5,32.6 157.5,32.6 C 164.4,47.7 178.7,61.2 194,70.6 C 221.5,83.9 249.4,78.6 279.8,54.1 C 286.5,48.7 292.5,44.9 293,45.6 C 300.5,57.2 313.3,66.6 317.6,80 C 317.6,85.7 293.2,102 274,109.2 C 226.4,122.9 194,117.4 165.8,75.9 z M 189.8,41 L 220.8,6.6 L 255.3,38.5 C 243.5,48.2 235,63.3 221.5,70.9 C 210.9,63.1 195,53.8 189.8,41 z";

// ॐ drawn once in white, centred, and read back so each character cell can
// ask how much of the symbol covers it.
function drawOm() {
  const size = Math.round(OM_SIZE * 1.4);
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d", { willReadFrequently: true });
  const k = OM_SIZE / 367;
  g.translate(size / 2 - (356 * k) / 2, size / 2 - (367 * k) / 2);
  g.scale(k, k);
  g.fillStyle = "#fff";
  g.fill(new Path2D(OM_PATH));
  return g.getImageData(0, 0, size, size);
}

export default function Ripples() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let om = null; // drawn on first use
    let cols, rows, grid, raf = 0, clicks = 0;
    let waves = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      cols = Math.ceil(window.innerWidth / CELL_W);
      rows = Math.ceil(window.innerHeight / CELL_H);
      grid = Array.from({ length: cols * rows }, () => CHARS[(Math.random() * CHARS.length) | 0]);
      waves = [];
    };

    // How much of ॐ, grown to `scale` around the click, covers a point.
    const omAt = (dx, dy, scale) => {
      const px = Math.round(dx / scale + om.width / 2), py = Math.round(dy / scale + om.height / 2);
      if (px < 0 || py < 0 || px >= om.width || py >= om.height) return 0;
      return om.data[(py * om.width + px) * 4 + 3] / 255;
    };

    const frame = (now) => {
      const t = now / 1000;
      waves = waves.filter((w) => t - w.t0 < LIFE);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (!waves.length) { raf = 0; return; }

      const { rgb, max } = THEME[document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"];
      ctx.font = `${FONT_PX}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * CELL_W, y = row * CELL_H;
          let alpha = 0, front = 0;
          for (const w of waves) {
            const age = t - w.t0;
            const fade = 1 - age / LIFE;
            const dx = x - w.x, dy = y - w.y;
            const r = age * SPEED;

            if (w.om) {
              // The symbol grows with the wave, slower than the ripple so it
              // stays readable; a few smaller copies behind it make the trail.
              const scale = r / OM_SIZE;
              if (Math.abs(dx) > (scale * om.width) / 2 || Math.abs(dy) > (scale * om.height) / 2) continue;
              for (const [s, strength] of OM_TRAIL) {
                const v = omAt(dx, dy, scale * s);
                if (!v) continue;
                alpha += v * strength * fade * max;
                if (s === 1) front = Math.max(front, fade);
              }
              continue;
            }

            const behind = r - Math.hypot(dx, dy);
            if (behind < -6 || behind > TAIL) continue;
            const v = behind < 0 ? 1 + behind / 6 : 1 - behind / TAIL;
            alpha += v * v * fade * max;
            front = Math.max(front, behind < 24 ? fade * (1 - Math.max(0, behind) / 24) : 0);
          }
          if (alpha < 0.03) continue;
          const i = row * cols + col;
          // The front reshuffles what it passes over, so the text shimmers.
          if (front > 0.6 && Math.random() < 0.15) grid[i] = CHARS[(Math.random() * CHARS.length) | 0];
          ctx.fillStyle = `rgba(${rgb},${Math.min(alpha, max)})`;
          ctx.fillText(grid[i], x, y);
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const onDown = (e) => {
      clicks++;
      const isOm = clicks % OM_EVERY === 0;
      if (isOm) om ??= drawOm();
      waves.push({ x: e.clientX, y: e.clientY, t0: performance.now() / 1000, om: isOm });
      if (!raf) raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
