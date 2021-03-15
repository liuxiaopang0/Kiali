<template>
  <div style="flex:1">
      <div v-show="isError && isLoading" style="height: 98%;margin-right: auto;margin-left: auto;margin-bottom: 10px;margin-top: 10px;text-align: center;">
        <!-- <i :icon="KialiIcon.Error" /> -->
        <h2>
          加载图形时出错
        </h2>
        <div style="margin-top:16;color:#737679;">{{error}}</div>
      </div>
    <div v-show="!isError && isLoading" style="height: 98%;margin-right: auto;margin-left: auto;margin-bottom: 10px;margin-top: 10px;text-align: center;">
      <h2>
        加载图
      </h2>
    </div>
    <div v-show="!isError && !isLoading&&namespaces.length === 0" style="height: 98%;margin-right: auto;margin-left: auto;margin-bottom: 10px;margin-top: 10px;text-align: center;">
    <!-- <div v-else-if="false" style="height: 98%;margin-right: auto;margin-left: auto;margin-bottom: 10px;margin-top: 10px;text-align: center;"> -->
      <h2>
        未选择名称空间
      </h2>
      <div style="margin-top:16;color:#737679;">
        当前没有选择名称空间，请使用“名称空间”选择器选择一个。
      </div>
    </div>
    <div v-show="!isError && !isLoading&&namespaces.length !== 0&&(!elements || !elements.nodes || elements.nodes.length < 1 )&& !isMiniGraph" style="height: 98%;margin-right: auto;margin-left: auto;margin-bottom: 10px;margin-top: 10px;text-align: center;">
      <h2>
        空图
      </h2>
      <div style="margin-top:16;color:#737679;">
        There is currently no graph available for {{namespacesText()}}. This could either mean there is no
        service mesh available for {{namespaces.length === 1 ? 'this namespace' : 'these namespaces'}} or
        the service mesh has yet to see request traffic.
        {{isDisplayingUnusedNodes && ("You are currently displaying 'Unused nodes', send requests to the service mesh and click 'Refresh'."
        )}}
        {{!isDisplayingUnusedNodes && (
            "You can enable 'Unused nodes' to display service mesh nodes that have yet to see any request traffic."
        )}}
      </div>
      <Button
        @click="isDisplayingUnusedNodes ? action : displayUnusedNodes"
        variant="primary"
      >
        {{(isDisplayingUnusedNodes && "Refresh") || "Display unused nodes"}}
      </Button>
    </div>
    <div v-show="!isError && !isLoading&&namespaces.length !== 0&&(!elements || !elements.nodes || elements.nodes.length < 1) && isMiniGraph" style="height: 98%;margin-right: auto;margin-left: auto;margin-bottom: 10px;margin-top: 10px;text-align: center;">
      <h2>
        空图
      </h2>
      <div style="margin-top:16;color:#737679;">没有足够的数据来生成图形。</div>
    </div>
    <div v-show="!isError && !isLoading&&namespaces.length !== 0&&(elements && elements.nodes && elements.nodes.length > 1) && isMiniGraph">
      <CytoscapeReactWrapper ref="CytoscapeReactWrapper" />
    </div>
    
  </div>
</template>
<script>
import * as _ from 'lodash'
import CytoscapeReactWrapper from './CytoscapeReactWrapper'
import { GraphHighlighter } from './graphs/GraphHighlighter'
import TrafficRender from './TrafficAnimation/TrafficRenderer'
import * as CytoscapeGraphUtils from './CytoscapeGraphUtils'
import { CyNode, isEdge, isNode, isCore } from './CytoscapeGraphUtils'
import { NodeType, Protocol } from './types/Graph'
import { renderDestServicesLinks, renderBadgedLink } from './SummaryPanel/SummaryLink'

import FocusAnimation from './FocusAnimation'

import { angleBetweenVectors, squaredDistance, normalize } from './utils/MathUtils'
import { getAccumulatedTrafficRateGrpc, getAccumulatedTrafficRateHttp } from './utils/TrafficRate'

export default {
  name: 'EmptyGraphLayout',
  components: {
    CytoscapeReactWrapper,
    materielId: ''
  },
  props: ['graphData', 'action', 'displayUnusedNodes', 'elements', 'error', 'isDisplayingUnusedNodes', 'isLoading', 'isError', 'isMiniGraph', 'namespaces'],
  watch: {
    '$store.state.governanceTopology.layout'(newValue, oldValue) {
      this.setCytoscapeReactWrapperRef(this.$refs.CytoscapeReactWrapper)
      this.processGraphUpdate(this.getCy(), newValue.name !== oldValue.name)
    },
    '$store.state.governanceTopology.edgeLabelMode'(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.setCytoscapeReactWrapperRef(this.$refs.CytoscapeReactWrapper)
        this.processGraphUpdate(this.getCy(), newValue !== oldValue)
      }
    },
    '$store.state.governanceTopology.graphElements'(newValue, oldValue) {
      if ((newValue !== oldValue) && newValue.edges.length > 0) {
        this.setCytoscapeReactWrapperRef(this.$refs.CytoscapeReactWrapper)
        this.processGraphUpdate(this.getCy(), true)
      }
    },
    '$store.state.governanceTopology.fetchParams'(newValue, oldValue) {
      if ((newValue.isMTLSEnabled !== oldValue.isMTLSEnabled ||
        newValue.showCircuitBreakers !== oldValue.showCircuitBreakers ||
        newValue.showMissingSidecars !== oldValue.showMissingSidecars ||
        newValue.showNodeLabels !== oldValue.showNodeLabels ||
        newValue.showSecurity !== oldValue.showSecurity ||
        newValue.showVirtualServices !== oldValue.showVirtualServices) && newValue.activeNamespaces.length > 0) {
        this.setCytoscapeReactWrapperRef(this.$refs.CytoscapeReactWrapper)
        this.processGraphUpdate(this.getCy(), false)
      }
    }
  },
  data() {
    return {
      resetSelection: false
      // graphHighlighter: {}
    }
  },
  mounted() {
    setTimeout(() => {
      this.setCytoscapeReactWrapperRef(this.$refs.CytoscapeReactWrapper)
    }, 0)
    // this.$nextTick(() => {
    //   this.setCytoscapeReactWrapperRef(this.$refs.CytoscapeReactWrapper)
    // })
  },
  methods: {
    getCy() {
      return this.$refs.CytoscapeReactWrapper ? this.$refs.CytoscapeReactWrapper.$cy : null
    },
    setCytoscapeReactWrapperRef(cyRef) {
      this.cyInitialization(this.getCy())
    },

    cyInitialization(cy) {
      if (!cy) {
        return
      }
      if (this.cy === cy) {
        return
      }
      this.cy = cy

      // this.contextMenuRef.current.connectCy(this.cy)

      this.graphHighlighter = new GraphHighlighter(cy)
      this.trafficRenderer = new TrafficRender(cy, cy.edges())

      const getCytoscapeBaseEvent = (event) => {
        const target = event.target
        if (target === cy) {
          return { summaryType: 'graph', summaryTarget: cy }
        } else if (isNode(target)) {
          if (target.data(CyNode.isGroup)) {
            return { summaryType: 'group', summaryTarget: target }
          } else {
            return { summaryType: 'node', summaryTarget: target }
          }
        } else if (isEdge(target)) {
          return { summaryType: 'edge', summaryTarget: target }
        } else {
          return null
        }
      }

      const findRelatedNode = element => {
      // Skip top-level node, this one has margins that we don't want to consider.
        if (element.getAttribute(this.DataNodeId)) {
          return null
        }
        while (element && element.getAttribute) {
          const dataNodeId = element.getAttribute(this.DataNodeId)
          if (dataNodeId) {
            return dataNodeId
          }
          element = element.parentNode
        }
        return null
      }

      cy.on('tap', (event) => {
      // Check if we clicked a label, if so stop processing the event right away.
        if (event.originalEvent) {
          const element = document.elementFromPoint(event.originalEvent.clientX, event.originalEvent.clientY)
          const realTargetId = findRelatedNode(element)
          if (realTargetId) {
            const realTarget = cy.$id(realTargetId)
            if (realTarget) {
              event.preventDefault()
              realTarget.trigger('tap')
              return
            }
          }
        }

        let tapped = event.target
        if (this.tapTimeout) {
        // cancel any single-tap timer in progress
          clearTimeout(this.tapTimeout)
          this.tapTimeout = null

          if (tapped === this.tapTarget) {
          // if we click the same target again, perform double-tap
            tapped = null
            this.tapTarget = null
            const cytoscapeEvent = getCytoscapeBaseEvent(event)
            if (cytoscapeEvent) {
              this.handleDoubleTap(cytoscapeEvent)
            }
          }
        }
        if (tapped) {
        // start single-tap timer
          this.tapTarget = tapped
          this.tapTimeout = setTimeout(() => {
          // timer expired without a follow-up click, so perform single-tap
            this.tapTarget = null
            const cytoscapeEvent = getCytoscapeBaseEvent(event)
            if (cytoscapeEvent) {
              this.handleTap(cytoscapeEvent)
              this.selectTarget(event.target, true)
            }
          }, this.doubleTapMs)
        }
      })
      cy.on('mouseover', 'node,edge', (evt) => {
        const cytoscapeEvent = getCytoscapeBaseEvent(evt)
        if (cytoscapeEvent) {
          this.handleMouseIn(cytoscapeEvent)
        }
      })

      cy.on('mouseout', 'node,edge', (evt) => {
        const cytoscapeEvent = getCytoscapeBaseEvent(evt)
        if (cytoscapeEvent) {
          this.handleMouseOut(cytoscapeEvent)
        }
      })

      cy.on('viewport', (evt) => {
        const cytoscapeEvent = getCytoscapeBaseEvent(evt)
        if (cytoscapeEvent) {
          this.customViewport = true
        }
      })

      // 'fit' is a custom event that we emit allowing us to reset cytoscapeGraph.customViewport
      cy.on('fit', (evt) => {
        const cytoscapeEvent = getCytoscapeBaseEvent(evt)
        if (cytoscapeEvent) {
          this.customViewport = false
        }
      })

      cy.on('nodehtml-create-or-update', 'node', (evt, data) => {
        const { label, isNew } = data
        const { target } = evt
        // This is the DOM node of the label, if we want the cyNode it is `target`
        const node = label.getNode()

        // Assign to the label node (the DOM element) an id that matches the cy node.
        // This is so that when we click, we can identify if the clicked label belongs to
        // any cy node and select it
        // Note that we don't add an actual listener to this DOM node. We use the cy click event, this proved to be more
        // stable than adding a listener. As we only want the contents to match and not the whole node (which is bigger).
        if (isNew) {
          node.setAttribute('data-node-id', target.id())
        }

        // Skip parent nodes from bounding expansion calculation, their size is defined by their contents, so no point in
        // messing with these values.
        if (target.isParent()) {
          return
        }

        // The code below expands the bounds of a node, taking into consideration the labels. This is important not only
        // for displaying the label, but to avoid nodes overlapping with other labels.
        // We assume that a label is placed centered in the bottom part of a node.
        // The algorithm is:
        // - Take the old bounds-expansion
        // - Get the bounding-box of a node (without taking into account the overlays  i.e. the one that appears on click)
        // - Compute the required extra width as the label width minus the bounding box width
        //   - This will yield a a positive number if we need more space, or negative if we need less space.
        // - Compute the required height as the height of the label. Since the label is at the bottom, we only need that.
        //   If its center was aligned with the center of the node, we would do a similar operation as with the width.
        // - Spread the required width as extra space in the left area and space in the right area of the cy node
        //   (half in each side)
        // - Required height is only needed at the bottom, so we now that we always have to grow at the bottom by this value.

        let oldBE = target.numericStyle('bounds-expansion')
        if (oldBE.length === 1) {
          oldBE = Array(4).fill(oldBE[0])
        }
        // Do not include the "click" overlay on the bounding box calc
        const bb = target.boundingBox({ includeOverlays: false })
        let newBE = [...oldBE]
        const requiredWidth = node.offsetWidth - bb.w
        const requiredHeight = node.offsetHeight
        newBE[1] += requiredWidth * 0.5
        newBE[3] += requiredWidth * 0.5
        newBE[2] = requiredHeight

        // Ensure we don't end with negative values in our bounds-expansion
        newBE = newBE.map(val => Math.max(val, 0))

        const compareBoundsExpansion = (be1, be2) => {
          if (be1.length !== be2.length) {
            return false
          }

          const delta = 0.00001

          for (let i = 0; i < be1.length; ++i) {
            if (Math.abs(be1[i] - be2[i]) > delta) {
              return false
            }
          }
          return true
        }

        // Only trigger an update if it really changed, else just skip to avoid this function to call again
        if (!compareBoundsExpansion(oldBE, newBE)) {
          target.style('bounds-expansion', newBE)
          // bounds-expansion changed. Make sure we tell our parent (if any) to update as well (so he can update the label position).
          if (target.isChild()) {
          // The timeout ensures that the previous value is already applied
            setTimeout(() => {
              if (!target.cy().destroyed()) {
                target.cy() // because we are using an extension
                  .nodeHtmlLabel()
                  .updateNodeLabel(target.parent())
              }
            }, 0)
          }
        }
      })

      cy.on('layoutstop', (_evt) => {
      // Don't allow a large zoom if the graph has a few nodes (nodes would look too big).
        this.safeFit(cy)
        this.fixLoopOverlap(cy)
      })

      cy.ready((evt) => {
        if (this.onReady) {
          this.onReady(evt.cy)
        }
        this.processGraphUpdate(cy, true)
      })

      cy.on('destroy', (_evt) => {
        this.trafficRenderer.stop()
        this.cy = undefined
        if (this.updateSummary) {
          this.updateSummary({ summaryType: 'graph', summaryTarget: undefined })
        }
      })
    },
    handleTap(event) {
      // console.log(JSON.parse(JSON.stringify(event.summaryTarget)), 'event')
      this.$store.commit('set_summaryType', event.summaryType)
      // this.$store.commit('set_summaryTarget', event.summaryType === 'group' ? event.summaryTarget.namespaces : {})
      console.log(event.summaryType === 'group' ? event.summaryTarget.namespaces : {}, 'summaryTarget', event.summaryTarget)
      if (event.summaryType === 'edge') {
        const target = event.summaryTarget
        const source = CytoscapeGraphUtils.decoratedNodeData(target.source())
        const dest = CytoscapeGraphUtils.decoratedNodeData(target.target())
        const edge = CytoscapeGraphUtils.decoratedEdgeData(target)
        const mTLSPercentage = edge.isMTLS
        const isMtls = mTLSPercentage && mTLSPercentage > 0
        const hasPrincipals = !!edge.sourcePrincipal || !!edge.destPrincipal
        const hasSecurity = isMtls || hasPrincipals
        const protocol = edge.protocol
        const isGrpc = protocol === Protocol.GRPC
        const isHttp = protocol === Protocol.HTTP
        const isTcp = protocol === Protocol.TCP
        this.$store.commit('set_summaryTarget', { source, dest, edge, mTLSPercentage, isMtls, hasPrincipals, hasSecurity, protocol, isGrpc, isHttp, isTcp })
      } else if (event.summaryType === 'graph') {
        const cy = event.summaryTarget
        const numSvc = cy.$(`node[nodeType = "${NodeType.SERVICE}"]`).size()
        const numWorkloads = cy.$(`node[nodeType = "${NodeType.WORKLOAD}"]`).size()
        const { numApps, numVersions } = this.countApps(cy)
        const numEdges = cy.edges().size()
        const nonServiceEdges = cy.$(`node[nodeType != "${NodeType.SERVICE}"][!isGroup]`).edgesTo('*')
        const totalRateGrpc = getAccumulatedTrafficRateGrpc(nonServiceEdges)
        const totalRateHttp = getAccumulatedTrafficRateHttp(nonServiceEdges)
        const incomingEdges = cy.$(`node[?${CyNode.isRoot}]`).edgesTo('*')
        const incomingRateGrpc = getAccumulatedTrafficRateGrpc(incomingEdges)
        const incomingRateHttp = getAccumulatedTrafficRateHttp(incomingEdges)
        const outgoingEdges = cy.nodes().leaves(`node[?${CyNode.isOutside}],[?${CyNode.isServiceEntry}]`).connectedEdges()
        const outgoingRateGrpc = getAccumulatedTrafficRateGrpc(outgoingEdges)
        const outgoingRateHttp = getAccumulatedTrafficRateHttp(outgoingEdges)
        console.log({ numSvc, numWorkloads, numApps, numVersions, numEdges, nonServiceEdges, totalRateGrpc, totalRateHttp, incomingEdges, incomingRateGrpc, incomingRateHttp, outgoingEdges, outgoingRateGrpc, outgoingRateHttp })
        this.$store.commit('set_summaryTarget', { numSvc, numWorkloads, numApps, numVersions, numEdges, totalRateGrpc, totalRateHttp, incomingRateGrpc, incomingRateHttp, outgoingRateGrpc, outgoingRateHttp })
      } else if (event.summaryType === 'node') {
        const node = event.summaryTarget
        const nodeData = CytoscapeGraphUtils.decoratedNodeData(node)
        const { nodeType, app, service, workload, isServiceEntry } = nodeData
        const servicesList = nodeType !== NodeType.SERVICE && renderDestServicesLinks(node)
        console.log(servicesList, 'servicesList')
        const destsList = nodeType === NodeType.SERVICE && isServiceEntry && this.renderDestServices(nodeData)
        const serviceList = this.renderServiceList(node)
        const workloadList = this.renderWorkloadList(node)
        const validChildren = node.children(
          `node[nodeType != "${NodeType.SERVICE}"][nodeType != "${NodeType.AGGREGATE}"]`
        )
        const incoming = getAccumulatedTrafficRateGrpc(validChildren.incomers('edge'))
        const outgoing = getAccumulatedTrafficRateGrpc(validChildren.edgesTo('*'))
        const size = node.children().filter('[httpIn > 0],[httpOut > 0]').size()

        const shouldRenderDestsList = destsList && destsList.length > 0
        const shouldRenderSvcList = servicesList && servicesList.length > 0
        const shouldRenderService = service && ![NodeType.SERVICE, NodeType.UNKNOWN].includes(nodeType)
        const shouldRenderApp = app && ![NodeType.APP, NodeType.UNKNOWN].includes(nodeType)
        const shouldRenderWorkload = workload && ![NodeType.WORKLOAD, NodeType.UNKNOWN].includes(nodeType)
        // const shouldRenderTraces = !isServiceEntry && !nodeData.isInaccessible && this.jaegerState.info && this.jaegerState.info.enabled && this.jaegerState.info.integration
        const shouldRenderTraces = true
        this.$store.commit('set_summaryTarget', { nodeData, serviceList, shouldRenderTraces, size, incoming, outgoing, workloadList, nodeType, app, service, workload, isServiceEntry, servicesList, destsList, shouldRenderDestsList, shouldRenderSvcList, shouldRenderService, shouldRenderApp, shouldRenderWorkload })
      } else {
        const group = event.summaryTarget
        const nodeData = CytoscapeGraphUtils.decoratedNodeData(group)
        const serviceList = this.renderServiceList(group)
        const workloadList = this.renderWorkloadList(group)
        let hasGrpcTraffic
        if (group.children().filter('[grpcIn > 0],[grpcOut > 0]').size() > 0) {
          hasGrpcTraffic = true
        } else {
          hasGrpcTraffic = false
        }
        let hasHttpTraffic
        if (group.children().filter('[httpIn > 0],[httpOut > 0]').size() > 0) {
          hasHttpTraffic = true
        } else {
          hasHttpTraffic = false
        }
        const validChildren = group.children(
          `node[nodeType != "${NodeType.SERVICE}"][nodeType != "${NodeType.AGGREGATE}"]`
        )
        const incoming = getAccumulatedTrafficRateGrpc(validChildren.incomers('edge'))
        const outgoing = getAccumulatedTrafficRateGrpc(validChildren.edgesTo('*'))
        this.$store.commit('set_summaryTarget', { nodeData, serviceList, hasGrpcTraffic, hasHttpTraffic, incoming, outgoing, workloadList })
      }
      console.log(this.$store.state.governanceTopology.summaryTarget, '$store.state.governanceTopology.summaryTarget')

      if (this.onNodeTap && this.isCyNodeClickEvent(event)) {
        this.onNodeTap(this.buildTapEventArgs(event))
      }

      this.graphHighlighter.onClick(event)
    },
    renderWorkloadList(group) {
      const workloadList = []

      group.children('node[workload]').forEach(node => {
        const nodeData = CytoscapeGraphUtils.decoratedNodeData(node)
        workloadList.push(renderBadgedLink(nodeData, NodeType.WORKLOAD))
      })

      return workloadList
    },
    renderServiceList(group) {
    // likely 0 or 1 but support N in case of unanticipated labeling
      const serviceList = []

      group.children(`node[nodeType = "${NodeType.SERVICE}"]`).forEach(serviceNode => {
        const serviceNodeData = CytoscapeGraphUtils.decoratedNodeData(serviceNode)
        serviceList.push(renderBadgedLink(serviceNodeData, NodeType.SERVICE))
        const aggregates = group.children(
          `node[nodeType = "${NodeType.AGGREGATE}"][service = "${serviceNodeData.service}"]`
        )
        if (!!aggregates && aggregates.length > 0) {
          const aggregateList = []
          aggregates.forEach(aggregateNode => {
            const aggregateNodeData = CytoscapeGraphUtils.decoratedNodeData(aggregateNode)
            aggregateList.push(renderBadgedLink(aggregateNodeData, NodeType.AGGREGATE))
          })
          serviceList.push(<div>{aggregateList}</div>)
        }
      })

      return serviceList
    },
    // renderBadgedLink(nodeData, nodeType, label) {
    //   // const link = getLink(nodeData, nodeType)

    //   return `<span style='margin-right: 5px, margin-bottom: 3px, display: inline-block'>
    //   <span v-if='${!!label}' style="white-space: 'pre'">${label || ''}</span>
    //   <span v-html='${this.getBadge(nodeData, nodeType)}'>${this.getBadge(nodeData, nodeType)}</span>
    // </span>`
    // },
    getBadge(nodeData, nodeType) {
      switch (nodeType || nodeData.nodeType) {
        case NodeType.AGGREGATE:
          return 'O'
        case NodeType.APP:
          return 'A'
        case NodeType.SERVICE:
          return nodeData.isServiceEntry ? 'SE' : 'S'
        case NodeType.WORKLOAD:
          return 'W'
        default:
          return 'O'
      }
    },
    countApps(cy) {
      const appVersions = {}

      cy.$(`node[nodeType = "${NodeType.APP}"][!isGroup]`).forEach(node => {
        const app = node.data(CyNode.app)
        if (appVersions[app] === undefined) {
          appVersions[app] = new Set()
        }
        appVersions[app].add(node.data(CyNode.version))
      })

      return {
        numApps: Object.getOwnPropertyNames(appVersions).length,
        numVersions: Object.getOwnPropertyNames(appVersions).reduce((totalCount, version) => {
          return totalCount + appVersions[version].size
        }, 0)
      }
    },
    isCyNodeClickEvent(event) {
      const targetType = event.summaryType
      if (targetType !== 'node' && targetType !== 'group') {
        return false
      }

      return true
    },
    safeFit(cy, force) {
      if (!force && this.customViewport) {
        return
      }
      this.focus(cy)
      CytoscapeGraphUtils.safeFit(cy)
    },
    focus(cy) {
      if (!this.focusSelector) {
        return
      }

      let selected = cy.$(this.focusSelector)

      // only perform the focus one time
      this.focusSelector = undefined

      if (!selected) {
        return
      }

      // If there is only one, select it
      if (selected.length === 1) {
        this.selectTargetAndUpdateSummary(selected[0])
      } else {
      // If we have many elements, try to check if a compound in this query contains everything, if so, select it.
        const compound = selected.filter('$node > node')
        if (compound && compound.length === 1 && selected.subtract(compound).same(compound.children())) {
          this.selectTargetAndUpdateSummary(compound[0])
          selected = compound
        }
      }

      // Start animation
      new FocusAnimation(cy).start(selected)
    },
    selectTarget(target, isTapped = false) {
      if (!this.isMiniGraph && isTapped) {
        return
      }
      if (this.cy) {
        this.cy.$(':selected').selectify().unselect().unselectify()
        if (target && !isCore(target)) {
          target.selectify().select().unselectify()
        }
      }
    },
    processGraphUpdate(cy, updateLayout) {
      this.trafficRenderer.stop()

      const isTheGraphSelected = cy.$(':selected').length === 0
      if (this.resetSelection) {
        if (!isTheGraphSelected) {
          this.selectTarget()
          this.handleTap({ summaryType: 'graph', summaryTarget: cy })
        }
        this.resetSelection = false
      }

      const globalScratchData = {
        activeNamespaces: this.$store.state.governanceTopology.namespaces, // Namespaces
        edgeLabelMode: this.$store.state.governanceTopology.edgeLabelMode, // 边缘标签模式
        graphType: this.$store.state.governanceTopology.graph_type, // 类型
        mtlsEnabled: this.$store.state.governanceTopology.fetchParams.isMTLSEnabled, // 已启用mtls
        showCircuitBreakers: this.$store.state.governanceTopology.fetchParams.showCircuitBreakers, // 显示断路器
        showMissingSidecars: this.$store.state.governanceTopology.fetchParams.showMissingSidecars,
        showNodeLabels: this.$store.state.governanceTopology.fetchParams.showNodeLabels, // 显示节点标签
        showSecurity: this.$store.state.governanceTopology.fetchParams.showSecurity, // 显示安全性
        showVirtualServices: this.$store.state.governanceTopology.fetchParams.showVirtualServices // 显示虚拟服务
      }
      console.log(globalScratchData, 'globalScratchData')
      cy.scratch('_global', globalScratchData)

      cy.startBatch()

      // KIALI-1291 issue was caused because some layouts (can't tell if all) do reuse the existing positions.
      // We got some issues when changing from/to cola/cose, as the nodes started to get far away from each other.
      // Previously we deleted the nodes prior to a layout update, this was too much and it seems that only reseting the
      // positions to 0,0 makes the layout more predictable.
      if (updateLayout) {
        cy.nodes().positions({ x: 0, y: 0 })
      }

      // update the entire set of nodes and edges to keep the graph up-to-date
      cy.json({ elements: this.graphData.elements })

      cy.endBatch()

      // Run layout and fit outside of the batch operation for it to take effect on the new nodes
      if (updateLayout) {
        CytoscapeGraphUtils.runLayout(cy, this.$store.state.governanceTopology.layout)// 展示方式
      }

      // We opt-in for manual selection to be able to control when to select a node/edge
      // https://github.com/cytoscape/cytoscape.js/issues/1145#issuecomment-153083828
      cy.nodes().unselectify()
      cy.edges().unselectify()

      // Verify our current selection is still valid, if not, select the graph
      if (!isTheGraphSelected && cy.$(':selected').length === 0) {
        this.handleTap({ summaryType: 'graph', summaryTarget: cy })
      }

      // Update TrafficRenderer
      this.trafficRenderer.setEdges(cy.edges())
      if (this.showTrafficAnimation) {
        this.trafficRenderer.start()
      }

      // notify that the graph has been updated
      if (this.setUpdateTime) {
        this.setUpdateTime(Date.now())
      }
    },
    shouldComponentUpdate(nextProps) {
      const currentIsEmpty = this.elements === undefined || _.isEmpty(this.elements.nodes)
      const nextIsEmpty = nextProps.elements === undefined || _.isEmpty(nextProps.elements.nodes)

      // Update if we have elements and we are not loading
      if (!nextProps.isLoading && !nextIsEmpty) {
        return true
      }

      // Update if we are going from having no elements to having elements or vice versa
      if (currentIsEmpty !== nextIsEmpty) {
        return true
      }
      // Do not update if we have elements and the namespace didn't change, as this means we are refreshing
      return !(!nextIsEmpty && _.isEqual(this.namespaces, nextProps.namespaces))
    },
    fixLoopOverlap(cy) {
      cy.$(':loop').forEach(loop => {
        const node = loop.source()
        const otherEdges = node.connectedEdges().subtract(loop)
        const minDistance = 1

        // Default values in rads (taken from cytoscape docs)
        const DEFAULT_LOOP_SWEEP = -1.5707
        const DEFAULT_LOOP_DIRECTION = -0.7854

        loop.style('loop-direction', DEFAULT_LOOP_DIRECTION)
        loop.style('loop-sweep', DEFAULT_LOOP_SWEEP)

        let found = false
        // 检查我们是否还有其他与任何循环边重叠的边
        // 这使用cytoscape forEach（https://js.cytoscape.org/#eles.forEach）
        otherEdges.forEach(edge => {
          const testPoint = edge.source().same(node) ? edge.sourceEndpoint() : edge.targetEndpoint()
          if (
            squaredDistance(testPoint, loop.sourceEndpoint()) <= minDistance ||
          squaredDistance(testPoint, loop.targetEndpoint()) <= minDistance
          ) {
            found = true
            return false // break the inner cytoscape forEach
          }
          return // return to avoid typescript error about "not all code paths return a value"
        })

        if (!found) {
          return
        }

        // 简单的情况，另一条边，只需将循环方向移动到默认的循环扫描值的一半即可避免出现边
        if (otherEdges.length === 1) {
          const loopDirection = loop.numericStyle('loop-direction') - loop.numericStyle('loop-sweep') * 0.5
          loop.style('loop-direction', loopDirection)
          return
        }

        // 计算顶部与顶部之间的每个角度（12点钟位置）
        // 我们将角度存储为弧度和正数，因此将PI添加到负角度。
        const usedAngles = []
        otherEdges.forEach(edge => {
          const testPoint = edge.source().same(node) ? edge.sourceEndpoint() : edge.targetEndpoint()
          const angle = angleBetweenVectors(
            normalize({ x: testPoint.x - node.position().x, y: testPoint.y - node.position().y }),
            { x: 0, y: 1 }
          )
          usedAngles.push(angle < 0 ? angle + 2 * Math.PI : angle)
        })

        usedAngles.sort((a, b) => a - b)

        // Try to fit our loop in the longest arc
        // Iterate over the found angles and find the longest distance
        const maxArc = {
          start: 0,
          end: 0,
          value: 0
        }
        for (let i = 0; i < usedAngles.length; ++i) {
          const start = i === 0 ? usedAngles[usedAngles.length - 1] : usedAngles[i - 1]
          const end = usedAngles[i]
          const arc = Math.abs(start - end)
          if (arc > maxArc.value) {
            maxArc.value = arc
            maxArc.start = start
            maxArc.end = end
          }
        }

        // If the max arc is 1.0 radians (the biggest gap is of about 50 deg), the node is already too busy, ignore it
        if (maxArc.value < 1.0) {
          return
        }

        if (maxArc.start > maxArc.end) {
        // To ensure the difference between end and start goes in the way we want, we add a full circle to our end
          maxArc.end += Math.PI * 2
        }

        if (maxArc.value <= -DEFAULT_LOOP_SWEEP) {
        // Make it slightly smaller to be able to fit
        // loop-sweep is related to the distance between the start and end of our loop edge
          loop.style('loop-sweep', -maxArc.value * 0.9)
          maxArc.start += maxArc.value * 0.05
          maxArc.end -= maxArc.value * 0.05
        }
        // Move the loop to the center of the arc, loop-direction is related to the middle point of the loop
        loop.style('loop-direction', maxArc.start + (maxArc.end - maxArc.start) * 0.5)
      })
    },
    handleMouseIn(event) {
      this.graphHighlighter.onMouseIn(event)
    },
    handleMouseOut(event) {
      this.graphHighlighter.onMouseOut(event)
    },

    selectTargetAndUpdateSummary(target) {
      this.selectTarget(target)
      const event = {
        summaryType: target.data(CyNode.isGroup) ? 'group' : 'node',
        summaryTarget: target
      }
      if (this.updateSummary) {
        this.updateSummary(event)
      }
      this.graphHighlighter.onClick(event)
    },

    namespacesText() {
      if (this.namespaces && this.namespaces.length > 0) {
        if (this.namespaces.length === 1) {
          return (`namespace<b>${this.namespaces[0].name}</b>`)
        } else {
          const namespacesString = this.namespaces.slice(0, -1).map(namespace => namespace.name).join(',') + ' and ' + this.namespaces[this.namespaces.length - 1].name
          return (`namespaces'<b>${namespacesString}</b>`)
        }
      }
      return null
    }
  }
}
</script>
<style scoped>

</style>