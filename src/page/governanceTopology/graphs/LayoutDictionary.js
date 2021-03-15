import { ColaGraph } from './ColaGraph'
import { CoseGraph } from './CoseGraph'
import { DagreGraph } from './DagreGraph'

var LayoutMap = {
  'cola': ColaGraph.getLayout(),
  'avsdf': ColaGraph.getLayout(),
  'dagre': DagreGraph.getLayout(),
  'cose-bilkent': CoseGraph.getLayout()
}

function getLayout(layout) {
  return LayoutMap.hasOwnProperty(layout.name) ? LayoutMap[layout.name] : LayoutMap.dagre
}

function getLayoutByName(layoutName) {
  return LayoutMap.hasOwnProperty(layoutName) ? LayoutMap[layoutName] : LayoutMap.dagre
}
export { getLayout, getLayoutByName }
