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
                <router-link :to="'/storagePvcDetail/'+ scope.row.cluster_name +'/'+ scope.row.namespace+'/'+scope.row.name" style="color: #2d8cf0;">{{ scope.row.user_name }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="网关">
              <template slot-scope="scope">{{ scope.row.open_type? '开通' : '未开通' }}</template>
            </el-table-column>
            <el-table-column prop="date" label="子域名解析">
              <template slot-scope="scope">{{ scope.row.protocol || '-' }}</template>
            </el-table-column>
            <el-table-column prop="date" label="状态">
              <template slot-scope="scope">{{ scope.row.protocol || '-' }}</template>
            </el-table-column>
            <el-table-column prop="date" label="访问地址">
              <template slot-scope="scope">{{ scope.row.protocol || '-' }}</template>
            </el-table-column>
            <el-table-column prop="date" label="创建时间">
              <template slot-scope="scope">{{ scope.row.create_time | dateformat() }}</template>
            </el-table-column>
            <el-table-column prop="operate" label="操作">
              <template slot-scope="scope">
                <el-dropdown size="small" placement="bottom" trigger="click">
                  <el-button circle icon="el-icon-setting"></el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="operate(scope.row, 'deploy')" icon="el-icon-edit">部署</el-dropdown-item>
                    <el-dropdown-item @click.native="$refs.AddServiceGovernance.open_dialog(false,scope.row)" icon="el-icon-edit">修改</el-dropdown-item>
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
          <SugonDeleteDialog :list="selected" :isShow.sync="dialogDelete" @confirm="delRoutingRules" :title="`${selected.length > 1 ? '批量删除' : '删除'}`" :type="'shutDown'" nameKey="user_name" idKey="id"></SugonDeleteDialog>
        </div>
      </div>
    </el-row>
    <processing-dialog ref="processingDialog" @ok="getList()"></processing-dialog>
    <add-service-governance ref="AddServiceGovernance" @ok="getList()" />
  </div>
</template>

<script>
  import * as serviceGovernance_http from '@/http/serviceGovernance-http'
  import ProcessingDialog from './handle/processingDialog'
  import AddServiceGovernance from './handle/addServiceGovernance'

  export default {
    name: 'RoutingRules',
    components: {
      ProcessingDialog,
      AddServiceGovernance
    },
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
      getList() {
        const that = this
        this.loading = true
        serviceGovernance_http.get_users(this.pageNum, this.pageSize, '', '').then(res => {
          if (res.status_code === 1) {
            that.List = res.content ? res.content.records : []
            that.total = res.content ? res.content.total : 1
            this.loading = false
          } else {
            that.loading = false
            that.$message({
              message: res.status_mes,
              type: 'error'
            })
          }
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
          return serviceGovernance_http.del_access(item.id, true)
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
      onCopy(e) {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      },
      // 复制失败
      onError(e) {
        this.$message({
          type: 'error',
          message: '复制失败'
        })
      },
      operate(item, data) {
        switch (data) {
          case 'deleteDialog':
            this.loading = false
            this.selected = []
            this.selected.push(item)
            this.$table_select_repeat(this.selected, this.List, 'table_dom')
            this.dialogDelete = true
            break
          case 'delBatchDialog':
            this.dialogDelete = true
            this.loading = false
            break
          case 'deploy':
            this.$refs.processingDialog.open_dialog(item, '部署')
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