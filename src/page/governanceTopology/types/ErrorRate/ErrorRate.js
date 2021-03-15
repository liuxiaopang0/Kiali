import { checkExpr, emptyRate, getRateHealthConfig, getErrorCodeRate } from './utils'
import { getRequestErrorsStatus, HEALTHY, NA, RATIO_NA } from '../Health'

// Sum the inbound and outbound request for calculating the global status
export function sumRequests(inbound, outbound) {
  var result = {}
  // init result with a deep clone of inbound
  for (var _i = 0, _a = Object.entries(inbound); _i < _a.length; _i++) {
    var _b = _a[_i]
    protocol = _b[0]
    req = _b[1]
    result[protocol] = {}
    for (var _c = 0, _d = Object.entries(req); _c < _d.length; _c++) {
      var _e = _d[_c]
      code = _e[0]
      rate = _e[1]
      result[protocol][code] = rate
    }
  }
  for (var _f = 0, _g = Object.entries(outbound); _f < _g.length; _f++) {
    var _h = _g[_f]
    var protocol = _h[0]
    var req = _h[1]
    if (!Object.keys(result).includes(protocol)) {
      result[protocol] = {}
    }
    for (var _j = 0, _k = Object.entries(req); _j < _k.length; _j++) {
      var _l = _k[_j]
      var code = _l[0]
      var rate = _l[1]
      if (!Object.keys(result[protocol]).includes(code)) {
        result[protocol][code] = 0
      }
      result[protocol][code] += rate
    }
  }
  return result
}

const getAggregate = (requests, conf) => {
  const inboundTolerances = conf.tolerance.filter(tol => checkExpr(tol.direction, 'inbound'))
  const outboundTolerances = conf.tolerance.filter(tol => checkExpr(tol.direction, 'outbound'))

  return {
    global: aggregate(sumRequests(requests.inbound, requests.outbound), conf.tolerance),
    inbound: aggregate(requests.inbound, inboundTolerances),
    outbound: aggregate(requests.outbound, outboundTolerances)
  }
}
export const calculateErrorRate = (ns, name, kind, requests) => {
  // Get the first configuration that match with the case
  const conf = getRateHealthConfig(ns, name, kind)
  // Get aggregate
  const status = getAggregate(requests, conf)
  const globalStatus = calculateStatus(status.global)
  if (globalStatus.status.status !== HEALTHY) {
    return {
      errorRatio: {
        global: globalStatus,
        inbound: calculateStatus(status.inbound),
        outbound: calculateStatus(status.outbound)
      },
      config: conf
    }
  }
  const result = {
    errorRatio: {
      global: globalStatus,
      inbound: calculateStatus(status.inbound),
      outbound: calculateStatus(status.outbound)
    },
    config: conf
  }

  // IF status is HEALTHY return errorCodes
  if (result.errorRatio.inbound.status.status === HEALTHY || result.errorRatio.outbound.status.status === HEALTHY) {
    const valuesErrorCodes = getErrorCodeRate(requests)
    result.errorRatio.inbound.status.value =
      result.errorRatio.inbound.status.status === HEALTHY
        ? valuesErrorCodes.inbound
        : result.errorRatio.inbound.status.value
    result.errorRatio.outbound.status.value =
      result.errorRatio.outbound.status.status === HEALTHY
        ? valuesErrorCodes.outbound
        : result.errorRatio.outbound.status.value
  }

  // In that case we want to keep values
  return result
}

export const calculateStatus = (requestTolerances) => {
  const result = {
    status: {
      value: RATIO_NA,
      status: NA
    },
    protocol: '',
    toleranceConfig: undefined
  }

  for (const reqTol of Object.values(requestTolerances)) {
    for (const [protocol, rate] of Object.entries(reqTol.requests)) {
      const tolerance =
        reqTol.tolerance && checkExpr(reqTol.tolerance.protocol, protocol) ? reqTol.tolerance : undefined
      // Calculate the status for the tolerance provided
      const auxStatus = getRequestErrorsStatus(rate.errorRatio, tolerance)

      // Check the priority of the status
      if (auxStatus.status.priority > result.status.status.priority) {
        result.status = auxStatus
        result.protocol = protocol
        result.toleranceConfig = reqTol.tolerance
      }
    }
  }
  return result
}

export const generateRateForTolerance = (tol, requests) => {
  for (const [protocol, req] of Object.entries(requests)) {
    if (checkExpr(tol.tolerance.protocol, protocol)) {
      for (const [code, value] of Object.entries(req)) {
        if (!Object.keys(tol.requests).includes(protocol)) {
          tol.requests[protocol] = emptyRate()
        }
        tol.requests[protocol].requestRate += Number(value)
        if (checkExpr(tol.tolerance.code, code)) {
          tol.requests[protocol].errorRate += Number(value)
        }
      }
    }
    if (Object.keys(tol.requests).includes(protocol)) {
      if (tol.requests[protocol].requestRate === 0) {
        tol.requests[protocol].errorRatio = -1
      } else {
        tol.requests[protocol].errorRatio =
          tol.requests[protocol].errorRate / tol.requests[protocol].requestRate
      }
    }
  }
}

// Aggregate the results
export const aggregate = (request, tolerances) => {
  const result = []
  if (request && tolerances) {
    for (const tol of Object.values(tolerances)) {
      const newReqTol = { tolerance: tol, requests: {}}
      generateRateForTolerance(newReqTol, request)
      result.push(newReqTol)
    }
  }
  return result
}
