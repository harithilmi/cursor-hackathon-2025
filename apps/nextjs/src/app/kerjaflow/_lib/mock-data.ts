export const MOCK_USER_DUMP_DEFAULT = `
Experienced Software Engineer with 4 years of experience.
Skills: React, JavaScript, Node.js, Tailwind CSS, SQL, Git.
Experience:
- Frontend Dev at TechMy Sdn Bhd (2020-2022): Built dashboard using React. Reduced load times by 40%.
- Freelance Web Dev (2018-2020): Wordpress and HTML sites for local SME.
- Education: BSc Computer Science, University of Malaya (2018).
Interests: AI, Open Source, Badminton.
Language: English (Native), Malay (Fluent), Mandarin (Basic).
`;

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  keywords: string[];
  culture_raw: string;
  red_flags: string[];
  link: string;
  risk_level: "Safe" | "Moderate" | "High Risk";
}

export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Senior React Engineer",
    company: "GlobalFintech Solutions",
    location: "Kuala Lumpur (Hybrid)",
    salary: "RM 12,000 - RM 18,000",
    tags: ["React", "TypeScript", "Node.js"],
    description:
      "Lead our mobile banking team. We value work-life balance. 21 days annual leave. Strictly no-overtime policy.",
    keywords: ["React", "Lead", "Banking", "Node.js", "TypeScript"],
    culture_raw: "International environment, transparent hierarchy.",
    red_flags: [],
    link: "https://hiredly.com/jobs/globalfintech-react",
    risk_level: "Safe",
  },
  {
    id: 2,
    title: "Full Stack Ninja (Urgent)",
    company: "Chinaman Tech Sdn Bhd",
    location: "Bangsar South",
    salary: "Undisclosed",
    tags: ["PHP", "JQuery", "Android", "iOS"],
    description:
      "Looking for a rockstar! Work hard play hard. We are a family. Fast-paced.",
    keywords: ["PHP", "Full Stack", "Hard Work"],
    culture_raw: "Family culture. Free pizza.",
    red_flags: ["Family Culture", "Urgent", "Ninja"],
    link: "https://hiredly.com/jobs/chinaman-tech",
    risk_level: "High Risk",
  },
  {
    id: 3,
    title: "Junior Frontend Developer",
    company: "StartUp My",
    location: "Sunway Geo",
    salary: "RM 3,500 - RM 4,500",
    tags: ["Vue.js", "Laravel"],
    description:
      "Great learning ground for fresh grads. Mentorship provided.",
    keywords: ["Vue.js", "Junior", "Learning"],
    culture_raw: "Young team.",
    red_flags: [],
    link: "https://hiredly.com/jobs/startup-my",
    risk_level: "Moderate",
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "GrabCar (via Agency)",
    location: "Petaling Jaya",
    salary: "RM 8,000 - RM 12,000",
    tags: ["React Native", "Mobile", "Redux"],
    description:
      "Join a fast moving team building the next gen super app features.",
    keywords: ["React Native", "Mobile", "App"],
    culture_raw: "Corporate but agile.",
    red_flags: [],
    link: "https://hiredly.com/jobs",
    risk_level: "Safe",
  },
];

export const calculateFit = (jobKeywords: string[], userDump: string): number => {
  if (!userDump || userDump.length < 10) return 0;
  const dumpLower = userDump.toLowerCase();
  let matchCount = 0;
  jobKeywords.forEach((kw) => {
    if (dumpLower.includes(kw.toLowerCase())) matchCount++;
  });
  // Return a percentage score (mocked logic)
  const score = Math.min(Math.round((matchCount / jobKeywords.length) * 100) + 40, 99);
  return score;
};
