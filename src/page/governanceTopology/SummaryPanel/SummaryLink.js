import { NodeType } from '../types/Graph'
import { CyNode, decoratedNodeData } from '../CytoscapeGraphUtils'
// import { Tooltip, Badge, PopoverPosition, TooltipPosition } from '@patternfly/react-core'
// import { Health } from 'types/Health'
// import { HealthIndicator, DisplayMode } from 'components/Health/HealthIndicator'

const getBadge = function(nodeData, nodeType) {
  switch (nodeType || nodeData.nodeType) {
    case NodeType.AGGREGATE:
      return `<span style="cursor:pointer;display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;" title="Operation ${nodeData.aggregate}">A</span>`
    case NodeType.APP:
      return `<span style="cursor:pointer;display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;" title="Application">A</span>`
    case NodeType.SERVICE:
      return nodeData.isServiceEntry ? `<span style="cursor:pointer;display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;" title="${nodeData.isServiceEntry === 'MESH_EXTERNAL' ? 'External Service Entry' : 'Internal Service Entry'}">SE</span>`
        : `<span style="cursor:pointer;display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;" title="Service">S</span>`
    case NodeType.WORKLOAD:
      return `<span style="cursor:pointer;display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;" title="Workload">W</span>`
    default:
      return `<span style="cursor:pointer;display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;" title="Unknown">U</span>`
  }
}

const getLink = (nodeData, nodeType) => {
  const namespace = nodeData.namespace
  if (!nodeType || nodeData.nodeType === NodeType.UNKNOWN) {
    nodeType = nodeData.nodeType
  }
  const { app, service, workload } = nodeData
  let displayName = 'unknown'
  // let link
  let key

  switch (nodeType) {
    case NodeType.AGGREGATE:
      displayName = nodeData.aggregateValue
      break
    case NodeType.APP:
      // link = `/namespaces/${encodeURIComponent(namespace)}/applications/${encodeURIComponent(app)}`
      key = `${namespace}.app.${app}`
      displayName = app
      break
    case NodeType.SERVICE:
      // if (nodeData.isServiceEntry) {
      //   link = `/namespaces/${encodeURIComponent(namespace)}/istio/serviceentries/${encodeURIComponent(service)}`
      // } else {
      //   link = `/namespaces/${encodeURIComponent(namespace)}/services/${encodeURIComponent(service)}`
      // }
      key = `${namespace}.svc.${service}`
      displayName = service
      break
    case NodeType.WORKLOAD:
      // link = `/namespaces/${encodeURIComponent(namespace)}/workloads/${encodeURIComponent(workload)}`
      key = `${namespace}.wl.${workload}`
      displayName = workload
      break
    default:
      // NOOP
      break
  }

  // if (link && !nodeData.isInaccessible) {
  //   return (
  //     <Link key={key} to={link}>
  //       {displayName}
  //     </Link>
  //   )
  // }

  return `<span key=${key}>${displayName}</span>`
}

// type RenderLinkProps = {
//   nodeData;
//   nodeType;
// };

// export function RenderLink(props) {
//   const link = getLink(props.nodeData, props.nodeType)

//   return (
//     <>'
//      '{link}'
//      '{props.nodeData.isInaccessible && (
//       <span style="paddingLeft: '2px' }}>
//         <KialiIcon.MtlsLock />
//       </span>
//     )}'
//    '</>
//   )
// }

// export const renderBadgedHost = (host: string) => {
//   return (
//     <span>
//       <Tooltip content={<>'os'</>}>
//         <Badge className='virtualitem_badge_definition'>H</Badge>
//       </Tooltip>
//       {host}
//     </span>
//   )
// }

export function renderBadgedLink(nodeData, nodeType, label) {
  const link = getLink(nodeData, nodeType)
  return `<span style="margin-right: 5px; margin-bottom: 3px; display: inline-block">
        <span v-if="${!!label}">
          <b>${label || ''}</b>
        </span>
        ${getBadge(nodeData, nodeType)}
      ${link}
    </span>
    `
  // '{nodeData.isInaccessible && <KialiIcon.MtlsLock />}'
}

export function renderHealth(health) {
  console.log(health)
  return `<div style="text-align: center;border-radius: 50px;padding: 0 10px;margin: 4px 0;display:inline-block;font-weight: normal;margin-top: 4px;margin-bottom: 4px;color:#151515;background:#ededed;">        
  <span style="margin:3px 3px 1px 0"><template v-if="${!!health}">
            ${health}
          </template>
          <template v-else>
            n/a
          </template> health</span>
        </div>`
}

export function renderDestServicesLinks(node) {
  const nodeData = decoratedNodeData(node)
  const destServices = node.data(CyNode.destServices)

  const links = []
  if (!destServices) {
    return links
  }

  destServices.forEach(ds => {
    const serviceNodeData = {
      id: nodeData.id,
      app: '',
      isInaccessible: nodeData.isInaccessible,
      isOutside: nodeData.isOutside,
      isRoot: nodeData.isRoot,
      isServiceEntry: nodeData.isServiceEntry,
      namespace: ds.namespace,
      nodeType: NodeType.SERVICE,
      service: ds.name,
      version: '',
      workload: ''
    }
    links.push(renderBadgedLink(serviceNodeData))
  })

  return links
}
