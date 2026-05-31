import { useEffect, useRef } from "react";
import {
  Bodies, Body, Common, Composite, Engine, Events,
  Mouse, MouseConstraint, Query, Render, Runner, World,
} from "matter-js";

const INITIAL_COUNT = 20;
const CLICK_COUNT   = 6;

const stroke = (isLight) => (isLight ? "black" : "white");

const makeRender = (isLight) => ({
  fillStyle:   "transparent",
  strokeStyle: stroke(isLight),
  lineWidth:   2,
});

const randomShape = (isLight, x, y) => {
  const r = makeRender(isLight);
  switch (Math.floor(Common.random(0, 4))) {
    case 0: return Bodies.circle(x, y, Common.random(15, 25), { render: r });
    case 1: return Bodies.rectangle(x, y, Common.random(20, 35), Common.random(20, 35), { render: r });
    case 2: return Bodies.polygon(x, y, 3, Common.random(18, 28), { render: r });
    default: return Bodies.polygon(x, y, 6, Common.random(15, 22), { render: r });
  }
};

const clickShape = (isLight, cx, cy) => {
  const r   = makeRender(isLight);
  const a   = Common.random(-Math.PI * 0.9, -Math.PI * 0.1);
  const spd = Common.random(2, 5);
  let body;
  switch (Math.floor(Common.random(0, 4))) {
    case 0: body = Bodies.circle(cx, cy, 5, { render: r }); break;
    case 1: body = Bodies.rectangle(cx, cy, 8, 8, { render: r }); break;
    case 2: body = Bodies.polygon(cx, cy, 3, 6, { render: r }); break;
    default: body = Bodies.polygon(cx, cy, 6, 5, { render: r });
  }
  Body.setVelocity(body, { x: Math.cos(a) * spd, y: Math.sin(a) * spd });
  return { body, targetScale: Common.random(2.5, 4) };
};

const easeOutBack = (x) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

export default function ShapesCanvas({ theme }) {
  const containerRef = useRef(null);
  const engineRef    = useRef(null);
  const runnerRef    = useRef(null);
  const bodiesRef    = useRef([]);
  const animRef      = useRef([]);

  const isLightRef = useRef(theme === "light");
  isLightRef.current = theme === "light";

  // Update stroke colors on theme change without restarting the engine
  useEffect(() => {
    const isLight = theme === "light";
    bodiesRef.current.forEach((b) => {
      if (b.position.y >= 180) b.render.strokeStyle = stroke(isLight);
    });
  }, [theme]);

  // Physics engine — runs once on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const W = window.innerWidth, H = 480;

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: el,
      engine,
      options: { width: W, height: H, wireframes: false, background: "transparent", pixelRatio: window.devicePixelRatio || 1 },
    });
    const mouse = Mouse.create(render.canvas);
    const mc    = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(engine.world, mc);
    render.mouse = mouse;

    // Remove matter-js wheel listeners so page scroll works
    const canvas = render.canvas;
    canvas.onwheel = null;
    if (mouse.mousewheel) {
      canvas.removeEventListener("wheel", mouse.mousewheel);
      canvas.removeEventListener("mousewheel", mouse.mousewheel);
      canvas.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    }

    const ground = Bodies.rectangle(W / 2, H + 25, W * 3, 50, { isStatic: true, render: { visible: false } });
    const sensor = Bodies.rectangle(W / 2, H + 100, W * 3, 50, { isSensor: true, isStatic: true, render: { visible: false } });
    Composite.add(engine.world, [ground, sensor]);

    Events.on(engine, "collisionStart", ({ pairs }) => {
      pairs.forEach(({ bodyA, bodyB }) => {
        const hit = bodyA === sensor ? bodyB : bodyB === sensor ? bodyA : null;
        if (hit) {
          World.remove(engine.world, hit);
          bodiesRef.current = bodiesRef.current.filter((b) => b !== hit);
        }
      });
    });

    for (let i = 0; i < INITIAL_COUNT; i++) {
      const s = randomShape(isLightRef.current, W / 2 + Common.random(-120, 120), Common.random(H - 150, H - 50));
      bodiesRef.current.push(s);
      Composite.add(engine.world, s);
    }

    const spawn = (x, y) => {
      if (!engineRef.current) return;
      const existing = Composite.allBodies(engineRef.current.world).filter((b) => !b.isStatic);
      if (Query.point(existing, { x, y }).length > 0) return;
      const n = Math.floor(Common.random(CLICK_COUNT, CLICK_COUNT + 2));
      for (let i = 0; i < n; i++) {
        const { body, targetScale } = clickShape(isLightRef.current, x, y);
        bodiesRef.current.push(body);
        animRef.current.push({ body, startTime: Date.now(), targetScale, currentScale: 1 });
        Composite.add(engineRef.current.world, body);
      }
    };

    const onClick    = (e) => { const r = canvas.getBoundingClientRect(); spawn(e.clientX - r.left, e.clientY - r.top); };
    const onTouchEnd = (e) => {
      if (e.touches.length > 1) return;
      const t = e.changedTouches[0]; if (!t) return;
      const r = canvas.getBoundingClientRect(); spawn(t.clientX - r.left, t.clientY - r.top);
    };
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchend", onTouchEnd);

    const onOrientation = (e) => {
      if (!engineRef.current || e.gamma == null || e.beta == null) return;
      engine.gravity.x = (e.gamma / 90) * 2;
      engine.gravity.y = Math.max(0.5, Math.min(2, (e.beta / 90) * 2));
    };
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission().then((p) => {
        if (p === "granted") window.addEventListener("deviceorientation", onOrientation);
      }).catch(() => {});
    } else {
      window.addEventListener("deviceorientation", onOrientation);
    }

    Events.on(engine, "afterUpdate", () => {
      animRef.current = animRef.current.filter((item) => {
        const progress = Math.min((Date.now() - item.startTime) / 150, 1);
        if (progress < 1) {
          const newScale    = 1 + (item.targetScale - 1) * easeOutBack(progress);
          Body.scale(item.body, newScale / item.currentScale, newScale / item.currentScale);
          item.currentScale = newScale;
          return true;
        }
        return false;
      });
    });

    Events.on(engine, "afterUpdate", () => {
      const light = isLightRef.current;
      bodiesRef.current.forEach((body) => {
        const y = body.position.y;
        if (y < 180) {
          const opacity = Math.max(0, (y - 50) / 130);
          body.render.strokeStyle = `rgba(${light ? "0,0,0" : "255,255,255"},${opacity})`;
        } else {
          body.render.strokeStyle = stroke(light);
        }
      });
    });

    const runner = Runner.create();
    runnerRef.current = runner;
    Render.run(render);
    Runner.run(runner, engine);

    // Pause/resume based on visibility — set up AFTER runner starts to avoid race condition
    const obs = new IntersectionObserver(([entry]) => {
      if (!runnerRef.current || !engineRef.current) return;
      entry.isIntersecting
        ? Runner.run(runnerRef.current, engineRef.current)
        : Runner.stop(runnerRef.current);
    }, { threshold: 0.1 });
    obs.observe(el);

    return () => {
      obs.disconnect();
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("deviceorientation", onOrientation);
      Render.stop(render);
      render.canvas.remove();
      Runner.stop(runner);
      Engine.clear(engine);
      bodiesRef.current = [];
      animRef.current   = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: 480, width: "100%", touchAction: "pan-y" }}
      aria-hidden="true"
    />
  );
}
