import type { NavItem, SocialLink } from '../types'

// ---------------------------------------------------------------------------
// Personal details. This is the real content supplied by Ahmed Sameh.
// ---------------------------------------------------------------------------
export const profile = {
  name: 'Ahmed Sameh',
  /** Split into words/lines for the kinetic hero typography. */
  firstName: 'Ahmed',
  lastName: 'Sameh',
  initials: 'AS',
  title: 'Data Engineer',
  /** Exact branding string used in the footer and document title. */
  pageTitle: 'Ahmed Sameh | Data Engineer',
  /** Typing-subtitle cycle, in order. Loops back to the first item. */
  roles: [
    'Data Engineer',
    'ETL Developer',
    'Pipeline Architect',
    'Big Data Enthusiast',
    'ML Enthusiast',
  ],
  location: 'El-Mahalla El-Kubra, Egypt',
  availability: 'Open to Egyptian & remote opportunities',
  email: 'abosameh1342005@gmail.com',
  education: {
    degree: 'B.Sc. in Computer Science and Artificial Intelligence',
    school: 'Faculty of Computers and Information, Mansoura University',
    period: '2023 – expected 2027',
  },
  languages: ['Arabic (native)', 'English'],
  /** Optional photo URL; the monogram is shown when null. */
  photo: null as string | null,
  story:
    'I am a Computer Science & Artificial Intelligence student who fell in love with the moment raw, messy data turns into a clean, reliable stream you can actually reason about. I build end-to-end pipelines that extract, transform and load real-world data, then layer machine learning on top to answer the questions that matter. Big Data is my complementary track — the bigger the dataset, the more interesting the problem.',
} as const

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home', index: '01' },
  { label: 'About', href: '#about', index: '02' },
  { label: 'Work', href: '#work', index: '03' },
  { label: 'Skills', href: '#skills', index: '04' },
  { label: 'Journey', href: '#journey', index: '05' },
  { label: 'Contact', href: '#contact', index: '06' },
]

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/abosameh522', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmed-sameh-283927414', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
]

/** Secondary GitHub handle kept here for easy reference. */
export const secondaryGithub = 'https://github.com/ahmed-s-bakr'
