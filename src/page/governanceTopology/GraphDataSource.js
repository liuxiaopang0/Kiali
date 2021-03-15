import store from '@/store'
import { PromisesRegistry } from './utils/CancelablePromises'
import { AppHealth,
  ServiceHealth,
  WorkloadHealth, NA } from './types/Health'
import { decorateGraphData } from './GraphData'
import EventEmitter from 'eventemitter3'
import * as governanceTopologyHttp from '@/http/governanceTopology-http'

export const EMPTY_GRAPH_DATA = { nodes: [], edges: [] }
const PROMISE_KEY = 'CURRENT_REQUEST'

const mergeStatus = (s1, s2) => {
  return s1.priority > s2.priority ? s1 : s2
}
var getNamespaceWorkloadHealth = function(namespace, durationSec) {
  const params = {
    type: 'workload'
  }
  if (durationSec) {
    params.rateInterval = String(durationSec) + 's'
  }
  return governanceTopologyHttp.get_health(namespace, params).then(
    response => {
      var ret = {}
      Object.keys(response).forEach(k => {
        ret[k] = new WorkloadHealth().computeItems(namespace, k, response[k].workloadStatus, response[k].requests, true)
      })
      return ret
    }
  )
}
var getNamespaceAppHealth = function(namespace, durationSec) {
  const params = {
    type: 'app'
  }
  if (durationSec) {
    params.rateInterval = String(durationSec) + 's'
  }
  return governanceTopologyHttp.get_health(namespace, params).then(
    response => {
      var ret = {}
      Object.keys(response).forEach(k => {
        ret[k] = new AppHealth().computeItems(namespace, k, response[k].workloadStatus ? response[k].workloadStatus : [], durationSec, true)
      })
      return ret
    }
  )
}

var getNamespaceServiceHealth = function(namespace, durationSec) {
  const params = {
    type: 'service'
  }
  if (durationSec) {
    params.rateInterval = String(durationSec) + 's'
  }
  return governanceTopologyHttp.get_health(namespace, params).then(
    response => {
      var ret = {}
      Object.keys(response).forEach(k => {
        ret[k] = new ServiceHealth().computeItems(namespace, k, response[k].requests, {
          rateInterval: durationSec,
          hasSidecar: true
        })
      })
      return ret
    }
  )
}

export default class GraphDataSource {
  graphDuration
  graphTimestamp
  _fetchParams
  _isError
  _isLoading
   eventEmitter
  graphElements
  promiseRegistry

  constructor() {
    this.graphElements = EMPTY_GRAPH_DATA
    this.graphDuration = 0
    this.graphTimestamp = 0

    this.eventEmitter = new EventEmitter()
    this.promiseRegistry = new PromisesRegistry()

    this._errorMessage = null
    this._fetchParams = {
      duration: 0,
      edgeLabelMode: 'none',
      graphType: 'versionedApp',
      includeHealth: true,
      injectServiceNodes: true,
      namespaces: [],
      showOperationNodes: false,
      showSecurity: false,
      showUnusedNodes: false
    }
    this._isError = this._isLoading = false
  }

  fetchGraphData = (fetchParams) => {
    const previousFetchParams = this.fetchParameters

    // Copy fetch parameters to a local attribute
    this._fetchParams = { ...fetchParams }

    if (fetchParams.namespaces.length === 0) {
      this._isLoading = this._isError = false
      this.graphElements = EMPTY_GRAPH_DATA
      this.graphDuration = 0
      this.graphTimestamp = 0
      this.emit('emptyNamespaces', fetchParams)
      return
    }

    const restParams = {
      duration: fetchParams.duration + 's',
      graphType: fetchParams.graphType,
      injectServiceNodes: fetchParams.injectServiceNodes
    }

    if (fetchParams.graphType === 'app' || fetchParams.graphType === 'versionedApp') {
      restParams.groupBy = 'app'
    }

    if (fetchParams.queryTime) {
      restParams.queryTime = String(Math.floor(fetchParams.queryTime / 1000))
    }

    // Some appenders are expensive so only specify an appender if needed.
    let appenders = 'deadNode,sidecarsCheck,serviceEntry,istio'

    if (fetchParams.showOperationNodes) {
      appenders += ',aggregateNode'
    }

    if (!fetchParams.node && fetchParams.showUnusedNodes) {
      // note we only use the unusedNode appender if this is NOT a drilled-in node graph and
      // the user specifically requests to see unused nodes.
      appenders += ',unusedNode'
    }

    if (fetchParams.showSecurity) {
      appenders += ',securityPolicy'
    }

    switch (fetchParams.edgeLabelMode) {
      case 'responseTime':
        appenders += ',responseTime'
        break

      case 'requestRate':
      case 'requestDistribution':
      case 'none':
      default:
        break
    }
    restParams.appenders = appenders

    this._isLoading = true
    this._isError = false

    const isPreviousDataInvalid =
      previousFetchParams.namespaces.map(ns => ns.name).join() !==
        this.fetchParameters.namespaces.map(ns => ns.name).join() ||
      previousFetchParams.node !== this.fetchParameters.node ||
      previousFetchParams.graphType !== this.fetchParameters.graphType ||
      previousFetchParams.includeHealth !== this.fetchParameters.includeHealth ||
      previousFetchParams.injectServiceNodes !== this.fetchParameters.injectServiceNodes ||
      previousFetchParams.showOperationNodes !== this.fetchParameters.showOperationNodes ||
      previousFetchParams.showUnusedNodes !== this.fetchParameters.showUnusedNodes

    if (isPreviousDataInvalid) {
      // Reset the graph data
      this.graphElements = EMPTY_GRAPH_DATA
      this.graphDuration = 0
      this.graphTimestamp = 0
    }

    this.emit('loadStart', isPreviousDataInvalid, fetchParams)
    if (fetchParams.node) {
      this.fetchDataForNode(restParams)
    } else {
      this.fetchDataForNamespaces(restParams)
    }
  };

  on = (eventName, callback) => {
    this.eventEmitter.on(eventName, callback)
  };

  removeListener = (eventName, callback) => {
    this.eventEmitter.removeListener(eventName, callback)
  };

  // Some helpers

  fetchForApp = (duration, namespace, app) => {
    const params = this.fetchForAppParams(duration, namespace, app)
    this.fetchGraphData(params)
  };

  fetchForAppParams = (duration, namespace, app) => {
    const params = GraphDataSource.defaultFetchParams(duration, namespace)
    params.graphType = 'app'
    params.node.nodeType = 'app'
    params.node.app = app
    return params
  };

  fetchForWorkload = (duration, namespace, workload) => {
    const params = this.fetchForWorkloadParams(duration, namespace, workload)
    this.fetchGraphData(params)
  };

  fetchForWorkloadParams = (duration, namespace, workload) => {
    const params = GraphDataSource.defaultFetchParams(duration, namespace)
    params.graphType = 'workload'
    params.node.nodeType = 'workload'
    params.node.workload = workload
    return params
  };

  fetchForService = (duration, namespace, service) => {
    const params = this.fetchForServiceParams(duration, namespace, service)
    this.fetchGraphData(params)
  };

  fetchForServiceParams = (duration, namespace, service) => {
    const params = GraphDataSource.defaultFetchParams(duration, namespace)
    params.graphType = 'workload'
    params.node.nodeType = 'service'
    params.node.service = service
    return params
  };

  fetchForNamespace = (duration, namespace) => {
    const params = this.fetchForNamespaceParams(duration, namespace)
    this.fetchGraphData(params)
  };

  fetchForNamespaceParams = (duration, namespace) => {
    const params = GraphDataSource.defaultFetchParams(duration, namespace)
    params.graphType = 'workload'
    params.showSecurity = true
    return params
  };

  // Private methods

  static defaultFetchParams(duration, namespace) {
    return {
      namespaces: [{ name: namespace }],
      duration: duration,
      graphType: 'workload',
      includeHealth: true,
      injectServiceNodes: true,
      edgeLabelMode: 'none',
      showOperationNodes: false,
      showSecurity: false,
      showUnusedNodes: false,
      node: {
        app: '',
        namespace: { name: namespace },
        nodeType: 'unknown',
        service: '',
        version: '',
        workload: ''
      }
    }
  }

  emit = (eventName, ...args) => {
    this.eventEmitter.emit(eventName, ...args)
  };

  fetchDataForNamespaces = (data) => {
    store.commit('set_isLoading', true)
    // restParams.namespaces = this.fetchParameters.namespaces.map(namespace => namespace.name).join(',')
    governanceTopologyHttp.get_graph(data).then(
      response => {
        const responseData = response
        this.graphElements = responseData && responseData.elements ? responseData.elements : EMPTY_GRAPH_DATA
        store.commit('set_graphElements', decorateGraphData(this.graphElements))
        this.graphTimestamp = responseData && responseData.timestamp ? responseData.timestamp : 0
        this.graphDuration = responseData && responseData.duration ? responseData.duration : 0
        console.log(decorateGraphData(this.graphElements), 'this.graphElements')
        const decoratedGraphElements = this.graphData
        if (this.fetchParameters.includeHealth) {
          this.fetchHealth(decoratedGraphElements)
          store.commit('set_isLoading', false)
        } else {
          this._isLoading = this._isError = false
          this.emit(
            'fetchSuccess',
            this.graphTimestamp,
            this.graphDuration,
            decoratedGraphElements,
            this.fetchParameters
          )
        }
      },
      error => {
        this._isLoading = false
        if (error.error) {
          return
        }

        // this._isError = true
        // this._errorMessage = API.getErrorString(error)
        // AlertUtils.addError('Cannot load the graph', error)
        // this.emit('fetchError', `Cannot load the graph: ${this.errorMessage}`, this.fetchParameters)
      }
    )
  };

  fetchDataForNode = (restParams) => {
    this.promiseRegistry.register(PROMISE_KEY, API.getNodeGraphElements(this.fetchParameters.node, restParams)).then(
      response => {
        const responseData = response.data
        this.graphElements = responseData && responseData.elements ? responseData.elements : EMPTY_GRAPH_DATA
        this.graphTimestamp = responseData && responseData.timestamp ? responseData.timestamp : 0
        this.graphDuration = responseData && responseData.duration ? responseData.duration : 0
        const decoratedGraphElements = this.graphData
        if (this.fetchParameters.includeHealth) {
          this.fetchHealth(decoratedGraphElements)
        } else {
          this._isLoading = this._isError = false
          this.emit(
            'fetchSuccess',
            this.graphTimestamp,
            this.graphDuration,
            decoratedGraphElements,
            this.fetchParameters
          )
        }
      },
      error => {
        this._isLoading = false
        if (error.isCanceled) {
          return
        }

        this._isError = true
        this._errorMessage = API.getErrorString(error)
        AlertUtils.addError('Cannot load the graph', error)
        this.emit('fetchError', this.errorMessage, this.fetchParameters)
      }
    )
  };

  // Limit health fetches to only the necessary namespaces for the necessary types
  fetchHealth(decoratedGraphElements) {
    if (!decoratedGraphElements.nodes || decoratedGraphElements.nodes.length === 0) {
      this._isLoading = false
      this.emit('fetchSuccess', this.graphTimestamp, this.graphDuration, decoratedGraphElements, this.fetchParameters)

      return
    }

    const duration = this.fetchParameters.duration
    const appNamespacePromises = new Map()
    const serviceNamespacePromises = new Map()
    const workloadNamespacePromises = new Map()

    const promiseToNode = new Map()

    // Asynchronously fetch health
    for (const node of decoratedGraphElements.nodes) {
      // ignore nodes that can not have health calculated due lack of access or lack of info
      // note: UNKNOWN node is already marked inaccessible
      if (node.data.isInaccessible) {
        continue
      }
      const namespace = node.data.namespace
      const nodeType = node.data.nodeType
      const workload = node.data.workload
      const workloadOk = workload && workload !== '' && workload !== 'unknown'
      // use workload health when workload is set and valid (workload nodes or versionApp nodes)
      const useWorkloadHealth = nodeType === 'workload' || (nodeType === 'app' && workloadOk)

      if (useWorkloadHealth) {
        let promise = workloadNamespacePromises.get(namespace)
        const nodeHealth = { node: node, key: node.data.workload }
        if (!promise) {
          promise = getNamespaceWorkloadHealth(namespace, duration)
          workloadNamespacePromises.set(namespace, promise)
          promiseToNode.set(promise, [nodeHealth])
        } else {
          const nodeHealths = promiseToNode.get(promise)
          nodeHealths.push(nodeHealth)
        }
      } else if (nodeType === 'app') {
        let promise = appNamespacePromises.get(namespace)
        const nodeHealth = { node: node, key: node.data.app }
        if (!promise) {
          promise = getNamespaceAppHealth(namespace, duration)
          appNamespacePromises.set(namespace, promise)
          promiseToNode.set(promise, [nodeHealth])
        } else {
          const nodeHealths = promiseToNode.get(promise)
          nodeHealths.push(nodeHealth)
        }
      } else if (nodeType === 'service') {
        let promise = serviceNamespacePromises.get(namespace)
        const nodeHealth = { node: node, key: node.data.service }
        if (!promise) {
          promise = getNamespaceServiceHealth(namespace, duration)
          serviceNamespacePromises.set(namespace, promise)
          promiseToNode.set(promise, [nodeHealth])
        } else {
          const nodeHealths = promiseToNode.get(promise)
          nodeHealths.push(nodeHealth)
        }
      }
    }

    let healthPromises = Array.from(appNamespacePromises.values())
    healthPromises = healthPromises.concat(Array.from(serviceNamespacePromises.values()))
    healthPromises = healthPromises.concat(Array.from(workloadNamespacePromises.values()))
    new PromisesRegistry().registerAll('HEALTH_PROMISES', healthPromises).then(
      nsHealths => {
        nsHealths.forEach((nsHealth, i) => {
          promiseToNode.get(healthPromises[i]).forEach(nh => {
            const health = nsHealth[nh.key]
            if (health) {
              nh.node.data.health = health
              nh.node.data.healthStatus = health.items.map(i => i.status).reduce((prev, cur) => mergeStatus(prev, cur), NA).name
            } else {
              nh.node.data.healthStatus = NA.name
              console.debug(`No health found for [${nh.node.data.nodeType}] [${nh.key}]`)
            }
          })
        })
        this._isLoading = false
        // this.emit(
        //   'fetchSuccess',
        //   this.graphTimestamp,
        //   this.graphDuration,
        //   decoratedGraphElements,
        //   this.fetchParameters
        // )
      },
      error => {
        this._isLoading = false
        if (error.isCanceled) {
          return
        }

        this._isError = true
        this._errorMessage = API.getErrorString(error)
        AlertUtils.addError('Cannot load the graph [health]', error)
        this.emit('fetchError', this.errorMessage, this.fetchParameters)
      }
    )
  }

  // Getters and setters
  get graphData() {
    return this.graphElements
  }

  get graphDefinition() {
    return {
      duration: this.graphDuration,
      elements: this.graphElements,
      timestamp: this.graphTimestamp,
      graphType: this.fetchParameters.graphType
    }
  }

  get errorMessage() {
    return this._errorMessage
  }

  get fetchParameters() {
    return this._fetchParams
  }

  get isError() {
    return this._isError
  }

  get isLoading() {
    return this._isLoading
  }
}
