import { experience, projects, site, type Status } from "@/content/site";
import { entries, relativeDate, streaks } from "@/lib/data";
import { Heatmap } from "@/components/Heatmap";
import { Overlays, PaletteButton } from "@/components/Overlays";
import { Sparkline } from "@/components/Sparkline";
import { Verified } from "@/components/Verified";
import { ContactLinks } from "@/components/ContactLinks";

const badge: Record<Status, [string, string]> = {
  live: ["live", "LIVE"],
  wip: ["wip", "IN PROGRESS"],
  shipped: ["shipped", "SHIPPED"],
  oss: ["live", "OPEN SOURCE"],
};

export default function Home() {

  const sections = [
    { id: "work", label: "Projects" },
    ...(experience.length ? [{ id: "experience", label: "Experience" }] : []),
    { id: "log", label: "Build log" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="wrap" id="top">
      <header>
        <a className="logo" href="#top" aria-label="Back to top">
          <span className="mark">JY</span>
          {site.name}
        </a>
        <nav>
          {sections.slice(0, -1).map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
          <PaletteButton />
          <a className="btn" href={`mailto:${site.email}`}>
            Contact
          </a>
        </nav>
      </header>

      <div className="hero">
        {site.status && (
          <span className="status">
            <span className="dot" />
            {site.status}
          </span>
        )}
        <h1>
          {site.headline}
          <br />
          <span className="dim">{site.subline}</span>
        </h1>
        <p className="lede">{site.intro}</p>
        <ContactLinks email={site.email} links={site.links} />
      </div>

      <div className="stats" aria-label="At a glance">
        <div className="stat">
          <span className="k">Projects</span>
          <span className="v">{projects.length}</span>
          <span className="d">{projects.filter((p) => p.status === "wip").length} in progress</span>
          <Verified source="project list" />
        </div>
        <div className="stat">
          <span className="k">Roles</span>
          <span className="v">{experience.length}</span>
          <span className="d">since {experience[experience.length - 1]?.dates.slice(4, 8)}</span>
          <Verified source="resume" />
        </div>
        <div className="stat">
          <span className="k">{site.education.label}</span>
          <span className="v">{site.education.value}</span>
          <span className="d">{site.education.detail}</span>
          <Verified source={site.education.source} />
        </div>
        <div className="stat">
          <span className="k">{site.highlight.label}</span>
          <span className="v">{site.highlight.value}</span>
          <span className="d">{site.highlight.detail}</span>
          <Verified source={site.highlight.source} />
        </div>
      </div>

      {streaks().activeDays >= site.showActivityAfterDays && <Heatmap />}

      <section id="work">
        <div className="sh">
          <h2>Projects</h2>
        </div>
        <div className="grid">
          {projects.map((p) => {
            const [cls, label] = badge[p.status];
            const inner = (
              <>
                <div className="ct">
                  <span className="ico">{p.initials}</span>
                  <div>
                    <div className="n">{p.name}</div>
                    <div className="c">{p.category}</div>
                  </div>
                  <span className={`badge ${cls}`}>{label}</span>
                </div>
                <p>{p.description}</p>
                {p.history && <Sparkline values={p.history} />}
                <div className="cf">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <div className="k">{s.label}</div>
                      <div className={`v${s.up ? " up" : ""}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </>
            );
            return p.url ? (
              <a key={p.name} className="card" href={p.url} target="_blank" rel="noopener">
                {inner}
              </a>
            ) : (
              <div key={p.name} className="card">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {experience.length > 0 && (
        <section id="experience">
          <div className="sh">
            <h2>Experience</h2>
          </div>
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Focus</th>
                  <th className="r">Dates</th>
                </tr>
              </thead>
              <tbody>
                {experience.map((r) => (
                  <tr key={r.company + r.dates}>
                    <td>{r.company}</td>
                    <td>{r.role}</td>
                    <td>
                      <span className="sub">{r.focus ?? ""}</span>
                    </td>
                    <td className="r">{r.dates}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section id="log">
        <div className="sh">
          <h2>Build log</h2>
          <span className="sync">
            <span className="dot" />
            Updated {relativeDate(entries[0]?.date ?? "")}
          </span>
        </div>
        {entries.length ? (
          <div className="feed">
            {entries.slice(0, 8).map((e, i) => (
              <div className="item" key={i}>
                <time dateTime={e.date}>{relativeDate(e.date)}</time>
                <span>
                  <span className="src">{e.type.toUpperCase()}</span>
                  {e.text}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-note">Nothing logged yet.</p>
        )}
      </section>

      <section id="contact" className="contact-cta">
        <h2>Get in touch</h2>
        <p>
          {site.status ? `${site.status}. ` : ""}Email is the best way to reach me.
        </p>
        <ContactLinks email={site.email} links={site.links} big />
      </section>

      <footer>
        <div>
          <a className="logo" href="#top" style={{ fontSize: 16 }}>
            <span className="mark">JY</span>
            {site.name}
          </a>
          <p className="bio">
            Press ⌘K to get around, or ~ if you&apos;re curious.
          </p>
        </div>
        <div>
          <h3>Elsewhere</h3>
          <ul>
            {site.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Projects</h3>
          <ul>
            {projects.map((p) => (
              <li key={p.name}>
                <a href={p.url ?? "#work"}>{p.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Site</h3>
          <ul>
            {sections.slice(0, -1).map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      <Overlays
        whoami={`${site.name.toLowerCase()}. ${site.headline.toLowerCase()} ${site.subline}`}
        email={site.email}
        linkedin={site.links.find((l) => l.label === "LinkedIn")?.href.replace("https://www.", "") ?? ""}
        projects={projects}
        experience={experience}
        sections={sections}
      />
    </div>
  );
}
