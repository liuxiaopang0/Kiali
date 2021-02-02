<template>
  <div class="container">
    <CJS ref="ref_CJS" :autoungrabify="allowGrab" :nodes="nodes" :edges="edges"></CJS>
    <div style="padding: 7px 10px;position: absolute;bottom: 0px;">
      <el-tooltip class="item" effect="dark" :content="allowGrab ? '禁用拖动' : '启用拖动'" placement="top">
        <el-button icon="icon-move-full" @click="allowGrab= !allowGrab" :style="{color:allowGrab?'#409EFF':''}"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="放大" placement="top">
        <el-button icon="icon-zoomIn" @click="$refs.ref_CJS.magnifying()"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="top">
        <el-button style="margin-left: -3px" icon="icon-suoxiao" @click="$refs.ref_CJS.contractible()"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩放以适合" placement="top">
        <el-button icon="icon-suofang" @click="$refs.ref_CJS.resize()"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="布局默认dagre" placement="top">
        <el-button icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({ name: 'dagre' })" :style="{color:layoutName==='dagre'?'#409EFF':''}"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="布局1" placement="top">
        <el-button style="margin-left: -3px" icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({ name: 'cose-bilkent' })" :style="{color:layoutName==='cose-bilkent'?'#409EFF':''}">1</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="布局2" placement="top">
        <el-button style="margin-left: -4px" icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({ name: 'cola' })" :style="{color:layoutName==='cola'?'#409EFF':''}">2</el-button>
      </el-tooltip>
      <el-button type="primary">Legend</el-button>
    </div>
  </div>
  <!-- <div class="container">
    <div id="cy"></div>
    <div style="padding: 7px 10px;position: absolute;bottom: 0px;">
      <el-tooltip class="item" effect="dark" :content="allowGrab ? '禁用拖动' : '启用拖动'" placement="top">
        <el-button icon="icon-move-full" @click="allowGrab= !allowGrab" :style="{color:allowGrab?'#409EFF':''}"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="放大" placement="top">
        <el-button icon="icon-zoomIn" @click="zoom(0.2)"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="top">
        <el-button style="margin-left: -3px" icon="icon-suoxiao" @click="zoom(-0.2)"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩放以适合" placement="top">
        <el-button icon="icon-suofang" @click="fit()"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="布局默认dagre" placement="top">
        <el-button icon="icon-guanxitu1" @click="layoutName = 'dagre'" :style="{color:layoutName==='dagre'?'#409EFF':''}"></el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="布局1" placement="top">
        <el-button style="margin-left: -3px" icon="icon-guanxitu1" @click="layoutName = 'cose-bilkent'" :style="{color:layoutName==='cose-bilkent'?'#409EFF':''}">1</el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="布局2" placement="top">
        <el-button style="margin-left: -4px" icon="icon-guanxitu1" @click="layoutName = 'cola'" :style="{color:layoutName==='cola'?'#409EFF':''}">2</el-button>
      </el-tooltip>
      <el-button type="primary">Legend</el-button>
    </div>
  </div> -->
</template>

<script>
import CJS from './cy'
import cytoscape from 'cytoscape'
// import * as Cy from 'cytoscape'
import canvas from 'cytoscape-canvas'
import cycola from 'cytoscape-cola'
import dagre from 'cytoscape-dagre'
import coseBilkent from 'cytoscape-cose-bilkent'
import popper from 'cytoscape-popper'

cytoscape.use(canvas)
cytoscape.use(cycola)
cytoscape.use(dagre)
cytoscape.use(coseBilkent)
cytoscape.use(popper)
// cytoscape('layout', 'group-compound-layout', GroupCompoundLayout)
import NodeImageKey from '@/assets/img/node-background-key.png'
import NodeImageTopology from '@/assets/img/node-background-topology.png'

export default {
  name: 'cytoscape',
  components: {
    CJS
  },
  data() {
    return {
      allowGrab: false, // 是否能拖动

      layoutName: 'dagre', // 画图布局

      CytoscapeGlobalScratchData: {
        activeNamespaces: '',
        edgeLabelMode: '',
        graphType: '',
        mtlsEnabled: '',
        showCircuitBreakers: '',
        showMissingSidecars: '',
        showSecurity: '',
        showNodeLabels: '',
        showVirtualServices: ''
      },

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
      nodes: [
        {
          'data': {
            'id': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'details',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '1cd79b3dd828bdcf35a57fdfc4e4f505',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'productpage',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '4aa670e0682d4be3aaf24d8f589feb4b',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'ratings',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '6519157be154675342fb76c41edc731c',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'reviews',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '5b6454ebd96fc9d21d492546bdc485fb',
            'nodeType': 'service',
            'namespace': 'default',
            'service': 'kubernetes',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': '791b47eae700823af5f816d23ba9b14e',
            'parent': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'details',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'details'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.26'
                }
              }
            ]
          }
        },
        {
          'data': {
            'id': '16d04f68bd507ca9b0707c2a576d1fc2',
            'parent': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'details',
            'service': 'details',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'details'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.26',
                  'httpOut': '0.26'
                }
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': '6fd9613574c3a42b22e1521194cef78c',
            'parent': '1cd79b3dd828bdcf35a57fdfc4e4f505',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'productpage',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'productpage'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.63',
                  'httpOut': '0.52'
                }
              }
            ]
          }
        },
        {
          'data': {
            'id': 'c2efd356d9a25fd009efe2a323e12361',
            'parent': '1cd79b3dd828bdcf35a57fdfc4e4f505',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'productpage',
            'service': 'productpage',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'productpage'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.63',
                  'httpOut': '0.63'
                }
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': 'f99faf11799f73784885e2eee0c59af4',
            'parent': '4aa670e0682d4be3aaf24d8f589feb4b',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'ratings',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'ratings'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.30'
                }
              }
            ]
          }
        },
        {
          'data': {
            'id': '906196769ac4714aae43f4f789a36d9c',
            'parent': '4aa670e0682d4be3aaf24d8f589feb4b',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'ratings',
            'service': 'ratings',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'ratings'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.30',
                  'httpOut': '0.30'
                }
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': '1b1a7fb27dd423c730bc8987ac6d33d3',
            'parent': '6519157be154675342fb76c41edc731c',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'reviews',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'reviews'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.26',
                  'httpOut': '0.30'
                }
              }
            ]
          }
        },
        {
          'data': {
            'id': 'adbe9380f23fcbefe5fedd6beb0597ef',
            'parent': '6519157be154675342fb76c41edc731c',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'reviews',
            'service': 'reviews',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'reviews'
              }
            ],
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.26',
                  'httpOut': '0.26'
                }
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': 'd4b46f60575a609248787a74c887a5bb',
            'nodeType': 'app',
            'namespace': 'istio-system',
            'app': 'istio-ingressgateway',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '2486d43269bdd448ab733350abc8d407',
            'nodeType': 'app',
            'namespace': 'istio-system',
            'app': 'istiod',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': 'cb596e11c8c0c058a835d71a831eea25',
            'nodeType': 'app',
            'namespace': 'istio-system',
            'app': 'kiali',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': 'e474e0b8e6b953250452df0c4d19fa4b',
            'parent': 'd4b46f60575a609248787a74c887a5bb',
            'nodeType': 'app',
            'namespace': 'istio-system',
            'app': 'istio-ingressgateway',
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpOut': '0.65'
                }
              }
            ],
            'isRoot': true
          }
        },
        {
          'data': {
            'id': '0fab8508e11d7f748ac27e298d222cd9',
            'parent': 'd4b46f60575a609248787a74c887a5bb',
            'nodeType': 'service',
            'namespace': 'istio-system',
            'app': 'istio-ingressgateway',
            'service': 'istio-ingressgateway',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': 'de0a1fb6cc6b0a3133d0ba97c1e5a6c2',
            'parent': '2486d43269bdd448ab733350abc8d407',
            'nodeType': 'app',
            'namespace': 'istio-system',
            'app': 'istiod',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': 'a43bf40318f71f3c4e2d63d9e2880c1b',
            'parent': '2486d43269bdd448ab733350abc8d407',
            'nodeType': 'service',
            'namespace': 'istio-system',
            'app': 'istiod',
            'service': 'istiod',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': 'ee75dded555d80a2d11d8807e600e28b',
            'parent': 'cb596e11c8c0c058a835d71a831eea25',
            'nodeType': 'app',
            'namespace': 'istio-system',
            'app': 'kiali',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': 'eb3484c4543f5eb38fc36d45de089bee',
            'parent': 'cb596e11c8c0c058a835d71a831eea25',
            'nodeType': 'service',
            'namespace': 'istio-system',
            'app': 'kiali',
            'service': 'kiali',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': '4a639f9922515051205421a93f94e0b8',
            'nodeType': 'service',
            'namespace': 'unknown',
            'service': 'unknown',
            'traffic': [
              {
                'protocol': 'http',
                'rates': {
                  'httpIn': '0.02',
                  'httpIn4xx': '0.02'
                }
              }
            ],
            'isInaccessible': true
          }
        }
      ],
      edges: [
        {
          'data': {
            'id': '53be6a156d245c0e2c268667a32ed8f0',
            'source': '16d04f68bd507ca9b0707c2a576d1fc2',
            'target': '791b47eae700823af5f816d23ba9b14e',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.26',
                'httpPercentReq': '100.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'details.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': 'b38f83872dc8fd989b6877d2cb08143b',
            'source': '1b1a7fb27dd423c730bc8987ac6d33d3',
            'target': '906196769ac4714aae43f4f789a36d9c',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.30',
                'httpPercentReq': '100.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'ratings.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': '8854909f6dc0672a6c15238ac26bf9e4',
            'source': '6fd9613574c3a42b22e1521194cef78c',
            'target': '16d04f68bd507ca9b0707c2a576d1fc2',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.26',
                'httpPercentReq': '50.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'details.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': 'dac626cab2d5407c280bac8e89734eda',
            'source': '6fd9613574c3a42b22e1521194cef78c',
            'target': 'adbe9380f23fcbefe5fedd6beb0597ef',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.26',
                'httpPercentReq': '50.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'reviews.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': '40ad8fbff113d95764af817cebc4bacd',
            'source': '906196769ac4714aae43f4f789a36d9c',
            'target': 'f99faf11799f73784885e2eee0c59af4',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.30',
                'httpPercentReq': '100.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'ratings.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': '5b7b3d1e2c6aad4601fd0c8819b18d9f',
            'source': 'adbe9380f23fcbefe5fedd6beb0597ef',
            'target': '1b1a7fb27dd423c730bc8987ac6d33d3',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.26',
                'httpPercentReq': '100.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'reviews.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': '9880fe6a96c070844b605b388790cbab',
            'source': 'c2efd356d9a25fd009efe2a323e12361',
            'target': '6fd9613574c3a42b22e1521194cef78c',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.63',
                'httpPercentReq': '100.0'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'productpage.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': '385cb29aeef067cecfef6997c345ee79',
            'source': 'e474e0b8e6b953250452df0c4d19fa4b',
            'target': '4a639f9922515051205421a93f94e0b8',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.02',
                'http4xx': '0.02',
                'httpPercentErr': '100.0',
                'httpPercentReq': '3.4'
              },
              'responses': {
                '404': {
                  'flags': {
                    'NR': '100.0'
                  },
                  'hosts': {
                    'unknown': '100.0'
                  }
                }
              }
            }
          }
        },
        {
          'data': {
            'id': 'd1f2e926601b71259ccd6e1c65fcde2c',
            'source': 'e474e0b8e6b953250452df0c4d19fa4b',
            'target': 'c2efd356d9a25fd009efe2a323e12361',
            'traffic': {
              'protocol': 'http',
              'rates': {
                'http': '0.63',
                'httpPercentReq': '96.6'
              },
              'responses': {
                '200': {
                  'flags': {
                    '-': '100.0'
                  },
                  'hosts': {
                    'productpage.default.svc.cluster.local': '100.0'
                  }
                }
              }
            }
          }
        }
      ]
    }
  },
  mounted() {
    this.addEles()
  },
  methods: {
    addEles() {
      this.$refs['ref_CJS'].addEles([
        { group: 'nodes', data: { 'id': '鲁A123456', 'name': '鲁A123456' }, classes: 'classes-A', position: { x: 200, y: 50 }},
        { group: 'nodes', data: { 'id': '鲁B123456', 'name': '鲁B123456' }, classes: 'classes-A', position: { x: 500, y: 50 }},
        { group: 'nodes', data: { 'id': '鲁C123456', 'name': '鲁C123456' }, classes: 'classes-A', display: 'hide', position: { x: 200, y: 150 }},
        { group: 'nodes', data: { 'id': '鲁D123456', 'name': '鲁D123456' }, classes: 'classes-A', position: { x: 500, y: 150 }},
        { group: 'nodes', data: { 'id': '小王', 'name': '小王' }, classes: 'classes-B', position: { x: 100, y: 100 }},
        { group: 'nodes', data: { 'id': '小赵', 'name': '小赵' }, classes: 'classes-B', position: { x: 400, y: 100 }},
        { group: 'nodes', data: { 'id': '川川某公司', 'name': '川川某公司' }, classes: 'classes-C', display: 'hide', position: { x: 300, y: 100 }},
        { group: 'nodes', data: { 'id': '京京某单位', 'name': '京京某单位' }, classes: 'classes-D', position: { x: 300, y: 200 }},
        { group: 'edges', data: { id: 'e0', name: '拥有', source: '小王', target: '鲁A123456' }},
        { group: 'edges', data: { id: 'e1', name: '拥有', source: '小赵', target: '鲁B123456' }},
        { group: 'edges', data: { id: 'e2', name: '拥有', source: '小王', target: '鲁C123456' }},
        { group: 'edges', data: { id: 'e3', name: '拥有', source: '小赵', target: '鲁D123456' }},
        { group: 'edges', data: { id: 'e4', name: '就职', source: '小王', target: '川川某公司' }},
        { group: 'edges', data: { id: 'e5', name: '就职', source: '小赵', target: '川川某公司' }},
        { group: 'edges', data: { id: 'e6', name: '租用', source: '川川某公司', target: '鲁A123456' }},
        { group: 'edges', data: { id: 'e7', name: '租用', source: '川川某公司', target: '鲁B123456' }}
      ])
    },
    delEles() {
      this.$refs['ref_CJS'].delEles()
    }
  // watch: {
  //   layoutName(newValue, oldValue) {
  //     this.createCytoscape()
  //   },
  //   allowGrab(newValue, oldValue) {
  //     this.createCytoscape()
  //   }
  // },
  // methods: {
  //   fit() {
  //     const cy = this.getCy()
  //     const container = cy ? cy.container() : undefined
  //     const ZoomOptions = {
  //       fitPadding: 25,
  //       maxZoom: 2.5
  //     }
  //     if (cy) {
  //       // CytoscapeGraphUtils.safeFit(cy)
  //       cy.fit(container, ZoomOptions.fitPadding)
  //       if (cy.zoom() > ZoomOptions.maxZoom) {
  //         cy.zoom(ZoomOptions.maxZoom)
  //         !!container && !!container.length ? cy.center(container) : cy.center()
  //       }
  //       cy.emit('fit')
  //     }
  //   },
  //   // 缩放
  //   zoom(zoom) {
  //     const selectedEles = this.elements('node:selected')
  //     /** 获取已选择内容中得第一个, 没有选择为null */
  //     const selectedEle = selectedEles && selectedEles.length ? selectedEles[0] : null
  //     /** 获取画布偏移位置 */
  //     const pan = this.$cy.pan()
  //     /** 计算原点坐标 */
  //     const [x, y] = selectedEle ? [selectedEle.position('x'), selectedEle.position('y')] : [pan.x, pan.y]
  //     let level = this.$cy.zoom() + zoom;
  //     (level > this.$cy.maxZoom) && (level = this.$cy.maxZoom);
  //     (level < this.$cy.minZoom) && (level = this.$cy.minZoom)
  //     this.$cy.zoom({ level: level, renderedPosition: { x: x, y: y }})
  //   },
  //   // 获取cy
  //   getCy() {
  //     console.log(document.getElementById('cy'))
  //     if (document.getElementById('cy')) {
  //       return (document.getElementById('cy')).getCy()
  //     }
  //     return null
  //   },
  //   getNodeBackgroundImage(ele = Cy.NodeSingular) {
  //     const nodeData = this.decoratedNodeData(ele)
  //     const isInaccessible = nodeData.isInaccessible
  //     const isServiceEntry = nodeData.isServiceEntry
  //     const isGroup = nodeData.isGroup
  //     if (isInaccessible && !isServiceEntry && !isGroup) {
  //       return NodeImageKey
  //     }
  //     const isOutside = nodeData.isOutside
  //     if (isOutside && !isGroup) {
  //       return NodeImageTopology
  //     }
  //     return 'none'
  //   },
  //   decoratedNodeData(ele = Cy.NodeSingular) {
  //     return ele.data()
  //   },
  //   getNodeShape(ele = Cy.NodeSingular) {
  //     const nodeData = this.decoratedNodeData(ele)
  //     const nodeType = nodeData.nodeType
  //     switch (nodeType) {
  //       case 'aggregate':
  //         return 'round-pentagon'
  //       case 'app':
  //         return 'round-rectangle'
  //       case 'service':
  //         return nodeData.isServiceEntry ? 'round-tag' : 'round-triangle'
  //       case 'unknown':
  //         return 'ellipse'
  //       case 'workload':
  //         return 'ellipse'
  //       default:
  //         return 'ellipse'
  //     }
  //   },
  //   getNodeBorderColor(ele = Cy.NodeSingular) {
  //     switch (ele.data(this.CyNode.healthStatus)) {
  //       case 'Degraded':
  //         return '#fff'
  //       case 'Failure':
  //         return 'red'
  //       default:
  //         return '#CCCCCC'
  //     }
  //   },
  //   getEdgeLabel(ele, includeProtocol) {
  //     const cyGlobal = { activeNamespaces: [
  //       { name: 'default' }, { name: 'istio-system' }
  //     ],
  //     edgeLabelMode: 'requestRate',
  //     graphType: 'app',
  //     mtlsEnabled: false,
  //     showCircuitBreakers: true,
  //     showMissingSidecars: true,
  //     showNodeLabels: true,
  //     showSecurity: false,
  //     showVirtualServices: true
  //     }
  //     // const cyGlobal = this.getCyGlobalData(ele)
  //     const edgeLabelMode = cyGlobal.edgeLabelMode
  //     console.log(edgeLabelMode, 'edgeLabelMode')
  //     let content = ''
  //     const edgeData = this.decoratedEdgeData(ele)

  //     switch (edgeLabelMode) {
  //       case this.EdgeLabelMode.REQUEST_RATE: {
  //         let rate = 0
  //         let pErr = 0
  //         if (edgeData.http > 0) {
  //           rate = edgeData.http
  //           pErr = edgeData.httpPercentErr > 0 ? edgeData.httpPercentErr : 0
  //         } else if (edgeData.grpc > 0) {
  //           rate = edgeData.grpc
  //           pErr = edgeData.grpcPercentErr > 0 ? edgeData.grpcPercentErr : 0
  //         } else if (edgeData.tcp > 0) {
  //           rate = edgeData.tcp
  //         }

  //         if (rate > 0) {
  //           if (pErr > 0) {
  //             let sErr = pErr.toFixed(1)
  //             sErr = `${sErr.endsWith('.0') ? pErr.toFixed(0) : sErr}`
  //             content = `${rate.toFixed(2)}\n${sErr}%`
  //           } else {
  //             content = rate.toFixed(2)
  //           }
  //         }
  //         break
  //       }
  //       case this.EdgeLabelMode.RESPONSE_TIME_95TH_PERCENTILE: {
  //         // todo: remove this logging once we figure out the strangeness going on with responseTime
  //         const logResponseTime = edgeData.responseTime
  //         if (!isNaN(logResponseTime) && !Number.isInteger(logResponseTime)) {
  //           console.log(`Unexpected string responseTime=|${logResponseTime}|`)
  //         }
  //         // hack to fix responseTime is sometimes a string during runtime even though its type is number
  //         const responseTimeNumber = parseInt(String(edgeData.responseTime))
  //         const responseTime = responseTimeNumber > 0 ? responseTimeNumber : 0
  //         if (responseTime && responseTime > 0) {
  //           content = responseTime < 1000.0 ? `${responseTime.toFixed(0)}ms` : `${(responseTime / 1000.0).toFixed(2)}s`
  //         }
  //         break
  //       }
  //       case this.EdgeLabelMode.REQUEST_DISTRIBUTION: {
  //         let pReq
  //         if (edgeData.httpPercentReq > 0) {
  //           pReq = edgeData.httpPercentReq
  //         } else if (edgeData.grpcPercentReq > 0) {
  //           pReq = edgeData.grpcPercentReq
  //         }
  //         if (pReq > 0) {
  //           const sReq = pReq.toFixed(1)
  //           content = `${sReq.endsWith('.0') ? pReq.toFixed(0) : sReq}%`
  //         }
  //         break
  //       }
  //       default:
  //         content = ''
  //     }

  //     if (includeProtocol) {
  //       const protocol = edgeData.protocol
  //       content = protocol ? `${protocol} ${content}` : content
  //     }

  //     const mtlsPercentage = edgeData.isMTLS
  //     if (cyGlobal.showSecurity && edgeData.hasTraffic) {
  //       if (cyGlobal.mtlsEnabled) {
  //         if (!mtlsPercentage || mtlsPercentage < 100) {
  //           content = `'\uE065 ' ${content}`
  //         }
  //       } else {
  //         if (mtlsPercentage && mtlsPercentage > 0) {
  //           content = `'\uE02a ' ${content}`
  //         }
  //       }
  //     }

  //     if (edgeData.hasTraffic && edgeData.responses) {
  //       const dest = this.decoratedNodeData(ele.target())
  //       if (dest.hasCB) {
  //         const responses = edgeData.responses
  //         for (const code of _.keys(responses)) {
  //           // TODO: Not 100% sure we want "UH" code here ("no healthy upstream hosts") but based on timing I have
  //           // seen this code returned and not "UO". "UO" is returned only when the circuit breaker is caught open.
  //           // But if open CB is responsible for removing possible destinations the "UH" code seems preferred.
  //           if (responses[code]['UO'] || responses[code]['UH']) {
  //             content = `'\uE02a ' ${content}`
  //             break
  //           }
  //         }
  //       }
  //     }
  //     console.log(content, 'content')
  //     return content
  //   },
  //   getCyGlobalData(ele = Cy.NodeSingular) {
  //     console.log(ele, 'ele.cy().scratch')
  //     return ele.cy().scratch('_global')
  //     // return ele.cy().scratch('_private')
  //   },
  //   decoratedEdgeData(ele = Cy.EdgeSingular) {
  //     return ele.data()
  //   },
  //   getEdgeColor(ele = Cy.EdgeSingular) {
  //     const edgeData = this.decoratedEdgeData(ele)

  //     if (!edgeData.hasTraffic) {
  //       return '#8b8d8f'
  //     }
  //     if (edgeData.protocol === 'tcp') {
  //       return '#004368'
  //     }

  //     const sourceNodeData = this.decoratedNodeData(ele.source())
  //     const destNodeData = this.decoratedNodeData(ele.target())
  //     const statusEdge = this.getEdgeHealth(edgeData, sourceNodeData, destNodeData)

  //     switch (statusEdge.status) {
  //       case 'FAILURE':
  //         return 'red'
  //       case 'DEGRADED':
  //         return 'red'
  //       default:
  //         return '#3e8635'
  //     }
  //   },
  //   getEdgeHealth(edge, source, target) {
  //     const configSource = this.getRateHealthConfig(source.namespace, source[source.nodeType], source.nodeType)
  //     const configTarget = this.getRateHealthConfig(target.namespace, target[target.nodeType], target.nodeType)

  //     const tolerancesSource = configSource ? configSource.tolerance.filter(tol => this.checkExpr(tol.direction, 'outbound')) : ''
  //     const tolerancesTarget = configTarget ? configTarget.tolerance.filter(tol => this.checkExpr(tol.direction, 'inbound')) : ''

  //     const outboundEdge = this.aggregate(this.transformEdgeResponses(edge.responses, edge.protocol), tolerancesSource, true)
  //     const inboundEdge = this.aggregate(this.transformEdgeResponses(edge.responses, edge.protocol), tolerancesTarget, true)

  //     const outboundEdgeStatus = this.calculateStatusGraph(outboundEdge, edge.responses)
  //     const inboundEdgeStatus = this.calculateStatusGraph(inboundEdge, edge.responses)

  //     return outboundEdgeStatus.status.status.priority > inboundEdgeStatus.status.status.priority
  //       ? outboundEdgeStatus.status
  //       : inboundEdgeStatus.status
  //   },
  //   calculateStatusGraph(requestsTolerances, traffic) {
  //     const result = {
  //       status: {
  //         value: -1,
  //         status: this.NA
  //       },
  //       protocol: '',
  //       toleranceConfig: undefined
  //     }
  //     // For each calculate errorRate by tolerance configuration
  //     for (const reqTol of Object.values(requestsTolerances)) {
  //       for (const [protocol, rate] of Object.entries(reqTol.requests)) {
  //         const tolerance =
  //             reqTol.tolerance && this.checkExpr(reqTol ? reqTol.tolerance ? reqTol.tolerance.protocol : '' : '', protocol) ? reqTol.tolerance : undefined
  //         // Create threshold for the tolerance
  //         const thresholds = {
  //           degraded: tolerance ? tolerance.degraded : '',
  //           failure: tolerance ? tolerance.failure : '',
  //           unit: '%'
  //         }
  //         // Calculate the status
  //         const auxStatus = this.scendingThresholdCheck(rate, thresholds)
  //         // Check if the status has more priority than the previous one
  //         if (auxStatus.status.priority > result.status.status.priority) {
  //           result.status = auxStatus
  //           result.protocol = protocol
  //           result.toleranceConfig = reqTol.tolerance
  //         }
  //       }
  //     }
  //     if (result.status.status === this.NA && Object.keys(traffic).length > 0) {
  //       result.status.status = this.HEALTHY
  //       result.status.value = 0
  //     }
  //     return result
  //   },
  //   ascendingThresholdCheck(value, thresholds) {
  //     if (value > 0) {
  //       if (value >= thresholds.failure) {
  //         return {
  //           value: value,
  //           status: 'FAILURE',
  //           violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.failure + thresholds.unit
  //         }
  //       } else if (value >= thresholds.degraded) {
  //         return {
  //           value: value,
  //           status: 'DEGRADED',
  //           violation: value.toFixed(2) + thresholds.unit + '>=' + thresholds.degraded + thresholds.unit
  //         }
  //       }
  //     }

  //     return { value: value, status: this.HEALTHY }
  //   },
  //   transformEdgeResponses(requests, protocol) {
  //     const prot = {}
  //     const result = {}
  //     result[protocol] = prot

  //     for (const [code, responseDetail] of Object.entries(requests)) {
  //       const percentRate = Object.values((responseDetail).flags).reduce(
  //         (acc, value) => acc + Number(value)
  //       )
  //       result[protocol][code] = Number(percentRate)
  //     }

  //     return result
  //   },
  //   getRateHealthConfig(ns, name, kind) {
  //     const configCache = {}
  //     const serverConfig = {
  //       healthConfig: {
  //         rate: []
  //       },
  //       installationTag: 'Kiali Console',
  //       istioAnnotations: {
  //         istioInjectionAnnotation: 'sidecar.istio.io/inject'
  //       },
  //       istioIdentityDomain: 'svc.cluster.local',
  //       istioNamespace: 'istio-system',
  //       istioComponentNamespaces: new Map(),
  //       istioLabels: {
  //         appLabelName: 'app',
  //         injectionLabelName: 'istio-injection',
  //         versionLabelName: 'version'
  //       },
  //       kialiFeatureFlags: {
  //         istioInjectionAction: true
  //       },
  //       prometheus: {
  //         globalScrapeInterval: 15,
  //         storageTsdbRetention: 21600
  //       },
  //       durations: {}
  //     }
  //     const key = ns + '_' + kind + '_' + name
  //     // If we have the configuration cached then return it
  //     if (configCache[key]) {
  //       return configCache[key]
  //     }
  //     if (serverConfig.healthConfig && serverConfig.healthConfig.rate) {
  //       for (const rate of serverConfig.healthConfig.rate) {
  //         if (this.checkExpr(rate.namespace, ns) && this.checkExpr(rate.name, name) && this.checkExpr(rate.kind, kind)) {
  //           configCache[key] = rate
  //           return rate
  //         }
  //       }
  //     }
  //     return serverConfig.healthConfig.rate[serverConfig.healthConfig.rate.length - 1]
  //   },
  //   checkExpr(value, testV) {
  //     let reg = value
  //     if (!reg) {
  //       return true
  //     }
  //     if (typeof value === 'string') {
  //       reg = new RegExp(value)
  //     }
  //     return (reg).test(testV)
  //   },
  //   createCytoscape() {
  //     // cytoscape.warnings(false)
  //     const cy = cytoscape({
  //       container: document.getElementById('cy'),
  //       boxSelectionEnabled: false,
  //       autounselectify: false,
  //       userZoomingEnabled: true, // 是否允许用户事件（例如鼠标滚轮，捏合缩放）缩放图形
  //       wheelSensitivity: 0.1, // 缩放时更改滚轮灵敏度。
  //       autoungrabify: !this.allowGrab, // 节点是否可以拖拽
  //       minZoom: 0.3, // 图表缩放得最小界限
  //       layout: {
  //         name: this.layoutName
  //       },
  //       style: [
  //         {
  //           selector: 'node',
  //           style: {
  //             content: 'data(app)',
  //             'background-color': '#fff',
  //             'background-image': (ele = Cy.NodeSingular) => {
  //               return this.getNodeBackgroundImage(ele)
  //             },
  //             'background-width': '80%',
  //             'background-height': '80%',
  //             'background-position-x': (ele = Cy.NodeSingular) => {
  //               if (this.getNodeShape(ele) === 'round-tag') {
  //                 return '0'
  //               }
  //               return '50%'
  //             },
  //             'background-position-y': (ele = Cy.NodeSingular) => {
  //               if (this.getNodeShape(ele) === 'round-triangle') {
  //                 return '6px'
  //               }
  //               return '50%'
  //             },
  //             'border-color': (ele = Cy.NodeSingular) => {
  //               return this.getNodeBorderColor(ele)
  //             },
  //             'border-style': (ele = Cy.NodeSingular) => {
  //               return this.decoratedNodeData(ele).isUnused ? 'dotted' : 'solid'
  //             },
  //             'border-width': '1px',
  //             ghost: 'yes',
  //             'ghost-offset-x': 1,
  //             'ghost-offset-y': 1,
  //             'ghost-opacity': 0.4,
  //             height: '25px',
  //             shape: (ele = Cy.NodeSingular) => {
  //               return this.getNodeShape(ele)
  //             },
  //             width: '25px',
  //             'z-index': 10
  //           }
  //         },
  //         {
  //           selector: `node[?isGroup]`,
  //           css: {
  //             'background-color': '#fff'
  //           }
  //         },
  //         // {
  //         //   selector: 'node:selected',
  //         //   style: nodeSelectedStyle
  //         // },
  //         {
  //           selector: 'node.mousehighlight',
  //           style: {
  //             'font-size': '11px'
  //           }
  //         },
  //         {
  //           selector: `node.mousehighlight[^isGroup]`,
  //           style: {
  //             'background-color': (ele = Cy.NodeSingular) => {
  //               switch (ele.data('healthStatus')) {
  //                 case 'DEGRADED':
  //                   return '#fdf2e5'
  //                 case 'FAILURE':
  //                   return '#ffe6e6'
  //                 default:
  //                   return '#def3ff'
  //               }
  //             },
  //             'border-color': (ele = Cy.NodeSingular) => {
  //               switch (ele.data('healthStatus')) {
  //                 case 'DEGRADED':
  //                   return '#fff'
  //                 case 'FAILURE':
  //                   return 'red'
  //                 default:
  //                   return '#39a5dc'
  //               }
  //             }
  //           }
  //         },
  //         {
  //           selector: 'node.mousedim',
  //           style: {
  //             opacity: 0.6
  //           }
  //         },
  //         {
  //           selector: ':parent',
  //           css: {
  //             'text-valign': 'bottom',
  //             'text-halign': 'center'
  //             // 'text-halign': 'right',
  //             // 'text-rotation': '90deg', //文字旋转
  //           }
  //         },
  //         {
  //           selector: 'edge',
  //           css: {
  //             'curve-style': 'bezier',
  //             'font-family': 'Verdana,Arial,Helvetica,sans-serif,pficon',
  //             'font-size': '6px',
  //             label: (ele = Cy.EdgeSingular) => {
  //               return this.getEdgeLabel(ele)
  //             },
  //             'line-color': (ele = Cy.EdgeSingular) => {
  //               return this.getEdgeColor(ele)
  //             },
  //             'line-style': 'solid',
  //             'target-arrow-shape': 'vee',
  //             'target-arrow-color': (ele = Cy.EdgeSingular) => {
  //               return this.getEdgeColor(ele)
  //             },
  //             'text-events': 'yes',
  //             'text-outline-color': '#fff',
  //             'text-outline-width': '1px',
  //             'text-wrap': 'wrap',
  //             width: '2'
  //           }
  //         },
  //         {
  //           selector: 'edge:selected',
  //           css: {
  //             width: 4,
  //             label: (ele = Cy.EdgeSingular) => this.getEdgeLabel(ele, true)
  //           }
  //         },
  //         {
  //           selector: 'edge[protocol="tcp"]',
  //           css: {
  //             'target-arrow-shape': 'triangle-cross',
  //             'line-style': 'solid'
  //           }
  //         },
  //         {
  //           selector: 'edge.mousehighlight',
  //           style: {
  //             'font-size': '10px'
  //           }
  //         },
  //         {
  //           selector: 'edge.mousehover',
  //           style: {
  //             label: (ele = Cy.EdgeSingular) => {
  //               return this.getEdgeLabel(ele, true)
  //             }
  //           }
  //         },
  //         {
  //           selector: 'edge.mousedim',
  //           style: {
  //             opacity: 0.3
  //           }
  //         },
  //         {
  //           selector: '*.find[^isGroup]',
  //           style: {
  //             'overlay-color': '#f0ab00',
  //             'overlay-padding': '7px',
  //             'overlay-opacity': 0.3
  //           }
  //         },
  //         {
  //           selector: '*.span[^isGroup]',
  //           style: {
  //             'overlay-color': '#a18fff',
  //             'overlay-padding': '7px',
  //             'overlay-opacity': 0.3
  //           }
  //         }

  //       ],
  //       elements: {
  //         // 节点数据
  //         nodes: this.nodes,
  //         //
  //         edges: this.edges
  //       }
  //     })
  //   }
  // },
  // mounted() {
  //   this.createCytoscape()
  // }
  }
}

</script>
<style scoped>
.container {
  min-height: 350px;
  height: calc(100vh - 113px);
  position: relative;
  background-color: #f5f5f5
}
#cy {
  width: 100%;
  height: 100%;
}

</style>