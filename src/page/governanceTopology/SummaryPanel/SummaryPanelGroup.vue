<template>
   <div>
      <div class="panel-heading">
        <div v-html="renderBadgedLink(groupData.nodeData)"></div>
        <div v-html="renderHealth(groupData.nodeData.health)"></div>
        <div>
          <div style="margin-top: 10px; margin-bottom: 10px">
            <div v-if="groupData.nodeData.hasCB">
              <!-- <KialiIcon.CircuitBreaker /> -->
              <span style="padding-left: 4px">Has Circuit Breaker</span>
            </div>
            <div v-if="groupData.nodeData.hasVS">
              <!-- <KialiIcon.VirtualService /> -->
              <span style="padding-left: 4px">Has Virtual Service</span>
            </div>
          </div>
          <div v-if="groupData.serviceList">
            <span v-for="(item,index) in groupData.serviceList" v-html="item" :key="'serviceList'+index"></span>
          </div>
          <div v-if="groupData.workloadList">
            <span v-for="(item,index) in groupData.workloadList" v-html="item" :key="'workloadList'+index"></span>
          </div>
        </div>
      </div>
      <div class="panel-body">
        <div v-if="groupData.hasGrpcTraffic">
          <InOutRateTableGrpc
            :title="'GRPC Traffic (requests per second):'"
            :inRate="groupData.incoming.rate"
            :inRateGrpcErr="groupData.incoming.rateGrpcErr"
            :inRateNR="groupData.incoming.rateNoResponse"
            :outRate="groupData.outgoing.rate"
            :outRateGrpcErr="groupData.outgoing.rateGrpcErr"
            :outRateNR="groupData.outgoing.rateNoResponse"
          />
        </div>
        <div v-if="groupData.hasHttpTraffic">
          <InOutRateTableHttp
            :title="'HTTP (requests per second):'"
            :inRate="groupData.incoming.rate"
            :inRate3xx="groupData.incoming.rate3xx"
            :inRate4xx="groupData.incoming.rate4xx"
            :inRate5xx="groupData.incoming.rate5xx"
            :inRateNR="groupData.incoming.rateNoResponse"
            :outRate="groupData.outgoing.rate"
            :outRate3xx="groupData.outgoing.rate3xx"
            :outRate4xx="groupData.outgoing.rate4xx"
            :outRate5xx="groupData.outgoing.rate5xx"
            :outRateNR="groupData.outgoing.rateNoResponse"
          />
        </div>
        <hr style="margin: 10px 0" />
        <div v-if="!groupData.hasGrpcTraffic">
          No GRPC traffic logged.
        </div>
        <div v-if="!groupData.hasHttpTraffic">
          No HTTP traffic logged.
        </div>
      </div>
   </div>
</template>
<script>
import { renderBadgedLink, renderHealth } from './SummaryLink'

export default {
  props: ['groupData'],
  methods: {
    renderBadgedLink(nodeData) {
      return renderBadgedLink(nodeData)
    },
    renderHealth(health) {
      return renderHealth(health)
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
.panel-body {
  padding: 15px;
}
</style>