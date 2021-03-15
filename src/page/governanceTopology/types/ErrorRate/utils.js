import { serverConfig } from '../../config'
import { generateRateForTolerance } from './ErrorRate'
import { generateRateForGraphTolerance } from './GraphEdgeStatus'

export function emptyRate() {
  return { requestRate: 0, errorRate: 0, errorRatio: 0 }
}
var DEFAULTCONF = {
  http: new RegExp('^[4|5]\\d\\d$'),
  grpc: new RegExp('^[1-9]$|^1[0-6]$')
}
export function requestsErrorRateCode(requests) {
  const rate = emptyRate()
  for (const [protocol, req] of Object.entries(requests)) {
    for (const [code, value] of Object.entries(req)) {
      rate.requestRate += value
      if (Object.keys(DEFAULTCONF).includes(protocol) && DEFAULTCONF[protocol].test(code)) {
        rate.errorRate += value
      }
    }
  }
  return rate.requestRate === 0 ? -1 : (rate.errorRate / rate.requestRate) * 100
}
export function getErrorCodeRate(requests) {
  return { inbound: requestsErrorRateCode(requests.inbound), outbound: requestsErrorRateCode(requests.outbound) }
}
/*
Cached this method to avoid use regexp in next calculations to improve performance
 */
export function checkExpr(value, testV) {
  var reg = value
  if (!reg) {
    return true
  }
  if (typeof value === 'string') {
    reg = eval(value)
  }
  return reg.exec(testV)
}
// Cache the configuration to avoid multiple calls to regExp
export const configCache = {}
export function getRateHealthConfig(ns, name, kind) {
  var key = ns + '_' + kind + '_' + name
  // If we have the configuration cached then return it
  if (configCache[key]) {
    return configCache[key]
  }
  if (serverConfig.healthConfig && serverConfig.healthConfig.rate) {
    for (const rate of serverConfig.healthConfig.rate) {
      if (checkExpr(rate.namespace, ns) && checkExpr(rate.name, name) && checkExpr(rate.kind, kind)) {
        configCache[key] = rate
        return rate
      }
    }
  }
  return serverConfig.healthConfig.rate[serverConfig.healthConfig.rate.length - 1]
}
/*
For Responses object like { "200": { flags: { "-": 1.2, "XXX": 3.1}, hosts: ...} } Transform to RequestType

Return object like:  {"http": { "200": 4.3}}
*/
export function transformEdgeResponses(requests, protocol) {
  const prot = {}
  const result = {}
  result[protocol] = prot

  for (const [code, responseDetail] of Object.entries(requests)) {
    const percentRate = Object.values(responseDetail.flags).reduce(
      (acc, value) => acc + Number(value)
    )
    result[protocol][code] = Number(percentRate)
  }

  return result
}
/*
 For requests type like { "http": { "200": 3.2, "501": 2.3 } ...} and a Tolerance Configuration to apply calculate the RequestToleranceGraph[]

 Return an array object where each item is a type RequestToleranceGraph by tolerance configuration passed by parameter

 Sample:

 [{
  tolerance: TOLERANCE CONFIGURATION,
  requests: {"http": 4.3}
 }]
 where this requests are the sum of rates where match the tolerance configuration.

*/
export function aggregate(request, tolerances, graph = false) {
  const result = []
  if (request && tolerances) {
    for (const tol of Object.values(tolerances)) {
      const newReqTol = { tolerance: tol, requests: {}}
      graph ? generateRateForGraphTolerance(newReqTol, request) : generateRateForTolerance(newReqTol, request)
      result.push(newReqTol)
    }
  }
  return result
}
