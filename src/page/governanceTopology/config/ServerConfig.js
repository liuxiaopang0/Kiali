import _ from 'lodash'

import { parseHealthConfig } from './HealthConfig'

export const humanDurations = (config, prefix, suffix) =>
  _.mapValues(config.durations, v => _.reject([prefix, v, suffix], _.isEmpty).join(' '))

const toDurations = (tupleArray) => {
  const obj = {}
  tupleArray.forEach(tuple => {
    obj[tuple[0]] = tuple[1]
  })
  return obj
}

const durationsTuples = [
  [60, '1m'],
  [300, '5m'],
  [600, '10m'],
  [1800, '30m'],
  [3600, '1h'],
  [10800, '3h'],
  [21600, '6h'],
  [43200, '12h'],
  [86400, '1d'],
  [604800, '7d'],
  [2592000, '30d']
]

const computeValidDurations = (cfg) => {
  let filtered = durationsTuples
  if (cfg.prometheus.storageTsdbRetention) {
    // Make sure we'll keep at least one item
    if (cfg.prometheus.storageTsdbRetention <= durationsTuples[0][0]) {
      filtered = [durationsTuples[0]]
    } else {
      filtered = durationsTuples.filter(d => d[0] <= cfg.prometheus.storageTsdbRetention)
    }
  }
  cfg.durations = toDurations(filtered)
}

// Set some defaults. Mainly used in tests, because
// these will be overwritten on user login.
let serverConfig = {
  healthConfig: {
    rate: [
      { kind: '/.*/',
        name: '/.*/',
        namespace: '/.*/',
        tolerance: [
          { code: '/^5\d\d$/', degraded: 0, failure: 10, protocol: '/http/', direction: '/.*/' },
          { code: '/^4\d\d$/', degraded: 10, failure: 20, protocol: '/http/', direction: '/.*/' },
          { code: '/^[1-9]$|^1[0-6]$/', degraded: 0, failure: 10, protocol: '/grpc/', direction: '/.*/' },
          { code: '/^-$/', degraded: 0, failure: 10, protocol: '/http|grpc/', direction: '/.*/' }
        ]
      }
    ]
  },
  installationTag: 'Kiali Console',
  istioAnnotations: {
    istioInjectionAnnotation: 'sidecar.istio.io/inject'
  },
  istioIdentityDomain: 'svc.cluster.local',
  istioNamespace: 'istio-system',
  istioComponentNamespaces: new Map(),
  istioLabels: {
    appLabelName: 'app',
    injectionLabelName: 'istio-injection',
    versionLabelName: 'version'
  },
  kialiFeatureFlags: {
    istioInjectionAction: true
  },
  prometheus: {
    globalScrapeInterval: 15,
    storageTsdbRetention: 21600
  },
  durations: {}
}
computeValidDurations(serverConfig)
export { serverConfig }

export const toValidDuration = (duration) => {
  // Check if valid
  if (serverConfig.durations[duration]) {
    return duration
  }
  // Get closest duration
  for (let i = durationsTuples.length - 1; i >= 0; i--) {
    if (duration > durationsTuples[i][0]) {
      return durationsTuples[i][0]
    }
  }
  return durationsTuples[0][0]
}

export const setServerConfig = (svcConfig) => {
  serverConfig = {
    ...svcConfig,
    durations: {}
  }
  serverConfig.healthConfig = svcConfig.healthConfig
    ? parseHealthConfig(svcConfig.healthConfig)
    : serverConfig.healthConfig

  computeValidDurations(serverConfig)
}

export const isIstioNamespace = (namespace) => {
  if (namespace === serverConfig.istioNamespace) {
    return true
  }
  return serverConfig.istioComponentNamespaces
    ? Object.values(serverConfig.istioComponentNamespaces).includes(namespace)
    : false
}
