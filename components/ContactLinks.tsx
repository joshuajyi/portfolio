"use client";
import { useState } from "react";

type Props = { email: string; links: { label: string; href: string }[]; big?: boolean };

export function ContactLinks({ email, links, big }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(email).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
        () => {},
      );
    } catch {}
  };
  return (
    <div className={`contact-row${big ? " big" : ""}`}>
      <span className="email-pill">
        <a href={`mailto:${email}`}>{email}</a>
        <button type="button" onClick={copy} aria-label="Copy email address">
          {copied ? "Copied" : "Copy"}
        </button>
      </span>
      {links.map((l) => (
        <a key={l.href} className="pill" href={l.href} target="_blank" rel="noopener">
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
