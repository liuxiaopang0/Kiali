import * as LayoutDictionary from './graphs/LayoutDictionary'
import { DagreGraph } from './graphs/DagreGraph'

const CytoscapeGlobalScratchNamespace = '_global'
export const CyEdge = {
  destPrincipal: 'destPrincipal',
  grpc: 'grpc',
  grpcErr: 'grpcErr',
  grpcNoResponse: 'grpcNoResponse',
  grpcPercentErr: 'grpcPercentErr',
  grpcPercentReq: 'grpcPercentReq',
  hasTraffic: 'hasTraffic',
  http: 'http',
  http3xx: 'http3xx',
  http4xx: 'http4xx',
  http5xx: 'http5xx',
  httpNoResponse: 'httpNoResponse',
  httpPercentErr: 'httpPercentErr',
  httpPercentReq: 'httpPercentReq',
  id: 'id',
  isMTLS: 'isMTLS',
  protocol: 'protocol',
  responses: 'responses',
  responseTime: 'responseTime',
  sourcePrincipal: 'sourcePrincipal',
  tcp: 'tcp'
}

export const CyEdgeResponses = {
  flags: 'flags',
  hosts: 'hosts'
}

export const CyNode = {
  aggregate: 'aggregate',
  aggregateValue: 'aggregateValue',
  app: 'app',
  destServices: 'destServices',
  grpcIn: 'grpcIn',
  grpcInErr: 'grpcInErr',
  grpcInNoResponse: 'grpcInNoResponse',
  grpcOut: 'grpcOut',
  hasCB: 'hasCB',
  hasMissingSC: 'hasMissingSC',
  hasVS: 'hasVS',
  health: 'health',
  healthStatus: 'healthStatus',
  httpIn: 'httpIn',
  httpIn3xx: 'httpIn3xx',
  httpIn4xx: 'httpIn4xx',
  httpIn5xx: 'httpIn5xx',
  httpInNoResponse: 'httpInNoResponse',
  httpOut: 'httpOut',
  id: 'id',
  isDead: 'isDead',
  isGroup: 'isGroup',
  isInaccessible: 'isInaccessible',
  isIstio: 'isIstio',
  isMisconfigured: 'isMisconfigured',
  isOutside: 'isOutside',
  isRoot: 'isRoot',
  isServiceEntry: 'isServiceEntry',
  isUnused: 'isUnused',
  namespace: 'namespace',
  nodeType: 'nodeType',
  service: 'service',
  tcpIn: 'tcpIn',
  tcpOut: 'tcpOut',
  version: 'version',
  workload: 'workload'
}

export const ZoomOptions = {
  fitPadding: 25,
  maxZoom: 2.5
}

export function safeFit(cy, centerElements) {
  cy.fit(centerElements, ZoomOptions.fitPadding)
  if (cy.zoom() > ZoomOptions.maxZoom) {
    cy.zoom(ZoomOptions.maxZoom)
    !!centerElements && !!centerElements.length ? cy.center(centerElements) : cy.center()
  }
  // 'fit' is a custom event that we emit allowing us to reset cytoscapeGraph.customViewport
  cy.emit('fit')
}

export function runLayout(cy, layout) {
  // Enable labels when doing a relayout, layouts can be told to take into account the labels to avoid
  // overlap, but we need to have them enabled (nodeDimensionsIncludeLabels: true)
  const showNodeLabels = cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels
  cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels = true

  // Using an extension
  cy.nodeHtmlLabel().updateNodeLabel(cy.nodes())
  const layoutOptions = LayoutDictionary.getLayout(layout)
  if (cy.nodes('$node > node').length > 0) {
    // if there is any parent node, run the group-compound-layout
    cy.layout({
      ...layoutOptions,
      name: 'group-compound-layout',
      realLayout: layout.name,
      // Currently we do not support non discrete layouts for the compounds, but this can be supported if needed.
      compoundLayoutOptions: LayoutDictionary.getLayout(DagreGraph.getLayout())
    }).run()
  } else {
    cy.layout(layoutOptions).run()
  }
  cy.scratch(CytoscapeGlobalScratchNamespace).showNodeLabels = showNodeLabels
}

export function decoratedEdgeData(ele) {
  return ele.data()
}

export function decoratedNodeData(ele) {
  return ele.data()
}

export function isCore(target) {
  return !('cy' in target)
}

export function isNode(target) {
  return !isCore(target) && target.isNode()
}

export function isEdge(target) {
  return !isCore(target) && target.isEdge()
}
