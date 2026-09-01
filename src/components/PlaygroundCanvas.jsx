import { useEffect, useRef } from "react";
import {
  Bodies, Body, Composite, Engine, Events, Mouse, MouseConstraint,
} from "matter-js";

// Physics-driven pills. Each project is a real <a> positioned by a matter body,
// so it stays clickable and keyboard-reachable — the physics only moves it.
const HEIGHT = 190;
const WALL = 60;
const HALF_PI = Math.PI / 2;

export default function PlaygroundCanvas({ items, theme }) {
  const sceneRef = useRef(null);
  const pillRefs = useRef([]);
  // Set by the drag handler; a pill that moved shouldn't also navigate on click.
  const draggedRef = useRef(false);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const width = scene.clientWidth;
    const engine = Engine.create();
    engine.gravity.y = 0.6;

    // Measure each rendered pill so its body matches the text it carries.
    const bodies = pillRefs.current.filter(Boolean).map((el, i) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const body = Bodies.rectangle(
        40 + Math.random() * Math.max(width - 80, 1),
        -100 - i * 90,
        w,
        h,
        { restitution: 0.5, friction: 0.5, chamfer: { radius: h / 2 } },
      );
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      return { body, el, w, h };
    });

    const walls = [
      Bodies.rectangle(width / 2, HEIGHT + WALL / 2, width + 200, WALL, { isStatic: true }),
      Bodies.rectangle(-WALL / 2, HEIGHT / 2, WALL, HEIGHT * 4, { isStatic: true }),
      Bodies.rectangle(width + WALL / 2, HEIGHT / 2, WALL, HEIGHT * 4, { isStatic: true }),
    ];

    const mouse = Mouse.create(scene);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    // Let the page keep scrolling over the canvas instead of the physics eating it.
    mouse.element.removeEventListener("wheel", mouse.mousewheel);

    Composite.add(engine.world, [...bodies.map((b) => b.body), ...walls, mouseConstraint]);

    let moved = 0;
    Events.on(mouseConstraint, "mousemove", () => {
      if (mouseConstraint.body) moved += 1;
    });
    Events.on(mouseConstraint, "startdrag", () => {
      moved = 0;
      draggedRef.current = false;
    });
    Events.on(mouseConstraint, "enddrag", () => {
      // A few frames of movement is a drag, not a click.
      draggedRef.current = moved > 3;
    });

    // Own rAF loop rather than Matter's Runner — one place controls the
    // lifecycle, which keeps StrictMode's double-mount from leaving a dead engine.
    let frame;
    let last = performance.now();

    const paint = () => {
      for (const { body, el, w, h } of bodies) {
        // A capsule is symmetric under a half turn, so folding the angle into
        // ±90° leaves the shape identical while the label never reads upside
        // down — worst case it sits vertical.
        const a =
          (((body.angle + HALF_PI) % Math.PI) + Math.PI) % Math.PI - HALF_PI;
        el.style.transform =
          `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) ` +
          `rotate(${a}rad)`;
      }
    };

    const tick = (now) => {
      // Clamp so a backgrounded tab doesn't resume with one giant step.
      const delta = Math.min(now - last, 32);
      last = now;
      Engine.update(engine, delta);
      paint();
      frame = requestAnimationFrame(tick);
    };

    paint();
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      Events.off(mouseConstraint);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [items, theme]);

  return (
    <div ref={sceneRef} className="pg-scene" style={{ height: HEIGHT }}>
      {items.map((p, i) => (
        <a
          key={p.name}
          ref={(el) => (pillRefs.current[i] = el)}
          className="pg-pill"
          draggable={false}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (draggedRef.current) e.preventDefault();
          }}
        >
          {p.name}
        </a>
      ))}
    </div>
  );
}
