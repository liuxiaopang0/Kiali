<template>
  <div class="sugon-input-container">
    <i :class="icon" v-if="icon" class="input-icon"></i>
    <input
      :type="type"
      @blur="onBlur"
      :value="value"
      @input="onInput"
      class="sugon-input"
      :class="input_class"
      :placeholder="placeholder"
      :style="inputStyle"
    />
  </div>
</template>
<script>
// 失去焦点时触发校验以及用户输入的时候触发校验
export default {
  props: {
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    icon: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    inputStyle: {
      type: Object
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    input_class() {
      var obj = {}
      var key = 'error_status'
      if (this.inputClass) {
        if (this.error_status) {
          key = 'error_status' + ' ' + this.inputClass + this.icon ? ' is_icon' : ''
          obj[key] = true
        } else {
          key = this.inputClass + this.icon ? ' is_icon' : ''
          obj[key] = true
        }
      } else if (this.icon) {
        if (this.error_status) {
          key = 'error_status' + ' ' + 'is_icon '
          obj[key] = true
        } else {
          key = 'is_icon'
          obj[key] = true
        }
      } else {
        obj[key] = this.error_status
      }
      return obj
    }
  },
  data() {
    return {
      error_status: false,
      isInput: true
    }
  },
  methods: {
    onInput(e) {
      this.$emit('change', e.target.value)
      //  this.$parent.$emit("validate")
    },
    onBlur() {
      this.$parent.validate({ type: 'blur' })
      // eventHub.$emit("input", {type:'blur'});
    },
    check_val(res) {
      if (res) {
        this.error_status = true
      } else {
        this.error_status = false
      }
    }
  }
}
</script>
<style scoped>
.sugon-input-container{
    position: relative;
    height: 100%;
    width: 100%;
}
.sugon-input {
  height: 100%;
  width: 100%;
  outline: none;
  border: 1px solid gainsboro;
  border-radius: 3px;
  transition: all 0.2s;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  color: #fff;
}
.sugon-input:focus {
  border: 1px solid #3674fb;
}
.sugon-input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #b0b0b1;
}
.sugon-input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #b0b0b1;
}
.sugon-input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #b0b0b1;
}
.sugon-input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #b0b0b1;
}
.input-icon{
  position: absolute;
  z-index: 1000;
  left: 10px;
  top: 50%;
  transform: translateY(-50%)
}
.error_status{
  border-color: red !important
}
.is_icon{
  padding-left: 26px !important
}
</style>