<template>
  <div id="cytoscape-container" style="flex: 1;min-width: 350px;padding-right: 5px;z-index: 0;height:100%;">
        <!-- <ReactResizeDetector :handleWidth="true" :handleHeight="true" :skipOnMount="false" :onResize="onResize" /> -->
        <EmptyGraphLayout
          :action="onEmptyGraphAction"
          :displayUnusedNodes="displayUnusedNodes"
          :elements="graphData.elements"
          :error="graphData.errorMessage"
          :isDisplayingUnusedNodes="showUnusedNodes"
          :isLoading="graphData.isLoading"
          :isError="graphData.isError"
          :isMiniGraph="isMiniGraph"
          :namespaces="graphData.fetchParams.namespaces"
          :graphData="graphData"
        >
        </EmptyGraphLayout>
      </div>
</template>
<script>
import EmptyGraphLayout from './EmptyGraphLayout'
import CytoscapeReactWrapper from './CytoscapeReactWrapper'

import { GraphHighlighter } from './graphs/GraphHighlighter'
import * as CytoscapeGraphUtils from './CytoscapeGraphUtils'
import FocusAnimation from './FocusAnimation'
import { CyNode, isCore, isEdge, isNode } from './CytoscapeGraphUtils'
// import { showTrace, hideTrace } from './CytoscapeTrace'
import { angleBetweenVectors, squaredDistance, normalize } from './utils/MathUtils'
import { NodeType, UNKNOWN, CytoscapeGlobalScratchNamespace } from './types/Graph'

export default {
  name: 'CytoscapeGraph',
  components: {
    EmptyGraphLayout,
    CytoscapeReactWrapper
  },
  props: ['containerClassName', 'graphData', 'onEmptyGraphAction', 'displayUnusedNodes', 'showUnusedNodes', 'isMiniGraph', 'contextMenuEdgeComponent', 'contextMenuNodeComponent', 'refreshInterval', 'contextMenuGroupComponent'],
  data() {
    return {
      contextTypes: {
        router: () => null
      },
      defaultProps: {
        isMiniGraph: false
      },
      doubleTapMs: 350,
      tapTarget: [],
      tapTimeout: [],
      DataNodeId: 'data-node-id',

      cy: {},
      customViewport: false,
      cytoscapeReactWrapperRef: [],
      focusSelector: '',
      graphHighlighter: GraphHighlighter,
      namespaceChanged: false,
      nodeChanged: false,
      resetSelection: false
    }
  },
  mounted() {
    if (this.graphData.isLoading) {
      return
    }

    const cy = this.getCy()
    if (!cy) {
      return
    }
    this.cyInitialization(this.getCy())

    // let updateLayout = false
    // Vuex中值修改时
    // if (
    //   this.nodeNeedsRelayout() ||
    //   this.namespaceNeedsRelayout(prevProps.graphData.elements, this.graphData.elements) ||
    //   this.elementsNeedRelayout(prevProps.graphData.elements, this.graphData.elements) ||
    //   this.layout.name !== prevProps.layout.name
    // ) {
    //   updateLayout = true
    // }

    // pre-select node if provided
    const node = this.graphData.fetchParams.node
    if (node && cy && cy.$(':selected').length === 0) {
      let selector = "[nodeType = '" + node.nodeType + "']"
      switch (node.nodeType) {
        case NodeType.AGGREGATE:
          selector =
            selector + "[aggregate = '" + node.aggregate + "'][aggregateValue = '" + node.aggregateValue + "']"
          break
        case NodeType.APP:
          selector = selector + "[app = '" + node.app + "']"
          if (node.version && node.version !== UNKNOWN) {
            selector = selector + "[version = '" + node.version + "']"
          }
          break
        case NodeType.SERVICE:
          selector = selector + "[service = '" + node.service + "']"
          break
        default:
          selector = selector + "[workload = '" + node.workload + "']"
      }
      const eles = cy.nodes(selector)
      if (eles.length > 0) {
        this.selectTargetAndUpdateSummary(eles[0])
      }
    }

    // if (this.trace) {
    //   showTrace(cy, this.graphData.fetchParams.graphType, this.trace)
    // } else if (!this.trace && prevProps.trace) {
    //   hideTrace(cy)
    // }
  },
  methods: {
    getCy() {
      return this.$refs.CytoscapeReactWrapper ? this.$refs.CytoscapeReactWrapper.$cy.getCy() : null
    },
    buildTapEventArgs(event) {
      const target = event.summaryTarget
      const targetType = event.summaryType
      const targetOrGroupChildren = targetType === 'group' ? target.descendants() : target

      // 调用回调
      return {
        aggregate: target.data(CyNode.aggregate),
        aggregateValue: target.data(CyNode.aggregateValue),
        app: target.data(CyNode.app),
        hasMissingSC: targetOrGroupChildren.every(t => t.data(CyNode.hasMissingSC)),
        isInaccessible: target.data(CyNode.isInaccessible),
        isOutside: target.data(CyNode.isOutside),
        isServiceEntry: target.data(CyNode.isServiceEntry),
        isUnused: targetOrGroupChildren.every(t => t.data(CyNode.isUnused)),
        namespace: target.data(CyNode.namespace),
        nodeType: target.data(CyNode.nodeType),
        service: target.data(CyNode.service),
        version: targetType === 'group' ? undefined : target.data(CyNode.version),
        workload: target.data(CyNode.workload)
      }
    },
    setCytoscapeReactWrapperRef(cyRef) {
      this.cytoscapeReactWrapperRef.current = cyRef
      this.cyInitialization(this.getCy())
    },
    onResize() {
      if (this.cy) {
        this.cy.resize()
        // always fit to the newly sized space
        this.safeFit(this.cy, true)
      }
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
    safeFit(cy, force) {
      if (!force && this.customViewport) {
        return
      }
      this.focus(cy)
      CytoscapeGraphUtils.safeFit(cy)
    },
    selectTarget(target, isTapped = false) {
      if (this.isMiniGraph && isTapped) {
        return
      }
      if (this.cy) {
        this.cy.$(':selected').selectify().unselect().unselectify()
        if (target && !isCore(target)) {
          target.selectify().select().unselectify()
        }
      }
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

    handleDoubleTap(event) {
      if (this.onNodeDoubleTap && this.isCyNodeClickEvent(event)) {
        this.onNodeDoubleTap(this.buildTapEventArgs(event))
      }
    },

    handleTap(event) {
      if (this.updateSummary) {
        this.updateSummary(event)
      }

      if (this.onNodeTap && this.isCyNodeClickEvent(event)) {
        this.onNodeTap(this.buildTapEventArgs(event))
      }

      if (!this.isMiniGraph) {
        this.graphHighlighter.onClick(event)
      }
    },

    handleMouseIn(event) {
      this.graphHighlighter.onMouseIn(event)
    },

    handleMouseOut(event) {
      this.graphHighlighter.onMouseOut(event)
    },

    namespaceNeedsRelayout(prevElements, nextElements) {
      const needsRelayout = this.namespaceChanged && prevElements !== nextElements
      if (needsRelayout) {
        this.namespaceChanged = false
      }
      return needsRelayout
    },

    nodeNeedsRelayout() {
      const needsRelayout = this.nodeChanged
      if (needsRelayout) {
        this.nodeChanged = false
      }
      return needsRelayout
    },

    isCyNodeClickEvent(event) {
      const targetType = event.summaryType
      if (targetType !== 'node' && targetType !== 'group') {
        return false
      }

      return true
    },

    // 要知道是否应该重新布局，我们需要知道是否有任何元素更改
    // 通过比较节点和边的数量（如果不同）进行快速回合
    // 可能会有更改。
    // 如果元素数量相同，则比较ID，如果找到了不存在的元素，则比较ID
    // 在另一种情况下，我们可以确定存在更改。
    // 最坏的情况是当它们相同时，请避免这种情况。
    elementsNeedRelayout(prevElements, nextElements) {
      if (prevElements === nextElements) {
        return false
      }
      if (
        !prevElements ||
      !nextElements ||
      !prevElements.nodes ||
      !prevElements.edges ||
      !nextElements.nodes ||
      !nextElements.edges ||
      prevElements.nodes.length !== nextElements.nodes.length ||
      prevElements.edges.length !== nextElements.edges.length
      ) {
        return true
      }
      // 如果两个ID相同，则无需重新布局
      return !(
        this.nodeOrEdgeArrayHasSameIds(nextElements.nodes, prevElements.nodes) &&
      this.nodeOrEdgeArrayHasSameIds(nextElements.edges, prevElements.edges)
      )
    },

    nodeOrEdgeArrayHasSameIds(a, b) {
      const aIds = a.map(e => e.id).sort()
      return b
        .map(e => e.id)
        .sort()
        .every((eId, index) => eId === aIds[index])
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
    }
  }
}
</script>

<style scoped>

</style>