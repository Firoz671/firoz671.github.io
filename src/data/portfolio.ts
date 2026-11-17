export interface NavItem {
  label: string;
  href: string;
}

export interface ActionLink {
  label: string;
  href: string | null;
}

export interface Highlight {
  value: string;
  label: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Profile {
  brand: string;
  name: string;
  initials: string;
  location: string;
  ui: {
    skipToContent: string;
    primaryNav: string;
    themeToDark: string;
    themeToLight: string;
    backToTop: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    titleLines: string[];
    lead: string;
    primaryCta: ActionLink;
    secondaryCta: ActionLink;
    highlights: Highlight[];
    panel: {
      title: string;
      status: string;
      rows: Fact[];
    };
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    portraitNote: string;
    facts: Fact[];
  };
  footer: {
    tagline: string;
  };
}

export interface SkillsContent {
  eyebrow: string;
  heading: string;
  intro: string;
  groups: Array<{
    title: string;
    items: string[];
  }>;
}

export type ProjectVisual = 'a' | 'b' | 'c';

export interface Project {
  title: string;
  kind: string;
  summary: string;
  meta: string;
  tags: string[];
  visual: ProjectVisual;
}

export interface ProjectsContent {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Project[];
}

export interface EducationContent {
  eyebrow: string;
  heading: string;
  intro: string;
  listHeading: string;
  items: Array<{
    title: string;
    institution: string;
    period: string;
    note: string;
  }>;
}

export interface CertificationsContent {
  eyebrow: string;
  heading: string;
  intro: string;
  items: Array<{
    title: string;
    issuer: string;
    year: string;
    note: string;
  }>;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string | null;
}

export interface ContactContent {
  eyebrow: string;
  heading: string;
  lead: string;
  email: ActionLink;
  emailCtaLabel: string;
  responseNote: string;
  linksHeading: string;
  links: ContactLink[];
  locationLabel: string;
}

export const profile: Profile = {
  brand: 'TODO Phase 4',
  name: 'TODO Phase 4: full name',
  initials: 'T4',
  location: 'TODO Phase 4: location',
  ui: {
    skipToContent: 'Skip to content',
    primaryNav: 'Primary',
    themeToDark: 'Switch to dark theme',
    themeToLight: 'Switch to light theme',
    backToTop: 'Back to top',
  },
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'TODO Phase 4: availability or status line',
    titleLines: ['TODO Phase 4:', 'your name here'],
    lead: 'TODO Phase 4: one-sentence positioning statement that says who you are and what you do.',
    primaryCta: { label: 'TODO Phase 4: primary action', href: '#contact' },
    secondaryCta: { label: 'TODO Phase 4: secondary action', href: '#projects' },
    highlights: [
      { value: 'TODO', label: 'Phase 4: highlight one' },
      { value: 'TODO', label: 'Phase 4: highlight two' },
      { value: 'TODO', label: 'Phase 4: highlight three' },
    ],
    panel: {
      title: 'TODO Phase 4: overview panel',
      status: 'TODO Phase 4: status',
      rows: [
        { label: 'TODO Phase 4: label', value: 'TODO Phase 4: value' },
        { label: 'TODO Phase 4: label', value: 'TODO Phase 4: value' },
        { label: 'TODO Phase 4: label', value: 'TODO Phase 4: value' },
      ],
    },
  },
  about: {
    eyebrow: 'About',
    heading: 'TODO Phase 4: about heading',
    paragraphs: [
      'TODO Phase 4: first about paragraph. Describe the work, the focus, and the kind of problems worth solving.',
      'TODO Phase 4: second about paragraph. Add the context, values, and the through-line of the career.',
    ],
    portraitNote: 'TODO Phase 4: portrait and a short caption.',
    facts: [
      { label: 'TODO Phase 4: label', value: 'TODO Phase 4: value' },
      { label: 'TODO Phase 4: label', value: 'TODO Phase 4: value' },
      { label: 'TODO Phase 4: label', value: 'TODO Phase 4: value' },
    ],
  },
  footer: {
    tagline: 'TODO Phase 4: footer note or short sign-off.',
  },
};

export const skills: SkillsContent = {
  eyebrow: 'Skills',
  heading: 'TODO Phase 4: skills heading',
  intro: 'TODO Phase 4: a sentence that frames the skill groups and how they are used together.',
  groups: [
    {
      title: 'TODO Phase 4: skill group one',
      items: [
        'TODO Phase 4: skill one',
        'TODO Phase 4: skill two',
        'TODO Phase 4: skill three',
        'TODO Phase 4: skill four',
      ],
    },
    {
      title: 'TODO Phase 4: skill group two',
      items: [
        'TODO Phase 4: skill one',
        'TODO Phase 4: skill two',
        'TODO Phase 4: skill three',
        'TODO Phase 4: skill four',
      ],
    },
    {
      title: 'TODO Phase 4: skill group three',
      items: [
        'TODO Phase 4: skill one',
        'TODO Phase 4: skill two',
        'TODO Phase 4: skill three',
        'TODO Phase 4: skill four',
      ],
    },
  ],
};

export const projects: ProjectsContent = {
  eyebrow: 'Projects',
  heading: 'TODO Phase 4: projects heading',
  intro: 'TODO Phase 4: a sentence about the kind of work these case studies represent.',
  items: [
    {
      title: 'TODO Phase 4: e-commerce storefront one',
      kind: 'E-commerce storefront',
      summary: 'TODO Phase 4: summary of the first storefront, the problem, and what changed.',
      meta: 'TODO Phase 4: role · year',
      tags: ['TODO Phase 4: tag', 'TODO Phase 4: tag', 'TODO Phase 4: tag'],
      visual: 'a',
    },
    {
      title: 'TODO Phase 4: e-commerce storefront two',
      kind: 'E-commerce storefront',
      summary: 'TODO Phase 4: summary of the second storefront and the decisions behind it.',
      meta: 'TODO Phase 4: role · year',
      tags: ['TODO Phase 4: tag', 'TODO Phase 4: tag', 'TODO Phase 4: tag'],
      visual: 'b',
    },
    {
      title: 'TODO Phase 4: data and NLP study',
      kind: 'Data / NLP study',
      summary: 'TODO Phase 4: summary of the data or NLP study, the method, and the finding.',
      meta: 'TODO Phase 4: role · year',
      tags: ['TODO Phase 4: tag', 'TODO Phase 4: tag', 'TODO Phase 4: tag'],
      visual: 'c',
    },
  ],
};

export const education: EducationContent = {
  eyebrow: 'Education',
  heading: 'TODO Phase 4: education and certifications heading',
  intro: 'TODO Phase 4: a short note about training and credentials.',
  listHeading: 'TODO Phase 4: education',
  items: [
    {
      title: 'TODO Phase 4: degree or program',
      institution: 'TODO Phase 4: institution',
      period: 'TODO Phase 4: period',
      note: 'TODO Phase 4: one line about the focus of the program.',
    },
    {
      title: 'TODO Phase 4: second degree or program',
      institution: 'TODO Phase 4: institution',
      period: 'TODO Phase 4: period',
      note: 'TODO Phase 4: one line about the focus of the program.',
    },
  ],
};

export const certifications: CertificationsContent = {
  eyebrow: 'Certifications',
  heading: 'TODO Phase 4: certifications',
  intro: 'TODO Phase 4: a line about how these certifications support the work.',
  items: [
    {
      title: 'TODO Phase 4: certification one',
      issuer: 'TODO Phase 4: issuer',
      year: 'TODO Phase 4: year',
      note: 'TODO Phase 4: one line about what the certification covers.',
    },
    {
      title: 'TODO Phase 4: certification two',
      issuer: 'TODO Phase 4: issuer',
      year: 'TODO Phase 4: year',
      note: 'TODO Phase 4: one line about what the certification covers.',
    },
  ],
};

export const contact: ContactContent = {
  eyebrow: 'Contact',
  heading: 'TODO Phase 4: contact heading',
  lead: 'TODO Phase 4: a sentence inviting the right kind of conversation.',
  email: { label: 'TODO Phase 4: email address', href: null },
  emailCtaLabel: 'TODO Phase 4: email action',
  responseNote: 'TODO Phase 4: response window or note.',
  linksHeading: 'TODO Phase 4: elsewhere',
  links: [
    { label: 'TODO Phase 4: link label', value: 'TODO Phase 4: link value', href: null },
    { label: 'TODO Phase 4: link label', value: 'TODO Phase 4: link value', href: null },
    { label: 'TODO Phase 4: link label', value: 'TODO Phase 4: link value', href: null },
  ],
  locationLabel: 'TODO Phase 4: location label',
};
