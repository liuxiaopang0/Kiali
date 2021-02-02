export default{
  methods: {
    open_dialog(name, data) {
      this.$nextTick(() => {
        this.$refs[name].open_dialog(data)
      })
    },
    // 表单重置
    resetForm(formN) {
      if (this.$refs[formN]) {
        this.$refs[formN].resetFields()
      }
    }
  }
}
