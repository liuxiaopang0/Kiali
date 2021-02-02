<template>
  <div class="sugon-form-item" :class="itemClass">
    <label v-if = 'label'>
        {{label}}
    </label>
    <slot></slot>
    <p v-if = 'error.status' class="erro-text">
        {{error.message}}
    </p>
  </div>
</template>
<script>
  export default {
    props: ['label', 'prop', 'itemClass'],
    // 能够获取全局的规则
    inject: ['form'],
    data() {
      return {
        error: {
          status: false,
          message: ''
        }
      }
    },
    methods: {
      // mounted() {
      //   this.$on('validate',this.validate)
      // },
      validate(back) {
        // 每个item都有一个validata方法
        // 1、获取rule校验规则
        const rules = this.form.rules[this.prop]
        // 2、获取model数据模型
        const value = this.form.model[this.prop]
        const formData = this.form.model
        var status = true
        for (const item of rules) {
          // status = this.check_rule(item,back.type,value)
          var data = item
          var type = back.type
          // 验证部分
          var state = true
          if (back.type == item.trigger || back.type == 'check_all') {
            var rule = ''
            if (item.rule == 'blank') {
              rule = /\S/
            } else if (item.rule == 'equal') {
              rule = new RegExp(`${formData[item.key]}`, 'g')
            } else if (item.rule == 'email') {
              rule = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
            } else if (item.rule == 'phone') {
              rule = /^1[3|4|5|7|8][0-9]\d{8}$/
            } else {
              rule = item.regex
            }
            state = rule.test(value)
            status = state
          }

          // 数据处理部分
          if (!status) {
            this.error.message = item.message
            this.error.status = true
          } else {
            this.error.status = false
          }
          this.$children.filter(v => v.isInput).map(item => item.check_val(!status))
          // eventHub.$emit('check',!status)
          if (!status) break
        }
        return status
      }
      // check_rule(data,type,val){//验证规则
      //   var state = true
      //   if(type == data.trigger || type == 'check_all'){
      //     var rule = '';
      //     console.log(data.rule)
      //     if(data.rule == 'blank'){
      //       rule = /\S/
      //     }else{
      //       rule = data.regex
      //     }
      //     state = rule.test(val)
      //     return state
      //   }
      // }
    }
  }
</script>
<style scoped>
.sugon-form-item{
  position: relative;
  margin-bottom: 20px;
}
.erro-text{
  padding-top:2px; 
  position: absolute;
  font-size: 12px;
  color:red;
  left: 0;
  top: 100%;
}
</style>
