import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export const MOD_KEY = IS_MAC ? "⌘" : "Ctrl";

// Tools whose schema has one enum parameter expand into a row per value, so
// "open_social" becomes "LinkedIn", "GitHub" and so on. Picking a tool and
// then picking an argument is two steps; this is one.
function expand(tools) {
  const rows = [];
  for (const tool of tools) {
    const props = tool.inputSchema?.properties ?? {};
    const keys = Object.keys(props);
    const enumKey = keys.length === 1 && props[keys[0]]?.enum ? keys[0] : null;

    if (!enumKey) {
      rows.push({ id: tool.name, label: tool.title, sub: null, tool, args: {} });
      continue;
    }
    for (const value of props[enumKey].enum) {
      rows.push({
        id: `${tool.name}:${value}`,
        label: value,
        sub: tool.title,
        tool,
        args: { [enumKey]: value },
      });
    }
  }
  return rows;
}

const GROUPS = [
  { kind: "read", label: "Read" },
  { kind: "act", label: "Do" },
];

export default function CommandPalette({ tools, open, onClose }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const rows = useMemo(() => expand(tools), [tools]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.label, r.sub, r.tool.name, r.tool.description]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    );
  }, [rows, query]);

  // Flat list for keyboard nav, grouped for display.
  const grouped = useMemo(
    () =>
      GROUPS.map((g) => ({
        ...g,
        rows: matches.filter((r) => r.tool.kind === g.kind),
      })).filter((g) => g.rows.length),
    [matches],
  );
  const ordered = useMemo(() => grouped.flatMap((g) => g.rows), [grouped]);

  const close = useCallback(() => {
    onClose();
    setQuery("");
    setActive(0);
    setResult(null);
  }, [onClose]);

  const run = useCallback(
    async (row) => {
      if (!row || busy) return;
      setBusy(true);
      try {
        const out = await row.tool.run(row.args);
        const text = String(out).trim();
        // Reads return JSON worth showing. Actions navigate or open a tab.
        if (text.startsWith("{") || text.startsWith("[")) {
          setResult({ title: row.tool.title, text });
        } else {
          close();
        }
      } catch (e) {
        setResult({ title: "Error", text: String(e) });
      } finally {
        setBusy(false);
      }
    },
    [busy, close],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (result) setResult(null);
        else close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % Math.max(ordered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + ordered.length) % Math.max(ordered.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        run(ordered[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ordered, active, run, close, result]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row in view when navigating with the keyboard.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let index = -1;

  return (
    <div className="cmdk-backdrop" onPointerDown={close} role="presentation">
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {result ? (
          <>
            <div className="cmdk-result-head">
              <button type="button" className="cmdk-back" onClick={() => setResult(null)}>
                ← Back
              </button>
              <span className="cmdk-result-title">{result.title}</span>
            </div>
            <pre className="cmdk-result">{result.text}</pre>
          </>
        ) : (
          <>
            <div className="cmdk-input-wrap">
              <input
                ref={inputRef}
                className="cmdk-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className="cmdk-list" ref={listRef} role="listbox">
              {ordered.length === 0 && (
                <p className="cmdk-empty">Nothing matches “{query}”</p>
              )}
              {grouped.map((group) => (
                <div key={group.kind} className="cmdk-group">
                  <div className="cmdk-group-label">{group.label}</div>
                  {group.rows.map((row) => {
                    index += 1;
                    const isActive = index === active;
                    const i = index;
                    return (
                      <button
                        key={row.id}
                        type="button"
                        data-active={isActive}
                        className={`cmdk-row${isActive ? " is-active" : ""}`}
                        onPointerEnter={() => setActive(i)}
                        onClick={() => run(row)}
                        role="option"
                        aria-selected={isActive}
                      >
                        <span className="cmdk-label">{row.label}</span>
                        {row.sub && <span className="cmdk-sub">{row.sub}</span>}
                        <span className="cmdk-enter" aria-hidden="true">↵</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="cmdk-foot">
          <kbd>↑↓</kbd>
          <kbd>↵</kbd>
          <kbd>esc</kbd>
          <span className="cmdk-foot-note">
            {tools.length} tools — the same list an AI agent gets
          </span>
        </div>
      </div>
    </div>
  );
}
