export const InformationModule = {
  state: {
    cluster_name: '', // 选中集群名称
    clusterActiveList: [], // 集群列表
    namespace: '', // 选中分区名称
    namespaceItems: [], // 分区列表
    graph_type: '' // 选中的图形类型
  },
  mutations: {
    set_cluster_name(state, data) {
      state.cluster_name = data
    },
    set_clusterActiveList(state, data) {
      state.clusterActiveList = data
    },
    set_namespace(state, data) {
      state.namespace = data
    },
    set_namespaceItems(state, data) {
      state.namespaceItems = data
    }
  },
  actions: {},
  getters: {}
}
