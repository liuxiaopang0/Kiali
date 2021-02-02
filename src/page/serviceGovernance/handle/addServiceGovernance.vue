<template>
  <div class="add-group">
    <el-dialog :title="status?'新建服务治理':'修改服务治理'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true" :before-close="handleClose" width="600px">
      <el-form :model="form" label-width="120px" :rules="rules" class="demo-ruleForm" action="" onsubmit="return false;" ref="form">
        <el-form-item label="名称：" prop='name'>
          <el-col :span="24">
            <el-input v-model="form.name" placeholder="必填（3~64个字符）" :disabled="!status"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="描述：" prop='description'>
          <el-col :span="24">
            <el-input v-model="form.description" placeholder=""></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="解析域名：" prop='description'>
          <span slot="label" style="position:relative;">
            解析域名：
            <el-tooltip class="item" effect="dark" placement="bottom">
              <div slot="content">解析域名</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-col :span="24">
            <el-input v-model="form.description" placeholder=""></el-input>
          </el-col>
        </el-form-item>
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
import * as serviceGovernance_http from '@/http/serviceGovernance-http'

export default {
  name: 'AddServiceGovernance',
  data() {
    const validateName = (rule, value, callback) => {
      if (this.status) {
        if (!(/^[a-z][a-z0-9-]{1,62}[a-z0-9]$/.exec(value))) {
          callback(new Error('名称只支持小写字母、数字、中划线，以小写字母开头'))
        } else {
          serviceGovernance_http.check_name(this.form.name, this.$store.state.namespace, this.$store.state.cluster_name).then(res => {
            if (res.status_code === 1) {
              if (!res.content) {
                callback(new Error('应用名称重复，请重新输入'))
              } else {
                callback()
              }
            } else {
              this.$message({
                message: res.status_mes,
                type: 'error'
              })
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      form: {

        name: '',
        description: '',
        cluster_name: '',
        namespace: '',
        app_type: 1,
        auto_start_up: true
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
        cluster_name: [
          { required: true, message: '请选择版本', trigger: 'change' }
        ],
        namespace: [
          { required: true, message: '请选择应用分区', trigger: 'change' }
        ],
        app_type: [
          { required: true, message: '请选择应用类型', trigger: 'change' }
        ]
      },
      serverVersion: [],
      namespaceItems: [],
      applicationTypeItems: [
        {
          label: '无状态',
          value: 1
        },
        {
          label: '有状态',
          value: 0
        }
      ],
      uuid: '',
      status: ''
    }
  },
  methods: {
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
      this.status = status
      if (!status) {
        this.form.name = row_data.name
        this.form.description = row_data.description
        this.form.app_type = row_data.app_type === '0' ? 0 : 1
        this.form.auto_start_up = row_data.auto_start_up === 0
        this.uuid = row_data.uuid
        if (row_data.label) {
          this.dynamicTags.push(row_data.label)
        } else {
          this.dynamicTag = []
        }

        if (this.dynamicTags.length) {
          this.inputVisible = false
        } else {
          this.inputVisible = false
        }
      }
      this.dialogFormVisible = true
      this.loading = false
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
        auto_start_up: true
      }
      this.$nextTick(_ => {
        this.$refs.form.clearValidate()
      })
      this.dialogFormVisible = false
    },
    handleSure() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.status) {
            const data =
              {
                app_type: this.form.app_type,
                auto_start_up: this.form.auto_start_up ? 0 : 1,
                cluster_name: this.$store.state.cluster_name,
                description: this.form.description,
                namespace: this.$store.state.namespace,
                name: this.form.name,
                label: this.dynamicTags.toString()
              }
            serviceGovernance_http.add_app(data).then(res => {
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
          } else {
            const data = {
              app_type: this.form.app_type,
              auto_start_up: this.form.auto_start_up ? 0 : 1,
              description: this.form.description,
              name: this.form.name,
              uuid: this.uuid,
              label: this.dynamicTags.toString()
            }
            serviceGovernance_http.put_app(data).then(res => {
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
        }
      })
    }
  }
}
</script>

<style scoped>
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
