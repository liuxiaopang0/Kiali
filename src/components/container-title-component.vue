<template>
  <div class="container-box-title">
    <div style="display:flex;align-items:center;justify-content: space-between;width:100%">
      <div style="display:flex;align-items:center;">
        <i class="shu"></i>
        <span style="margin-left:5px;font-weight:bolder" v-if="!bread">{{title}}</span>
        <el-breadcrumb separator="/" v-else style="margin-left:8px;font-size:12px">
          <el-breadcrumb-item v-for="(item,index) in bread" :key="index" :to="{ path: item.href}">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
     <div style="font-size:12px;">
        <span style="margin-left:10px" v-if="clusterFlag">集群</span>
        <el-select v-model="cluster_name" placeholder="所属集群" @change="cluster_change" style="margin-left: 8px" v-if="clusterFlag">
          <el-option :label="item.name" :value="item.name" v-for="(item,index) in clusterActiveList" :key="index"></el-option>
        </el-select>
        <span style="margin-left:10px" v-if="namespaceFlag">应用分区</span>
        <el-select v-model="namespace" placeholder="所属分区" @change="namespace_change" style="margin-left: 8px" v-if="namespaceFlag">
          <el-option :label="item.name" :value="item.name" v-for="(item,index) in namespaceItems" :key="index"></el-option>
        </el-select>
        <span style="margin-left:10px" v-if="graphTypeFlag">图形类型</span>
        <el-select v-model="graph_type" placeholder="图形类型" @change="graphType_change" style="margin-left: 8px" v-if="graphTypeFlag">
          <el-option :label="item.lable" :value="item.value" v-for="(item,index) in graphTypeList" :key="index"></el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
/*
 * 列表页面容器
 *
 * title 页面盒子的标题 string
 * back 是否需要返回按钮 形式为路由路径 string
 * bread 面包屑
*/
import store from '@/store'
import * as indexHttp from '@/http/index-http/index-http/'

export default {
  props: ['title', 'back', 'bread'],
  data() {
    return {
      namespaceItems: [],
      namespace: '',
      namespaceFlag: true,

      clusterActiveList: [],
      cluster_name: '',
      clusterFlag: true,

      graphTypeList: [
        {
          lable: '应用图',
          value: 'app'
        },
        {
          lable: '服务图',
          value: 'service'
        },
        {
          lable: '版本化的应用',
          value: 'versionedApp'
        },
        {
          lable: '工作量图',
          value: 'workload'
        }
      ],
      graph_type: 'app'
    }
  },
  computed: {
    graphTypeFlag() {
      if (this.$route.name === 'GovernanceTopology') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    '$store.state.information.clusterActiveList'() {
      var arr = []
      this.clusterActiveList = this.$store.state.information.clusterActiveList
      this.clusterActiveList.map((ele, element) => {
        arr.push(ele.name)
      })
      if (arr.indexOf(this.$store.state.cluster_name) === -1) {
        this.cluster_name = this.clusterActiveList[0].name
        this.namespace = ''
        store.commit('set_cluster_name', this.cluster_name)
        store.commit('set_namespace', this.namespace)
      }
    },
    '$store.state.information.namespaceItems'() {
      var arr = []
      this.namespaceItems = this.$store.state.information.namespaceItems
      this.namespaceItems.map((ele, element) => {
        arr.push(ele.name)
      })
      if (arr.indexOf(this.$store.state.namespace) === -1 && this.namespaceItems.length > 0) {
        this.namespace = this.namespaceItems[0].name
        store.commit('set_namespace', this.namespace)
      }
    },
    '$store.state.information.namespace'() {
      this.namespace = this.$store.state.information.namespace
    }
  },
  created() {
    this.getClusters()
  },
  methods: {
    go_to() {
      this.$router.push(this.back)
    },
    breadClick(item, index) {
      // this.$store.commit('set_active_breadcrumb', item.href)
      // this.$emit('isClick', item.href)
    },
    cluster_change() {
      store.commit('set_cluster_name', this.cluster_name)
      this.getnamespaces()
    },
    namespace_change() {
      store.commit('set_namespace', this.namespace)
    },
    graphType_change() {
      store.commit('set_graph_type', this.graph_type)
    },
    // 应用分区
    getnamespaces() {
      indexHttp.get_application_available(this.cluster_name).then(res => {
        if (res.status_code === 1) {
          this.namespaceItems = res.content ? res.content : []
          store.commit('set_namespaceItems', this.namespaceItems)
          if (!this.namespaceItems.length) {
            this.namespace = ''
          } else {
            this.namespace = this.namespaceItems[0].name
          }
          store.commit('set_namespace', this.namespace)
        } else {
          this.namespaceItems = []
          this.namespace = ''
          store.commit('set_namespace', '')
          store.commit('set_namespaceItems', this.namespaceItems)
          this.messageBox('error', res.status_mes)

          return
        }
      })
    },
    // 获取集群列表
    getClusters() {
      indexHttp.get_clusters(1, 10000, 'all').then(data => {
        this.$handle_http_back(data, true, false).then((res) => {
          this.clusterActiveList = data.content ? data.content.list : []
          store.commit('set_clusterActiveList', this.clusterActiveList)
          if (this.clusterActiveList.length !== 0) {
            this.cluster_name = this.clusterActiveList[0].name
            store.commit('set_cluster_name', this.cluster_name)
            this.getnamespaces()
          } else {
            this.clusterActiveList = []
            this.cluster_name = ''
            store.commit('set_cluster_name', this.cluster_name)
          }
        })
      })
    }
  }
}
</script>
