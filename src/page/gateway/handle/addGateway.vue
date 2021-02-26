<template>
  <div class="add-group">
    <el-dialog :title="status?'新建网关':'修改网关'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" :before-close="handleClose" width="600px">
      <el-form :model="form" label-width="150px" :rules="rules" class="demo-ruleForm" action="" onsubmit="return false;" ref="form">
        <el-form-item label="网关名称：" prop='name'>
          <el-col :span="24">
            <el-input v-model="form.name" placeholder="必填（3~64个字符）" :disabled="!status"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="服务网格出口：" prop='service_grid_exit'>
          <el-col :span="24">
            <el-select v-model="form.service_grid_exit" placeholder="请选择服务网格出口" style="width:100%">
              <el-option v-for="(item,index) in serviceGridExitItems" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <div class="row-layout" v-for="(data,index) of form.hosts" :key="index">
          <el-col :span="24">
            <el-form-item style="width:100%" :prop="'hosts.' + index + '.host_name'" :rules="{ required: true, message: '请输入服务域名', trigger: 'blur' }">
              <span slot="label" style="position:relative;">
                解析服务域名：
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">解析服务域名</div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="data.host_name" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-form-item label-width="10px" style="margin-left:20px">
            <i class="el-icon-delete delete-icon" style="color:red" @click="delete_form(index)"></i>
          </el-form-item> 
        </div>
        <el-form-item label="描述：" prop='description'>
          <el-col :span="24">
            <el-input v-model="form.description" placeholder=""></el-input>
          </el-col>
        </el-form-item>
        
        <p style="text-align:center;cursor:pointer" class="border-style" @click="add_node_form()">
          +添加服务域名
        </p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSure" :loading="loading">
          <span v-if="!loading">确 定</span>
          <span v-else>{{status?'添加':'修改'}}中</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as gatewayHttp from '@/http/gateway-http'

export default {
  name: 'AddGateway',
  data() {
    const validateName = (rule, value, callback) => {
      if (this.status) {
        if (!(/^[a-z][a-z0-9-]{1,62}[a-z0-9]$/.exec(value))) {
          callback(new Error('名称只支持小写字母、数字、中划线，以小写字母开头'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      serviceGridExitItems: [], // 服务网格出口数据
      form: {
        name: '',
        description: '',
        cluster_name: '',
        namespace: '',
        app_type: 1,
        auto_start_up: true,
        hosts: [{ host_name: '' }],
        service_grid_exit: '',
        status: 0,
        uuid: ''
      },
      dialogFormVisible: false,
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 64, message: '长度为3到64个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        description: [
          { min: 0, max: 255, message: '描述最长为255个字符', trigger: 'blur' }
        ],
        service_grid_exit: [
          { required: true, message: '请选择服务网格出口', trigger: 'change' }
        ]
      },
      status: ''
    }
  },
  methods: {
    add_node_form() {
      this.form.hosts.push({ host_name: '' })
    },
    delete_form(index) {
      this.form.hosts.splice(index, 1)
    },
    taghandleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    open_dialog(status, row_data) {
      this.getServiceGridExitItems()
      this.status = status
      if (!status) {
        this.form.name = row_data.name
        this.form.description = row_data.description
        this.form.cluster_name = row_data.cluster_name
        this.form.namespace = row_data.namespace
        this.form.app_type = row_data.app_type
        this.form.auto_start_up = row_data.auto_start_up
        this.form.hosts = this.arrayConversion(row_data.hosts)
        this.form.service_grid_exit = row_data.service_grid_exit
        this.form.status = row_data.status
        this.form.uuid = row_data.uuid
      }
      console.log(this.form.hosts)
      this.dialogFormVisible = true
      this.loading = false
    },
    getServiceGridExitItems() {
      gatewayHttp.get_service_grid_exit(this.$store.state.information.cluster_name).then(res => {
        if (res.status_code === 1) {
          this.serviceGridExitItems = res.content ? res.content : []
        } else {
          this.serviceGridExitItems = []
          this.$message({
            message: res.status_mes,
            type: 'error'
          })
        }
      })
    },
    handleClose() {
      this.dynamicTags = []
      this.inputVisible = false
      this.inputValue = ''
      this.form = {
        name: '',
        description: '',
        cluster_name: '',
        namespace: '',
        app_type: 1,
        auto_start_up: true,
        hosts: [{ host_name: '' }],
        service_grid_exit: '',
        status: 0,
        uuid: ''
      }
      this.$nextTick(_ => {
        this.$refs.form.clearValidate()
      })
      this.dialogFormVisible = false
    },
    arrayConversion(array) {
      var res = []
      if (array) {
        array.forEach((t) => {
          res.push({ 'host_name': t })
        })
      }
      return res
    },
    getArrayProps(array, key = 'host_name') {
      var res = []
      if (array) {
        array.forEach((t) => {
          res.push(t[key])
        })
      }
      return res
    },
    handleSure() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          const data =
              {
                cluster_name: this.$store.state.information.cluster_name,
                description: this.form.description,
                name: this.form.name,
                namespace: this.$store.state.information.namespace,
                hosts: this.getArrayProps(this.form.hosts),
                service_grid_exit: this.form.service_grid_exit
              }
          if (!this.status) {
            data.status = this.form.status
            data.uuid = this.form.uuid
          }
          gatewayHttp[this.status ? 'post_gateway' : 'put_gateway'](data).then(res => {
            if (res.status_code === 1) {
              this.$message({
                message: res.status_mes,
                type: 'success'
              })
              this.handleClose()
              this.$emit('ok')
            } else {
              this.$message({
                message: res.status_mes,
                type: 'error'
              })
              this.loading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.row-layout{
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
  }
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
