<template>
  <div id="box">
    <h1>demo</h1>
    <div id="cy"></div>
  </div>
</template>

<script>
  import cytoscape from 'cytoscape'
  import * as Cy from 'cytoscape'
import NodeImageKey from '@/assets/img/node-background-key.png'
import NodeImageTopology from '@/assets/img/node-background-topology.png'

  export default {
    name: 'cytoscape',
    components: {},
    data() {
      return {
        CyNode: {
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
        },
        nodes: [{
          data: {
            id: 'n0'
          }
        },
        {
          data: {
            id: 'n1'
          }
        },
        {
          data: {
            id: 'n2'
          }
        },
        {
          data: {
            id: 'n3'
          }
        }

        ],
        edges: [{
          data: {
            source: 'n2',
            target: 'n1'
          }
        },
        {
          data: {
            source: 'n2',
            target: 'n3'
          }
        },
        {
          data: {
            source: 'n2',
            target: 'n0'
          }
        },
        {
          data: {
            source: 'n1',
            target: 'n0'
          }
        },
        {
          data: {
            source: 'n0',
            target: 'n1'
          }
        }
        ]
      }
    },
    methods: {
      getNodeBackgroundImage(ele = Cy.NodeSingular) {
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
      decoratedNodeData(ele = Cy.NodeSingular) {
        return ele.data()
      },
      getNodeShape(ele = Cy.NodeSingular) {
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
      // getNodeBorderColor(ele = Cy.NodeSingular) {
      //   switch (ele.data(this.CyNode.healthStatus)) {
      //     case DEGRADED.name:
      //       return NodeColorBorderDegraded
      //     case FAILURE.name:
      //       return NodeColorBorderFailure
      //     default:
      //       return NodeColorBorder
      //   }
      // },
      createCytoscape() {
        cytoscape.warnings(false)
        const cy = cytoscape({
          container: document.getElementById('cy'),
          boxSelectionEnabled: false,
          // autounselectify: false,
          userZoomingEnabled: false, // 是否允许用户事件（例如鼠标滚轮，捏合缩放）缩放图形
          wheelSensitivity: 0.1, // 缩放时更改滚轮灵敏度。
          autoungrabify: true, // 节点是否可以拖拽
          minZoom: 0.3, // 图表缩放得最小界限
          layout: {
            name: 'breadthfirst'
          },
          style: [{
            selector: 'node',
            style: {
              'background-color': '#fff',
              'background-image': (ele = Cy.NodeSingular) => {
                return this.getNodeBackgroundImage(ele)
              },
              'background-width': '80%',
              'background-height': '80%',
              'background-position-x': (ele = Cy.NodeSingular) => {
                if (this.getNodeShape(ele) === 'round-tag') {
                  return '0'
                }
                return '50%'
              },
              'background-position-y': (ele = Cy.NodeSingular) => {
                if (this.getNodeShape(ele) === 'round-triangle') {
                  return '6px'
                }
                return '50%'
              },
              // 'border-color': (ele = Cy.NodeSingular) => {
              //   return getNodeBorderColor(ele)
              // },
              // 'border-style': (ele = Cy.NodeSingular) => {
              //   return decoratedNodeData(ele).isUnused ? 'dotted' : 'solid'
              // },
              'border-width': '1px',
              ghost: 'yes',
              'ghost-offset-x': 1,
              'ghost-offset-y': 1,
              'ghost-opacity': 0.4,
              height: '25px',
              shape: (ele = Cy.NodeSingular) => {
                return this.getNodeShape(ele)
              },
              width: '25px',
              'z-index': 10
            }
          },
          {
            selector: ':parent',
            css: {
              'text-valign': 'top',
              'text-halign': 'center'
              // 'text-halign': 'right',
              // 'text-rotation': '90deg', //文字旋转
            }
          },
          {
            selector: 'edge',
            style: {
              width: 3,
              label: 'data(label)',
              'target-arrow-shape': 'triangle',
              'target-arrow-fill': 'hollow', // 箭头填充 空心
              'line-color': '#9dbaea',
              'target-arrow-color': '#9dbaea',
              'curve-style': 'bezier'
            }
          }

          ],
          elements: {
            // 节点数据
            nodes: this.nodes,
            //
            edges: this.edges
          }
        })
      }
    },
    mounted() {
      this.createCytoscape()
    }
  }

</script>

<style>

  #box {
    width: 1000px;
    height: 500px;
  }

  

  h1 {
    opacity: 0.5;
    font-size: 1em;
  }

</style>