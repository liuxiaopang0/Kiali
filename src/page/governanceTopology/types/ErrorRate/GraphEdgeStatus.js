import { ascendingThresholdCheck, RATIO_NA, HEALTHY, NA } from '../Health'

import { aggregate, checkExpr, getRateHealthConfig, transformEdgeResponses } from './utils'

// Graph Edge
/*
 Return the status for the edge from source to target
*/
export function getEdgeHealth(edge, source, target) {
  // We need to check the configuration for item A outbound requests and configuration of B for inbound requests
  const configSource = getRateHealthConfig(source.namespace, source[source.nodeType], source.nodeType)
  const configTarget = getRateHealthConfig(target.namespace, target[target.nodeType], target.nodeType)

  // If there is not tolerances with this configuration we'll use defaults
  const tolerancesSource = configSource.tolerance.filter(tol => checkExpr(tol.direction, 'outbound'))
  const tolerancesTarget = configTarget.tolerance.filter(tol => checkExpr(tol.direction, 'inbound'))

  // Calculate aggregate
  const outboundEdge = aggregate(transformEdgeResponses(edge.responses, edge.protocol), tolerancesSource, true)
  const inboundEdge = aggregate(transformEdgeResponses(edge.responses, edge.protocol), tolerancesTarget, true)

  // Calculate status
  const outboundEdgeStatus = calculateStatusGraph(outboundEdge, edge.responses)
  const inboundEdgeStatus = calculateStatusGraph(inboundEdge, edge.responses)

  // Keep status with more priority
  return outboundEdgeStatus.status.status.priority > inboundEdgeStatus.status.status.priority
    ? outboundEdgeStatus.status
    : inboundEdgeStatus.status
}

/*
  Calculate the RequestToleranceGraph for a requests and a configuration
  Return the calculation in the object RequestToleranceGraph
*/

export function generateRateForGraphTolerance(tol, requests) {
  // If we have a tolerance configuration then calculate
  if (tol.tolerance) {
    // For each requests type {<protocol:string> : { <code: string>: <rate: number> } }
    for (const [protocol, req] of Object.entries(requests)) {
      // Check if protocol configuration match the protocol request
      if (checkExpr(tol.tolerance.protocol, protocol)) {
        // Loop by the status code and rate for each code
        for (const [code, value] of Object.entries(req)) {
          // If code match the regular expression in the configuration then sum the rate
          if (checkExpr(tol.tolerance.code, code)) {
            tol.requests[protocol] = tol.requests[protocol] ? tol.requests[protocol] + value : value
          }
        }
      }
    }
  }
}
/*
Calculate the status of the edge with more priority given the results in requestsTolerances: RequestToleranceGraph[]

Return an object with the status calculated, the protocol and the tolerance configuration that kiali applied
 */
export function calculateStatusGraph(requestsTolerances, traffic) {
  // By default the health is NA
  const result = {
    status: {
      value: RATIO_NA,
      status: NA
    },
    protocol: '',
    toleranceConfig: undefined
  }
  // For each calculate errorRate by tolerance configuration
  for (const reqTol of Object.values(requestsTolerances)) {
    for (const [protocol, rate] of Object.entries(reqTol.requests)) {
      const tolerance =
        reqTol.tolerance && checkExpr(reqTol.tolerance.protocol, protocol) ? reqTol.tolerance : undefined
      // Create threshold for the tolerance
      const thresholds = {
        degraded: tolerance.degraded,
        failure: tolerance.failure,
        unit: '%'
      }
      // Calculate the status
      const auxStatus = ascendingThresholdCheck(rate, thresholds)
      // Check if the status has more priority than the previous one
      if (auxStatus.status.priority > result.status.status.priority) {
        result.status = auxStatus
        result.protocol = protocol
        result.toleranceConfig = reqTol.tolerance
      }
    }
  }
  if (result.status.status === NA && Object.keys(traffic).length > 0) {
    result.status.status = HEALTHY
    result.status.value = 0
  }
  return result
}
