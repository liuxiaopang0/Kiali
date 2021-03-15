<template>
  <div
    style="background-color: #fff;border: 1px #ddd solid;margin: 0 0 60px 0;overflow: hidden;overflow-x: auto;overflow-y: auto;padding: 5px;z-index: 3;"
  >
    <div style="width: 200px;">
      <span style="font-size: 16px;font-weight: bold;">Legend</span>
      <span style="float: right;margin-top: -7px;">
        <el-button
          @click="$emit('clickLegend')"
          type="text"
          icon="el-icon-close"
          style="color:#737679;font-size:16px;"
        ></el-button>
      </span>
    </div>
    <div style="display: flex;flex-direction: column;">
      <div style="width: 200px;height: 100%;overflow: hidden;">
        <div
          v-for="(item, index) in legendData"
          :key="index"
          style="font-size: 14px;padding-top: 5px"
        >
          {{ item.title }}
          <div
            v-for="(ele, index1) in item.data"
            :key="index1"
            style="display: flex;flex-direction: row;font-size: 5px;justify-content: space-between;padding: 5px 5px 0 5px;"
          >
            <span><img :alt="ele.label" :src="ele.icon"/></span>
            <span
              style="font-size: 12px;font-weight: normal;margin-top: 3px;width: 130px;"
              >{{ ele.label }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

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
  data() {
    return {
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
      ]
    }
  }
}
</script>
<style scoped>
</style>