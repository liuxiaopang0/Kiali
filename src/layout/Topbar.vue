<!--用户界面-->
<template>
  <div class="header">
    <div class="navbar">
      <!-- <SugonNavMenu :menuList="menuList"/> -->
      <div class="navbar-header">
        <a class="navbar-brand">
          <img src="@/assets/image/index/logo.svg" style="height: 40px" alt=""/>
          <span style="font-weight: bold;font-size:23px;color:white;margin-left: 10px;">Kiali</span>
          <!-- <img :src="imgUrl" /> -->
        </a>
        <!-- <a class="navbar-brand" v-else href="/">
          <img :src="bjimgUrl" style="height: 32px; margin: 9px 0px 0px 26px;"/>
        </a> -->
        <div class="navbar-switch"></div>
      </div>
      <div class="navbar-collapse">
        <ul class="navbar-left">
          <!-- <li @click="go_to('/data-screening')" :class="{isActive:current_nav === '/data-screening'}">数据探查</li>
          <li @click="go_to('/DataElementManagement')" :class="{isActive:current_nav === '/DataElementManagement'}">数据元管理</li>
          <li @click="go_to('/DictionaryIndex')" :class="{isActive:current_nav === '/DictionaryIndex'}">字典引用管理</li> -->
        </ul>

        <ul class="navbar-right">
          <!-- <li v-ToOther="'数据开发'">数据开发</li> -->
          <!-- <li>
            <el-select size="mini" v-model="project_name" popper-class="sugon_el_select" placeholder="请选择" @change="space_change" filterable>
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.workspaceName"
              :value="item.id"
            ></el-option>
          </el-select>
          </li> -->
          <li>
            <el-popover
              placement="bottom-end"
              width="220"
              popper-class="login_out_panel"
              v-model="visible">
              <div class="topbar-info-dropdown-memu topbar-info-dropdown-memu-list" style="width: 220px;color:#ccc;" v-loading="this.exit_loading" element-loading-text="退出中">
                <div class="user-box">
                  <div class="header-image-wrap">
                    <div class="header-image">
                      <img class="topbar-user-avatar" src="../assets/default_header.jpg">
                    </div>
                  </div>
                  <div class="user-info">
                    <p><img class="user-info-img" src="../assets/login_out_user.png">用户：<span>{{user_info.username}}</span></p>
                    <p><img class="user-info-img" src="../assets/login_out_type.png">角色：<span>{{user_info.userType === 'admin' ? '平台管理员':user_info.userType === 'master' ? '项目主账号':'普通用户'}}</span></p>
                    <!-- <p><img class="user-info-img" src="../assets/login_out_type.png">角色：<span>{{user_info.userType === 'admin' ? '平台管理员':user_info.userType === 'master' ? '项目主账号':'普通用户'}}</span></p> -->
                    <!-- <p>时间：<span style="font-size:12px">2020-7-3 20:00:00</span></p> -->
                  </div>
                </div>
                <div class="exit" @click="exit">退出系统</div>

              </div>
              <dl slot="reference" class="user-menu">
                <dt>
                  <img class="user-avatar" src="../assets/default_header.jpg">
                </dt>
                <dd>
                  <h3>{{user_info.osUserName}}</h3>
                  <!-- <p>系统管理员</p> -->
                  <i :class="this.visible?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                </dd>
              </dl>
            </el-popover>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import SideBar from './Sidebar'
  import * as index_http from '@/http/index-http/index-http'
  import * as user_http from '~/http/user-http/user-http'
  export default {
    name: 'Topbar',
    data() {
      return {
        project_name: '选项1',
        visible: false,
        id: '',
        name: '',
        imgUrl: require('@/assets/styles/images/xuanyuan-metaData.svg'),
        version: '',
        exit_loading: false,
        main_menu: [
          {
            name: '产品服务',
            index: ''
          }
        ],
        options: [],
        user_info: {},
        // current_nav:'/data-screening',
        all_path: ['/data-screening', '/DataElementManagement', '/DictionaryIndex', '/MyData', '/configManage', '/Approval', 'ConManage'],
        menuList: [
          { name: '轩辕大数据', imgUrl: require('@/assets/styles/images/xuanxuan.png'), id: '0' },
          { name: '数据开发', imgUrl: require('@/assets/styles/images/xuanyuan-web-logo.svg'), id: '1' },
          { name: '数据资源目录', imgUrl: require('@/assets/styles/images/xuanyuan-map-logo.svg'), id: '2' },
          { name: '运维中心', imgUrl: require('@/assets/styles/images/xuanyuan-operation-logo.svg'), id: '3' },
          { name: '服务资源管理', imgUrl: require('@/assets/styles/images/xuanyuan-server-logo.svg'), id: '5' }
        ]
      }
    },
    created() {
      // this.getCurrentUser();
      // this.getVersion();
      this.user_info = JSON.parse(localStorage.getItem('user_info')) ? JSON.parse(localStorage.getItem('user_info')) : {}
      this.all_path.forEach((item) => {
        if (this.$route.path.includes(item)) {
          // this.current_nav = item
          this.$store.commit('set_current_nav', item)
        }
      })
      // this.get_space()
    },
    mounted() {
      // this.$store.commit('set_isAdmin',true)
    },
    beforeDestroy() {

    },
    methods: {
      go_to(path) {
        // this.current_nav = path
        this.$store.commit('set_current_nav', path)
        this.$router.push(path)
      },
      space_change(id) {
        var api_header = JSON.parse(localStorage.getItem('api_header'))
        api_header.workspaceId = String(id)
        localStorage.setItem('api_header', JSON.stringify(api_header))
        localStorage.setItem('workspaceId', api_header.workspaceId)
        sessionStorage.setItem('last_url', this.$route.path)
        this.$router.push('/reload')
      },
      get_info() {
        user_http.get_user_info().then((data) => {
          this.$handle_http_back(data, true, false).then((res) => {
            localStorage.setItem('user_info_role', JSON.stringify(res.data))
            this.user_info = res.data
            this.$store.commit('set_role_info', res.data)
          })
        })
      },
      get_space() {
        index_http.get_space_list().then((data) => {
          this.$handle_http_back(data, true, false).then((res) => {
            res.data.forEach(item => {
              if (item.workspaceName === '') {
                item.workspaceName = item.workspaceCode
              }
            })
            this.options = res.data
            if (localStorage.getItem('api_header')) {
              var api_header = JSON.parse(localStorage.getItem('api_header'))
              if (!api_header.workspaceId) {
                this.project_name = res.data[0].workspaceName
                api_header.workspaceId = String(res.data[0].id)
                localStorage.setItem('api_header', JSON.stringify(api_header))
              } else {
                this.project_name = res.data.filter((item) => item.id === api_header.workspaceId)[0].workspaceName
              }
              localStorage.setItem('workspaceId', api_header.workspaceId)
              this.get_info()
            }
          })
        })
      },
      exit() {
        this.exit_loading = true
        this.$store.dispatch('exit').then((res) => {
          this.exit_loading = false
          localStorage.removeItem('token')
          this.$handle_http_back(res, true, false).then((data) => {
            this.$router.push('/login')
          })
        }).catch(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
      },
      getPath() {
        if (this.$route.path.indexOf('/data-screening') !== -1) {
          this.$store.commit('set_current_nav', '/data-screening')
        } else if (this.$route.path.indexOf('/DataElementManagement') !== -1) {
          this.$store.commit('set_current_nav', '/DataElementManagement')
        } else if (this.$route.path.indexOf('/DictionaryIndex') !== -1) {
          this.$store.commit('set_current_nav', '/DictionaryIndex')
        }
        // this.current_nav = this.$store.state.current_nav
      }
    },
    components: {
      'side-bar': SideBar
    },
    computed: {
      current_nav() {
        return this.$store.state.current_nav
      }
    },
    watch: {
      '$route': 'getPath'
      // current_nav(val){
      //   let path = this.$route.path
      //   if(path.indexOf('data-screening')!==-1){
      //     return '/data-screening'
      //   }else if(path.indexOf('DataElementManagement')!==-1){
      //     return '/DataElementManagement'
      //   }else{
      //     return '/DictionaryIndex'
      //   }
      // }
      // current_nav
    }
  }
</script>
<style lang="scss">
.login_out_panel .el-loading-mask{
  background:rgba(236, 236, 236, 0.8)
}
</style>
<style  lang="scss" scoped>
.navbar-brand{
  display:flex;
  flex-direction:row;
  align-items:center;
  cursor: pointer;
}
.isActive{
  background: #409EFF;
  color: white !important;
}
.navbar-right{
  input{
    background: #3d4652;
    border-color:#615f5f;
    color: #c2c4c8;
  }
}
a{
  color: #333
}
.user-box{
  display: flex;
}
.header-image-wrap{
  width: 70px;
  height:70px;
  border-radius: 70px;
  margin-right:14px;
  border:1px solid #282A39;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-image{
  width: 65px;
  height:65px;
  border-radius: 65px;
  border:1px solid #393E5D;
  display: flex;
  align-items: center;
  justify-content: center;
  // box-shadow: 0 0 2px 2px #17B3FB;
}
.header-image img{
  width: 60px;
  height:60px;
  border-radius: 60px;
  border:2px solid #17B3FB;
}
.user-info{
  margin-top: 8px;
}
.user-info p{
  margin-bottom: 20px;
  font-size: 12px;
}
.user-info-img{
  display:block;
  float:left;
  margin-top: 2px;
  margin-right:8px;
}
.exit{
  text-align: center;
  transition: all 0.2s;
  padding: 8px 0;
  cursor: pointer;
}
.exit:hover{
  background: #FF607F;
  color:#fff;
}
</style>


