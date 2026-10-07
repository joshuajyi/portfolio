import { site } from "@/content/site";
import { heatmap, streaks } from "@/lib/data";

export function Heatmap() {
  const cells = heatmap();
  const { current, longest, activeDays } = streaks();
  return (
    <div className="heat" aria-label="Build activity">
      <div className="sh">
        <h2>Activity</h2>
        <span className="sync">
          Since{" "}
          {new Date(site.startedBuilding + "T00:00:00Z").toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          })}{" "}
          · from my build log
        </span>
      </div>
      <div className="heat-scroll">
        <div className="heat-grid">
          {cells.map((c) => (
            <i
              key={c.date}
              data-l={c.level}
              data-future={c.future || undefined}
              title={`${c.date}: ${c.count} ${c.count === 1 ? "entry" : "entries"}`}
            />
          ))}
        </div>
      </div>
      <div className="heat-foot">
        <span>
          {activeDays} active {activeDays === 1 ? "day" : "days"} · current streak {current}d · longest {longest}d
        </span>
        <span className="legend">
          Less <i style={{ background: "var(--surface-2)" }} />
          <i data-l="1" />
          <i data-l="2" />
          <i data-l="3" />
          <i data-l="4" /> More
        </span>
      </div>
    </div>
  );
}
