<template>
  <div ref="mainDivRef">
    <div class="panel-heading">
      <div>
        <div v-html="renderBadgedLink(nodeData.nodeData)"></div>
        <div v-html="renderHealth(nodeData.nodeData.health)"></div>
        <div style="margin-top: 10px; margin-bottom: 10px">
          <div v-if="nodeData.nodeData.hasCB">
            <!-- <KialiIcon.CircuitBreaker /> -->
            <span style="padding-left: 4px">Has Circuit Breaker</span>
          </div>
          <div v-if="nodeData.nodeData.hasVS">
            <!-- <KialiIcon.VirtualService /> -->
            <span style="padding-left: 4px">Has Virtual Service</span>
          </div>
          <div v-if="nodeData.nodeData.hasMissingSC">
            <!-- <KialiIcon.MissingSidecar /> -->
            <span style="padding-left: 4px">Has Missing Sidecar</span>
          </div>
          <div v-if="nodeData.nodeData.isDead">
            <span style="margin-right: 5px">
              <!-- <KialiIcon.Info /> -->
            </span>
            <span style="padding-left: 4px">Has No Running Pods</span>
          </div>
        </div>
        <div v-if="nodeData.shouldRenderDestsList">
          <span v-for="(item,index) in nodeData.destsList" v-html="item" :key="'serviceList'+index"></span>
        </div>
        <div v-if="nodeData.shouldRenderSvcList">
          <span v-for="(item,index) in nodeData.servicesList" v-html="item" :key="'workloadList'+index"></span>
        </div>
        <div
          v-if="nodeData.shouldRenderService"
          v-html="renderBadgedLink(nodeData.nodeData, 'service')"
        ></div>
        <div
          v-if="nodeData.shouldRenderApp"
          v-html="renderBadgedLink(nodeData.nodeData, 'app')"
        ></div>
        <div
          v-if="nodeData.shouldRenderWorkload"
          v-html="renderBadgedLink(nodeData.nodeData, 'WORKLOAD')"
        ></div>
      </div>
    </div>
    <div v-if="nodeData.shouldRenderTraces">
      <div style="padding: 10px 15px 0 15px">
        <el-tabs :stretch="true" v-model="activeName" type="card">
          <el-tab-pane label="Traffic" name="Traffic">
            <div className="panel-body">
              <div v-if="hasGrpcTraffic(nodeData.nodeData)">
                <InOutRateTableGrpc
                  :title="'GRPC Traffic (requests per second):'"
                  :inRate="nodeData.incoming.rate"
                  :inRateGrpcErr="nodeData.incoming.rateGrpcErr"
                  :inRateNR="nodeData.incoming.rateNoResponse"
                  :outRate="nodeData.outgoing.rate"
                  :outRateGrpcErr="nodeData.outgoing.rateGrpcErr"
                  :outRateNR="nodeData.outgoing.rateNoResponse"
                />
              </div>
              <div v-if="hasHttpTraffic(nodeData.size)">
                <InOutRateTableHttp
                  :title="'HTTP (requests per second):'"
                  :inRate="incoming.rate"
                  :inRate3xx="incoming.rate3xx"
                  :inRate4xx="incoming.rate4xx"
                  :inRate5xx="incoming.rate5xx"
                  :inRateNR="incoming.rateNoResponse"
                  :outRate="outgoing.rate"
                  :outRate3xx="outgoing.rate3xx"
                  :outRate4xx="outgoing.rate4xx"
                  :outRate5xx="outgoing.rate5xx"
                  :outRateNR="outgoing.rateNoResponse"
                />
              </div>
              <!-- <div>
              {this.renderSparklines(group)}
              {hr()}
            </div> -->
              <div v-if="!hasGrpcTraffic(nodeData.nodeData)">
                No GRPC traffic logged.
              </div>
              <div v-if="!hasHttpTraffic(nodeData.size)">
                No HTTP traffic logged.
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Traces" name="Traces"> </el-tab-pane>
        </el-tabs>
        <!-- <SimpleTabs id="graph_summary_tabs" defaultTab={0} style={{ paddingBottom: '10px' }}>
            <Tab style={summaryFont} title="Traffic" eventKey={0}>
              <div style={summaryFont}>
                <SummaryPanelNodeTraffic {...this.props} />
              </div>
            </Tab>
            <Tab style={summaryFont} title="Traces" eventKey={1}>
              <SummaryPanelNodeTraces nodeData={nodeData} queryTime={this.props.queryTime - this.props.duration} />
            </Tab>
          </SimpleTabs> -->
      </div>
    </div>
    <div v-else style="padding: 10px 15px 0 15px">
      <div className="panel-body">
        <div v-if="hasGrpcTraffic(nodeData.nodeData)">
          <InOutRateTableGrpc
            :title="'GRPC Traffic (requests per second):'"
            :inRate="nodeData.incoming.rate"
            :inRateGrpcErr="nodeData.incoming.rateGrpcErr"
            :inRateNR="nodeData.incoming.rateNoResponse"
            :outRate="nodeData.outgoing.rate"
            :outRateGrpcErr="nodeData.outgoing.rateGrpcErr"
            :outRateNR="nodeData.outgoing.rateNoResponse"
          />
        </div>
        <div v-if="hasHttpTraffic(nodeData.size)">
          <InOutRateTableHttp
            :title="'HTTP (requests per second):'"
            :inRate="incoming.rate"
            :inRate3xx="incoming.rate3xx"
            :inRate4xx="incoming.rate4xx"
            :inRate5xx="incoming.rate5xx"
            :inRateNR="incoming.rateNoResponse"
            :outRate="outgoing.rate"
            :outRate3xx="outgoing.rate3xx"
            :outRate4xx="outgoing.rate4xx"
            :outRate5xx="outgoing.rate5xx"
            :outRateNR="outgoing.rateNoResponse"
          />
        </div>
        <!-- <div>
              {this.renderSparklines(group)}
              {hr()}
            </div> -->
        <div v-if="!hasGrpcTraffic(nodeData.nodeData)">
          No GRPC traffic logged.
        </div>
        <div v-if="!hasHttpTraffic(nodeData.size)">
          No HTTP traffic logged.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { renderBadgedLink, renderHealth } from './SummaryLink'
import InOutRateTableGrpc from '@/components/SummaryPanel/InOutRateTableGrpc'

export default {
  name: 'SummaryPanelNode',
  components: {
    InOutRateTableGrpc
  },
  props: ['namespaces', 'nodeData'],
  data() {
    return {
      activeName: 'Traffic'
    }
  },
  methods: {
    renderBadgedLink(nodeData, nodeType, label) {
      return renderBadgedLink(nodeData, nodeType, label)
    },
    renderHealth(health) {
      return renderHealth(health)
    },
    renderNamespace(ns) {
      console.log(ns, 'ns')
      return `<span>
      <span style='display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;margin-bottom: 2px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;'>NS</span>
      ${ns} 
      </span>`
    },
    hasGrpcTraffic(data) {
      return data.grpcIn > 0 || data.grpcOut > 0
    },
    hasHttpTraffic(size) {
      if (size > 0) {
        return true
      }
      return false
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
  background-color: #fff;
  border-color: #ddd;
}

.pf-c-badge {
  display: inline-block;
  min-width: 17px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  border-radius: 50px;
  line-height: 20px;
}
</style>