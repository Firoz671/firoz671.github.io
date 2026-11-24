export interface NavItem {
  label: string;
  href: string;
}

export interface ActionLink {
  label: string;
  href: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Profile {
  brand: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  languages: string;
  ui: {
    skipToContent: string;
    primaryNav: string;
    themeToDark: string;
    themeToLight: string;
    backToTop: string;
    opensInNewTab: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    titleLines: string[];
    lead: string;
    primaryCta: ActionLink;
    secondaryCta: ActionLink;
    highlights: string[];
    portrait: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
    panel: {
      title: string;
      rows: Fact[];
    };
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    facts: Fact[];
  };
  footer: {
    tagline: string;
  };
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface SkillsContent {
  eyebrow: string;
  heading: string;
  groups: SkillGroup[];
  learning: {
    heading: string;
    intro: string;
    groups: SkillGroup[];
  };
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  title: string;
  kind: string;
  bullets: string[];
  outcome: string | null;
  stack: string[];
  live: ProjectLink | null;
  image: ProjectImage | null;
}

export interface ProjectsContent {
  eyebrow: string;
  heading: string;
  outcomeLabel: string;
  items: Project[];
}

export interface GitHubContent {
  eyebrow: string;
  heading: string;
  intro: string;
  profileLink: ActionLink;
  memberSince: string;
  stats: {
    repositories: string;
    followers: string;
    stars: string;
  };
  blocks: {
    repositories: string;
    languages: string;
    contributions: string;
    activity: string;
  };
  heatmap: {
    heading: string;
    subtitle: string;
    profile: ActionLink;
    total: string;
    legend: {
      less: string;
      more: string;
    };
    tooltip: {
      count: string;
      countSingular: string;
      empty: string;
    };
    summary: string;
    monthlyHeading: string;
    monthlyItem: string;
    scrollLabel: string;
    empty: string;
  };
  repoMeta: {
    stars: string;
    forks: string;
    updated: string;
    noDescription: string;
  };
  contributionStates: {
    open: string;
    merged: string;
    closed: string;
  };
  activity: {
    push: string;
    pushGeneric: string;
    commitSingular: string;
    commitPlural: string;
    prOpened: string;
    prMerged: string;
    prClosed: string;
    issueOpened: string;
    issueClosed: string;
    fork: string;
    release: string;
    createRepo: string;
    createBranch: string;
    createTag: string;
  };
  languageCount: string;
  languageCountSingular: string;
  lastUpdated: string;
  empty: {
    repositories: string;
    languages: string;
    contributions: string;
    activity: string;
  };
  pinned: string[];
  hidden: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  thesis: string;
}

export interface EducationContent {
  eyebrow: string;
  heading: string;
  listHeading: string;
  thesisLabel: string;
  items: EducationItem[];
  activities: {
    heading: string;
    items: string[];
  };
}

export interface CertificationsContent {
  heading: string;
  items: Array<{
    title: string;
    issuer: string;
  }>;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  external: boolean;
}

export interface CvLink {
  label: string;
  href: string;
}

export interface ContactContent {
  eyebrow: string;
  heading: string;
  lead: string;
  emailActionLabel: string;
  email: {
    address: string;
    href: string;
  };
  linksHeading: string;
  links: ContactLink[];
  locationLabel: string;
  cv: CvLink | null;
}

const name = 'Md. Firoz Al Mahmud';
const role = 'Software Engineer, Frontend (React)';
const location = 'Dhaka, Bangladesh';
const email = 'firoz.a.mahmud01@gmail.com';
const githubUrl = 'https://github.com/firoz671';
const linkedin = 'https://www.linkedin.com/in/firoz-al-mahmud-264982243/';
const summarySeeking =
  'Seeking a Software Engineer role where I can contribute to scalable software solutions while continuously strengthening my engineering expertise.';

export const profile: Profile = {
  brand: 'Firoz',
  name,
  initials: 'MFA',
  role,
  location,
  languages: 'Bangla, English',
  ui: {
    skipToContent: 'Skip to content',
    primaryNav: 'Primary',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    backToTop: 'Back to top',
    opensInNewTab: 'opens in a new tab',
  },
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'GitHub', href: '#github' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: role,
    titleLines: ['Md. Firoz', 'Al Mahmud'],
    lead: 'Computer Science and Engineering graduate with hands-on experience building responsive, production-ready web applications using React.js, JavaScript, Tailwind CSS, and REST APIs.',
    primaryCta: { label: 'Email Firoz', href: `mailto:${email}` },
    secondaryCta: { label: 'View projects', href: '#projects' },
    highlights: [
      '2 live e-commerce storefronts',
      '10,000-comment sentiment dataset',
      'B.Sc. in CSE, 2025',
    ],
    portrait: {
      src: '/img/firoz.png',
      width: 1672,
      height: 941,
      alt: 'Portrait of Md. Firoz Al Mahmud at his desk',
    },
    panel: {
      title: 'Profile',
      rows: [
        { label: 'Role', value: role },
        { label: 'Location', value: location },
        { label: 'Languages', value: 'Bangla, English' },
      ],
    },
  },
  about: {
    eyebrow: 'About',
    heading: role,
    paragraphs: [
      'Computer Science and Engineering graduate with hands-on experience building responsive, production-ready web applications using React.js, JavaScript, Tailwind CSS, and REST APIs.',
      'Strong foundation in frontend development, UI implementation, object-oriented programming, data structures, and software development practices. Experienced in transforming designs into pixel-perfect interfaces, solving responsive UI challenges, and developing reusable components.',
      summarySeeking,
    ],
    facts: [
      { label: 'Role', value: role },
      { label: 'Location', value: location },
      { label: 'Languages', value: 'Bangla, English' },
    ],
  },
  footer: {
    tagline: role,
  },
};

export const skills: SkillsContent = {
  eyebrow: 'Skills',
  heading: 'Technical skills',
  groups: [
    {
      title: 'Frontend',
      items: [
        'React.js',
        'JavaScript (ES6+)',
        'HTML5',
        'CSS3',
        'Tailwind CSS',
        'Responsive Design',
        'Pixel-Perfect UI',
      ],
    },
    {
      title: 'State management',
      items: ['Context API (React)'],
    },
    {
      title: 'API and integration',
      items: ['REST API integration', 'Postman', 'API testing'],
    },
    {
      title: 'Working knowledge',
      items: ['Python (data scraping, OOP)', 'Java (OOP)'],
    },
    {
      title: 'Design-to-code',
      items: ['Figma to HTML', 'PSD to HTML', 'Adobe XD to HTML'],
    },
    {
      title: 'AI-assisted development',
      items: [
        'Claude',
        'OpenCode',
        'Ollama',
        'local LLMs',
        'AI-assisted coding',
        'context engineering',
      ],
    },
    {
      title: 'Foundations',
      items: [
        'Data Structures and Algorithms',
        'OOP',
        'SDLC',
        'STLC',
        'cloud concepts',
      ],
    },
    {
      title: 'Tools',
      items: [
        'Git',
        'GitHub',
        'VS Code',
        'Postman',
        'Microsoft Office',
        'Excel',
      ],
    },
    {
      title: 'Also',
      items: [
        'Technical report writing',
        'knowledge base authoring',
        'cross-team collaboration',
      ],
    },
  ],
  learning: {
    heading: 'Currently Learning & Exploring',
    intro:
      'Building on my frontend foundation by exploring AI application development and software architecture.',
    groups: [
      {
        title: 'AI & LLM Engineering',
        items: [
          'Large Language Models (LLMs)',
          'Generative AI',
          'Retrieval-Augmented Generation (RAG)',
          'LangChain',
          'Model Context Protocol (MCP)',
        ],
      },
      {
        title: 'Software Architecture',
        items: ['System Design'],
      },
      {
        title: 'Web Frameworks',
        items: ['Next.js'],
      },
    ],
  },
};

export const projects: ProjectsContent = {
  eyebrow: 'Selected work',
  heading: 'Projects',
  outcomeLabel: 'Outcome',
  items: [
    {
      title: 'Blinxos',
      kind: 'Online watch store',
      bullets: [
        'Developed a responsive React.js e-commerce storefront with product browsing, search, categories, cart, and checkout.',
        'Implemented product variants, color-based image switching, dynamic galleries, and mobile-friendly sliders for the watch catalog.',
        'Created reusable and scalable UI components for consistent frontend development, with frontend APIs integrated for dynamic product and catalog data.',
        'Solved responsive UI and frontend integration challenges across different screen sizes, and integrated Meta Pixel tracking for key customer and e-commerce interactions.',
      ],
      outcome:
        'Delivered a production-ready storefront optimized for mobile users and real-world e-commerce operations.',
      stack: ['React.js', 'Tailwind CSS', 'REST APIs'],
      live: { label: 'Visit Blinxos', href: 'https://blinxos.com' },
      image: {
        src: '/img/blinxos.webp',
        width: 1916,
        height: 965,
        alt: 'Blinxos online watch store homepage with a free shipping banner and watch categories',
      },
    },
    {
      title: 'Hookfinity',
      kind: 'Fashion e-commerce platform',
      bullets: [
        'Built a responsive React.js fashion e-commerce storefront covering product browsing, search, categories, cart, and checkout.',
        'Supported the fashion catalog with product variants, color-based image switching, dynamic galleries, and mobile-friendly sliders.',
        'Built reusable UI components for consistent frontend development and connected frontend APIs for dynamic product and catalog data.',
        'Resolved responsive layout and integration issues across screen sizes and added Meta Pixel tracking for e-commerce interactions.',
      ],
      outcome:
        'Delivered a complete frontend experience covering product discovery, product selection, cart management, and checkout.',
      stack: ['React.js', 'Tailwind CSS', 'REST APIs'],
      live: { label: 'Visit Hookfinity', href: 'https://hookfinityshop.com' },
      image: {
        src: '/img/hookfinity.webp',
        width: 1917,
        height: 917,
        alt: "Hookfinity fashion e-commerce homepage showing a new arrivals collection of men's shirts",
      },
    },
    {
      title:
        'Sentiment-Based Study of Public Opinion and Perception on AI Adoption in Bangladesh',
      kind: 'Thesis',
      bullets: [
        'Built a custom dataset of 10,000 code-mixed comments on public sentiment toward AI in Bangladesh.',
        'Data cleaning, preprocessing, and exploratory analysis with Python libraries.',
        'Benchmarked multiple deep learning models for sentiment classification.',
        'Analyzed model performance and insights for a low-resource, code-mixed language context.',
      ],
      outcome: null,
      stack: ['Python', 'Data analysis'],
      live: null,
      image: null,
    },
  ],
};

export const github: GitHubContent = {
  eyebrow: 'Open source',
  heading: 'GitHub',
  intro:
    'A live snapshot of my public repositories and open source activity on GitHub.',
  profileLink: { label: 'View on GitHub', href: githubUrl },
  memberSince: 'Member since {year}',
  stats: {
    repositories: 'Public repositories',
    followers: 'Followers',
    stars: 'Total stars',
  },
  blocks: {
    repositories: 'Repositories',
    languages: 'Languages',
    contributions: 'Open source contributions',
    activity: 'Recent activity',
  },
  heatmap: {
    heading: 'Open Source Activity',
    subtitle: 'Building in public, one commit at a time.',
    profile: { label: '@firoz671', href: githubUrl },
    total: '{total} contributions in the last year',
    legend: {
      less: 'Less',
      more: 'More',
    },
    tooltip: {
      count: '{count} contributions on {date}',
      countSingular: '{count} contribution on {date}',
      empty: 'No contributions',
    },
    summary: '{total} contributions between {from} and {to}',
    monthlyHeading: 'Monthly contributions',
    monthlyItem: '{month}: {count}',
    scrollLabel: 'Contribution heatmap, scroll horizontally',
    empty:
      'Contribution data is not available yet. The heatmap will appear after the next successful data refresh.',
  },
  repoMeta: {
    stars: 'Stars',
    forks: 'Forks',
    updated: 'Updated',
    noDescription: 'No description provided.',
  },
  contributionStates: {
    open: 'Open',
    merged: 'Merged',
    closed: 'Closed',
  },
  activity: {
    push: 'Pushed {count} {unit} to {repo}',
    pushGeneric: 'Pushed commits to {repo}',
    commitSingular: 'commit',
    commitPlural: 'commits',
    prOpened: 'Opened a pull request in {repo}',
    prMerged: 'Merged a pull request in {repo}',
    prClosed: 'Closed a pull request in {repo}',
    issueOpened: 'Opened an issue in {repo}',
    issueClosed: 'Closed an issue in {repo}',
    fork: 'Forked {repo}',
    release: 'Published a release in {repo}',
    createRepo: 'Created the repository {repo}',
    createBranch: 'Created a branch in {repo}',
    createTag: 'Created a tag in {repo}',
  },
  languageCount: '{count} repositories',
  languageCountSingular: '{count} repository',
  lastUpdated: 'Last updated {date}',
  empty: {
    repositories: 'No public repositories to show yet.',
    languages: 'No language data available yet.',
    contributions: 'No public open source contributions yet.',
    activity: 'No recent public activity yet.',
  },
  pinned: [],
  hidden: [],
};

export const education: EducationContent = {
  eyebrow: 'Education',
  heading: 'Education and certifications',
  listHeading: 'Education',
  thesisLabel: 'Thesis',
  items: [
    {
      degree: 'Bachelor of Science in Computer Science and Engineering',
      institution: 'Daffodil International University',
      period: 'Jan 2022 – Dec 2025',
      thesis:
        'Sentiment-Based Study of Public Opinion and Perception on AI Adoption in Bangladesh',
    },
  ],
  activities: {
    heading: 'Activities',
    items: [
      'Participated in the "Take Off" and "Unlock the Algorithm" programming contests.',
    ],
  },
};

export const certifications: CertificationsContent = {
  heading: 'Certifications',
  items: [
    {
      title: 'JavaScript Workshop for Absolute Beginners',
      issuer: 'Ostaad',
    },
    {
      title: 'Responsive Web Design Certification',
      issuer: 'freeCodeCamp',
    },
    {
      title: 'Vibe Coding Your First Agent with Google Gemini',
      issuer: 'Google DeepMind',
    },
  ],
};

export const contact: ContactContent = {
  eyebrow: 'Contact',
  heading: 'Contact',
  lead: summarySeeking,
  emailActionLabel: 'Email Firoz',
  email: {
    address: email,
    href: `mailto:${email}`,
  },
  linksHeading: 'Links',
  links: [
    {
      label: 'GitHub',
      value: 'github.com/firoz671',
      href: githubUrl,
      external: true,
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/firoz-al-mahmud-264982243',
      href: linkedin,
      external: true,
    },
  ],
  locationLabel: 'Location',
  cv: {
    label: 'Download CV (PDF)',
    href: '/Firoz-Al-Mahmud-CV.pdf',
  },
};
