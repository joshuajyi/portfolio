"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  whoami: string;
  email: string;
  linkedin: string;
  projects: { name: string; status: string; category: string; url?: string }[];
  experience: { company: string; role: string; dates: string }[];
  sections: { id: string; label: string }[];
};

function toggleTheme() {
  const root = document.documentElement;
  const current =
    root.dataset.theme ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

function copy(text: string) {
  try {
    navigator.clipboard.writeText(text).catch(() => {});
  } catch {}
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function Overlays({ whoami, email, linkedin, projects, experience, sections }: Props) {
  const [palOpen, setPalOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const palInput = useRef<HTMLInputElement>(null);
  const termInput = useRef<HTMLInputElement>(null);
  const termOut = useRef<HTMLDivElement>(null);

  const openTerm = useCallback(() => {
    setTermOpen(true);
    setLines((l) =>
      l.length ? l : ['<span class="m">welcome. type</span> <span class="g">help</span> <span class="m">to see commands.</span>'],
    );
  }, []);

  const commands = useMemo(
    () => [
      ...sections.map((s) => ({
        title: `Go to ${s.label}`,
        hint: "Section",
        run: () => document.getElementById(s.id)?.scrollIntoView(),
      })),
      ...projects.map((p) => ({
        title: `Open ${p.name}`,
        hint: "Project",
        run: () => (p.url ? window.open(p.url, "_blank", "noopener") : document.getElementById("work")?.scrollIntoView()),
      })),
      {
        title: "Copy email address",
        hint: email,
        keys: "contact mail",
        run: () => {
          copy(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
      },
      { title: "Toggle light / dark", hint: "Theme", keys: "theme mode", run: toggleTheme },
      { title: "Open terminal", hint: "~", keys: "console shell", run: openTerm },
    ],
    [sections, projects, email, openTerm],
  );

  const shown = commands.filter((c) =>
    [c.title, c.hint, "keys" in c ? c.keys : ""].join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  const runAt = (i: number) => {
    const c = shown[i];
    setPalOpen(false);
    c?.run();
  };

  // Global shortcuts: ⌘K / Ctrl+K for the palette, ~ for the terminal, Esc to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /INPUT|TEXTAREA/.test((document.activeElement as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalOpen((o) => !o);
      } else if (e.key === "Escape") {
        setPalOpen(false);
        setTermOpen(false);
      } else if (!typing && (e.key === "~" || e.key === "`")) {
        e.preventDefault();
        setTermOpen((o) => {
          if (!o) openTerm();
          return !o;
        });
      }
    };
    const onOpen = () => setPalOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [openTerm]);

  useEffect(() => {
    if (palOpen) {
      setQuery("");
      setSel(0);
      palInput.current?.focus();
    }
  }, [palOpen]);

  useEffect(() => {
    if (termOpen) termInput.current?.focus();
  }, [termOpen]);

  useEffect(() => {
    termOut.current?.scrollTo({ top: termOut.current.scrollHeight });
  }, [lines]);

  const responses: Record<string, string> = {
    help: '<span class="m">commands:</span> whoami  projects  resume  contact  theme  clear  exit',
    whoami: esc(whoami),
    projects:
      projects
        .map((p) => {
          const dot = p.status === "wip" ? "m" : "g";
          return `<span class="${dot}">●</span> ${esc(p.name.toLowerCase().padEnd(26))}${esc(p.category)}`;
        })
        .join("\n") || "nothing here yet.",
    resume: experience.length
      ? experience.map((r) => `${esc(r.dates.padEnd(22))}${esc(r.company.padEnd(26))}${esc(r.role)}`).join("\n")
      : "résumé coming soon. try <span class=\"g\">projects</span>.",
    contact: `email     ${esc(email)}\nlinkedin  ${esc(linkedin)}`,
  };

  const onTermKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const cmd = e.currentTarget.value.trim().toLowerCase();
    e.currentTarget.value = "";
    const echo = `<span class="g">$</span> ${esc(cmd)}`;
    if (!cmd) return setLines((l) => [...l, echo]);
    if (cmd === "clear") return setLines([]);
    if (cmd === "exit") return setTermOpen(false);
    if (cmd === "theme") {
      toggleTheme();
      return setLines((l) => [...l, echo, "theme switched."]);
    }
    const out = responses[cmd] ?? `command not found: ${esc(cmd)}. try <span class="g">help</span>`;
    setLines((l) => [...l, echo, out]);
  };

  return (
    <>
      {palOpen && (
        <div className="ov" onClick={(e) => e.target === e.currentTarget && setPalOpen(false)}>
          <div className="pal" role="dialog" aria-modal="true" aria-label="Command palette">
            <label htmlFor="pal-q" className="sr">
              Search commands
            </label>
            <input
              id="pal-q"
              ref={palInput}
              value={query}
              placeholder="Type a command or search…"
              autoComplete="off"
              onChange={(e) => {
                setQuery(e.target.value);
                setSel(0);
              }}
              onKeyDown={(e) => {
                const n = Math.max(shown.length, 1);
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSel((s) => (s + 1) % n);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSel((s) => (s - 1 + n) % n);
                } else if (e.key === "Enter") runAt(sel);
              }}
            />
            {shown.length ? (
              <ul role="listbox">
                {shown.map((c, i) => (
                  <li
                    key={c.title}
                    role="option"
                    aria-selected={i === sel}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => runAt(i)}
                  >
                    <span>{c.title}</span>
                    <span>{c.hint}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty">No matching commands</div>
            )}
          </div>
        </div>
      )}

      {termOpen && (
        <div className="term" role="dialog" aria-label="Terminal">
          <div className="term-bar">
            <span>joshua@portfolio: ~</span>
            <span>esc to close</span>
          </div>
          <div className="term-out" ref={termOut} dangerouslySetInnerHTML={{ __html: lines.join("\n") }} />
          <div className="term-in">
            <span>$</span>
            <label htmlFor="term-q" className="sr">
              Terminal input
            </label>
            <input id="term-q" ref={termInput} autoComplete="off" spellCheck={false} onKeyDown={onTermKey} />
          </div>
        </div>
      )}

      {copied && (
        <div className="toast" role="status">
          Copied {email}
        </div>
      )}
    </>
  );
}

export function PaletteButton() {
  return (
    <button
      className="kbd"
      type="button"
      aria-label="Open command palette"
      onClick={() => window.dispatchEvent(new Event("open-palette"))}
    >
      ⌘K
    </button>
  );
}
