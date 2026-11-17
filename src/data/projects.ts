import type { Project } from '../types'

// ---------------------------------------------------------------------------
// Projects — edit here to add/remove/reorder work.
// `githubUrl` powers the card link, the modal buttons and the command palette.
// Metrics keep null values until verified numbers exist — never invent figures.
// The modal hides any metric whose value is null.
// ---------------------------------------------------------------------------
export const projects: Project[] = [
  {
    id: 'ecommerce-data-pipeline',
    title: 'E-commerce Data Pipeline',
    summary: 'An end-to-end ETL/ELT pipeline that turns raw e-commerce events into query-ready tables.',
    category: 'Data Engineering',
    year: '2025',
    problem: 'Orders, customers and clickstream events arrive inconsistent and duplicated across sources, making them hard to trust.',
    approach: 'I built a modular extract → validate → transform → load pipeline with a star schema and orchestrated, logged runs.',
    result: 'Clean, reproducible datasets ready for downstream services and ML workflows.',
    tags: ['Python', 'SQL', 'Pandas', 'ETL', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/abosameh522/ecommerce-data-pipeline',
    art: 'pipeline',
    hue: 190,
    metrics: [
      { label: 'Records processed', value: null },
      { label: 'Pipeline stages', value: null },
    ],
  },
  {
    id: 'customer-churn-prediction',
    title: 'Customer Churn Prediction',
    summary: 'A machine-learning pipeline that flags customers likely to churn before they leave.',
    category: 'Machine Learning',
    year: '2025',
    problem: 'Churn is usually spotted too late, so businesses need an early-warning signal from customer data.',
    approach: 'I handled imbalance and missing values, engineered tenure features, then trained and compared several classifiers.',
    result: 'A validated model with a reusable inference path and documented trade-offs.',
    tags: ['Python', 'Pandas', 'scikit-learn', 'Feature Engineering', 'Model Evaluation'],
    githubUrl: 'https://github.com/abosameh522/customer-churn-prediction',
    art: 'churn',
    hue: 265,
    metrics: [
      { label: 'ROC-AUC', value: null },
      { label: 'Models compared', value: null },
    ],
  },
  {
    id: 'credit-risk-analysis',
    title: 'Credit Risk Analysis',
    summary: 'A machine-learning pipeline that models credit risk to support smarter, fairer lending decisions.',
    category: 'Machine Learning',
    year: '2024',
    problem: 'Lenders need to quantify default risk from applicant data without relying on guesswork.',
    approach: 'I built a reproducible pipeline over applicant records, engineered ratio features and trained evaluated classifiers.',
    result: 'A modelling baseline that surfaces the strongest risk drivers.',
    tags: ['Python', 'Pandas', 'SQL', 'scikit-learn', 'Feature Engineering', 'Model Evaluation'],
    githubUrl: 'https://github.com/abosameh522/credit-risk-analysis',
    art: 'credit',
    hue: 330,
    metrics: [
      { label: 'Accuracy', value: null },
      { label: 'Features engineered', value: null },
    ],
  },
  {
    id: 'nile-delta-crop-monitoring',
    title: 'Nile Delta Crop Monitoring',
    summary: 'A geospatial pipeline combining Sentinel-2 imagery and Open-Meteo weather data to monitor crops across the Nile Delta.',
    category: 'Data Engineering',
    year: '2025',
    problem: 'Satellite and weather feeds are scattered and noisy, so crop health is hard to track at scale.',
    approach: 'I ingested and aligned Sentinel-2 bands with Open-Meteo series, computed NDVI and stored pipeline-ready layers.',
    result: 'A repeatable geospatial pipeline that turns raw feeds into interpretable crop-health signals.',
    tags: ['Python', 'Sentinel-2', 'Open-Meteo', 'Geospatial', 'Pandas', 'NDVI'],
    githubUrl: 'https://github.com/abosameh522/delta-crop-monitoring-system',
    art: 'satellite',
    hue: 150,
    metrics: [
      { label: 'Area monitored', value: null },
      { label: 'Data sources', value: '2' },
    ],
  },
  {
    id: 'phishing-url-detection',
    title: 'Phishing URL Detection',
    summary: 'An end-to-end ML system that classifies malicious URLs from their structural and lexical features.',
    category: 'Machine Learning',
    year: '2024',
    problem: 'Phishing URLs look legitimate at a glance and manual review does not scale.',
    approach: 'I extracted lexical and structural features, balanced the dataset and tuned classifiers for precision and recall.',
    result: 'A working classifier plus a reusable feature-extraction pipeline.',
    tags: ['Python', 'scikit-learn', 'Feature Engineering', 'Pandas', 'FastAPI'],
    githubUrl: 'https://github.com/abosameh522/phishing-url-detection',
    art: 'phishing',
    hue: 210,
    metrics: [
      { label: 'F1-score', value: null },
      { label: 'URL features', value: null },
    ],
  },
]

export const projectFilters = ['All', 'Data Engineering', 'Machine Learning'] as const
export type ProjectFilter = (typeof projectFilters)[number]
