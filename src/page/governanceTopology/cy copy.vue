<template>
  <div style="position: relative; height: 100%; width: 100%;background-color: #f5f5f5">
    <div id="cytoscape_id" style="height: 100%; width: 100%;"></div>
  </div>
</template>

<script>
import cytoscape from 'cytoscape'
import cxtmenu from 'cytoscape-cxtmenu'
import cola from 'cytoscape-cola'
import coseBilkent from 'cytoscape-cose-bilkent'
import dagre from 'cytoscape-dagre'
import popper from 'cytoscape-popper'

import NodeImageKey from '@/assets/img/node-background-key.png'
import NodeImageTopology from '@/assets/img/node-background-topology.png'

export default {
  name: 'CJS',
  props: ['autoungrabify', 'nodes', 'edges'],
  data() {
    return {
      HEALTHY: {
        name: 'Healthy',
        color: '#3e8635',
        priority: 1,
        // icon: CheckCircleIcon,
        class: 'icon-healthy'
      },

      NA: {
        name: 'No health information',
        color: '#6a6e73',
        priority: 0,
        // icon: UnknownIcon,
        class: 'icon-na'
      }
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
    // Cxtmenu圆形菜单主要依赖组件
    if (!cytoscape().cxtmenu) {
      cytoscape.use(cxtmenu)
      cytoscape.use(cola)
      cytoscape.use(dagre)
      cytoscape.use(popper)
      cytoscape.use(coseBilkent)
    }
    this.createCytoscape()
    // Cxtmenu圆形菜单--结束
    // 不同节点的样式
    // this.$cy
    //   .style()
    //   .selector('.classes-A')
    //   .style({
    //     'background-color': '#FF0000',
    //     'border-color': '#FF0000',
    //     'border-width': '1px'
    //   })
    //   .selector('.classes-B')
    //   .style({
    //     'background-color': '#00FF00',
    //     'border-color': '#00FF00',
    //     'border-width': '1px'
    //   })
    //   .selector('.classes-C')
    //   .style({
    //     'background-color': '#0000FF',
    //     'border-color': '#0000FF',
    //     'border-width': '1px'
    //   })
    //   .selector('.classes-D')
    //   .style({
    //     'background-color': '#E0E0E0',
    //     'border-color': '#E0E0E0',
    //     'border-width': '1px'
    //   })

    // // 通用的样式
    // this.$cy
    // .style()
    // /* 未选择节点样式*/
    // .selector('node')
    // .style({
    //   label: 'data(name)',
    //   'font-size': '10pt',
    //   width: '8pt',
    //   height: '8pt'
    // })
    // /* 已选择节点样式*/
    // .selector('node:selected')
    // .style({ 'border-color': '#c84e40', 'border-width': '1px' })
    // /* 未选择节点样式*/
    // .selector('edge')
    // .style({
    //   label: 'data(name)',
    //   'target-arrow-shape': 'triangle-backcurve' /* 箭头样式*/,
    //   'target-arrow-size': '1px' /* 箭头大小*/,
    //   'target-arrow-color': '#999999' /* 箭头颜色*/,
    //   'curve-style': 'bezier' /* 线条样式曲线*/,
    //   'line-color': '#999999' /* 线条颜色*/,
    //   width: '1px' /* 线条宽度*/,
    //   'font-size': '10px' /* 标签字体大小*/,
    //   color: '#000000' /* 标签字体大小*/,
    //   'text-outline-color': 'white' /* 文本轮廓颜色*/,
    //   'text-outline-width': '1px' /* 文本轮廓宽度*/,
    //   'text-rotation': 'autorotate' /* 标签方向*/
    // })
    // /* 已选择节点样式*/
    // .selector('edge:selected')
    // .style({
    //   color: '#3165fc' /* 标签字体大小*/,
    //   'target-arrow-color': '#61bffc' /* 箭头颜色*/,
    //   'line-color': '#61bffc' /* 线条颜色*/
    // })
    // /* 高亮样式*/
    // .selector('.light-off')
    // .style({ opacity: '0.1' })
  },
  methods: {
    /**
     * eles : Array or Map.
     * node_eg: {group: 'nodes', data: {id: 'nid1', name: 'name1', label: 'l1 l2', others: 'others'}, classes: 'like label', position: {x: 100, y: 100}};
     * edge_eg: {group: 'edges', data: {id: 'eid1', name: 'name1', source: 'A', target: 'B', label: 'l1 l2', others: 'others'}, classes: 'like label', position: {x: 100, y: 100}};
     * node_eg: [
     *   {group: 'nodes', data: {id: 'nid1', name: 'name1', label: 'l1 l2', others: 'others'}, classes: 'like label', position: {x: 100, y: 100}};
     *   {group: 'nodes', data: {id: 'nid2', name: 'name2', label: 'l1 l2', others: 'others'}, classes: 'like label', position: {x: 100, y: 100}};
     * ];
     * edge_eg: [
     *   {group: 'edges', data: {id: 'eid1', name: 'name1', source: 'nid1', target: 'nid2', label: 'l1 l2', others: 'others'}, classes: 'like label', position: {x: 100, y: 100}};
     *   {group: 'edges', data: {id: 'eid2', name: 'name1', source: 'nid2', target: 'nid3', label: 'l1 l2', others: 'others'}, classes: 'like label', position: {x: 100, y: 100}};
     * ];
     * @param eles 元素集合.
     */
    getNodeBackgroundImage(ele) {
      const nodeData = this.decoratedNodeData(ele)
      const isInaccessible = nodeData.isInaccessible
      const isServiceEntry = nodeData.isServiceEntry
      const isGroup = nodeData.isGroup
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
    getNodeBorderColor(ele) {
      switch (ele.data('healthStatus')) {
        case 'Degraded':
          return '#fff'
        case 'Failure':
          return 'red'
        default:
          return '#CCCCCC'
      }
    },
    getEdgeLabel(ele, includeProtocol) {
      const cyGlobal = { activeNamespaces: [
        { name: 'default' }, { name: 'istio-system' }
      ],
      edgeLabelMode: 'requestRate',
      graphType: 'app',
      mtlsEnabled: false,
      showCircuitBreakers: true,
      showMissingSidecars: true,
      showNodeLabels: true,
      showSecurity: false,
      showVirtualServices: true
      }
      // const cyGlobal = this.getCyGlobalData(ele)
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
          return 'red'
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
        activeNamespaces: [{ name: 'default' }, { name: 'istio-system' }],
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
        // initial viewport state:
        // zoom: 1, // 图表的初始缩放级别.可以设置options.minZoom和options.maxZoom设置缩放级别的限制.
        // pan: { x: 0, y: 0 }, // 图表的初始平移位置.
        // interaction options:
        // minZoom: 1e-50, // 图表缩放级别的最小界限.视口的缩放比例不能小于此缩放级别.
        // zoomingEnabled: true, // 是否通过用户事件和编程方式启用缩放图形.
        // userZoomingEnabled: true, // 是否允许用户事件(例如鼠标滚轮,捏合缩放)缩放图形.对此缩放的编程更改不受此选项的影响.
        // panningEnabled: true, // 是否通过用户事件和编程方式启用平移图形.
        // userPanningEnabled: true, // 是否允许用户事件(例如拖动图形背景)平移图形.平移的程序化更改不受此选项的影响.
        // boxSelectionEnabled: true, // 是否启用了框选择(即拖动框叠加,并将其释放为选择).如果启用,则用户必须点击以平移图表.
        // selectionType: 'single', // 一个字符串，指示用户输入的选择行为.对于'additive',用户进行的新选择将添加到当前所选元素的集合中.对于'single',用户做出的新选择成为当前所选元素的整个集合.
        // touchTapThreshold: 8, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
        // // 这些值具有合理的默认值,因此建议不要更改这些选项,除非您有充分的理由这样做.大值几乎肯定会产生不良后果.
        // desktopTapThreshold: 4, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
        // // 这些值具有合理的默认值,因此建议不要更改这些选项,除非您有充分的理由这样做.大值几乎肯定会产生不良后果.
        // autolock: false, // 默认情况下是否应锁定节点(根本不可拖动,如果true覆盖单个节点状态).
        // autoungrabify: !this.autoungrabify, // 默认情况下节点是否不允许被拾取(用户不可抓取,如果true覆盖单个节点状态).
        // autounselectify: false, // 默认情况下节点是否允许被选择(不可变选择状态,如果true覆盖单个元素状态).
        // rendering options:
        // headless: false, // true:空运行,不显示不需要容器容纳.false:显示需要容器容纳.
        // styleEnabled: true, // 一个布尔值,指示是否应用样式.
        // hideEdgesOnViewport: true, // 渲染提示,设置为true在渲染窗口时,不渲染边.例如,移动某个顶点时或缩放时,边信息会被临时隐藏,移动结束后,边信息会被执行一次渲染.由于性能增强,此选项现在基本上没有实际意义.
        // hideLabelsOnViewport: true, // 渲染提示,当设置为true使渲染器在平移和缩放期间使用纹理而不是绘制元素时,使大图更具响应性.由于性能增强,此选项现在基本上没有实际意义.
        // textureOnViewport: true, // 渲染提示,当设置为true使渲染器在平移和缩放期间使用纹理而不是绘制元素时,使大图更具响应性.由于性能增强,此选项现在基本上没有实际意义.
        // motionBlur: true, // 渲染提示,设置为true使渲染器使用运动模糊效果使帧之间的过渡看起来更平滑.这可以增加大图的感知性能.由于性能增强,此选项现在基本上没有实际意义.
        // motionBlurOpacity: 0.2, // 当motionBlur:true,此值控制运动模糊帧的不透明度.值越高,运动模糊效果越明显.由于性能增强,此选项现在基本上没有实际意义.
        // wheelSensitivity: 0.3, // 缩放时更改滚轮灵敏度.这是一个乘法修饰符.因此,0到1之间的值会降低灵敏度(变焦较慢),而大于1的值会增加灵敏度(变焦更快).
        // pixelRatio: 'auto', // 使用手动设置值覆盖屏幕像素比率(1.0建议,如果已设置).这可以通过减少需要渲染的有效区域来提高高密度显示器的性能,
        // 尽管在最近的浏览器版本中这是不太必要的.如果要使用硬件的实际像素比,可以设置pixelRatio: 'auto'(默认).
        // DOM容器,决定内容展示的位置,方式一(原生):document.getElementById('xx'),方式二(jQuery):$('#xx')
        container: document.getElementById('cytoscape_id'),
        // 一个指定布局选项的普通对象.
        layout: { name: 'dagre' },
        style: [
          {
            selector: 'node',
            style: {
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
                return this.getNodeBorderColor(ele)
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
          // {
          //   selector: `node[?isGroup]`,
          //   css: {
          //     'background-color': '#fff'
          //   }
          // },
          {
            selector: 'node:selected',
            style: {
              'border-color': (ele) => {
                console.log(ele, ele.data(), 'ele.data()')
                switch (ele.data('healthStatus')) {
                  case 'Degraded':
                    return 'red'
                  case 'FAILURE':
                    return 'red'
                  default:
                    return '#39a5dc'
                }
              },
              'border-width': '3px'
            }
          },
          {
            selector: 'node.mousehighlight',
            style: {
              'font-size': '11px'
            }
          },
          {
            selector: `node.mousehighlight[^isGroup]`,
            style: {
              'background-color': (ele) => {
                switch (ele.data('healthStatus')) {
                  case 'DEGRADED':
                    return '#fdf2e5'
                  case 'FAILURE':
                    return '#ffe6e6'
                  default:
                    return '#def3ff'
                }
              },
              'border-color': (ele) => {
                switch (ele.data('healthStatus')) {
                  case 'DEGRADED':
                    return '#fff'
                  case 'FAILURE':
                    return 'red'
                  default:
                    return '#39a5dc'
                }
              }
            }
          },
          {
            selector: 'node.mousedim',
            style: {
              opacity: 0.6
            }
          },
          {
            selector: ':parent',
            css: {
              'text-valign': 'bottom',
              'text-halign': 'center'
            // 'text-halign': 'right',
            // 'text-rotation': '90deg', //文字旋转
            }
          },
          {
            selector: 'edge',
            css: {
              // 'label': 'data(traffic.protocol)',
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
              'label': 'data(traffic.protocol)'
              // label: (ele) => this.getEdgeLabel(ele, true)
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
          nodes: this.nodes,
          edges: this.edges
        }
      })
      this.$cy.scratch('_global', globalScratchData)
      this.$cy.nodeHtmlLabel(this.htmlNodeLabels(this.$cy))
    },
    // 更改文字
    htmlNodeLabels(cy) {
      console.log(cy, '121212')
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
      console.log(ele, '33333')
      const getCyGlobalData = (ele) => {
        return ele.cy().scratch('_global')
      }

      let content = ''
      const cyGlobal = getCyGlobalData(ele)
      console.log(cyGlobal, 'cyGlobal')
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
      debugger
      if (cyGlobal.showMissingSidecars && data.hasMissingSC) {
        badges = `<span class="pf-icon pf-icon-blueprint" style="marginLeft: 1px"></span> ${badges}`
      }
      if (cyGlobal.showCircuitBreakers && data.hasCB) {
        badges = `<span class="pf-icon pf-icon-blueprint" style="marginLeft: 1px"></span> ${badges}`
      }
      if (cyGlobal.showVirtualServices && data.hasVS) {
        badges = `<span class="fa fa-code-branch" style="marginLeft: 1px"></span> ${badges}`
      }
      console.log(badges, 'badges')
      if (badges.length > 0) {
        badges = `<div style="alignItems: center;
        backgroundColor: #703fec;
        borderTopLeftRadius: 3px;
        borderBottomLeftRadius: 3px;
        color: #fff;
        display: flex;
        fontSize: 12px;
        padding: 3px 3px">${badges}</div>`
      }
      console.log(badges, 'badges222')

      const hasBadge = badges.length > 0

      console.log(getCyGlobalData(ele).showNodeLabels, 'getCyGlobalData(ele).showNodeLabels')
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
          contentRawStyle += 'font-size: ' + '11px' + ';'
        }

        if (isGroupMember) {
          switch (nodeType) {
            case 'AGGREGATE':
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
            case 'SERVICE':
              content = service
              break
            case 'WORKLOAD':
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
        content = `<div style="alignItems: 'center';
        backgroundColor: withAlpha(NodeTextBackgroundColor, 'a');
        color: '#030303';
        display: flex;
        fontSize: '8px';
        padding: 3px 5px;
        borderRadius: 3px;
        borderWidth: 1px;" 
      style="${contentRawStyle} ${hasBadge ? 'borderBottomLeftRadius: unset;borderColor: #703fec;borderStyle: solid;borderTopLeftRadius: unset;borderLeft: 0' : ''} ">${content}</div>`
      }
      return `<div  style="${labelRawStyle}  borderRadius: 3px;
          boxShadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 8px 0 rgba(0, 0, 0, 0.19);
          display: flex;
          fontFamily: NodeTextFont,
          fontSize: 0;
          fontWeight: normal;
          marginTop: 4px;
          lineHeight: 11px;
          textAlign: center">${badges}${content}</div>`
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
    refresh({ name = 'cola', randomize = false, animate = true } = {}) {
      this.$cy
        .layout({ name: name, randomize: randomize, animate: animate })
        .run()
    }
    /** *************************工具栏************************/
  }
}
</script>