<template>
  <div style="height: 100%; width: 100%;background-color: #f5f5f5">
    <div id="cytoscape_id" style="height: 100%; width: 100%;"></div>
  </div>
</template>

<script>
import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import coseBilkent from 'cytoscape-cose-bilkent'
import dagre from 'cytoscape-dagre'
import popper from 'cytoscape-popper'
import canvas from 'cytoscape-canvas'
import cycola from 'cytoscape-cola'
const nodeHtmlLabel = require('cy-node-html-label')

cytoscape.use(canvas)
cytoscape.use(cycola)
cytoscape.use(cola)
cytoscape.use(dagre)
cytoscape.use(popper)
cytoscape.use(coseBilkent)
nodeHtmlLabel(cytoscape)

import NodeImageKey from '@/assets/img/node-background-key.png'
import NodeImageTopology from '@/assets/img/node-background-topology.png'

export default {
  name: 'CJS',
  props: ['autoungrabify', 'nodes', 'edges', 'data'],
  data() {
    return {
      HEALTHY: {
        name: 'Healthy',
        color: '#3e8635',
        priority: 1,
        class: 'icon-healthy'
      },

      NA: {
        name: 'No health information',
        color: '#6a6e73',
        priority: 0,
        class: 'icon-na'
      },

      start: [
        { 'centos7ssh': { 'workloadStatuses': [{ 'name': 'centos7ssh', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh-1': { 'workloadStatuses': [{ 'name': 'centos7ssh-1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'details': { 'workloadStatuses': [{ 'name': 'details-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'minio': { 'workloadStatuses': [{ 'name': 'argo-artifacts', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'nginx-ds': { 'workloadStatuses': [{ 'name': 'nginx-ds1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'productpage': { 'workloadStatuses': [{ 'name': 'productpage-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'ratings': { 'workloadStatuses': [{ 'name': 'ratings-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'reviews': { 'workloadStatuses': [{ 'name': 'reviews-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, { 'name': 'reviews-v2', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }], 'requests': { 'inbound': {}, 'outbound': {}}}, 'swfs-ca1': { 'workloadStatuses': [{ 'name': 'swfs-ca1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }], 'requests': { 'inbound': {}, 'outbound': {}}}},
        { 'argo-artifacts': { 'workloadStatus': { 'name': 'argo-artifacts', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh': { 'workloadStatus': { 'name': 'centos7ssh', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh-1': { 'workloadStatus': { 'name': 'centos7ssh-1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'details-v1': { 'workloadStatus': { 'name': 'details-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'nginx-ds1': { 'workloadStatus': { 'name': 'nginx-ds1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'productpage-v1': { 'workloadStatus': { 'name': 'productpage-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'quickstart-es-default': { 'workloadStatus': { 'name': 'quickstart-es-default', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'ratings-v1': { 'workloadStatus': { 'name': 'ratings-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'reviews-v1': { 'workloadStatus': { 'name': 'reviews-v1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'reviews-v2': { 'workloadStatus': { 'name': 'reviews-v2', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': 0 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-filer': { 'workloadStatus': { 'name': 'seaweed1-filer', 'desiredReplicas': 3, 'currentReplicas': 3, 'availableReplicas': 0, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-master': { 'workloadStatus': { 'name': 'seaweed1-master', 'desiredReplicas': 3, 'currentReplicas': 3, 'availableReplicas': 3, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-volume': { 'workloadStatus': { 'name': 'seaweed1-volume', 'desiredReplicas': 3, 'currentReplicas': 3, 'availableReplicas': 0, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}, 'swfs-ca1': { 'workloadStatus': { 'name': 'swfs-ca1', 'desiredReplicas': 1, 'currentReplicas': 1, 'availableReplicas': 1, 'syncedProxies': -1 }, 'requests': { 'inbound': {}, 'outbound': {}}}},
        { 'argo-artifacts': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh-headless': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh-headless-1': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh-nodeport': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'centos7ssh-nodeport-1': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'details': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'kubernetes': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'productpage': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'quickstart-es-default': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'quickstart-es-http': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'quickstart-es-transport': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'ratings': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'reviews': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-filer': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-filer-peer': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-master': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-master-peer': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-volume-0': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-volume-1': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-volume-2': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'seaweed1-volume-peer': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'swfs-ca': { 'requests': { 'inbound': {}, 'outbound': {}}}, 'swfs-ca-headless': { 'requests': { 'inbound': {}, 'outbound': {}}}}
      ]
    }
  },
  beforeCreate() {
    this.$cy && this.$cy.destroyed() && this.$cy.destroy()
    delete this.$cy
  },
  beforeDestroy() {
    this.$cy && this.$cy.destroyed() && this.$cy.destroy()
    delete this.$cy
  },
  watch: {
    autoungrabify(newValue, oldValue) {
      this.$cy.autoungrabify(!newValue)
    }
  },
  mounted() {
    this.createCytoscape()
  },
  methods: {
    /**
     * @param eles 元素集合.
     */
    getNodeBackgroundImage(ele) {
      const nodeData = this.decoratedNodeData(ele)
      const isInaccessible = nodeData.isInaccessible
      const isServiceEntry = nodeData.isServiceEntry
      const isGroup = nodeData.isGroup
      // console.log(isInaccessible && !isServiceEntry && !isGroup, isOutside && !isGroup, '2323', nodeData)
      if (isInaccessible && !isServiceEntry && !isGroup) {
        return NodeImageKey
      }
      const isOutside = nodeData.isOutside
      if (isOutside && !isGroup) {
        return NodeImageTopology
      }
      return 'none'
    },
    decoratedNodeData(ele) {
      return ele.data()
    },
    getNodeShape(ele) {
      const nodeData = this.decoratedNodeData(ele)
      const nodeType = nodeData.nodeType
      switch (nodeType) {
        case 'aggregate':
          return 'round-pentagon'
        case 'app':
          return 'round-rectangle'
        case 'service':
          return nodeData.isServiceEntry ? 'round-tag' : 'round-triangle'
        case 'unknown':
          return 'ellipse'
        case 'workload':
          return 'ellipse'
        default:
          return 'ellipse'
      }
    },
    getNodeborderColor(ele) {
      // console.log(ele.data('healthStatus'), '232323')
      switch (ele.data('healthStatus')) {
        case 'Degraded':
          return '#FFA500'
        case 'Failure':
          return 'red'
        default:
          return '#CCCCCC'
      }
    },
    getEdgeLabel(ele, includeProtocol) {
      console.log(ele, includeProtocol, 'getEdgeLabel')
      // const cyGlobal = {
      //   activeNamespaces: [
      //     { name: 'default' }, { name: 'istio-system' }
      //   ],
      //   edgeLabelMode: 'requestRate',
      //   graphType: 'app',
      //   mtlsEnabled: false,
      //   showCircuitBreakers: true,
      //   showMissingSidecars: true,
      //   showNodeLabels: true,
      //   showSecurity: false,
      //   showVirtualServices: true
      // }
      const cyGlobal = this.getCyGlobalData(ele)
      const edgeLabelMode = cyGlobal.edgeLabelMode
      console.log(edgeLabelMode, 'edgeLabelMode')
      let content = ''
      const edgeData = this.decoratedEdgeData(ele)

      switch (edgeLabelMode) {
        case 'requestRate': {
          let rate = 0
          let pErr = 0
          if (edgeData.http > 0) {
            rate = edgeData.http
            pErr = edgeData.httpPercentErr > 0 ? edgeData.httpPercentErr : 0
          } else if (edgeData.grpc > 0) {
            rate = edgeData.grpc
            pErr = edgeData.grpcPercentErr > 0 ? edgeData.grpcPercentErr : 0
          } else if (edgeData.tcp > 0) {
            rate = edgeData.tcp
          }

          if (rate > 0) {
            if (pErr > 0) {
              let sErr = pErr.toFixed(1)
              sErr = `${sErr.endsWith('.0') ? pErr.toFixed(0) : sErr}`
              content = `${rate.toFixed(2)}\n${sErr}%`
            } else {
              content = rate.toFixed(2)
            }
          }
          break
        }
        case 'responseTime': {
          // todo: remove this logging once we figure out the strangeness going on with responseTime
          const logResponseTime = edgeData.responseTime
          if (!isNaN(logResponseTime) && !Number.isInteger(logResponseTime)) {
            console.log(`Unexpected string responseTime=|${logResponseTime}|`)
          }
          // hack to fix responseTime is sometimes a string during runtime even though its type is number
          const responseTimeNumber = parseInt(String(edgeData.responseTime))
          const responseTime = responseTimeNumber > 0 ? responseTimeNumber : 0
          if (responseTime && responseTime > 0) {
            content = responseTime < 1000.0 ? `${responseTime.toFixed(0)}ms` : `${(responseTime / 1000.0).toFixed(2)}s`
          }
          break
        }
        case 'requestDistribution': {
          let pReq
          if (edgeData.httpPercentReq > 0) {
            pReq = edgeData.httpPercentReq
          } else if (edgeData.grpcPercentReq > 0) {
            pReq = edgeData.grpcPercentReq
          }
          if (pReq > 0) {
            const sReq = pReq.toFixed(1)
            content = `${sReq.endsWith('.0') ? pReq.toFixed(0) : sReq}%`
          }
          break
        }
        default:
          content = ''
      }

      if (includeProtocol) {
        const protocol = edgeData.protocol
        content = protocol ? `${protocol} ${content}` : content
      }

      const mtlsPercentage = edgeData.isMTLS
      if (cyGlobal.showSecurity && edgeData.hasTraffic) {
        if (cyGlobal.mtlsEnabled) {
          if (!mtlsPercentage || mtlsPercentage < 100) {
            content = `'\uE065 ' ${content}`
          }
        } else {
          if (mtlsPercentage && mtlsPercentage > 0) {
            content = `'\uE02a ' ${content}`
          }
        }
      }

      if (edgeData.hasTraffic && edgeData.responses) {
        const dest = this.decoratedNodeData(ele.target())
        if (dest.hasCB) {
          const responses = edgeData.responses
          for (const code of _.keys(responses)) {
            // TODO: Not 100% sure we want "UH" code here ("no healthy upstream hosts") but based on timing I have
            // seen this code returned and not "UO". "UO" is returned only when the circuit breaker is caught open.
            // But if open CB is responsible for removing possible destinations the "UH" code seems preferred.
            if (responses[code]['UO'] || responses[code]['UH']) {
              content = `'\uE02a ' ${content}`
              break
            }
          }
        }
      }
      console.log(content, 'content')
      return content
    },
    getCyGlobalData(ele) {
      console.log(ele, 'ele.cy().scratch')
      return ele.cy().scratch('_global')
      // return ele.cy().scratch('_private')
    },
    decoratedEdgeData(ele) {
      return ele.data()
    },
    getEdgeColor(ele) {
      const edgeData = this.decoratedEdgeData(ele)

      if (!edgeData.hasTraffic) {
        return '#8b8d8f'
      }
      if (edgeData.protocol === 'tcp') {
        return '#004368'
      }

      const sourceNodeData = this.decoratedNodeData(ele.source())
      const destNodeData = this.decoratedNodeData(ele.target())
      const statusEdge = this.getEdgeHealth(edgeData, sourceNodeData, destNodeData)

      switch (statusEdge.status) {
        case 'FAILURE':
          return 'red'
        case 'DEGRADED':
          return '#FFA500'
        default:
          return '#3e8635'
      }
    },
    getEdgeHealth(edge, source, target) {
      const configSource = this.getRateHealthConfig(source.namespace, source[source.nodeType], source.nodeType)
      const configTarget = this.getRateHealthConfig(target.namespace, target[target.nodeType], target.nodeType)

      const tolerancesSource = configSource ? configSource.tolerance.filter(tol => this.checkExpr(tol.direction, 'outbound')) : ''
      const tolerancesTarget = configTarget ? configTarget.tolerance.filter(tol => this.checkExpr(tol.direction, 'inbound')) : ''

      const outboundEdge = this.aggregate(this.transformEdgeResponses(edge.responses, edge.protocol), tolerancesSource, true)
      const inboundEdge = this.aggregate(this.transformEdgeResponses(edge.responses, edge.protocol), tolerancesTarget, true)

      const outboundEdgeStatus = this.calculateStatusGraph(outboundEdge, edge.responses)
      const inboundEdgeStatus = this.calculateStatusGraph(inboundEdge, edge.responses)

      return outboundEdgeStatus.status.status.priority > inboundEdgeStatus.status.status.priority
        ? outboundEdgeStatus.status
        : inboundEdgeStatus.status
    },
    calculateStatusGraph(requestsTolerances, traffic) {
      const result = {
        status: {
          value: -1,
          status: this.NA
        },
        protocol: '',
        toleranceConfig: undefined
      }
      // For each calculate errorRate by tolerance configuration
      for (const reqTol of Object.values(requestsTolerances)) {
        for (const [protocol, rate] of Object.entries(reqTol.requests)) {
          const tolerance =
              reqTol.tolerance && this.checkExpr(reqTol ? reqTol.tolerance ? reqTol.tolerance.protocol : '' : '', protocol) ? reqTol.tolerance : undefined
          // Create threshold for the tolerance
          const thresholds = {
            degraded: tolerance ? tolerance.degraded : '',
            failure: tolerance ? tolerance.failure : '',
            unit: '%'
          }
          // Calculate the status
          const auxStatus = this.scendingThresholdCheck(rate, thresholds)
          // Check if the status has more priority than the previous one
          if (auxStatus.status.priority > result.status.status.priority) {
            result.status = auxStatus
            result.protocol = protocol
            result.toleranceConfig = reqTol.tolerance
          }
        }
      }
      if (result.status.status === this.NA && Object.keys(traffic).length > 0) {
        result.status.status = this.HEALTHY
        result.status.value = 0
      }
      return result
    },
    ascendingThresholdCheck(value, thresholds) {
      if (value > 0) {
        if (value >= thresholds.failure) {
          return {
            value: value,
            status: 'FAILURE',
            violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.failure + thresholds.unit
          }
        } else if (value >= thresholds.degraded) {
          return {
            value: value,
            status: 'DEGRADED',
            violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.degraded + thresholds.unit
          }
        }
      }

      return { value: value, status: this.HEALTHY }
    },
    transformEdgeResponses(requests, protocol) {
      const prot = {}
      const result = {}
      result[protocol] = prot

      for (const [code, responseDetail] of Object.entries(requests)) {
        const percentRate = Object.values((responseDetail).flags).reduce(
          (acc, value) => acc + Number(value)
        )
        result[protocol][code] = Number(percentRate)
      }

      return result
    },
    getRateHealthConfig(ns, name, kind) {
      const configCache = {}
      const serverConfig = {
        healthConfig: {
          rate: []
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
      const key = ns + '_' + kind + '_' + name
      // If we have the configuration cached then return it
      if (configCache[key]) {
        return configCache[key]
      }
      if (serverConfig.healthConfig && serverConfig.healthConfig.rate) {
        for (const rate of serverConfig.healthConfig.rate) {
          if (this.checkExpr(rate.namespace, ns) && this.checkExpr(rate.name, name) && this.checkExpr(rate.kind, kind)) {
            configCache[key] = rate
            return rate
          }
        }
      }
      return serverConfig.healthConfig.rate[serverConfig.healthConfig.rate.length - 1]
    },
    checkExpr(value, testV) {
      let reg = value
      if (!reg) {
        return true
      }
      if (typeof value === 'string') {
        reg = new RegExp(value)
      }
      return (reg).test(testV)
    },

    createCytoscape() {
      const globalScratchData = {
        // activeNamespaces: this.props.graphData.fetchParams.namespaces,
        // edgeLabelMode: this.props.edgeLabelMode,
        // graphType: this.props.graphData.fetchParams.graphType,
        // mtlsEnabled: this.props.isMTLSEnabled,
        // showCircuitBreakers: this.props.showCircuitBreakers,
        // showMissingSidecars: this.props.showMissingSidecars,
        // showSecurity: this.props.showSecurity,
        // showNodeLabels: this.props.showNodeLabels,
        // showVirtualServices: this.props.showVirtualServices
        activeNamespaces: [], // 选中了几个分区
        edgeLabelMode: 'noLabel',
        graphType: 'app',
        mtlsEnabled: false,
        showCircuitBreakers: true,
        showMissingSidecars: true,
        showNodeLabels: true,
        showSecurity: false,
        showVirtualServices: true
      }
      // cytoscape.warnings(false)
      this.$cy = cytoscape({
        boxSelectionEnabled: false,
        autounselectify: false,
        userZoomingEnabled: true, // 是否允许用户事件（例如鼠标滚轮，捏合缩放）缩放图形
        wheelSensitivity: 0.1, // 缩放时更改滚轮灵敏度。
        autoungrabify: !this.autoungrabify, // 节点是否可以拖拽
        minZoom: 1e-50, // 图表缩放得最小界限
        maxZoom: 1e50, // 图表缩放级别的最大界限.视口的缩放比例不能大于此缩放级别.
        container: document.getElementById('cytoscape_id'),
        layout: {
          name: 'dagre',
          fit: false,
          nodeDimensionsIncludeLabels: true,
          rankDir: 'LR'
        },
        style: [
          {
            selector: 'node',
            style: {
              // label: 'data(app)',
              // content: 'data(app)',
              'background-color': '#fff',
              'background-image': (ele) => {
                return this.getNodeBackgroundImage(ele)
              },
              'background-width': '80%',
              'background-height': '80%',
              'background-position-x': (ele) => {
                if (this.getNodeShape(ele) === 'round-tag') {
                  return '0'
                }
                return '50%'
              },
              'background-position-y': (ele) => {
                if (this.getNodeShape(ele) === 'round-triangle') {
                  return '6px'
                }
                return '50%'
              },
              'border-color': (ele) => {
                return this.getNodeborderColor(ele)
              },
              'border-style': (ele) => {
                return this.decoratedNodeData(ele).isUnused ? 'dotted' : 'solid'
              },
              'border-width': '1px',
              ghost: 'yes',
              'ghost-offset-x': 1,
              'ghost-offset-y': 1,
              'ghost-opacity': 0.4,
              height: '25px',
              shape: (ele) => {
                return this.getNodeShape(ele)
              },
              width: '25px',
              'z-index': 10
            }
          },
          // 节点是一个应用程序框
          {
            selector: `node[?isGroup]`,
            css: {
              'background-color': '#fff'
            }
          },
          // 选择节点
          {
            selector: 'node:selected',
            style: {
              'border-color': (ele) => {
                console.log(ele, ele.data(), 'ele.data()', ele.data('healthStatus'))
                switch (ele.data('healthStatus')) {
                  case 'Degraded':
                    return '#FFA500'
                  case 'Failure':
                    return 'red'
                  default:
                    return '#CCCCCC'
                }
              },
              'border-width': '3px'
            }
          },
          // 节点被突出显示（请参阅GraphHighlighter.ts）
          {
            selector: 'node.mousehighlight',
            style: {
              'font-size': '11px'
            }
          },
          // 除“应用程序框”以外的节点被突出显示（请参见GraphHighlighter.ts）
          {
            // 选中的图标颜色
            selector: `node.mousehighlight[^isGroup]`,
            style: {
              'background-color': (ele) => {
                switch (ele.data('healthStatus')) {
                  case 'DEGRADED':
                    return '#FFA500'
                  case 'FAILURE':
                    return '#ffe6e6'
                  default:
                    return '#def3ff'
                }
              },
              'border-color': (ele) => {
                switch (ele.data('healthStatus')) {
                  case 'DEGRADED':
                    return '#FFA500'
                  case 'FAILURE':
                    return 'red'
                  default:
                    return '#39a5dc'
                }
              }
            }
          },
          // 节点为灰色（请参见GraphHighlighter.ts）
          {
            selector: 'node.mousedim',
            style: {
              opacity: 0.6
            }
          },
          {
            selector: 'node.mousehover',
            style: {
              label: (ele) => {
                return this.getEdgeLabel(ele, true)
              }
            }
          },
          // {
          //   selector: ':parent',
          //   css: {
          //     'text-valign': 'bottom',
          //     'text-halign': 'center'
          //   // 'text-halign': 'right',
          //   // 'text-rotation': '90deg', //文字旋转
          //   }
          // },
          {
            selector: 'edge',
            css: {
              'curve-style': 'bezier',
              'font-family': 'Verdana,Arial,Helvetica,sans-serif,pficon',
              'font-size': '6px',
              'line-color': (ele) => {
                return this.getEdgeColor(ele)
              },
              'line-style': 'solid',
              'target-arrow-shape': 'vee',
              'target-arrow-color': (ele) => {
                return this.getEdgeColor(ele)
              },
              'text-events': 'yes',
              'text-outline-color': '#fff',
              'text-outline-width': '1px',
              'text-wrap': 'wrap',
              width: '2'
            }
          },
          // 选中线条时
          {
            selector: 'edge:selected',
            css: {
              width: 4,
              label: (ele) => this.getEdgeLabel(ele, true)
            }
          },
          {
            selector: 'edge[protocol="tcp"]',
            css: {
              'target-arrow-shape': 'triangle-cross',
              'line-style': 'solid'
            }
          },
          {
            selector: 'edge.mousehighlight',
            style: {
              'font-size': '10px'
            }
          },
          {
            selector: 'edge.mousehover',
            style: {
              label: (ele) => {
                return this.getEdgeLabel(ele, true)
              }
            }
          },
          {
            selector: 'edge.mousedim',
            style: {
              opacity: 0.3
            }
          },
          {
            selector: '*.find[^isGroup]',
            style: {
              'overlay-color': '#f0ab00',
              'overlay-padding': '7px',
              'overlay-opacity': 0.3
            }
          },
          {
            selector: '*.span[^isGroup]',
            style: {
              'overlay-color': '#a18fff',
              'overlay-padding': '7px',
              'overlay-opacity': 0.3
            }
          }

        ],
        elements: {
          nodes: this.data.nodes,
          edges: this.data.edges
        }
      })
      this.$cy.scratch('_global', globalScratchData)
      this.$cy.nodeHtmlLabel(this.htmlNodeLabels(this.$cy))
      this.$cy.on('mouseover', 'node,edge', (evt) => {
        const cytoscapeEvent = this.getCytoscapeBaseEvent(evt)
        console.log(cytoscapeEvent, 'cytoscapeEvent')
        if (cytoscapeEvent) {
          this.handleMouseIn(cytoscapeEvent)
        }
      })

      this.$cy.on('mouseout', 'node,edge', (evt) => {
        const cytoscapeEvent = this.getCytoscapeBaseEvent(evt)
        if (cytoscapeEvent) {
          this.handleMouseOut(cytoscapeEvent)
        }
      })

      // this.$cy.on('viewport', (evt) => {
      //   const cytoscapeEvent = this.getCytoscapeBaseEvent(evt)
      //   if (cytoscapeEvent) {
      //     this.customViewport = true
      //   }
      // })

      // //   // 'fit' is a custom event that we emit allowing us to reset cytoscapeGraph.customViewport
      // this.$cy.on('fit', (evt) => {
      //   const cytoscapeEvent = this.getCytoscapeBaseEvent(evt)
      //   if (cytoscapeEvent) {
      //     this.customViewport = false
      //   }
      // })
    },
    handleMouseOut(event) {
      if (this.hovered && this.hovered.summaryTarget === event.summaryTarget) {
        this.clearHover()
        this.unhighlight()
      }
    },
    unhighlight() {
      this.$cy.elements('.mousedim').removeClass('mousedim')
      this.$cy.elements('.mousehighlight').removeClass('mousehighlight')
    },
    clearHover() {
      if (this.hovered) {
        this.hovered.summaryTarget.removeClass('mousehover')
        this.hovered = undefined
      }
    },
    handleMouseIn(event) {
      if (['node', 'edge', 'group'].indexOf(event.summaryType) !== -1) {
        this.hovered = event
        this.hovered.summaryTarget.addClass('mousehover')
        this.refresh1()
      }
    },
    refresh1() {
      const toHighlight = this.getHighlighted()
      console.log(toHighlight, 'toHighlight')
      if (!toHighlight) {
        return
      }

      toHighlight.addClass('mousehighlight')
      this.$cy.elements().difference(toHighlight).addClass('mousedim')
    },
    getHighlighted() {
      const isHover = true
      const event = isHover ? this.hovered : this.selected
      if (event) {
        switch (event.summaryType) {
          case 'node':
            return this.getNodeHighlight(event.summaryTarget, isHover)
          case 'edge':
            return this.getEdgeHighlight(event.summaryTarget, isHover)
          case 'group':
            return this.getAppBoxHighlight(event.summaryTarget, isHover)
          default:
        // fall through
        }
      }
      return undefined
    },
    getNodeHighlight(node, isHover) {
      const elems = isHover ? node.closedNeighborhood() : node.predecessors().add(node.successors())
      return this.includeParentNodes(elems.add(node))
    },
    getAppBoxHighlight(appBox, isHover) {
      let elems
      if (isHover) {
        elems = appBox.children().reduce((prev, child) => {
          return prev.add(child.closedNeighborhood())
        }, this.$cy.collection())
      } else {
        const children = appBox.children()
        elems = children.add(children.predecessors()).add(children.successors())
      }
      return this.includeParentNodes(elems)
    },
    getEdgeHighlight(edge, isHover) {
      let elems
      if (isHover) {
        elems = edge.connectedNodes()
      } else {
        const source = edge.source()
        const target = edge.target()
        elems = source.add(target).add(source.predecessors()).add(target.successors())
      }
      return this.includeParentNodes(elems.add(edge))
    },
    includeParentNodes(nodes) {
      return nodes.reduce((all, current) => {
        all = all.add(current)
        if (current.isChild()) {
          all = all.add(current.parent())
        }
        return all
      }, this.$cy.collection())
    },
    getCytoscapeBaseEvent(event) {
      const target = event.target
      console.log(event, 'event', target)
      if (target === this.$cy) {
        return { summaryType: 'graph', summaryTarget: this.$cy }
      } else if (this.isNode(target)) {
        if (target.data('isGroup')) {
          return { summaryType: 'group', summaryTarget: target }
        } else {
          return { summaryType: 'node', summaryTarget: target }
        }
      } else if (this.isEdge(target)) {
        return { summaryType: 'edge', summaryTarget: target }
      } else {
        return null
      }
    },
    isCore(target) {
      return !('cy' in target)
    },
    isNode(target) {
      return !this.isCore(target) && target.isNode()
    },
    isEdge(target) {
      return !this.isCore(target) && target.isEdge()
    },
    // 更改文字
    htmlNodeLabels(cy) {
      return [
        {
          query: 'node:visible',
          halign: 'center',
          valign: 'bottom',
          halignBox: 'center',
          valignBox: 'bottom',
          tpl: (data) => this.htmlLabelForNode(this.$cy.$id(data.id))
        }
      ]
    },
    htmlLabelForNode(ele) {
      const getCyGlobalData = (ele) => {
        return ele.cy().scratch('_global')
      }

      let content = ''
      const cyGlobal = getCyGlobalData(ele)
      var data = this.decoratedNodeData(ele)
      console.log(data, 'data')
      let labelRawStyle = ''

      const isGroup = data.isGroup

      if (ele.hasClass('mousehighlight')) {
        labelRawStyle += 'font-size: ' + '11px' + ';'
      }

      if (ele.hasClass('mousedim')) {
        labelRawStyle += 'opacity: 0.6;'
      }

      if (isGroup) {
        labelRawStyle += 'margin-top: 13px;'
      }

      let badges = ''
      if (cyGlobal.showMissingSidecars && data.hasMissingSC) {
        badges = `<span class="icon-fuzhi" style="marginLeft: 1px"></span> ${badges}`
      }
      if (cyGlobal.showCircuitBreakers && data.hasCB) {
        badges = `<span class="icon-shandian" style="marginLeft: 1px"></span> ${badges}`
      }
      if (cyGlobal.showVirtualServices && data.hasVS) {
        badges = `<span class="icon-master" style="marginLeft: 1px"></span> ${badges}`
      }
      if (badges.length > 0) {
        badges = `<div style="align-Items: center;background-color: #703fec;border-top-left-radius: 3px;border-bottom-left-radius: 3px;color: #fff;display: flex;font-size: 12px;padding: 3px 3px">${badges}</div>`
      }
      const hasBadge = badges.length > 0

      if (getCyGlobalData(ele).showNodeLabels) {
        const app = data.app || ''
        const isGroupMember = data.parent
        const isMultiNamespace = cyGlobal.activeNamespaces.length > 1
        const isOutside = data.isOutside
        const namespace = data.namespace
        const nodeType = data.nodeType
        const service = data.service || ''
        const version = data.version || ''
        const workload = data.workload || ''

        let contentRawStyle = ''

        if (isGroup) {
          contentRawStyle += `background-color: #393f44;`
          contentRawStyle += `color: #fff;`
        }
        if (ele.hasClass('mousehighlight')) {
          contentRawStyle += 'font-size: 11px;'
        }

        if (isGroupMember) {
          switch (nodeType) {
            case 'aggregate':
              content = data.aggregateValue ? data.aggregateValue : ''
              break
            case 'app':
              if (cyGlobal.graphType === 'app') {
                content = app
              } else if (version && version !== 'unknown') {
                content = version
              } else {
                content = workload ? `${workload}` : `${app}`
              }
              break
            case 'service':
              content = service
              break
            case 'workload':
              content = workload
              break
            default:
              content = ''
          }
        } else {
          const contentArray = []
          if ((isMultiNamespace || isOutside) && nodeType !== 'unknown') {
            contentArray.push('(' + namespace + ')')
          }
          switch (nodeType) {
            case 'aggregate':
              contentArray.unshift(data.aggregateValue ? data.aggregateValue : '')
              break
            case 'app':
              if (cyGlobal.graphType === 'app' || isGroup || version === 'unknown') {
                contentArray.unshift(app)
              } else {
                contentArray.unshift(version)
                contentArray.unshift(app)
              }
              break
            case 'service':
              contentArray.unshift(service)
              break
            case 'unknown':
              contentArray.unshift('unknown')
              break
            case 'workload':
              contentArray.unshift(workload)
              break
            default:
              contentArray.unshift('error')
          }
          content = contentArray.join('<br/>')
        }
        content = `<div style="align-items:center;display: flex;font-size: 8px;padding: 3px 5px;border-radius: 3px;border-width: 1px;${contentRawStyle}${hasBadge ? 'border-bottom-left-radius: unset;border-color: #703fec;border-left: 0;border-style: solid;border-top-left-radius: unset;borderLeft: 0' : ''}">${content}</div>`
      }
      return `<div style="border-radius: 3px;box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.19);display: flex;font-family: Verdana,Arial,Helvetica,sans-serif,pficon,font-size: 0;font-weight: normal;margin-top: 4px;line-height: 11px;text-align: center;${labelRawStyle}">${badges}${content}</div>`
    },
    addEles(eles) {
      if (eles) {
        this.$cy.startBatch()
        this.$cy.batch(() => {
          const elements = (Array.isArray
            ? Array.isArray(eles)
            : eles != null && eles instanceof Array)
            ? eles
            : [eles]
          const filterElements = elements.filter(
            __ => !this.$cy.getElementById(__.data.id).length
          )
          this.$cy.add(filterElements)
        })
        this.$cy.endBatch()
      }
    },
    /**
     * 删除选择的内容(可能是顶点, 也可能是关系)
     */
    delEles() {
      this.$cy.startBatch()
      this.$cy.batch(() => {
        const selectedEles = this.$cy.elements(':selected')
        // 未选择不进行操作
        if (!selectedEles || selectedEles.length < 1) {
          return false
        }
        selectedEles.remove()
      })
      this.$cy.endBatch()
    },
    /** *************************工具栏************************/
    /**
     * 缩放大小.
     * @param zoom 增减幅度.
     */
    zoom(zoom) {
      /** 获取已选择内容 */
      const selectedEles = this.$cy.elements('node:selected')
      /** 获取已选择内容中得第一个, 没有选择为null */
      const selectedEle =
        selectedEles && selectedEles.length ? selectedEles[0] : null
      /** 获取画布偏移位置 */
      const pan = this.$cy.pan()
      /** 计算原点坐标 */
      const [x, y] = selectedEle
        ? [selectedEle.position('x'), selectedEle.position('y')]
        : [pan.x, pan.y]
      let level = this.$cy.zoom() + zoom
      level > this.$cy.maxZoom && (level = this.$cy.maxZoom)
      level < this.$cy.minZoom && (level = this.$cy.minZoom)
      this.$cy.zoom({ level: level, renderedPosition: { x: x, y: y }})
    },
    /** 放大 */
    magnifying() {
      this.zoom(0.3)
    },
    /** 缩小 */
    contractible() {
      this.zoom(-0.3)
    },
    /** 合适大小 */
    resize() {
      this.$cy.fit()
    },
    /**
     * 高亮.
     * @param ele 某元素ID
     */
    lightOn(ele) {
      this.$cy.startBatch()
      this.$cy.batch(() => {
        this.$cy.elements().addClass('light-off') //* 添加样式*/
        const elements = (Array.isArray
          ? Array.isArray(ele)
          : ele != null && ele instanceof Array)
          ? ele
          : [ele]
        elements.forEach(__ => {
          this.$cy.getElementById(__).removeClass('light-off')
          this.$cy
            .getElementById(__)
            .neighborhood()
            .removeClass('light-off')
        })
      })
      this.$cy.once('click', () => this.lightOff())
      this.$cy.endBatch()
    },
    /**
     * 取消高亮.
     */
    lightOff() {
      this.$cy.startBatch()
      this.$cy.batch(
        () => this.$cy.elements().removeClass('light-off') /* 移除样式*/
      )
      this.$cy.endBatch()
    },
    /** 高亮邻居 */
    highlight() {
      /** 获取已选择内容 */
      const selectedEles = this.$cy.elements('node:selected')
      /** 获取已选择内容中得第一个, 没有选择为null */
      const selectedEle =
        selectedEles && selectedEles.length ? selectedEles[0] : null
      selectedEle && this.lightOn(selectedEle.id())
    },
    /**
     * 刷新布局.
     * name取值范围:
     * ['grid', 'circle', 'cola', 'avsdf', 'cose-bilkent', ]
     * @param {name = 'cola......', randomize = true | false, animate = true | false}
     */
    refresh(data) {
      this.$cy
        .layout({ ...data })
        .run()
      this.$cy.fit()
    }
    /** *************************工具栏************************/
  }
}
</script>