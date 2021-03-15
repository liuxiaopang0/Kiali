import { FAILURE, DEGRADED } from '../types/Health'
import {
  EdgeLabelMode,
  NodeType,
  CytoscapeGlobalScratchNamespace
} from '../types/Graph'
// import { icons } from '../../../config'
import NodeImageTopology from '@/assets/img/node-background-topology.png'
import NodeImageKey from '@/assets/img/node-background-key.png'
import { decoratedEdgeData, decoratedNodeData } from '../CytoscapeGraphUtils'
import _ from 'lodash'

import { getEdgeHealth } from '../types/ErrorRate'

export const DimClass = 'mousedim'
export const HighlightClass = 'mousehighlight'
export const HoveredClass = 'mousehover'

const EdgeTextOutlineColor = '#fff'
const EdgeTextOutlineWidth = '1px'
const EdgeTextFont = 'Verdana,Arial,Helvetica,sans-serif,pficon'
const EdgeTextFontSize = '6px'
const EdgeTextFontSizeHover = '10px'
const EdgeWidth = 2
const EdgeWidthSelected = 4
const NodeBorderWidth = '1px'
const NodeBorderWidthSelected = '3px'
const NodeColorBorderHover = '#39a5dc'
const NodeColorBorderSelected = '#39a5dc'
const NodeColorFill = '#fff'
const NodeColorFillBox = '#fff'
const NodeColorFillHover = '#def3ff'
const NodeColorFillHoverDegraded = '#fdf2e5'
const NodeColorFillHoverFailure = '#ffe6e6'

export class GraphStyles {
  static colorsDefined

  static options() {
    return { wheelSensitivity: 0.1, autounselectify: false, autoungrabify: true }
  }

  static htmlLabelForNode(ele) {
    const getCyGlobalData = (ele) => {
      return ele.cy().scratch(CytoscapeGlobalScratchNamespace)
    }

    let content = ''
    const cyGlobal = getCyGlobalData(ele)
    const data = decoratedNodeData(ele)
    let labelRawStyle = ''
    if (!ele || !cyGlobal || !data) return

    const isGroup = data ? data.isGroup : ''

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
  }

  static htmlNodeLabels(cy) {
    return [
      {
        query: 'node:visible',
        halign: 'center',
        valign: 'bottom',
        halignBox: 'center',
        valignBox: 'bottom',
        tpl: data => this.htmlLabelForNode(cy.$id(data.id))
      }
    ]
  }

  static styles() {
    const getCyGlobalData = (ele) => {
      return ele.cy().scratch(CytoscapeGlobalScratchNamespace)
    }

    const getEdgeColor = (ele) => {
      const edgeData = decoratedEdgeData(ele)
      if (!edgeData.hasTraffic) {
        return '#8b8d8f' // 灰色
      }
      if (edgeData.protocol === 'tcp') {
        return '#004368' // 深蓝色
      }

      const sourceNodeData = decoratedNodeData(ele.source())
      const destNodeData = decoratedNodeData(ele.target())
      const statusEdge = getEdgeHealth(edgeData, sourceNodeData, destNodeData)
      switch (statusEdge.status.name) {
        case FAILURE.name:
          return '#c9190b' // 红色
        case DEGRADED.name:
          return '#f0ab00'// 黄色
        default:
          return '#3e8635' // 绿色
      }
    }

    const getEdgeLabel = (ele, includeProtocol) => {
      const cyGlobal = getCyGlobalData(ele)
      const edgeLabelMode = cyGlobal.edgeLabelMode
      let content = ''
      const edgeData = decoratedEdgeData(ele)

      switch (edgeLabelMode) {
        case EdgeLabelMode.REQUEST_RATE: {
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
        case EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE: {
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
        case EdgeLabelMode.REQUEST_DISTRIBUTION: {
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
        const dest = decoratedNodeData(ele.target())
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
      return content
    }

    const getNodeBackgroundImage = (ele) => {
      const nodeData = decoratedNodeData(ele)
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
    }

    const getNodeBackgroundPositionX = (ele) => {
      if (getNodeShape(ele) === 'round-tag') {
        return '0'
      }
      return '50%'
    }

    const getNodeBackgroundPositionY = (ele) => {
      if (getNodeShape(ele) === 'round-triangle') {
        return '6px'
      }
      return '50%'
    }

    const getNodeBorderColor = (ele) => {
      switch (ele.data('healthStatus')) {
        case DEGRADED.name:
          return '#3e8635'
        case FAILURE.name:
          return '#f0ab00'
        default:
          return '#bbb'
      }
    }

    const getNodeShape = (ele) => {
      const nodeData = decoratedNodeData(ele)
      const nodeType = nodeData.nodeType
      switch (nodeType) {
        case NodeType.AGGREGATE:
          return 'round-pentagon'
        case NodeType.APP:
          return 'round-rectangle'
        case NodeType.SERVICE:
          return nodeData.isServiceEntry ? 'round-tag' : 'round-triangle'
        case NodeType.UNKNOWN:
          return 'ellipse'
        case NodeType.WORKLOAD:
          return 'ellipse'
        default:
          return 'ellipse'
      }
    }
    return [
      // Node Defaults
      {
        selector: 'node',
        css: {
          'background-color': NodeColorFill,
          'background-image': (ele) => {
            return getNodeBackgroundImage(ele)
          },
          'background-width': '80%',
          'background-height': '80%',
          'background-position-x': getNodeBackgroundPositionX,
          'background-position-y': getNodeBackgroundPositionY,
          'border-color': (ele) => {
            return getNodeBorderColor(ele)
          },
          'border-style': (ele) => {
            return decoratedNodeData(ele).isUnused ? 'dotted' : 'solid'
          },
          'border-width': NodeBorderWidth,
          ghost: 'yes',
          'ghost-offset-x': 1,
          'ghost-offset-y': 1,
          'ghost-opacity': 0.4,
          height: '25px',
          shape: (ele) => {
            return getNodeShape(ele)
          },
          width: '25px',
          'z-index': 10
        }
      },
      // Node is an App Box
      {
        selector: `node[?isGroup]`,
        css: {
          'background-color': NodeColorFillBox
        }
      },
      // Node is selected
      {
        selector: 'node:selected',
        style: {
          'border-color': (ele) => {
            switch (ele.data('healthStatus')) {
              case DEGRADED.name:
                return '#3e8635'
              case FAILURE.name:
                return '#f0ab00'
              default:
                return NodeColorBorderSelected
            }
          },
          'border-width': NodeBorderWidthSelected
        }
      },
      // Node is highlighted (see GraphHighlighter.ts)
      {
        selector: `node.${HighlightClass}`,
        style: {
          'font-size': '11px'
        }
      },
      // Node other than App Box is highlighted (see GraphHighlighter.ts)
      {
        selector: `node.${HighlightClass}[^isGroup]`,
        style: {
          'background-color': (ele) => {
            switch (ele.data('healthStatus')) {
              case DEGRADED.name:
                return NodeColorFillHoverDegraded
              case FAILURE.name:
                return NodeColorFillHoverFailure
              default:
                return NodeColorFillHover
            }
          },
          'border-color': (ele) => {
            switch (ele.data('healthStatus')) {
              case DEGRADED.name:
                return '#3e8635'
              case FAILURE.name:
                return '#f0ab00'
              default:
                return NodeColorBorderHover
            }
          }
        }
      },
      // Node is dimmed (see GraphHighlighter.ts)
      {
        selector: `node.${DimClass}`,
        style: {
          opacity: 0.6
        }
      },
      {
        selector: 'edge',
        css: {
          'curve-style': 'bezier',
          'font-family': EdgeTextFont,
          'font-size': EdgeTextFontSize,
          label: (ele) => {
            return getEdgeLabel(ele)
          },
          'line-color': (ele) => {
            return getEdgeColor(ele)
          },
          'line-style': 'solid',
          'target-arrow-shape': 'vee',
          'target-arrow-color': (ele) => {
            return getEdgeColor(ele)
          },
          'text-events': 'yes',
          'text-outline-color': EdgeTextOutlineColor,
          'text-outline-width': EdgeTextOutlineWidth,
          'text-wrap': 'wrap',
          width: EdgeWidth
        }
      },
      {
        selector: 'edge:selected',
        css: {
          width: EdgeWidthSelected,
          label: (ele) => getEdgeLabel(ele, true)
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
        selector: `edge.${HighlightClass}`,
        style: {
          'font-size': EdgeTextFontSizeHover
        }
      },
      {
        selector: `edge.${HoveredClass}`,
        style: {
          label: (ele) => {
            return getEdgeLabel(ele, true)
          }
        }
      },
      {
        selector: `edge.${DimClass}`,
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
    ]
  }
}
