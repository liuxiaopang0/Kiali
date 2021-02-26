<template>
  <div  class="user-style">
    <el-row>
      <div class="user-list">
        <div class="action-bar">
          <el-button type="primary" @click="getList()" icon="el-icon-refresh-right"></el-button>
          <el-button type="primary" @click="$router.push(`/createRoutingRules`)" icon="el-icon-plus">新建</el-button>
          <el-button :disabled="selected.length == 0" type="danger" @click="operate(null, 'delBatchDialog')">批量删除</el-button>
        </div>
        <div class="user-table">
          <el-table :data="List" stripe v-loading="loading" @selection-change="handleSelectionChange" ref="table_dom" style="width: 100%" :default-sort = "{prop: 'date', order: 'ascending'}">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="date" label="路由规则名称" min-width="80">
              <template slot-scope="scope">
                <!-- <span>{{ scope.row.name }}</span> -->
                <router-link :to="'/routingRulesDetail/'+ scope.row.uuid+'/'+scope.row.name" style="color: #2d8cf0;">{{ scope.row.name }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="网关">
              <template slot-scope="scope">{{ scope.row.gateways }}</template>
            </el-table-column>
            <el-table-column prop="date" label="子域名解析">
              <template slot-scope="scope">{{ scope.row.protocol || '-' }}</template>
            </el-table-column>
            <el-table-column prop="date" label="状态">
              <template slot-scope="scope"><span :style="{color:scope.row.status?'rgb(0, 175, 0)': 'red'}">{{ scope.row.status?'已部署':'未部署'  }}</span></template>
            </el-table-column>
            <el-table-column prop="date" label="访问地址">
              <template slot-scope="scope">{{ scope.row.protocol || '-' }}</template>
            </el-table-column>
            <el-table-column prop="date" label="创建时间">
              <template slot-scope="scope">{{ scope.row.create_at | dateformat() }}</template>
            </el-table-column>
            <el-table-column prop="operate" label="操作">
              <template slot-scope="scope">
                <el-dropdown size="small" placement="bottom" trigger="click">
                  <el-button circle icon="el-icon-setting"></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :disabled="!!scope.row.status" @click.native="deployRoutingRules(scope.row)" icon="el-icon-setting">部署</el-dropdown-item>
                    <el-dropdown-item @click.native="modifyRoutingRules(scope.row)" icon="el-icon-edit">修改</el-dropdown-item>
                    <el-dropdown-item @click.native="operate(scope.row, 'deleteDialog')" icon="el-icon-delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <div slot="empty">
              <span>
                <i class="fa fa-info-circle"></i>
                没有查询到符合条件的记录
              </span>
            </div>
          </el-table>
          <el-pagination background v-if="List.length!==0" @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="sizes, total, prev, pager, next, jumper" :total="total">
          </el-pagination>
          <SugonDeleteDialog :list="selected" :isShow.sync="dialogDelete" @confirm="delRoutingRules" :title="`${selected.length > 1 ? '批量删除' : '删除'}`" :type="'shutDown'" nameKey="name" idKey="uuid"></SugonDeleteDialog>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
  import * as routingRulesHttp from '@/http/routingRules-http'

  export default {
    name: 'RoutingRules',
    components: {},
    data() {
      return {
        loading: false,
        selected: [],
        List: [],
        pageNum: 1,
        pageSize: 10,
        total: 1,
        dialogDelete: false

      }
    },
    watch: {
      '$store.state.information.namespace'() {
        this.getList()
      }
    },
    created() {
      this.getList()
    },
    mounted() {
    },
    methods: {
      deployRoutingRules(data) {
        const h = this.$createElement
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, `确定部署此路由规则?`)

          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '部署中'
              routingRulesHttp.deploy_routerRule(data.uuid).then(res => {
                if (res.status_code === 1) {
                  this.$message({
                    message: res.status_mes,
                    type: 'success'
                  })
                  done()
                  instance.confirmButtonLoading = false
                  instance.confirmButtonText = '确定'
                  this.getList()
                } else {
                  done()
                  instance.confirmButtonLoading = false
                  instance.confirmButtonText = '确定'
                  this.$message({
                    message: res.status_mes,
                    type: 'error'
                  })
                }
              })
            } else {
              done()
            }
          }
        }).catch(_ => {

        })
      },
      getList() {
        const that = this
        this.loading = true
        routingRulesHttp.get_routerRuleList(this.$store.state.information.cluster_name, this.$store.state.information.namespace).then(res => {
          if (res.status_code === 1) {
            that.List = res.content ? res.content : []
            // that.total = res.content ? res.content.total : 1
            this.loading = false
          } else {
            that.List = []
            that.loading = false
            that.$message({
              message: res.status_mes,
              type: 'error'
            })
          }
        })
      },
      modifyRoutingRules(val) {
        this.$router.push({
          path: `/modifyRoutingRules/${val.uuid}/${val.name}`
        })
      },
      handleSelectionChange(currentRow) {
        this.selected = currentRow
      },
      handleSizeChange(data) {
        this.pageSize = data
        this.getList()
      },
      handlePageChange(data) {
        this.pageNum = data
        this.getList()
      },
      getClear() {
        this.storagePvcName = ''
        this.getList()
      },
      // 删除
      delRoutingRules(response) {
        this.loading = true
        var arrs = response.data.map((item, index) => {
          return routingRulesHttp.del_routerRule(item.id)
        })
        Promise.all(arrs).then((data) => {
          response.close()
          this.dialogDelete = false
          for (var item of data) {
            this.$handle_http_back(item, false, false).then((res) => {
            }).catch((_) => {

            })
          }
          this.getList()
        })
      },
      operate(item, data) {
        switch (data) {
          case 'deleteDialog':
            this.loading = false
            this.selected = []
            this.selected.push(item)
            this.$table_select_repeat(this.selected, this.List, 'table_dom', '', 'uuid')
            this.dialogDelete = true
            break
          case 'delBatchDialog':
            this.dialogDelete = true
            this.loading = false
            break
          case 'modify':
            // this.open_dialog('processingDialog',item,false)
            this.$refs.processingDialog.open_dialog(item, '修改')
            break
          default:
            break
        }
      }
    }
  }

</script>

<style scoped>

</style>