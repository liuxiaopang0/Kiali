<template>
  <div>
    <sugon-dialog :isShow.sync="dialog_state" @confirm="submit" title="弹框Demo" :width="1000">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
    </sugon-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog_state: false,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open_dialog(data) { // 与  全局mixin结合，data为传入值
      this.dialog_state = true
      console.log(this.$refs['ruleForm'])
      this.resetForm(this.$refs['ruleForm'])
    },
    submit(response) {
      setTimeout(() => {
        response.close()// 关闭loading
        this.dialog_state = false// 关闭弹框
      }, 2000)
    }
  }
}
</script>

<style>

</style>