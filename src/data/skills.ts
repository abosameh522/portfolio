import type { PipelineStage, TimelineItem } from '../types'

// ---------------------------------------------------------------------------
// Skills shown as an interactive Source → Ingest → Transform → Store → Serve
// pipeline in the Skills section.
// ---------------------------------------------------------------------------
export const pipelineStages: PipelineStage[] = [
  {
    id: 'source',
    label: 'Source',
    description: 'Where raw data begins — files, APIs and live feeds.',
    skills: ['APIs', 'CSV / JSON', 'Web Scraping', 'Satellite Imagery', 'Open-Meteo'],
  },
  {
    id: 'ingest',
    label: 'Ingest',
    description: 'Collecting and moving data reliably into the system.',
    skills: ['Python', 'Kafka', 'Airflow', 'Batch Processing'],
  },
  {
    id: 'transform',
    label: 'Transform',
    description: 'Cleaning, validating and shaping data for downstream use.',
    skills: ['Pandas', 'SQL', 'Spark', 'Data Modelling', 'Feature Engineering'],
  },
  {
    id: 'store',
    label: 'Store',
    description: 'Persisting curated datasets that others can trust.',
    skills: ['PostgreSQL', 'Data Warehousing', 'Star Schema', 'Git / DVC'],
  },
  {
    id: 'serve',
    label: 'Serve',
    description: 'Shipping trained models and data through fast, reusable APIs.',
    skills: ['scikit-learn', 'FastAPI', 'REST APIs', 'Docker', 'Model Inference'],
  },
]

/** Flat list used by the marquee and the About counters. */
export const allTools = [
  'Python',
  'SQL',
  'PostgreSQL',
  'Spark',
  'Airflow',
  'Kafka',
  'Docker',
  'Pandas',
  'scikit-learn',
  'FastAPI',
  'Git',
  'Linux',
]

/** Timeline / journey entries. */
export const timeline: TimelineItem[] = [
  {
    id: 'edu-start',
    period: '2023',
    title: 'B.Sc. Computer Science & AI',
    org: 'Mansoura University',
    description:
      'Started the Computer Science and Artificial Intelligence programme at the Faculty of Computers and Information.',
    type: 'education',
    link: 'https://www.mans.edu.eg/',
  },
  {
    id: 'foundations',
    period: '2023 – 2024',
    title: 'Building the foundations',
    org: 'Self-directed learning',
    description:
      'Learned Python, SQL and the fundamentals of data engineering while exploring machine learning and version control.',
    type: 'learning',
  },
  {
    id: 'first-projects',
    period: '2024',
    title: 'First ML & pipeline projects',
    org: 'Project work',
    description:
      'Built credit risk modelling, phishing URL detection and an e-commerce data pipeline — my first end-to-end systems.',
    type: 'project',
    projectId: 'credit-risk-analysis',
  },
  {
    id: 'pipelines',
    period: '2025',
    title: 'Into data engineering',
    org: 'Project work',
    description:
      'Designed an end-to-end e-commerce ETL/ELT pipeline and a customer churn prediction system; explored Big Data tooling.',
    type: 'project',
    projectId: 'ecommerce-data-pipeline',
  },
  {
    id: 'geospatial',
    period: '2025',
    title: 'Geospatial & applied ML',
    org: 'Project work',
    description:
      'Worked with Sentinel-2 satellite imagery and weather data for crop monitoring, and deepened my Big Data and applied ML practice.',
    type: 'project',
    projectId: 'nile-delta-crop-monitoring',
  },
  {
    id: 'future',
    period: '2027 — expected',
    title: 'Graduation & beyond',
    org: 'Mansoura University',
    description:
      'Completing my degree and looking for a junior Data Engineer role where I can keep building systems that move data forward.',
    type: 'education',
    link: 'https://www.mans.edu.eg/',
  },
]
