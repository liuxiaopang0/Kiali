<template>
  <el-dialog :title="incomingTitle" :visible.sync="dialogFormVisible"  :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" :append-to-body="true">
    <el-form :model="form" :rules="rules" ref="form" style="margin:10px" label-width="80px">
      <el-form-item prop="user_name" label="名称：">
        <el-input v-model="form.user_name" disabled style="width:100%" />
      </el-form-item>
      <div v-if="incomingTitle === '关闭'">
        <el-alert
          title="确认关闭该账号权限"
          type="warning"
          show-icon :closable="false">
        </el-alert>
      </div>
      <el-form-item prop="protocol" label="协议：" v-if="incomingTitle !== '关闭'">
        <el-select v-model="form.protocol" placeholder="请选择协议" style="width:100%">
          <el-option
            v-for="(item,index) in protocolItems"
            :label="item.label"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">
        <span v-if="!loading">立即{{incomingTitle}}</span>
        <span v-else>{{incomingTitle}}中</span>
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
  import table_mixin from '@/mixin/handle-mixin'
  import * as user_http from '@/http/user-http/user-http'

export default {
    name: 'ProcessingDialog',
    mixins: [table_mixin],
    data() {
      return {
        dialogFormVisible: false,
        loading: false,
        cluster_name: '',
        api_id: '',
        status: true,
        incomingTitle: '',
        protocolItems: [
          {
            label: 'HDFS',
            value: 'HDFS'
          },
          {
            label: 'S3',
            value: 'S3'
          },
          {
            label: 'HTTP',
            value: 'HTTP'
          }
        ],
        form: {
          protocol: '',
          app_id: '',
          user_id: '',
          user_name: '',
          user_type: '',
          owner_id: ''
        },
        rules: {
          protocol: {
            required: true,
            message: '请选择协议',
            trigger: 'change'
          }
        }
      }
    },
    methods: {
      open_dialog(row_data, incoming) {
        this.incomingTitle = incoming
        this.form.app_id = row_data.app_id
        this.form.user_id = row_data.id
        this.form.user_name = row_data.user_name
        this.form.user_type = row_data.type
        this.form.owner_id = row_data.owner_id
        if (this.incomingTitle !== '关闭') {
          this.form.protocol = ''
        } else {
          this.form.protocol = this.form.protocol
        }
        this.loading = false
        this.dialogFormVisible = true
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            const obj = {
              protocol: this.form.protocol,
              owner_id: this.form.owner_id,
              user_id: this.form.user_id,
              user_name: this.form.user_name,
              user_type: this.form.user_type
            }
            user_http[this.incomingTitle === '开通' ? 'post_subapp' : this.incomingTitle === '关闭' ? 'del_sub' : 'post_reset'](this.incomingTitle === '重置APPID' ? obj : [obj]).then(res => {
              if (res.status_code == 1) {
                this.messageBox('success', res.status_mes)
                // this.dialogFormVisible = false
                this.handleClose()
                this.$emit('ok')
              } else {
                this.messageBox('error', res.status_mes)
              }
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      handleClose() {
        this.form = {
          protocol: '',
          app_id: '',
          user_id: '',
          user_name: '',
          user_type: '',
          owner_id: ''
        }
        this.$nextTick(_ => {
          this.$refs.form.clearValidate()
        })
        this.dialogFormVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
