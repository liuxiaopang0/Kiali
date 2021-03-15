// import {
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   ExclamationTriangleIcon,
//   MinusCircleIcon,
//   UnknownIcon
// } from '@patternfly/react-icons';
// import { IconType } from '@patternfly/react-icons/dist/js/createIcon';
import { getName } from '../utils/RateIntervals'
import { PFAlertColor, PfColors } from '../Pf/PfColors'
import { calculateErrorRate } from './ErrorRate'
// import  } from './ServerConfig';
import { serverConfig } from '../config'

// class HealthConfig {
//   items
//   statusConfig
// }

export class HealthItem {
  status
  title
  text
  children
}

export class HealthItemConfig {
  status
  title
  text
  value
  threshold
}

// class HealthSubItem {
//   status
//   text
//   value
//   children
// }

export class WorkloadStatus {
  name
  desiredReplicas
  currentReplicas
  availableReplicas
  syncedProxies
}

export const TRAFFICSTATUS = 'Traffic Status'

const createTrafficTitle = function(time) {
  return TRAFFICSTATUS + ' (Last ' + time + ')'
}

/*
RequestType class
- where the structure is type {<protocol>: {<code>:value ...} ...}

Example: { "http": {"200": 2, "404": 1 ...} ... }
*/
export class RequestHealth {
  inbound
  outbound
}

export class Status {
  name
  color
  priority
  icon
  class
}

export class ProxyStatus {
  CDS
  EDS
  LDS
  RDS
}

export const IDLE = {
  name: 'Idle',
  color: PFAlertColor.InfoBackground,
  priority: 3,
  // icon: MinusCircleIcon,
  class: 'icon-idle'
}

export const FAILURE = {
  name: 'Failure',
  color: PFAlertColor.Danger,
  priority: 3,
  // icon: ExclamationCircleIcon,
  class: 'icon-failure'
}
export const DEGRADED = {
  name: 'Degraded',
  color: PFAlertColor.Warning,
  priority: 2,
  // icon: ExclamationTriangleIcon,
  class: 'icon-degraded'
}
export const HEALTHY = {
  name: 'Healthy',
  color: PFAlertColor.Success,
  priority: 1,
  // icon: CheckCircleIcon,
  class: 'icon-healthy'
}
export const NA = {
  name: 'No health information',
  color: PfColors.Gray,
  priority: 0,
  // icon: UnknownIcon,
  class: 'icon-na'
}

// class Thresholds {
//   degraded
//   failure
//   unit
// }

export class ThresholdStatus {
  value
  status
  violation
}

const POD_STATUS = 'Pod Status'

// Use -1 rather than NaN to allow straigthforward comparison
export const RATIO_NA = -1

export function ratioCheck(availableReplicas, currentReplicas, desiredReplicas, syncedProxies) {
  if (desiredReplicas === 0) {
    return IDLE
  }
  if (
    desiredReplicas > 0 &&
    currentReplicas > 0 &&
    availableReplicas > 0 &&
    (currentReplicas < desiredReplicas || availableReplicas < desiredReplicas)
  ) {
    return DEGRADED
  }
  if (desiredReplicas > 0 && availableReplicas === 0) {
    return FAILURE
  }

  if (desiredReplicas === availableReplicas && availableReplicas !== currentReplicas) {
    return FAILURE
  }

  if (syncedProxies >= 0 && syncedProxies < desiredReplicas) {
    return DEGRADED
  }
  if (
    desiredReplicas === currentReplicas &&
    currentReplicas === availableReplicas &&
    availableReplicas === desiredReplicas
  ) {
    return HEALTHY
  }

  return DEGRADED
}

export function proxyStatusMessage(syncedProxies, desiredReplicas) {
  let msg = ''
  if (syncedProxies < desiredReplicas) {
    const unsynced = desiredReplicas - syncedProxies
    msg = ' (' + unsynced
    msg += unsynced !== 1 ? ' proxies' : ' proxy'
    msg += ' unsynced)'
  }
  return msg
}

export function isProxyStatusSynced(status) {
  return (
    isProxyStatusComponentSynced(status.CDS) &&
    isProxyStatusComponentSynced(status.EDS) &&
    isProxyStatusComponentSynced(status.LDS) &&
    isProxyStatusComponentSynced(status.RDS)
  )
}

export function isProxyStatusComponentSynced(componentStatus) {
  return componentStatus === 'Synced'
}

export function mergeStatus(s1, s2) {
  return s1.priority > s2.priority ? s1 : s2
}

export function ascendingThresholdCheck(value, thresholds) {
  if (value > 0) {
    if (value >= thresholds.failure) {
      return {
        value: value,
        status: FAILURE,
        violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.failure + thresholds.unit
      }
    } else if (value >= thresholds.degraded) {
      return {
        value: value,
        status: DEGRADED,
        violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.degraded + thresholds.unit
      }
    }
  }

  return { value: value, status: HEALTHY }
}

export function getRequestErrorsStatus(ratio, tolerance) {
  if (tolerance && ratio >= 0) {
    const thresholds = {
      degraded: tolerance.degraded,
      failure: tolerance.failure,
      unit: '%'
    }
    return ascendingThresholdCheck(100 * ratio, thresholds)
  }

  return {
    value: RATIO_NA,
    status: NA
  }
}

export function getRequestErrorsSubItem(thresholdStatus, prefix) {
  return {
    status: thresholdStatus.status,
    text: prefix + ': ' + (thresholdStatus.status === NA ? 'No requests' : thresholdStatus.value.toFixed(2) + '%'),
    value: thresholdStatus.status === NA ? 0 : thresholdStatus.value
  }
}

export class Health {
  getGlobalStatus() {
    return this.health.items.map(i => i.status).reduce((prev, cur) => mergeStatus(prev, cur), NA)
  }

  getStatusConfig() {
    const tolConfDefault = serverConfig.healthConfig.rate[serverConfig.healthConfig.rate.length - 1].tolerance
    for (const tol of tolConfDefault) {
      if (this.health.statusConfig && tol === this.health.statusConfig.threshold) {
        return undefined
      }
    }
    return this.health.statusConfig.threshold
  }
}

export class ServiceHealth extends Health {
  static fromJson = (ns, srv, json, ctx) =>
    new ServiceHealth(ns, srv, json.requests, ctx)

  computeItems(ns, srv, requests, ctx) {
    const items = []
    const statusConfig = {}
    if (ctx.hasSidecar) {
      // Request errors
      const reqError = calculateErrorRate(ns, srv, 'service', requests)
      const reqErrorsText =
        reqError.errorRatio.global.status.status === NA
          ? 'No requests'
          : reqError.errorRatio.global.status.value.toFixed(2) + '%'
      const item = {
        title: createTrafficTitle(getName(ctx.rateInterval).toLowerCase()),
        status: reqError.errorRatio.global.status.status,
        children: [
          {
            text: 'Inbound: ' + reqErrorsText,
            status: reqError.errorRatio.global.status.status,
            value: reqError.errorRatio.global.status.value
          }
        ]
      }
      items.push(item)
      statusConfig.title = createTrafficTitle(getName(ctx.rateInterval).toLowerCase())
      statusConfig.status = reqError.errorRatio.global.status.status
      statusConfig.threshold = reqError.errorRatio.global.toleranceConfig
      statusConfig.value = reqError.errorRatio.global.status.value
    } else {
      items.push({
        title: TRAFFICSTATUS,
        status: NA,
        text: 'No Istio sidecar'
      })
    }

    return { items, statusConfig }
  }

  // constructor(ns, srv, requests, ctx) {
  //   super(ServiceHealth.computeItems(ns, srv, requests, ctx))
  // }
}

export class AppHealth extends Health {
  static fromJson(ns, app, json, ctx) {
    new AppHealth(ns, app, json.workloadStatuses, json.requests, ctx)
  }

  computeItems(ns, app, workloadStatuses, requests, ctx) {
    const items = []
    const statusConfig = {}
    {
      // Pods
      const children = workloadStatuses.map(d => {
        const status = ratioCheck(d.availableReplicas, d.currentReplicas, d.desiredReplicas, d.syncedProxies)
        let proxyMessage = ''
        if (d.syncedProxies >= 0) {
          proxyMessage = proxyStatusMessage(d.syncedProxies, d.desiredReplicas)
        }
        return {
          text: d.name + ': ' + d.availableReplicas + ' / ' + d.desiredReplicas + proxyMessage,
          status: status
        }
      })
      const podsStatus = children.map(i => i.status).reduce((prev, cur) => mergeStatus(prev, cur), NA)
      const item = {
        title: POD_STATUS,
        status: podsStatus,
        children: children
      }
      items.push(item)
    }

    // Request errors
    if (ctx.hasSidecar) {
      const reqError = calculateErrorRate(ns, app, 'app', requests)
      const reqIn = reqError.errorRatio.inbound.status
      const reqOut = reqError.errorRatio.outbound.status
      const both = mergeStatus(reqIn.status, reqOut.status)
      const item = {
        title: createTrafficTitle(getName(ctx.rateInterval).toLowerCase()),
        status: both,
        children: [getRequestErrorsSubItem(reqIn, 'Inbound'), getRequestErrorsSubItem(reqOut, 'Outbound')]
      }

      statusConfig.title = createTrafficTitle(getName(ctx.rateInterval).toLowerCase())
      statusConfig.status = reqError.errorRatio.global.status.status
      statusConfig.threshold = reqError.errorRatio.global.toleranceConfig
      statusConfig.value = reqError.errorRatio.global.status.value

      items.push(item)
    }
    return { items, statusConfig }
  }

  // constructor(ns, app, workloadStatuses, requests, ctx) {
  //   super(AppHealth.computeItems(ns, app, workloadStatuses, requests, ctx))
  // }
}

export class WorkloadHealth extends Health {
  static fromJson(ns, workload, json, ctx) {
    new WorkloadHealth(ns, workload, json.workloadStatus, json.requests, ctx)
  }

  computeItems(ns, workload, workloadStatus, requests, ctx) {
    const items = []
    var statusConfig = {}
    {
      // Pods
      const podsStatus = ratioCheck(
        workloadStatus.availableReplicas,
        workloadStatus.currentReplicas,
        workloadStatus.desiredReplicas,
        workloadStatus.syncedProxies
      )
      const item = {
        title: POD_STATUS,
        status: podsStatus,
        children: [
          {
            text:
              workloadStatus.name + ': ' + workloadStatus.availableReplicas + ' / ' + workloadStatus.desiredReplicas,
            status: podsStatus
          }
        ]
      }
      if (podsStatus !== NA && podsStatus !== HEALTHY) {
        item.children = [
          {
            status: podsStatus,
            text: String(
              workloadStatus.desiredReplicas + ' desired pod' + (workloadStatus.desiredReplicas !== 1 ? 's' : '')
            )
          },
          {
            status: podsStatus,
            text: String(
              workloadStatus.currentReplicas + ' current pod' + (workloadStatus.currentReplicas !== 1 ? 's' : '')
            )
          },
          {
            status: podsStatus,
            text: String(
              workloadStatus.availableReplicas + ' available pod' + (workloadStatus.availableReplicas !== 1 ? 's' : '')
            )
          }
        ]

        if (workloadStatus.syncedProxies >= 0) {
          item.children.push({
            status: podsStatus,
            text: String(
              workloadStatus.syncedProxies + ' synced prox' + (workloadStatus.availableReplicas !== 1 ? 'ies' : 'y')
            )
          })
        }
      }
      items.push(item)
    }
    // Request errors
    if (ctx.hasSidecar) {
      const reqError = calculateErrorRate(ns, workload, 'workload', requests)
      const reqIn = reqError.errorRatio.inbound.status
      const reqOut = reqError.errorRatio.outbound.status
      const both = mergeStatus(reqIn.status, reqOut.status)
      const item = {
        title: createTrafficTitle(getName(ctx.rateInterval).toLowerCase()),
        status: both,
        children: [getRequestErrorsSubItem(reqIn, 'Inbound'), getRequestErrorsSubItem(reqOut, 'Outbound')]
      }
      items.push(item)

      statusConfig.title = createTrafficTitle(getName(ctx.rateInterval).toLowerCase())
      statusConfig.status = reqError.errorRatio.global.status.status
      statusConfig.threshold = reqError.errorRatio.global.toleranceConfig
      statusConfig.value = reqError.errorRatio.global.status.value
    }
    return { items, statusConfig }
  }

  // constructor(ns, workload, workloadStatus, requests, ctx) {
  //   super(WorkloadHealth.computeItems(ns, workload, workloadStatus, requests, ctx))
  // }
}

export function healthNotAvailable() {
  return new AppHealth('', '', [], { inbound: {}, outbound: {}}, { rateInterval: 60, hasSidecar: true })
}

// export const NamespaceAppHealth = { [app]: AppHealth }
// export const NamespaceServiceHealth = { [service]: ServiceHealth }
// export const NamespaceWorkloadHealth = { [workload]: WorkloadHealth }

export const WithAppHealth = { health: AppHealth }
export const WithServiceHealth = { health: ServiceHealth }
export const WithWorkloadHealth = { health: WorkloadHealth }

export const WithHealth = WithAppHealth | WithServiceHealth | WithWorkloadHealth
export const hasHealth = (val) => !!val['health']
