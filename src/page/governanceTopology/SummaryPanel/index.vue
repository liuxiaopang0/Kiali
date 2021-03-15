<template>
  <div id="graph-side-panel" style=" fontSize: var(--graph-side-panel--font-size);padding: 0;position: relative;height:100%">
    <div style="height: 100%">
        <div class="toggleSidePanel" @click="isVisible =!isVisible">
          {{isVisible ?  'Hide' : 'Show'}}
        </div>
        <div v-if="isVisible" class="panel panel-default summaryPanel">
          <SummaryPanelEdge :edgeData="summaryData.summaryTarget" v-if="summaryData.summaryType === 'edge'"/>
          <SummaryPanelGraph :graphData="summaryData.summaryTarget" v-if="summaryData.summaryType === 'graph'" :namespaces="$store.state.governanceTopology.namespaces"  :numApps="10" :numVersions="12" :numSvc="1" :numWorkloads="23" :numEdges="11" />
          <SummaryPanelGroup :groupData="summaryData.summaryTarget" v-if="summaryData.summaryType === 'group'" :namespaces="$store.state.governanceTopology.namespaces"  :numApps="10" :numVersions="12" :numSvc="1" :numWorkloads="23" :numEdges="11" />
          <SummaryPanelNode :nodeData="summaryData.summaryTarget" v-if="summaryData.summaryType === 'node'" :namespaces="$store.state.governanceTopology.namespaces" />
        </div>
    </div>
  </div>
</template>
<script>
import SummaryPanelEdge from './SummaryPanelEdge'
import SummaryPanelGraph from './SummaryPanelGraph'
import SummaryPanelNode from './SummaryPanelNode'
import SummaryPanelGroup from './SummaryPanelGroup'
export default {
  props: ['summaryData', 'namespaces', 'graphType'],
  components: {
    SummaryPanelEdge,
    SummaryPanelGraph,
    SummaryPanelGroup,
    SummaryPanelNode
  },
  watch: {
    summaryData(newValue, oldValue) {
      if (newValue.summaryTarget && newValue.summaryType) {
        this.isVisible = true
      } else {
        this.isVisible = false
      }
      console.log('ddddd', newValue.summaryTarget)
    }
  },
  data() {
    return {
      isVisible: false
    }
  }
}
</script>
<style scoped>
.toggleSidePanel {
  background-color: white;
  border: 1px #ddd solid;
  border-radius: 3px;
  cursor: pointer;
  left: -19px;
  min-width: 50px;
  position: absolute;
  text-align: center;
  top: 70px;
  transform: rotate(-90deg);
  transform-origin: left top 0
}
.panel{
  margin-bottom: 23px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 1px;
  -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
  box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
}

.panel-default {
  border-color: #ddd;
}
.summaryPanel {
   height: 100%;
  margin: 0;
  min-width: 300px;
  overflow-y: scroll;
  background-color: #fff;
  width: 300px;
  font-size: 'var(--graph-side-panel--font-size)';
  padding: 0;
  position: relative
}
.summaryFont {
  font-size: 12px;
}
</style>