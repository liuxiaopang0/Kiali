<template>
  <div style="height: 100%">
    <el-row>
      <Masthead @ok="cycle"/>
      <GraphSettings />
    </el-row>
    <div
      class="page-container"
      style="box-sizing: border-box;min-width: 0px;min-height: 0px;display: flex;background-color: #f5f5f5;position: relative;"
    >
      <GraphLegend v-if="Legend" @clickLegend="Legend = !Legend" />
      <div
        style="flex: 1;min-width: 350px;padding-right: 5px;z-index: 0;height:100%;"
      >
        <CytoscapeGraph
          ref="ref_CJS"
          :compressOnHide="true"
          :graphData="{
            elements: $store.state.governanceTopology.graphElements,
            errorMessage: !!dataSource.errorMessage
              ? dataSource.errorMessage
              : undefined,
            isError: dataSource.isError,
            isLoading: $store.state.governanceTopology.isLoading,
            fetchParams: {
              graphType: $store.state.governanceTopology.graph_type,
              namespaces: $store.state.governanceTopology.namespaces
            },
            timestamp: $store.state.governanceTopology.selected_time
          }"
          :displayUnusedNodes="() => undefined"
          :edgeLabelMode="EdgeLabelMode.NONE"
          :isMTLSEnabled="false"
          :isMiniGraph="true"
          :layout="DagreGraph"
          :onNodeTap="handleNodeTap"
          :refreshInterval="0"
        ></CytoscapeGraph>
      </div>
      <CytoscapeToolbar
      :compressOnHide="true"
          :elements="$store.state.governanceTopology.graphElements"
          :isLoading="$store.state.governanceTopology.isLoading"
          :isError="dataSource.isError"
          :namespaces="$store.state.governanceTopology.namespaces"
          :isMiniGraph="true"
        :dom="$refs.ref_CJS"
        @clickLegend="Legend = !Legend"
      />

      <SummaryPanel
      v-if="$store.state.governanceTopology.namespaces.length>0 && $store.state.governanceTopology.graph_type && $store.state.governanceTopology.graphElements.nodes.length>0"
        :summaryData="{
          summaryType: $store.state.governanceTopology.summaryType,
          summaryTarget: $store.state.governanceTopology.summaryTarget
        }"
        :namespaces="$store.state.governanceTopology.namespaces"
        :graphType="$store.state.governanceTopology.graph_type"
      />
    </div>
  </div>
</template>

<script>
import GraphDataSource from './GraphDataSource'
import CytoscapeGraph from './CytoscapeGraph'
import CytoscapeToolbar from './CytoscapeToolbar'
import GraphLegend from './GraphLegend'
import GraphSettings from './GraphToolbar/GraphSettings'
import Masthead from './GraphToolbar/Masthead'
import SummaryPanel from './SummaryPanel/index'

import store from '@/store'

import { DagreGraph } from './graphs/DagreGraph'

export default {
  name: 'cytoscape',
  // props: ['dataSource'],
  components: {
    CytoscapeGraph,
    CytoscapeToolbar,
    GraphLegend,
    GraphSettings,
    Masthead,
    SummaryPanel
  },
  data() {
    return {
      Legend: false,
      elements: {},
      dataSource: {
        errorMessage: '',
        isError: false,
        isLoading: '',
        fetchParameters: {
          graphType: 'versionedApp',
          namespaces: [{ name: 'chenxi-istio' }]
        },
        graphTimestamp: '1614757743'
      },
      EdgeLabelMode: {
        NONE: 'NONE'
      },
      DagreGraph: {
        name: 'dagre',
        fit: false,
        nodeDimensionsIncludeLabels: true,
        rankDir: 'LR'
      },

      timeId: ''
    }
  },
  created() {
    store.commit('set_graphElements', { edges: [], nodes: [] })
    store.commit('set_isLoading', false)
    store.commit('set_layout', DagreGraph.getLayout())
    this.dataSource = new GraphDataSource()
  },
  mounted() {
    if (store.state.governanceTopology.namespaces.length > 0) this.getList()
  },
  watch: {
    // '$store.state.governanceTopology.summaryType'() {
    //   console.log(this.$store.state.governanceTopology.summaryType, '$store.state.governanceTopology.summaryType')
    // },
    '$store.state.governanceTopology.graph_type'() {
      if (store.state.governanceTopology.namespaces.length > 0) {
        this.getList()
      } else {
        store.commit('set_graphElements', { edges: [], nodes: [] })
        store.commit('set_isLoading', false)
      }
    },
    '$store.state.governanceTopology.selected_time'() {
      if (store.state.governanceTopology.namespaces.length > 0) {
        this.getList()
      } else {
        store.commit('set_graphElements', { edges: [], nodes: [] })
        store.commit('set_isLoading', false)
      }
    },
    '$store.state.governanceTopology.namespaces'() {
      if (store.state.governanceTopology.namespaces.length > 0) {
        this.getList()
      } else {
        store.commit('set_graphElements', { edges: [], nodes: [] })
        store.commit('set_isLoading', false)
      }
    },
    '$store.state.governanceTopology.fetchParams'(newValue, oldValue) {
      if (
        store.state.governanceTopology.namespaces.length > 0 &&
        (newValue.showOperationNodes !== oldValue.showOperationNodes ||
          newValue.node !== oldValue.node ||
          newValue.showSecurity !== oldValue.showSecurity)
      ) {
        this.getList()
      }
    }
  },
  methods: {
    getList() {
      var groupBy = 'app'
      // if (store.state.governanceTopology.fetchParams.graphType === 'app' || store.state.governanceTopology.fetchParams.graphType === 'versionedApp') {
      //   groupBy = 'app'
      // }
      var appenders = 'deadNode,sidecarsCheck,serviceEntry,istio'
      if (store.state.governanceTopology.fetchParams.showOperationNodes) {
        appenders += ',aggregateNode'
      }

      if (
        !store.state.governanceTopology.fetchParams.node &&
        store.state.governanceTopology.fetchParams.showUnusedNodes
      ) {
        // note we only use the unusedNode appender if this is NOT a drilled-in node graph and
        // the user specifically requests to see unused nodes.
        appenders += ',unusedNode'
      }

      if (store.state.governanceTopology.fetchParams.showSecurity) {
        appenders += ',securityPolicy'
      }

      switch (store.state.governanceTopology.edgeLabelMode) {
        case 'responseTime':
          appenders += ',responseTime'
          break
        default:
          break
      }
      // if (store.state.governanceTopology.selected_time && store.state.governanceTopology.graph_type && store.state.governanceTopology.namespaces.length > 0) {
      this.dataSource.fetchDataForNamespaces({
        duration: store.state.governanceTopology.selected_time,
        graphType: store.state.governanceTopology.graph_type,
        injectServiceNodes: true,
        groupBy: groupBy,
        appenders: appenders,
        namespaces: store.state.governanceTopology.namespaces.join(',')
      })
      // }
    },
    cycle(time) {
      console.log('触发定时器', time)
      if (time === 0) {
        clearInterval(this.timeId)
      } else {
        this.timeId = setInterval(() => {
          if (store.state.governanceTopology.namespaces.length > 0) {
            this.getList()
          } else {
            store.commit('set_graphElements', { edges: [], nodes: [] })
            store.commit('set_isLoading', false)
          }
          console.log('定时器' + this.timeId)
        }, time * 1000)
      }
    },
    handleNodeTap(e) {
      console.log(e, '33333333333')
    }
  },
  destroyed() {
    clearInterval(this.timeId)
    console.log('销毁了')
  }
}
</script>
<style scoped>
.page-container {
  /* min-height: 350px; */
  height: calc(100vh - 230px);
  /* min-height: calc(100% - 32px); */
  position: relative;
  background-color: #f5f5f5;
}
#cy {
  width: 100%;
  height: 100%;
}
</style>