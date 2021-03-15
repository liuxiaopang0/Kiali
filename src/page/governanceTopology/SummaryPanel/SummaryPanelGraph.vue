<template>
  <div>
    <div class="panel-heading">
      <span v-for="(item,index) in namespaces" :key="index">
        <div  v-html="renderNamespace(item)"></div>
      </span>
       <br />
      <strong>Current Graph:</strong>
      <br />
      <span v-if="graphData.numApps"><svg fill="currentColor" height="12px" width="12px" viewBox="0 64 1024 1024" aria-hidden="true" role="img" class="fc2six4" style="margin: 0 5px;vertical-align: -0.125em;"><path d="M950.827 643.87h-131.627v197.973c0 40.107-32.853 72.96-73.173 72.96h-672.853c-40.32 0-73.173-32.853-73.173-72.96v-534.613c0-40.32 32.853-73.173 73.173-73.173h131.627v-197.76c0-40.32 32.853-73.173 73.173-73.173h672.853c40.32 0 73.173 32.853 73.173 73.173v534.613c0 40.107-32.853 72.96-73.173 72.96zM887.467 577.524v-70.4h-68.267v70.4h68.267zM612.267 850.59h70.4v-70.4h-70.4v70.4zM70.187 308.51v402.133h679.040v-402.133h-679.040zM953.813 37.364h-678.827v196.693h471.040c40.32 0 73.173 32.853 73.173 73.173v132.48h134.613v-402.347z" transform="rotate(180 0 512) scale(-1 1)"></path></svg>{{graphData.numApps.toString()}} {{graphData.numApps === 1 ? 'app ' : 'apps '}}{{graphData.numVersions > 0 && `(${graphData.numVersions} versions)`}}<br /></span>
      <span v-if="graphData.numSvc"><svg fill="currentColor" height="12px" width="12px" viewBox="0 64 1304 1024" aria-hidden="true" role="img" class="fc2six4" style="margin: 0 5px;vertical-align: -0.125em;"><path d="M1316.571 621.486l-219.429 183.543v-146.743h-131.429c-0.229 0.229-0.229 0.686-0.457 0.914-39.314 67.2-92.571 120.457-159.771 159.771-67.2 39.086-140.571 58.743-220.343 58.743s-153.143-19.657-220.343-58.971c-67.2-39.314-120.457-92.571-159.771-159.771-39.086-67.2-58.743-140.571-58.743-220.114 0-24.914 1.829-49.143 5.714-72.686h-152.229l0.229-73.371h170.743c8.914-25.6 20.571-50.286 34.514-74.286 39.314-67.2 92.571-120.457 159.771-159.771s140.571-58.743 220.343-58.743c79.771 0 153.143 19.657 220.343 58.743 67.2 39.314 120.457 92.571 159.771 159.771 38.857 67.2 58.514 140.571 58.514 220.343 0 51.2-8.229 99.886-24.457 146.057h97.6v-146.514l219.429 183.086zM242.514 437.714c0 46.629 9.143 90.971 27.429 133.486s42.743 79.086 73.371 109.714c30.629 30.629 67.2 55.086 109.714 73.371s86.857 27.429 133.486 27.429c46.629 0 90.971-9.143 133.486-27.429s79.086-42.743 109.714-73.371c7.086-7.086 13.943-14.629 20.571-22.4h-265.371l0.229-73.371h311.314c2.057-4.571 4.343-9.143 6.171-13.714 18.286-42.514 27.429-86.857 27.429-133.486s-9.143-90.971-27.429-133.486c-18.286-42.514-42.743-79.086-73.371-109.714s-67.2-55.086-109.714-73.371c-42.514-18.286-86.857-27.429-133.486-27.429s-90.971 9.143-133.486 27.429c-42.514 18.286-79.086 42.743-109.714 73.371-27.886 27.886-50.514 60.571-68.114 98.057l310.4-0.229v-146.286l218.743 183.086-218.743 183.314v-146.514h-335.086c-5.029 23.314-7.543 47.086-7.543 71.543z" transform="rotate(180 0 512) scale(-1 1)"></path></svg>{{graphData.numSvc.toString()}} {{graphData.numSvc === 1 ? 'service ' : 'services '}}<br /></span>
      <span v-if="graphData.numWorkloads">{{graphData.numWorkloads.toString()}} {{graphData.numWorkloads === 1 ? 'workload ' : 'workloads '}}<br /></span>
      <span v-if="graphData.numEdges"><svg fill="currentColor" height="12px" width="12px" viewBox="0 64 1104 1024" aria-hidden="true" role="img" class="fc2six4" style="margin: 0 5px;vertical-align: -0.125em;"><path d="M365.714 838.857c0-60.594-49.121-109.714-109.714-109.714s-109.714 49.121-109.714 109.714c0 60.594 49.121 109.714 109.714 109.714s109.714-49.121 109.714-109.714zM1097.143 182.857c0-60.594-49.121-109.714-109.714-109.714s-109.714 49.121-109.714 109.714c0 60.594 49.121 109.714 109.714 109.714s109.714-49.121 109.714-109.714zM219.429 256c0-60.594-49.121-109.714-109.714-109.714s-109.714 49.121-109.714 109.714c0 60.594 49.121 109.714 109.714 109.714s109.714-49.121 109.714-109.714zM828.8 306.286l-75.2 51.2c8.457 25.6 13.257 52.8 13.257 81.143 0 55.086-17.371 106.057-47.314 147.886l87.771 89.6c20.8-11.429 44.8-18.057 70.4-18.057 80.686 0 146.286 65.6 146.286 146.286s-65.6 146.514-146.286 146.514c-80.686 0-146.286-65.6-146.286-146.286 0-28.8 8.229-55.543 22.629-78.171l-85.029-86.857c-43.2 33.829-97.829 54.171-157.029 54.171-33.829 0-66.286-6.629-96-18.743l-13.943 18.971c-13.486 18.286-37.714 23.543-53.714 11.429-16.229-11.886-18.514-36.571-5.257-54.857l9.6-13.029c-58.286-46.629-95.543-118.4-95.543-198.857 0-22.4 2.971-44.114 8.457-64.914l-2.743-1.143c-19.2-9.371-28.343-32-20.571-50.286s29.943-25.6 48.914-16.457l2.514 1.143c35.429-58.514 93.486-101.486 162.286-117.029l-4.343-42.057c-49.143-11.2-85.714-55.771-85.714-109.257 0-61.943 49.143-112 109.714-112s109.714 50.057 109.714 112c0 44.114-24.914 82.057-61.029 100.343l4.8 45.257c79.314 5.257 148.571 46.629 191.771 107.886l68.8-46.857c18.286-12.571 42.286-9.143 53.029 7.771s4.571 40.914-13.943 53.257zM877.714 882.286c42.971 0 77.714-34.743 77.714-77.714s-34.743-77.714-77.714-77.714-77.714 34.743-77.714 77.714 34.743 77.714 77.714 77.714zM475.429-20.572c-32.914 0-59.429 26.514-59.429 59.429s26.514 59.429 59.429 59.429 59.429-26.514 59.429-59.429-26.514-59.429-59.429-59.429zM512 299.428c-77.029 0-139.429 62.4-139.429 139.429s62.4 139.429 139.429 139.429 139.429-62.4 139.429-139.429-62.4-139.429-139.429-139.429z" transform="rotate(180 0 512) scale(-1 1)"></path></svg>{{graphData.numEdges.toString()}} {{graphData.numEdges === 1 ? 'edge ' : 'edges '}}<br /></span>
    </div>
    <div class="summaryBodyTabs">
      <el-tabs :stretch="true" v-model="activeName" type="card">
        <el-tab-pane label="Incoming" name="Incoming">
          <div class="summaryFont">
            <div v-if="graphData.incomingRateGrpc.rate === 0 && graphData.incomingRateHttp.rate === 0"> No incoming traffic.</div>
            <div v-else>
              <RateTableGrpc v-if="graphData.incomingRateGrpc.rate > 0"
                :title="'GRPC Traffic (requests per second):'"
                :rate="graphData.incomingRateGrpc.rate"
                :rateGrpcErr="graphData.incomingRateGrpc.rateGrpcErr"
                :rateNR="graphData.incomingRateGrpc.rateNoResponse"
                :key="'echarts' + Math.random() * 100000"
              />
              <RateTableHttp v-if="graphData.incomingRateHttp.rate > 0"
                :title="'HTTP (requests per second):'"
                :rate="graphData.incomingRateHttp.rate"
                :rate3xx="graphData.incomingRateHttp.rate3xx"
                :rate4xx="graphData.incomingRateHttp.rate4xx"
                :rate5xx="graphData.incomingRateHttp.rate5xx"
                :rateNR="graphData.incomingRateHttp.rateNoResponse"
                :key="'echarts' + Math.random() * 100000"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Outgoing" name="Outgoing">
          <div class="summaryFont">
            <div v-if="graphData.outgoingRateGrpc.rate === 0 && graphData.outgoingRateHttp.rate === 0"> No outgoing traffic.</div>
            <div v-else>
              <RateTableGrpc
                :title="'GRPC Traffic (requests per second):'" v-if="graphData.outgoingRateGrpc.rate > 0"
                :rate="graphData.outgoingRateGrpc.rate"
                :rateGrpcErr="graphData.outgoingRateGrpc.rateGrpcErr"
                :rateNR="graphData.outgoingRateGrpc.rateNoResponse"
                :key="'echarts' + Math.random() * 100000"
              />
              <RateTableHttp
                :title="'HTTP (requests per second):'"  v-if="graphData.outgoingRateHttp.rate > 0"
                :rate="graphData.outgoingRateHttp.rate"
                :rate3xx="graphData.outgoingRateHttp.rate3xx"
                :rate4xx="graphData.outgoingRateHttp.rate4xx"
                :rate5xx="graphData.outgoingRateHttp.rate5xx"
                :rateNR="graphData.outgoingRateHttp.rateNoResponse"
                :key="'echarts' + Math.random() * 100000"
                  />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Total" name="Total">
          <div class="summaryFont">
            <div v-if="graphData.totalRateGrpc.rate === 0 && graphData.totalRateHttp.rate === 0"> No traffic.</div>
            <div v-else>
              <RateTableGrpc
                :title="'GRPC Traffic (requests per second):'"  v-if="graphData.totalRateGrpc.rate > 0"
                :rate="graphData.totalRateGrpc.rate"
                :rateGrpcErr="graphData.totalRateGrpc.rateGrpcErr"
                :rateNR="graphData.totalRateGrpc.rateNoResponse"
                :key="'echarts' + Math.random() * 100000"
              />
              <RateTableHttp
                :title="'HTTP (requests per second):'"  v-if="graphData.totalRateHttp.rate > 0"
                :rate="graphData.totalRateHttp.rate"
                :rate3xx="graphData.totalRateHttp.rate3xx"
                :rate4xx="graphData.totalRateHttp.rate4xx"
                :rate5xx="graphData.totalRateHttp.rate5xx"
                :rateNR="graphData.totalRateHttp.rateNoResponse"
                :key="'echarts' + Math.random() * 100000"
              />
              <div v-if="shouldShowRPSChart()">
                <hr style="margin: 10px 0" />
                    <!-- {this.renderRpsChart()} -->
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <hr style="margin: 10px 0" />
    </div>
  </div>
</template>
<script>
import RateTableGrpc from '@/components/SummaryPanel/RateTableGrpc'
import RateTableHttp from '@/components/SummaryPanel/RateTableHttp'
export default {
  name: 'SummaryPanelGraph',
  components: {
    RateTableGrpc,
    RateTableHttp
  },
  props: ['namespaces', 'numApps', 'numVersions', 'numSvc', 'numWorkloads', 'numEdges', 'graphData'],
  data() {
    return {
      activeName: 'Incoming'
    }
  },
  mounted() {
    // this.renderNamespacesSummary()
  },
  methods: {
    // renderNamespacesSummary() {
    //   console.log(this.namespaces.map(namespace => this.renderNamespace(namespace)), 'this.namespaces.map(namespace => this.renderNamespace(namespace))')
    //   return this.namespaces.map(namespace => this.renderNamespace(namespace))
    // },
    renderNamespace(ns) {
      // console.log(ns, 'ns')
      return `<span>
      <span style='display: inline-block;min-width: 17px;padding:0 10px;font-size: 12px;font-weight: 700;color: #fff;text-align: center;border-radius:50px;line-height: 20px;margin-bottom: 2px;background-color: rgb(115, 188, 247);border-radius: 50px;margin-right: 10px;'>NS</span>
      ${ns} 
      </span>`
    },
    shouldShowRPSChart() {
      return this.namespaces.length === 1
    }

  }
}
</script>
<style scoped>
.panelStyle {
  height: 100%;
  margin: 0;
  min-width: 300px;
  overflow-y: auto;
  background-color: #fff;
  width: 300px
}
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
    padding:0 10px;
    font-size: 14px;
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
.summaryBodyTabs >>> .el-tabs__item {
  padding: 0 8px !important;
}
</style>