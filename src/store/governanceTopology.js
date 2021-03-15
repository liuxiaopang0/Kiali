export const GovernanceTopology = {
  state: {
    graphElements: [], // 图表数据
    layout: {}, // 数据展示方式
    edgeLabelMode: '', // 数据展示方式
    isLoading: false, // 是否loading
    selected_time: '60s',
    graph_type: '', // 选中的图形类型
    namespaces: [],
    summaryType: '',
    summaryTarget: {},
    fetchParams: {
      isMTLSEnabled: false,
      showCircuitBreakers: false, // 显示断路器
      showMissingSidecars: false, // 显示失踪的小汽车
      showSecurity: false, // 显示安全性
      showNodeLabels: false, // 显示节点标签
      showVirtualServices: false, // 显示虚拟服务
      showOperationNodes: '',
      node: '',
      showUnusedNodes: ''
    },
    graphType: ''
  },
  mutations: {
    set_graphElements(state, data) {
      state.graphElements = data
    },
    set_layout(state, data) {
      state.layout = data
    },
    set_edgeLabelMode(state, data) {
      state.edgeLabelMode = data
    },
    set_isLoading(state, data) {
      state.isLoading = data
    },
    set_selected_time(state, data) {
      state.selected_time = data
    },
    set_graph_type(state, data) {
      state.graph_type = data
    },
    set_namespaces(state, data) {
      state.namespaces = data
    },
    set_fetchParams(state, data) {
      state.fetchParams = data
    },
    set_summaryType(state, data) {
      state.summaryType = data
    },
    set_summaryTarget(state, data) {
      state.summaryTarget = data
    }
  },
  actions: {},
  getters: {}
}
