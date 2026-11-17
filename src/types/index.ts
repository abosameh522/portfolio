// ---------------------------------------------------------------------------
// Shared types. Edit the files in src/data/ to change all site content.
// ---------------------------------------------------------------------------

export type ProjectCategory = 'Data Engineering' | 'Machine Learning'

export interface ProjectMetric {
  label: string
  value: string
}

export interface Project {
  /** Stable unique key. */
  id: string
  title: string
  /** Short one-liner shown on the card. */
  summary: string
  category: ProjectCategory
  /** Display year, e.g. "2025". */
  year: string
  /** Long-form detail used inside the modal (1–2 short sentences each). */
  problem: string
  approach: string
  result: string
  /** Technology / tool tags. */
  tags: string[]
  /** Full GitHub URL, or null when not public yet (renders a disabled button). */
  githubUrl: string | null
  /** Drives the generated abstract preview artwork. */
  art: 'pipeline' | 'churn' | 'credit' | 'satellite' | 'phishing'
  /** Accent hue used for the generated artwork + card glow. */
  hue: number
  /** Optional metrics — use "TODO: add metric" until real numbers exist. */
  metrics: ProjectMetric[]
}

export interface PipelineStage {
  id: string
  label: string
  description: string
  skills: string[]
}

export interface SocialLink {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'mail' | 'twitter'
}

export interface TimelineItem {
  id: string
  period: string
  title: string
  org: string
  description: string
  type: 'education' | 'project' | 'learning'
  /** Optional official link (used for education entries). */
  link?: string
  /** Optional project id — opens that project's modal when clicked. */
  projectId?: string
}

export interface NavItem {
  label: string
  href: string
  index: string
}
