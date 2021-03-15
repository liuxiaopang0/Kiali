<!--用户界面-->
<template>
  <el-popover
    placement="bottom-start"
    width="200"
    trigger="click"
    v-model="visible">
    <ul class="product-menu">
      <li class="product-item" v-for="(item,index) in list" :key="index" @click="changeRoute(item.index)">
        <i :class="'icon font_family sidebar-icon ' + item.icon"></i>
        <a class="product-item-link" :title="item.name" :class="{'active-nav':current_nav === item.index}">
          {{item.name}}
        </a>
      </li>
    </ul>
    <div slot="reference" class="product-menu-button" @click="go_to">
      <!-- <i class="el-icon-menu"></i> -->
      <span>数据管理</span>
      <i :class="this.visible?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
    </div>
  </el-popover>
</template>

<script>
import router from '@/router'
import store from '@/store'
import { mapState } from 'vuex'
export default {
  name: 'Sidebar',
  props: ['custom', 'allList'],
  data() {
    return {
      defaultProps: {
        children: 'childs',
        label: 'catalogName',
        value: 'id',
        isLeaf: 'leaf'
      },
      menu_list: [],
      visible: false,
      list: [
        {
          name: '元数据管理',
          index: '/configManage'
        },
        {
          name: '数据资源管理',
          index: '/DataResourcesManage'
        }
      ],
      current_name: '',
      private: [],
      current_nav: ''
    }
  },
  computed: mapState({
    data1: 'data1'
  }),
  watch: {

  },
  created() {
    // this.initData()
  },
  mounted() {
    if (this.custom) {
      this.top = 0
    }
  },
  beforeDestroy() {

  },
  methods: {
    initData() {
      ConfigManageHttp.get_catalog_list({ pid: 'rootPid' }).then(res => {
        if (res.code === 0) {
          const arr = []
          const obj = this.ergodic(res.data)
          arr.push(obj)
          this.menu_list = arr
        }
      })
    },
    ergodic(item) {
      item['label'] = item.catalogName
      item['id'] = item.id
      item['mark'] = item.mark
      item['icon'] =
          item.mark === 'catalog'
            ? 'iconfont icon08 menu-orange menu-icon'
            : 'icon09 menu-green menu-icon iconfont'
      if (item.childs !== null && item.childs.length > 0) {
        for (let i = 0; i < item.childs.length; i++) {
          this.ergodic(item.childs[i])
        }
      }
      return item
    },
    handleNodeClick(data, node) { // 点击节点
      // this.node_id = data.id
      // this.tableData = []
      // this.catalogName = data.catalogName
      // this.catalog_id = data.id
      if (node.level === 3) {
        this.$router.push(`/AllData?project=${data.label}&project_id=${data.id}`)
        this.$store.commit('set_all_data_path', { project: data.label, id: data.id })
      }
    },
    go_to() {
      this.$router.push(this.list[0].index)
      this.current_nav = this.list[0].index
    },
    changeRoute(index) {
      this.visible = false
      this.current_nav = index
      this.$router.push(index)
      this.$emit('change', index)
    }
  },
  components: {
    // 'menu-div': Menu
  }
}
</script>

<style scoped>
.active-nav{
  color: #00a0ff
}
</style>
