// import logfmtParser from 'logfmt/lib/logfmt_parser'
// import { retrieveTimeRange } from 'components/Time/TimeRangeHelper'
// import { guardTimeRange, durationToBounds } from './types/Common'
// import { defaultMetricsDuration } from '../Metrics/Helper'

// export const buildTags = (showErrors, statusCode) => {
//   let tags = ''
//   if (showErrors) {
//     tags += 'error=true'
//   }
//   if (statusCode !== 'none') {
//     tags += ' http.status_code=' + statusCode
//   }
//   return convTagsLogfmt(tags)
// }

// export const isErrorTag = ({ key, value }) => key === 'error' && (value === true || value === 'true')

// const convTagsLogfmt = (tags) => {
//   if (!tags) {
//     return ''
//   }
//   const data = logfmtParser.parse(tags)
//   Object.keys(data).forEach(key => {
//     const value = data[key]
//     if (typeof value !== 'string') {
//       data[key] = String(value)
//     }
//   })
//   return JSON.stringify(data)
// }

// export const getTimeRangeMicros = () => {
//   const range = retrieveTimeRange()
//   // Convert any time range (like duration) to bounded from/to
//   const boundsMillis = guardTimeRange(range, durationToBounds, b => b)
//   // Not necessary, we know that guardTimeRange will always send a default
//   const defaultFrom = new Date().getTime() - defaultMetricsDuration * 1000
//   // Convert to microseconds
//   return {
//     from: boundsMillis.from ? boundsMillis.from * 1000 : defaultFrom * 1000,
//     to: boundsMillis.to ? boundsMillis.to * 1000 : undefined
//   }
// }

export const getWorkloadFromSpan = (span) => {
  const nodeKV = span.tags.find(tag => tag.key === 'node_id')
  if (nodeKV) {
    // Example of node value:
    // sidecar~172.17.0.20~ai-locals-6d8996bff-ztg6z.default~default.svc.cluster.local
    const parts = nodeKV.value.split('~')
    if (parts.length < 3) {
      return undefined
    }
    const podWithNamespace = parts[2]
    const nsIdx = podWithNamespace.lastIndexOf('.')
    if (nsIdx >= 0) {
      return extractWorkloadFromPod(podWithNamespace.substring(0, nsIdx), podWithNamespace.substring(nsIdx + 1))
    }
    return undefined
  }
  // Tag not found => try with 'hostname' in process' tags
  const hostnameKV = span.process.tags.find(tag => tag.key === 'hostname')
  if (hostnameKV) {
    const svcNs = span.process.serviceName.split('.')
    return extractWorkloadFromPod(hostnameKV.value, svcNs.length > 1 ? svcNs[1] : '')
  }
  return undefined
}

const replicasetFromPodRegex = /^([a-z0-9-.]+)-[a-z0-9]+$/
const extractWorkloadFromPod = (pod, ns) => {
  const result = replicasetFromPodRegex.exec(pod)
  if (result && result.length === 2) {
    return {
      pod: pod,
      workload: adjustWorkloadNameFromReplicaset(result[1]),
      namespace: ns
    }
  }
  return undefined
}

// Pod template hash should be made of alphanum without vowels, '0', '1' and '3'
// (see https://github.com/kubernetes/kubernetes/blob/release-1.17/staging/src/k8s.io/apimachinery/pkg/util/rand/rand.go#L83)
const templateHashRegex = /^[bcdfghjklmnpqrstvwxz2456789]{6,16}$/
const adjustWorkloadNameFromReplicaset = (replicaset) => {
  // This is a best effort to try to disambiguate deployment-like workloads versus replicaset-like workloads
  // Workloads can be:
  // - foo-fg65h9p7qj (deployment)
  // - bar-replicaset (replicaset)
  // In the first case, we want to keep "foo", but in the second case we need the whole "bar-replicaset" string.
  // This is not 100% guaranteed, there's still a small chance that a replica set is wrongly seen as a deployment-like workload.
  // That happens when:
  // - it contains at least one dash '-'
  // - AND the part after the last dash is:
  //   . between 6 and 16 characters long
  //   . AND compound exclusively of alphanums characters except vowels, '0', '1' and '3'
  const parts = replicaset.split('-')
  if (parts.length < 2) {
    return replicaset
  }
  const templateHashCandidate = parts[parts.length - 1]
  if (templateHashRegex.test(templateHashCandidate)) {
    return replicaset.substring(0, replicaset.length - templateHashCandidate.length - 1)
  }
  return replicaset
}

export const searchParentWorkload = (span) => {
  if (Array.isArray(span.references)) {
    const ref = span.references.find(s => s.refType === 'CHILD_OF' || s.refType === 'FOLLOWS_FROM')
    if (ref && ref.span) {
      return getWorkloadFromSpan(ref.span)
    }
  }
  return undefined
}

export const getAppFromSpan = (span) => {
  const split = span.process.serviceName.split('.')
  return { app: split[0], namespace: split.length > 1 ? split[1] : '' }
}

export const searchParentApp = (span) => {
  if (Array.isArray(span.references)) {
    const ref = span.references.find(s => s.refType === 'CHILD_OF' || s.refType === 'FOLLOWS_FROM')
    if (ref && ref.span) {
      return getAppFromSpan(ref.span)
    }
  }
  return undefined
}

export const getSpanType = (span) => {
  const component = span.tags.find(tag => tag.key === 'component')
  if (component?.value === 'proxy') {
    return 'envoy'
  }
  if (span.tags.some(t => t.key.startsWith('http.'))) {
    return 'http'
  }
  if (span.tags.some(t => t.key.startsWith('peer.'))) {
    return 'tcp'
  }
  return 'unknown'
}

export const extractOpenTracingBaseInfo = (span) => {
  const info = { hasError: false }
  span.tags.forEach(t => {
    if (t.key === 'component') {
      info.component = t.value
    }
    if (isErrorTag(t)) {
      info.hasError = true
    }
  })
  return info
}

export const extractOpenTracingHTTPInfo = (span) => {
  // See https://github.com/opentracing/specification/blob/master/semantic_conventions.md
  const info = extractOpenTracingBaseInfo(span)
  span.tags.forEach(t => {
    if (t.key === 'http.status_code') {
      const val = parseInt(t.value, 10)
      if (!isNaN(val) && val > 0) {
        info.statusCode = val
      }
    } else if (t.key === 'http.url') {
      info.url = t.value
    } else if (t.key === 'http.method') {
      info.method = t.value
    } else if (t.key === 'span.kind') {
      if (t.value === 'client') {
        info.direction = 'outbound'
      } else if (t.value === 'server') {
        info.direction = 'inbound'
      }
    }
  })
  return info
}

export const extractOpenTracingTCPInfo = (span) => {
  // See https://github.com/opentracing/specification/blob/master/semantic_conventions.md
  const info = extractOpenTracingBaseInfo(span)
  span.tags.forEach(t => {
    if (t.key === 'message_bus.destination') {
      info.topic = t.value
    } else if (t.key === 'peer.address') {
      info.peerAddress = t.value
    } else if (t.key === 'peer.hostname') {
      info.peerHostname = t.value
    } else if (t.key === 'span.kind') {
      if (t.value === 'producer' || t.value === 'client') {
        info.direction = 'outbound'
      } else if (t.value === 'consumer' || t.value === 'server') {
        info.direction = 'inbound'
      }
    }
  })
  return info
}

export const extractEnvoySpanInfo = (span) => {
  const info = extractOpenTracingHTTPInfo(span)
  span.tags.forEach(t => {
    if (t.key === 'response_flags') {
      if (t.value !== '-') {
        info.responseFlags = t.value
      }
    } else if (t.key === 'upstream_cluster') {
      const parts = t.value.split('|')
      if (parts.length === 4) {
        if (parts[0] === 'outbound') {
          const svcParts = parts[3].split('.')
          if (svcParts.length === 5) {
            info.direction = 'outbound'
            info.peer = {
              name: svcParts[0],
              namespace: svcParts[1],
              kind: 'service'
            }
          }
        } else if (parts[0] === 'inbound') {
          const wkdNs = searchParentWorkload(span)
          if (wkdNs) {
            info.direction = 'inbound'
            info.peer = {
              name: wkdNs.workload,
              namespace: wkdNs.namespace,
              kind: 'workload'
            }
          }
        }
      }
    }
  })
  return info
}

export const extractSpanInfo = (span) => {
  const type = getSpanType(span)
  const info =
    type === 'envoy'
      ? extractEnvoySpanInfo(span)
      : type === 'http'
        ? extractOpenTracingHTTPInfo(span)
        : type === 'tcp'
          ? extractOpenTracingTCPInfo(span)
          : extractOpenTracingBaseInfo(span)
  return { type: type, info: info }
}

export const sameSpans = (a, b) => {
  return a.map(s => s.spanID).join() === b.map(s => s.spanID).join()
}
