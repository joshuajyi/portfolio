import log from "@/content/log.json";
import { site } from "@/content/site";

export type LogType = "build" | "ship" | "learn" | "write" | "commit";
export type LogEntry = { date: string; type: LogType; text: string };

const DAY = 86_400_000;
const iso = (d: Date) => d.toISOString().slice(0, 10);
const utcDay = (s: string) => Date.parse(s + "T00:00:00Z");

export const entries: LogEntry[] = (log as LogEntry[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

const countByDay = entries.reduce<Record<string, number>>((m, e) => {
  m[e.date] = (m[e.date] ?? 0) + 1;
  return m;
}, {});

const today = utcDay(iso(new Date()));

/**
 * Week columns × 7 rows ending this week; each cell has a 0–4 level.
 * Starts at the week you started building (min 20 weeks, max a year), so it fills in as you go.
 */
export function heatmap() {
  const end = today + (6 - new Date(today).getUTCDay()) * DAY; // Saturday of this week
  const weeksSinceStart = Math.ceil((end - utcDay(site.startedBuilding) + DAY) / (7 * DAY));
  const weeks = Math.min(53, Math.max(20, weeksSinceStart));
  const start = end - (weeks * 7 - 1) * DAY;
  const cells: { date: string; count: number; level: number; future: boolean }[] = [];
  for (let t = start; t <= end; t += DAY) {
    const date = iso(new Date(t));
    const count = countByDay[date] ?? 0;
    cells.push({ date, count, level: Math.min(count, 4), future: t > today });
  }
  return cells;
}

/** Consecutive days with at least one entry, ending today or yesterday. */
export function streaks() {
  const days = Object.keys(countByDay).map(utcDay).sort((a, b) => a - b);
  let longest = 0;
  let run = 0;
  let prev = -Infinity;
  for (const d of days) {
    run = d - prev === DAY ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  let cursor = countByDay[iso(new Date(today))] ? today : today - DAY;
  while (countByDay[iso(new Date(cursor))]) {
    current++;
    cursor -= DAY;
  }
  return { current, longest, activeDays: days.length };
}

export function daysBuilding() {
  return Math.max(1, Math.floor((today - utcDay(site.startedBuilding)) / DAY) + 1);
}

export function relativeDate(date: string) {
  const diff = Math.round((today - utcDay(date)) / DAY);
  if (diff <= 0) return "today";
  if (diff === 1) return "1d ago";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return new Date(utcDay(date)).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
}
