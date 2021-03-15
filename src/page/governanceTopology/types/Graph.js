
export const SUMMARY_PANEL_CHART_WIDTH = 250

export const Protocol = {
  GRPC: 'grpc',
  HTTP: 'http',
  TCP: 'tcp'
}

export const EdgeLabelMode = {
  NONE: 'noLabel',
  REQUEST_RATE: 'requestRate',
  REQUEST_DISTRIBUTION: 'requestDistribution',
  RESPONSE_TIME_95TH_PERCENTILE: 'responseTime'
}

export const GraphType = {
  APP: 'app',
  SERVICE: 'service',
  VERSIONED_APP: 'versionedApp',
  WORKLOAD: 'workload'
}

export const GroupByType = {
  APP: 'app',
  NONE: 'none',
  VERSION: 'version'
}

export const NodeType = {
  AGGREGATE: 'aggregate',
  APP: 'app',
  SERVICE: 'service',
  UNKNOWN: 'unknown',
  WORKLOAD: 'workload'
}
export const CytoscapeGlobalScratchNamespace = '_global'
export const UNKNOWN = 'unknown'
