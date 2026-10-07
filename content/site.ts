// Everything personal lives in this file and content/log.json.

export type Status = "live" | "wip" | "shipped" | "oss";

export type Project = {
  name: string;
  initials: string;
  category: string;
  status: Status;
  description: string;
  url?: string;
  // Up to three facts shown along the bottom of the card.
  stats: { label: string; value: string; up?: boolean }[];
  // Optional history (oldest → newest) to draw a sparkline, e.g. weekly users.
  history?: number[];
};

export type Role = { company: string; role: string; focus?: string; dates: string };

export const site = {
  name: "Josh Yi",
  handle: "joshua yi",
  headline: "Computer engineering student building embedded systems",
  subline: "and the software around them.",
  intro:
    "I study computer engineering at San Jose State University (graduating June 2028). I'm into embedded systems and systems software, and I like building things end to end so I understand every layer. I also teach robotics to kids through FIRST LEGO League.",
  // Set to null to hide the status pill.
  status: "Open to internships" as string | null,
  email: "joshua.yi@outlook.com",
  // The day "Day N of building in public" counts from.
  startedBuilding: "2026-10-07",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/joshuayitech/" },
  ],
  education: {
    label: "Graduating",
    value: "Jun 2028",
    detail: "Computer Engineering · SJSU",
    source: "SJSU",
  },
  // The activity heatmap appears once the build log covers this many days.
  showActivityAfterDays: 14,
  // Fourth stat in the strip.
  highlight: {
    label: "Face match latency",
    value: "10.6 ms",
    detail: "median per image, M4",
    source: "benchmark",
  },
};

export const projects: Project[] = [
  {
    name: "Kairo",
    initials: "Ka",
    category: "macOS planner · Desktop app",
    status: "oss",
    description:
      "Schedules backward from deadlines: estimates effort and spreads work sessions across the days before each due date.",
    stats: [
      { label: "Core", value: "Rust · Tauri 2" },
      { label: "UI", value: "React · TS" },
      { label: "Storage", value: "SQLite" },
    ],
  },
  {
    name: "Local Face Recognition",
    initials: "Fr",
    category: "Computer vision · Pipeline",
    status: "oss",
    description:
      "Offline face detection, embedding and matching with YuNet and SFace, in Python with OpenCV and ONNX.",
    stats: [
      { label: "Median", value: "10.6 ms", up: true },
      { label: "Models", value: "YuNet · SFace" },
      { label: "Runs", value: "Fully offline" },
    ],
  },
  {
    name: "Motor Vibration Monitor",
    initials: "Vm",
    category: "Embedded · STM32",
    status: "wip",
    description:
      "An STM32U575 reading an LSM6DSOX accelerometer, working toward on-device fault detection for motors.",
    stats: [
      { label: "MCU", value: "STM32U575" },
      { label: "Sensor", value: "LSM6DSOX" },
      { label: "Goal", value: "On-device" },
    ],
  },
];

// Leave empty to hide the Experience section.
export const experience: Role[] = [
  { company: "Dr. Owl Academy", role: "Robotics Instructor / Intern", focus: "Coaching FIRST LEGO League teams", dates: "Jun 2026 – now" },
  { company: "YMCA of the USA", role: "Wellness Coach", focus: "Member services and floor safety", dates: "Jul 2025 – now" },
  { company: "Evergreen Valley College", role: "Peer Tutor", focus: "Calculus, physics, intro CS", dates: "Dec 2024 – May 2026" },
  { company: "Grasshopper Kids", role: "STEM Instructor", focus: "Hands-on STEM for Pre-K and TK", dates: "Jan 2025 – Dec 2025" },
  { company: "KidzToPros", role: "Summer Camp Instructor", focus: "K–5 camps, summers 2022 and 2023", dates: "Jun 2022 – Aug 2023" },
  { company: "Kumon", role: "Tutor", focus: "Math and English for K–8", dates: "Sep 2021 – May 2022" },
];
