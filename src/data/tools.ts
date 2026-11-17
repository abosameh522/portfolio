// ---------------------------------------------------------------------------
// Single source of truth for every clickable tech chip and ticker metric.
// `name` keys must match the chip labels used in projects, skills and marquee.
// ---------------------------------------------------------------------------

export interface ToolInfo {
  /** One line on how I use it in my work. */
  purpose: string
  /** Official documentation URL. */
  docsUrl: string
}

const DOCS = {
  python: 'https://docs.python.org/3/',
  postgres: 'https://www.postgresql.org/docs/',
  pandas: 'https://pandas.pydata.org/docs/',
  spark: 'https://spark.apache.org/docs/latest/',
  airflow: 'https://airflow.apache.org/docs/',
  kafka: 'https://kafka.apache.org/documentation/',
  docker: 'https://docs.docker.com/',
  sklearn: 'https://scikit-learn.org/stable/user_guide.html',
  fastapi: 'https://fastapi.tiangolo.com/',
  git: 'https://git-scm.com/doc',
  dvc: 'https://dvc.org/doc',
  linux: 'https://man7.org/linux/man-pages/',
  openMeteo: 'https://open-meteo.com/en/docs',
  // The Copernicus mission URL currently returns 404; Wikipedia is the
  // reliable fallback here.
  sentinel: 'https://en.wikipedia.org/wiki/Sentinel-2',
  rest: 'https://developer.mozilla.org/en-US/docs/Glossary/REST',
  kimball: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/',
  mdn: 'https://developer.mozilla.org/en-US/docs/Web/API',
  json: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON',
  requests: 'https://requests.readthedocs.io/en/latest/',
  geopandas: 'https://geopandas.org/en/stable/docs.html',
  wikipedia: 'https://en.wikipedia.org/wiki/Extract,_transform,_load',
  ndvi: 'https://en.wikipedia.org/wiki/Normalized_difference_vegetation_index',
} as const

export const tools: Record<string, ToolInfo> = {
  // Core tools
  Python: { purpose: 'My go-to language for pipelines, cleaning and modelling scripts.', docsUrl: DOCS.python },
  SQL: { purpose: 'Queries and transformations against relational warehouses.', docsUrl: DOCS.postgres },
  PostgreSQL: { purpose: 'Stores the curated tables my pipelines produce.', docsUrl: DOCS.postgres },
  Pandas: { purpose: 'In-memory cleaning, reshaping and feature work.', docsUrl: DOCS.pandas },
  Spark: { purpose: 'Distributed transforms when datasets get too big for one machine.', docsUrl: DOCS.spark },
  Airflow: { purpose: 'Schedules and monitors my ETL jobs.', docsUrl: DOCS.airflow },
  Kafka: { purpose: 'Streams events between pipeline stages.', docsUrl: DOCS.kafka },
  Docker: { purpose: 'Packages each pipeline stage into a reproducible container.', docsUrl: DOCS.docker },
  'scikit-learn': { purpose: 'Trains and evaluates my machine-learning models.', docsUrl: DOCS.sklearn },
  FastAPI: { purpose: 'Serves models and data through lightweight REST APIs.', docsUrl: DOCS.fastapi },
  Git: { purpose: 'Version control for every project and experiment.', docsUrl: DOCS.git },
  Linux: { purpose: 'My everyday environment for running and debugging jobs.', docsUrl: DOCS.linux },
  'Git / DVC': { purpose: 'Versions both code and datasets so runs stay reproducible.', docsUrl: DOCS.git },

  // Concepts & sources
  ETL: { purpose: 'The extract → transform → load pattern behind my pipelines.', docsUrl: DOCS.wikipedia },
  APIs: { purpose: 'Pulls source data from external services.', docsUrl: DOCS.mdn },
  'CSV / JSON': { purpose: 'The common file formats I ingest and normalize.', docsUrl: DOCS.json },
  'Web Scraping': { purpose: 'Collects public web data when no API exists.', docsUrl: DOCS.requests },
  'Satellite Imagery': { purpose: 'Raw Earth-observation scenes used in the crop project.', docsUrl: DOCS.sentinel },
  'Sentinel-2': { purpose: 'Provides the multispectral bands for vegetation indices.', docsUrl: DOCS.sentinel },
  'Open-Meteo': { purpose: 'Supplies weather series that complement satellite data.', docsUrl: DOCS.openMeteo },
  'Batch Processing': { purpose: 'Runs large jobs on a schedule rather than per event.', docsUrl: DOCS.airflow },
  'Data Modelling': { purpose: 'Shapes raw records into structures that are easy to query.', docsUrl: DOCS.kimball },
  'Data Warehousing': { purpose: 'Central store for curated, query-ready tables.', docsUrl: DOCS.kimball },
  'Star Schema': { purpose: 'Fact and dimension tables used in my e-commerce pipeline.', docsUrl: DOCS.kimball },
  'Feature Engineering': { purpose: 'Turns raw columns into signals my models can learn from.', docsUrl: 'https://scikit-learn.org/stable/modules/preprocessing.html' },
  'Model Evaluation': { purpose: 'Checks model quality with proper splits and metrics.', docsUrl: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
  'Model Inference': { purpose: 'Serves trained models behind a simple API.', docsUrl: DOCS.fastapi },
  'REST APIs': { purpose: 'The contract my services use to expose data and models.', docsUrl: DOCS.rest },
  Geospatial: { purpose: 'Tools for aligning and analysing location-based data.', docsUrl: DOCS.geopandas },
  NDVI: { purpose: 'Vegetation index derived from red and near-infrared bands.', docsUrl: DOCS.ndvi },
  DVC: { purpose: 'Tracks dataset versions alongside code.', docsUrl: DOCS.dvc },

  // Playground stages (clickable after completion)
  Source: { purpose: 'Where raw data originates — files, APIs and feeds.', docsUrl: DOCS.mdn },
  Ingest: { purpose: 'Moves that data reliably into the system.', docsUrl: DOCS.airflow },
  Transform: { purpose: 'Cleans and reshapes records for downstream use.', docsUrl: DOCS.pandas },
  Store: { purpose: 'Persists curated datasets others can trust.', docsUrl: DOCS.postgres },
  Serve: { purpose: 'Exposes the result through models and APIs.', docsUrl: DOCS.fastapi },
}

/** Ticker metrics — explained in plain English, clearly marked as simulated. */
export interface MetricInfo {
  title: string
  description: string
  docsUrl: string
}

export const tickerMetrics: Record<string, MetricInfo> = {
  'rows processed': {
    title: 'Rows processed',
    description:
      'Throughput: how many records moved through the pipeline. Engineers watch it to spot slowdowns or sudden spikes.\nSimulated data — decorative demo, not a live system.',
    docsUrl: 'https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/index.html',
  },
  'jobs succeeded': {
    title: 'Jobs succeeded',
    description:
      'Success rate against the target SLA: the share of scheduled runs that finished without errors.\nSimulated data — decorative demo, not a live system.',
    docsUrl: 'https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/index.html',
  },
  'pipeline uptime': {
    title: 'Pipeline uptime',
    description:
      'Availability: how long the pipeline stayed healthy and reachable over a period.\nSimulated data — decorative demo, not a live system.',
    docsUrl: 'https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/index.html',
  },
  'packets in flight': {
    title: 'Packets in flight',
    description:
      'Backpressure: records queued between stages. A rising count means a downstream stage cannot keep up.\nSimulated data — decorative demo, not a live system.',
    docsUrl: 'https://airflow.apache.org/docs/apache-airflow/stable/administration-and-deployment/logging-monitoring/index.html',
  },
}
