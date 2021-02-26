<template>
  <div style="height: 100%">
    <el-row>
      <div style="margin-bottom: 10px;">
        <el-button type="primary" style="position: relative;" @click="isShow = !isShow">
          显示<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <div v-if="isShow" style="position: absolute;z-index: 2;width: 217px;background: #fff;background-clip:padding-box;border:0.5px solid rgba(255,255,255,.5);padding:8px 0;box-shadow: rgb(186, 186, 186) 0px 0px 5px 1px">
          <div style="overflow: auto;min-width: 100%;max-height: calc(100vh - 207.333px);">
            <div style="font-size:14px">
              <div style="color: #6a6e73;font-weight: 700;padding: 8px 16px 2px 16px;">Show Edge Labels</div>
              <div v-for="(item,index) in [{name:'No Label',value:'No Label'},{name:'Request Rate',value:'Request Rate'},{name:'Request Distribution',value:'Request Distribution'},{name:'Response Time',value:'Response Time'}]" :key="index" style="cursor: not-allowed;width: 100%;display: inline-block;line-height: 32px;">
                <el-radio style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" v-model="radio" :label="item.value">{{item.name}}</el-radio>
              </div>
              <div style="color: #6a6e73;font-weight: 700;padding: 8px 16px 2px 16px;">Show</div>
              <div v-for="item in ['Compress Hidden', 'Node Names', 'Operation Nodes', 'Service Nodes','Traffic Animation','Unused Nodes']" :key="item" style="cursor: not-allowed;width: 100%;display: inline-block;line-height: 32px;">
                <el-checkbox-group v-model="checked">
                  <el-checkbox style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" :label="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div style="color: #6a6e73;font-weight: 700;padding: 8px 16px 2px 16px;">Show Badges</div>
              <div v-for="item in ['Circuit Breakers', 'Missing Sidecars', 'Virtual Services', 'Security']" :key="item" style="cursor: not-allowed;width: 100%;display: inline-block;line-height: 32px;">
                <el-checkbox-group v-model="checked">
                  <el-checkbox style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" :label="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <el-input v-model="find" style="width:100px;display:inline-block;" />
        <el-input v-model="hide" style="width:100px;display:inline-block;" />
      </div>
    </el-row>
    <!-- <div class="page-container"> -->
      <div class="page-container" style="box-sizing: border-box;min-width: 0px;min-height: 0px;display: flex;background-color: #f5f5f5;position: relative;">
        <div v-if="Legend" style="background-color: #fff;border: 1px #ddd solid;margin: 0 0 60px 0;overflow: hidden;overflow-x: auto;overflow-y: auto;padding: 5px;z-index: 3;">
          <div style="width: 200px;">
            <span style="font-size: 16px;font-weight: bold;">Legend</span>
            <span style="float: right;margin-top: -7px;">
              <el-button  @click="Legend = false" type="text" icon="el-icon-close" style="color:#737679;font-size:16px;"></el-button>
            </span>
          </div>
          <div style="display: flex;flex-direction: column;">
            <div style="width: 200px;height: 100%;overflow: hidden;">
              <div v-for="(item,index) in legendData" :key="index" style="font-size: 14px;padding-top: 5px">
                {{item.title}}
                <div v-for="(ele,index1) in item.data" :key="index1" style="display: flex;flex-direction: row;font-size: 5px;justify-content: space-between;padding: 5px 5px 0 5px;">
                  <span><img :alt="ele.label" :src="ele.icon" ></span>
                  <span style="font-size: 12px;font-weight: normal;margin-top: 3px;width: 130px;">{{ele.label}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 1;min-width: 350px;padding-right: 5px;z-index: 0;">
          <CJS ref="ref_CJS" :data="this.decorateGraphData({ 'nodes': this.nodes, 'edges': this.edges })" :autoungrabify="allowGrab" :nodes="nodes" :edges="edges"></CJS>
        </div>
        <!-- <div style="background:red;width:10px;height:100%;"></div> -->
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
              <el-button icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({
                name: 'dagre',
                fit: false,
                nodeDimensionsIncludeLabels: true,
                rankDir: 'LR'
              }),layoutName='dagre'" :style="{color:layoutName==='dagre'?'#409EFF':''}"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="布局1" placement="top">
                    <el-button style="margin-left: -3px" icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({
                name: 'cose-bilkent',
                animate: false,
                fit: false,
                nodeDimensionsIncludeLabels: true
              }),layoutName='cose-bilkent'" :style="{color:layoutName==='cose-bilkent'?'#409EFF':''}">1</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="布局2" placement="top">
                    <el-button style="margin-left: -4px" icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({
                name: 'cola',
                animate: false,
                fit: false,
                flow: { axis: 'x' },
                nodeDimensionsIncludeLabels: true,
                randomize: false
              }),layoutName='cola'" :style="{color:layoutName==='cola'?'#409EFF':''}">2</el-button>
            </el-tooltip>
            <el-button type="primary" @click="Legend = !Legend">Legend</el-button>
          </div>
      </div>
      
    <!-- </div> -->
  </div>
</template>

<script>
import CJS from './cy'

// Node Shapes
import workloadImage from '@/assets/img/legend/node.svg'
import appImage from '@/assets/img/legend/app.svg'
import serviceImage from '@/assets/img/legend/service.svg'
import aggregateImage from '@/assets/img/legend/aggregate.svg'
import serviceEntryImage from '@/assets/img/legend/service-entry.svg'
// Node Colors
import nodeColorNormalImage from '@/assets/img/legend/node-color-normal.svg'
import nodeColorWarningImage from '@/assets/img/legend/node-color-warning.svg'
import nodeColorDangerImage from '@/assets/img/legend/node-color-danger.svg'
import nodeColorUnusedImage from '@/assets/img/legend/node-color-unused.svg'
// Node Background
import externalNamespaceImage from '@/assets/img/legend/external-namespace.svg'
import restrictedNamespaceImage from '@/assets/img/legend/restricted-namespace.svg'
// Edges
import edgeSuccessImage from '@/assets/img/legend/edge-success.svg'
import edgeDangerImage from '@/assets/img/legend/edge-danger.svg'
import edgeWarnImage from '@/assets/img/legend/edge-warn.svg'
import edgeIdlemage from '@/assets/img/legend/edge-idle.svg'
import edgeTcpImage from '@/assets/img/legend/edge-tcp.svg'
import edgeMtlsImage from '@/assets/img/legend/mtls-badge.svg'
// Traffic Animation
import trafficNormalImage from '@/assets/img/legend/traffic-normal-request.svg'
import trafficFailedImage from '@/assets/img/legend/traffic-failed-request.svg'
import trafficTcpImage from '@/assets/img/legend/traffic-tcp.svg'
// Badges
import badgeCircuitBreakerImage from '@/assets/img/legend/node-badge-circuit-breaker.svg'
import badgeMissingSidecarImage from '@/assets/img/legend/node-badge-missing-sidecar.svg'
import badgeVirtualServicesImage from '@/assets/img/legend/node-badge-virtual-services.svg'

export default {
  name: 'cytoscape',
  components: {
    CJS
  },
  data() {
    return {
      Legend: false,
      legendData: [
        {
          title: 'Node Shapes',
          data: [
            { label: 'Workload', icon: workloadImage },
            { label: 'App', icon: appImage },
            { label: 'Operation', icon: aggregateImage },
            { label: 'Service', icon: serviceImage },
            { label: 'Service Entry', icon: serviceEntryImage }
          ]
        },
        {
          title: 'Node Colors',
          data: [
            { label: 'Normal', icon: nodeColorNormalImage },
            { label: 'Warn', icon: nodeColorWarningImage },
            { label: 'Danger', icon: nodeColorDangerImage },
            { label: 'Unused', icon: nodeColorUnusedImage }
          ]
        },
        {
          title: 'Node Background',
          data: [
            { label: 'External Namespace', icon: externalNamespaceImage },
            { label: 'Restricted Namespace', icon: restrictedNamespaceImage }
          ]
        },
        {
          title: 'Edges',
          data: [
            { label: 'Failure', icon: edgeDangerImage },
            { label: 'Degraded', icon: edgeWarnImage },
            { label: 'Healthy', icon: edgeSuccessImage },
            { label: 'TCP Connection', icon: edgeTcpImage },
            { label: 'Idle', icon: edgeIdlemage },
            { label: 'mTLS (badge)', icon: edgeMtlsImage }
          ]
        },
        {
          title: 'Traffic Animation',
          data: [
            { label: 'Normal Request', icon: trafficNormalImage },
            { label: 'Failed Request', icon: trafficFailedImage },
            { label: 'TCP Traffic', icon: trafficTcpImage }
          ]
        },
        {
          title: 'Node Badges',
          data: [
            { label: 'Circuit Breaker', icon: badgeCircuitBreakerImage },
            { label: 'Missing Sidecar', icon: badgeMissingSidecarImage },
            { label: 'Virtual Services', icon: badgeVirtualServicesImage }
          ]
        }
      ],

      checked: [],
      radio: '1',
      visible: false,
      isShow: false,
      find: '',
      hide: '',

      allowGrab: false, // 是否能拖动

      layoutName: 'dagre', // 画图布局

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
            'id': '1dc860585c7c62f074c0006794b012c0',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'minio',
            'isGroup': 'app'
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
            'hasVS': true
          }
        },
        {
          'data': {
            'id': '721ef0b8cfba57d153213a5d659ae9da',
            'parent': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'details-v1',
            'app': 'details',
            'version': 'v1',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'details'
              }
            ]
          }
        },
        {
          'data': {
            'id': 'a90e9f13fe3d43979b9735421567298e',
            'parent': '1dc860585c7c62f074c0006794b012c0',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'minio',
            'service': 'argo-artifacts',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'argo-artifacts'
              }
            ],
            'isRoot': true
          }
        },
        {
          'data': {
            'id': '66782d17b3eb7b0a7b507c6af9faa069',
            'parent': '1dc860585c7c62f074c0006794b012c0',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'argo-artifacts',
            'app': 'minio',
            'version': 'latest',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'argo-artifacts'
              }
            ]
          }
        },
        {
          'data': {
            'id': '06e488a37fc9aa5b0e0805db4f16ae69',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'productpage-v1',
            'app': 'productpage',
            'version': 'v1',
            'isRoot': true
          }
        }
      ],
      edges: [
        {
          'data': {
            'id': '531fdd02d44612b9a7a9f393dcbf6940',
            'source': '06e488a37fc9aa5b0e0805db4f16ae69',
            'target': '16d04f68bd507ca9b0707c2a576d1fc2',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': 'f774bb2441e6cc6e34630c04c150ca35',
            'source': '16d04f68bd507ca9b0707c2a576d1fc2',
            'target': '721ef0b8cfba57d153213a5d659ae9da',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': 'a5806d6835b762aad284a5b1d4b97523',
            'source': 'a90e9f13fe3d43979b9735421567298e',
            'target': '66782d17b3eb7b0a7b507c6af9faa069',
            'traffic': {
              'protocol': 'http'
            }
          }
        }
      ]

    }
  },
  mounted() {
    console.log(this.decorateGraphData({ 'nodes': this.nodes, 'edges': this.edges }), 'decorateGraphData')
  },
  methods: {
    decorateGraphData(graphData) {
      console.log(graphData, 'graphData')
      const elementsDefaults = {
        edges: {
          destPrincipal: undefined,
          grpc: NaN,
          grpcErr: NaN,
          grpcPercentErr: NaN,
          grpcPercentReq: NaN,
          hasTraffic: undefined,
          http: NaN,
          http3xx: NaN,
          http4xx: NaN,
          http5xx: NaN,
          httpNoResponse: NaN,
          httpPercentErr: NaN,
          httpPercentReq: NaN,
          isMTLS: -1,
          // protocol: undefined,
          responses: undefined,
          responseTime: NaN,
          sourcePrincipal: undefined,
          tcp: NaN
        },
        nodes: {
          aggregate: undefined,
          aggregateValue: undefined,
          app: undefined,
          destServices: undefined,
          grpcIn: NaN,
          grpcInErr: NaN,
          grpcOut: NaN,
          hasCB: undefined,
          hasMissingSC: undefined,
          hasVS: undefined,
          health: undefined,
          httpIn: NaN,
          httpIn3xx: NaN,
          httpIn4xx: NaN,
          httpIn5xx: NaN,
          httpInNoResponse: NaN,
          // healthStatus: '',
          httpOut: NaN,
          isDead: undefined,
          // isGroup: undefined,
          isInaccessible: undefined,
          isIstio: undefined,
          isMisconfigured: undefined,
          isOutside: undefined,
          isRoot: undefined,
          isServiceEntry: undefined,
          isUnused: undefined,
          service: undefined,
          tcpIn: NaN,
          tcpOut: NaN,
          version: undefined,
          workload: undefined
        }
      }
      // It's not easy to get find/hide to work exactly as users may expect.  Because edges represent
      // traffic for only one protocol it is best to use 0 defaults for that one protocol, and leave the others
      // as NaN. In that way numerical expressions affect only edges for a desired protocol.  Because nodes
      // can involve traffic from multiple protocols, it seems (for now) best to only set the values explicitly
      // supplied in the JSON.
      const edgeProtocolDefaults = {
        grpc: {
          grpc: 0,
          grpcErr: 0,
          grpcNoResponse: 0,
          grpcPercentErr: 0,
          grpcPercentReq: 0
        },
        http: {
          http: 0,
          http3xx: 0,
          http4xx: 0,
          http5xx: 0,
          httpNoResponse: 0,
          httpPercentErr: 0,
          httpPercentReq: 0
        },
        tcp: {
          tcp: 0
        }
      }

      function propertiesToNumber(object, keys) {
        const objectWithNumbers = { ...object }
        const targetKeys = keys || Object.keys(objectWithNumbers)
        for (const key of targetKeys) {
          objectWithNumbers[key] = Number(objectWithNumbers[key])
        }
        return objectWithNumbers
      }

      const decoratedGraph = {}
      if (graphData) {
        if (graphData.nodes) {
          decoratedGraph.nodes = graphData.nodes.map((node) => {
            const decoratedNode = { ...node }
            console.log(decoratedNode, 'decoratedNode')
            // parse out the traffic data into top level fields for the various protocols. This is done
            // to be back compatible with our existing ui code that expects the explicit http and tcp fields.
            // We can then set the 'traffic' field undefined because it is unused in the cy element handling.
            if (decoratedNode.data.traffic) {
              const traffic = decoratedNode.data.traffic
              decoratedNode.data.traffic = undefined
              traffic.forEach(protocol => {
                decoratedNode.data = { ...propertiesToNumber(protocol.rates), ...decoratedNode.data }
              })
            }
            // node.aggregate is set like aggregate=aggregateValue, split into distinct fields for the ui to use
            if (decoratedNode.data.aggregate) {
              const aggr = decoratedNode.data.aggregate.split('=')
              decoratedNode.data.aggregate = aggr[0]
              decoratedNode.data.aggregateValue = aggr[1]
            }
            const isIstio = this.isIstioNamespace(decoratedNode.data.namespace) ? true : undefined
            // prettier-ignore
            decoratedNode.data = { 'isIstio': isIstio, ...elementsDefaults.nodes, ...decoratedNode.data }
            // prettier-ignore
            return decoratedNode
          })
        }
        if (graphData.edges) {
          decoratedGraph.edges = graphData.edges.map((edge) => {
            const decoratedEdge = { ...edge }
            const { traffic, ...edgeData } = edge.data
            // see comment above about the 'traffic' data handling
            if (traffic) {
              if (this.hasProtocolTraffic(traffic)) {
                decoratedEdge.data = {
                  hasTraffic: true,
                  responses: traffic.responses,
                  ...edgeProtocolDefaults[traffic.protocol],
                  ...propertiesToNumber(traffic.rates),
                  // Base properties that need to be cast as number.
                  ...propertiesToNumber(edgeData, ['isMtls', 'responseTime'])
                }
              }
              decoratedEdge.data = { protocol: traffic.protocol, ...decoratedEdge.data }
            }
            // prettier-ignore
            decoratedEdge.data = { ...elementsDefaults.edges, ...decoratedEdge.data }
            // prettier-ignore
            return decoratedEdge
          })
        }
      }
      return decoratedGraph
    },
    isIstioNamespace(namespace) {
      if (namespace === 'istio-system') {
        return true
      }
      return new Map()
        ? Object.values(new Map()).includes(namespace)
        : false
    },
    hasProtocolTraffic(protocolTraffic) {
      return (
        protocolTraffic.rates !== undefined && protocolTraffic.responses !== undefined
      )
    },
    handleCommand() {
      console.log('jinlaile')
      this.visible = true
      console.log(this.visible, 'visible')
    },
    changeValue1(callback, vc) {
      console.log('回调参数' + callback)
      if (!callback) {
        return
      }
    }
  }

}

</script>
<style scoped>
.page-container {
  /* min-height: 350px; */
  height: calc(100vh - 200px);
  /* min-height: calc(100% - 32px); */
  position: relative;
  background-color: #f5f5f5
}
#cy {
  width: 100%;
  height: 100%;
}

</style>