<template>
  <div class="app-wrapper">
    <div>
      <top-bar></top-bar>
    </div>
    <div class="container">
      <sugon-menu :menuData="menu_list" ref="menu" @change="nav_change" />
      <div class="main">
        <!-- <div class="container-box"> -->
          <container-box-component bread="route" :title="'组件demo'" @breadClick="bread_click">
          <router-view :key="$route.fullpath"/>
            </container-box-component>
        </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import TopBar from '@/layout/Topbar'
import SugonMenu from '@/components/sugon-menu'
import ContainerBoxComponent from '@/components/container-box-component'
import { mapState } from 'vuex'

export default {
  components: {
    TopBar,
    SugonMenu,
    ContainerBoxComponent
  },
  computed: {
    ...mapState({})
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      menu_list: [
        {
          icon: 'icon-yingyongzhongxin',
          name: '管理中心',
          id: '1',
          index: '',
          children: [
            {
              icon: 'el-icon-user-solid',
              name: '服务治理',
              id: '2',
              index: '/serviceGovernance'
            },
            {
              icon: 'el-icon-tickets',
              name: '网关',
              id: '3',
              index: '/gateway'
            },
            {
              icon: 'el-icon-s-management',
              name: '路由规则',
              id: '4',
              index: '/routingRules',
              children: [
                {
                  icon: 'el-icon-user-solid',
                  name: '创建',
                  id: '6',
                  index: '/createRoutingRules'
                }
              ]
            },
            {
              icon: 'el-icon-s-management',
              name: '治理拓扑',
              id: '5',
              index: '/governanceTopology'
            }
          ]
        }

      ]
    }
  },
  watch: {
    '$route.path': function(_new, old) {
      this.setData1()
    },
    '$store.state.menu.current_nav'() {
      this.$nextTick(() => {
        // if (!this.navs.length) {
        //   this.$emit('change', { group: [] })
        // }
        console.log('31111111111')
        this.$refs['menu'].init(this.$route.path)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['menu'].init(this.$route.path)
    })
  },
  methods: {
    nav_change(data) {
      this.$store.commit('set_current_menu', data)
      if (data && data.item && data.item.index && data.item.index !== this.$route.path) {
        this.$router.push(data.item.index)
      }
    },
    setData1() {
      if (this.menu_list.length) {
        let arr = []
        for (let index = 0; index < this.menu_list.length; index++) {
          const element = this.menu_list[index]
          arr = this.menu_list.filter(item => {
            return this.$route.path.indexOf(item.index) !== -1
          })
          // arr.push(element)
        }
        if (arr.length) {
          this.$store.commit('set_current_nav', arr[0].name ? [] : [...arr[0].children])
        }
      }
    },
    bread_click(href) {
      this.$refs['navbar'].reset_path(href)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index-box{
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
    display: flex;
    flex-direction: column;
  }
  .index-top{
    width: 100%;
    height: 48px;
  }
  .index-content{
    /* background:#0F121A; */
    /* height:100%; */
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  .index-content .index-conent-left{
    overflow: hidden;
    height: 100%;
    display: flex;
  }
  .index-content .index-content-container{
    flex: 1;
  }
  .index-main {
    /* position: relative; */
    flex: 1;
    height: 100%;
    overflow: auto;
    background: #f0f2f5;
  }
</style>
