<template>
  <div ref="mainDivRef">
    <div class="panel-heading" style="background:rgb(255, 255, 255)">
      <!-- <div v-html="`<el-tooltip class='item' effect='dark' content='Operation' placement='left'><span class="pf-c-badge virtualitem_badge_definition">O</span></el-tooltip>`"></div> -->
      <div v-html="renderBadgedLink(edgeData.source, undefined, 'From:  ')"></div>
      <div v-html="renderBadgedLink(edgeData.dest, undefined, 'To:  ')"></div>
      
      <!-- <div>
        <span style="margin-right: 12px; margin-bottom: 3px; display: inline-block">
          <span style="white-space: pre;">
            <b>To:</b>
          </span>
          <span class="pf-c-badge virtualitem_badge_definition">{{getBadge(edgeData.dest, 'nodeType')}}</span>
          {{getLink(edgeData.dest, undefined)}}
        </span>
      </div> -->
    </div>
    <div class="summaryBodyTabs">
      <div v-if="edgeData.isGrpc || edgeData.isHttp">
        <el-tabs :stretch="true" v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Traffic" name="Traffic">
            <div v-if="edgeData.isGrpc">
              <RateTableGrpc :title="'GRPC requests per second:'" :rate="safeRate(edgeData.edge.grpc)" :rateGrpcErr="safeRate(edgeData.edge.grpcErr)" :rateNR="safeRate(edgeData.edge.grpcNoResponse)" :key="'echarts' + Math.random() * 100000"/>
            </div>
            <div v-if="edgeData.isHttp">
              <RateTableHttp :title="'HTTP requests per second:'" :rate="safeRate(edgeData.edge.http)" :rate3xx="safeRate(edgeData.edge.http3xx)" :rate4xx="safeRate(edgeData.edge.http4xx)" :rate5xx="safeRate(edgeData.edge.http5xx)" :rateNR="safeRate(edgeData.edge.httpNoResponse)" :key="'echarts' + Math.random() * 100000"/>
            </div>
            <!-- <ResponseFlagsTable :title="'Response flags by code:'" :responses="edgeData.edge.responses" /> -->
          </el-tab-pane>
          <el-tab-pane label="Flags" name="Flags">
            <ResponseFlagsTable :title="`Response flags by ${edgeData.isGrpc ? 'GRPC code:' : 'HTTP code:'}`" :responses="edgeData.edge.responses" />
          </el-tab-pane>
          <el-tab-pane label="Hosts" name="Hosts">
            <ResponseHostsTable :title="`'Hosts by ' + ${edgeData.isGrpc ? 'GRPC code:' : 'HTTP code:'}`" :responses="edgeData.edge.responses" />
          </el-tab-pane>
        </el-tabs>
        <hr style="margin: 10px 0" />
      </div>
      <div v-else-if="edgeData.isTcp">
          <el-tabs :stretch="true" v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="Flags" name="Flags">
              <ResponseFlagsTable :title="'Response flags by code:'" :responses="edgeData.edge.responses" :key="'echarts' + Math.random() * 100000" />
            </el-tab-pane>
            <el-tab-pane label="Hosts" name="Hosts">
              <ResponseHostsTable :title="'Hosts by code:'" :responses="edgeData.edge.responses" :key="'echarts' + Math.random() * 100000" />
            </el-tab-pane>
          </el-tabs>
      </div>
      <!-- <hr style="margin: 10px 0" /> -->
      <!-- {{renderCharts('target', 'isGrpc', 'isHttp', 'isTcp')}} -->
    </div>
  </div>
</template>
<script>
import ResponseFlagsTable from '@/components/SummaryPanel/ResponseFlagsTable'
import ResponseHostsTable from '@/components/SummaryPanel/ResponseHostsTable'
import RateTableGrpc from '@/components/SummaryPanel/RateTableGrpc'
import RateTableHttp from '@/components/SummaryPanel/RateTableHttp'
import { NodeType } from '../types/Graph'
import responseFlags from '../utils/ResponseFlags'

import { renderBadgedLink, renderHealth } from './SummaryLink'

export default {
  name: 'SummaryPanelEdge',
  props: ['edgeData'],
  components: {
    ResponseFlagsTable,
    ResponseHostsTable,
    RateTableGrpc,
    RateTableHttp
  },
  data() {
    return {
      activeName: 'Flags',
      FlagsData: [],
      HostsData: [],
      NodeMetricType: {
        APP: 1,
        WORKLOAD: 2,
        SERVICE: 3,
        AGGREGATE: 4
      }
    }
  },
  computed: {
    ss() {
      return renderBadgedLink('33', undefined, 'From:  ')
    }
  },
  created() {
    this.activeName = this.edgeData.isGrpc || this.edgeData.isHttp ? 'Traffic' : 'Flags'
  },
  methods: {
    renderBadgedLink(nodeData, nodeType, label) {
      return renderBadgedLink(nodeData, nodeType, label)
    },
    handleClick(val) {
    },
    getBadge(nodeData, nodeType) {
      console.log(nodeType, nodeData.nodeType === NodeType.APP, 'nodeData.nodeType')
      console.log(NodeType.AGGREGATE, NodeType.APP, NodeType.SERVICE, NodeType.WORKLOAD)
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
    getLink(nodeData, nodeType) {
      if (!nodeType || nodeData.nodeType === NodeType.UNKNOWN) {
        nodeType = nodeData.nodeType
      }
      const { app, service, workload } = nodeData
      var displayName = 'unknown'
      switch (nodeType) {
        case NodeType.AGGREGATE:
          displayName = nodeData.aggregateValue
          break
        case NodeType.APP:
          displayName = app
          break
        case NodeType.SERVICE:
          displayName = service
          break
        case NodeType.WORKLOAD:
          displayName = workload
          break
        default:
          // NOOP
          break
      }

      return displayName
    },
    safeRate(s) {
      return isNaN(s) ? 0.0 : Number(s)
    },
    getTitle(flags) {
      return flags.split(',').map(flagToken => {
        flagToken = flagToken.trim()
        const flag = responseFlags[flagToken]
        return flagToken === '-' ? '' : `[${flagToken}] ${flag ? flag.help : 'Unknown Flag'}`
      })
        .join('\n')
    },
    renderCharts(edge, isGrpc, isHttp, isTcp) {
      if (!this.hasSupportedCharts(edge)) {
        return isGrpc || isHttp ? 'Service graphs do not support service-to-service aggregate sparklines. See the chart above for aggregate traffic or use the workload graph type to observe individual workload-to-service edgesparklines.'
          : 'Service graphs do not support service-to-service aggregate sparklines. Use the workload graph type to observe individual workload-to-service edge sparklines.'
      }

      const target = this.decoratedNodeData(edge.target())
      if (target.isInaccessible) {
        return 'Sparkline charts cannot be shown because the destination is inaccessible.'
      }

      if (this.state.loading) {
        return <strong>Loading charts...</strong>
      }

      if (this.state.metricsLoadError) {
        return (
          <div>
            <KialiIcon.Warning /> <strong>Error loading metrics: </strong>
            {this.state.metricsLoadError}
          </div>
        )
      }

      // let rpsChart, tcpChart
      // if (isGrpc || isHttp) {
      //   const labelRps = isGrpc ? 'GRPC Request Traffic' : 'HTTP Request Traffic'
      //   const labelRt = isGrpc ? 'GRPC Request Response Time (ms)' : 'HTTP Request Response Time (ms)'
      // rpsChart = (
      // <RpsChart label={labelRps} dataRps={this.state.reqRates} dataErrors={this.state.errRates} />'
      //  '{hr()}'
      //  '<ResponseTimeChart
      //   label={labelRt}
      //   rtAvg={this.state.rtAvg}
      //   rtMed={this.state.rtMed}
      //   rt95={this.state.rt95}
      //   rt99={this.state.rt99}
      //   unit={this.state.unit}
      // />''
      // )
      // } else if (isTcp) {
      //   tcpChart = <TcpChart label='TCP Traffic' sentRates={this.state.tcpSent} receivedRates={this.state.tcpReceived} />
      // }

      // return
      // '{rpsChart}'
      // '{tcpChart}'
    },
    hasSupportedCharts(edge) {
      const sourceData = this.decoratedNodeData(edge.source())
      const destData = this.decoratedNodeData(edge.target())
      const sourceMetricType = this.getNodeMetricType(sourceData)
      const destMetricType = this.getNodeMetricType(destData)

      // service-to-service edges are unsupported because they represent aggregations (of multiple workload to service edges)
      const chartsSupported = sourceMetricType !== this.NodeMetricType.SERVICE || destMetricType !== this.NodeMetricType.SERVICE
      return chartsSupported
    },
    decoratedNodeData(ele) {
      return ele.data()
    },
    getNodeMetricType(nodeData) {
      switch (nodeData.nodeType) {
        case NodeType.AGGREGATE:
          return this.NodeMetricType.AGGREGATE
        case NodeType.APP:
          // treat versioned app like a workload to narrow to the specific version
          return nodeData.workload ? this.NodeMetricType.WORKLOAD : this.NodeMetricType.APP
        case NodeType.SERVICE:
          return this.NodeMetricType.SERVICE
        default:
          // treat UNKNOWN as a workload with name="unknown"
          return this.NodeMetricType.WORKLOAD
      }
    }
  }
}
</script>
<style scoped>
.panel-heading {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  color: #363636;
  background-color: #f5f5f5;
  border-color: #ddd;
}

.pf-c-badge {
  display: inline-block;
  min-width: 17px;
  padding:0 10px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  border-radius:50px;
  line-height: 20px;
}
.virtualitem_badge_definition {
  background-color: rgb(115, 188, 247);
  border-radius: 50px;
  margin-right: 10px;
}
.summaryBodyTabs {
  padding: 10px 15px 0 15px
}
</style>