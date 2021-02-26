<template>
    <ul class="right-list-option sugon-option">
        <li class="label-style" :style="label_style">{{label}}</li>
        <li :title="title_val" :class="li_style" class="option-msg">
            <p v-if="!isDom" class="text-over">{{value | trans_msg}}</p>
            <slot></slot>
            <div :class="{'no-msg':noMsg}"></div>
        </li>
    </ul>
</template>
<script>
export default {
  props: ['label', 'value', 'isDom', 'type', 'labelStyle', 'isTitle'],
  data() {
    return {
      is_option: true,
      is_title: true,
      noMsg: false,
      page_msg: ''
    }
  },
  inject: {
    config: {
      default: {}
    }
  },
  watch: {

  },
  filters: {
    trans_msg(data) {
      var res = '--'
      if (data) {
        res = data
      } else if (String(data) == '0') {
        res = data
      }
      return res
    }
  },
  created() {
  },
  computed: {
    label_style() {
      var res = ''
      if (this.labelStyle) {
        res = this.labelStyle
      } else if (this.config.labelStyle) {
        res = this.config.labelStyle
      }
      return res
    },
    title_val() {
      var res = ''
      if (this.config) {
        if (this.isTitle == 'hide') {
          res = ''
        } else if (this.isTitle == 'show') {
          res = this.value
        } else if (this.config.isTitle == 'hide') {
          res = ''
        } else if (this.config.isTitle == 'show') {
          res = this.value
        } else {
          res = this.value
        }
      } else {
        if (this.isTitle == 'hide') {
          res = ''
        } else if (this.isTitle == 'show') {
          res = this.value
        } else {
          res = this.value
        }
      }
      return res
    },
    li_style() {
      var _style = ''
      switch (this.type) {
        case 'nextTo':
          _style = {
            nextTo: true
          }
          break
        default:
          _style = {
            liStyle: true
          }
      }
      return _style
    }
  }
}
</script>
<style scoped>
.right-list-option{
    display: flex;
    padding: 10px 14px;
}
.right-list-option li{
    overflow: hidden;
}
.label-style{
    width: 30%;
}
.liStyle{
    flex: 1;
}
.nextTo{
    padding: 0 !important;
}
.right-list-option li:nth-child(1){
    padding-right:10px;
}
.right-list-option li:nth-child(2){
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: pre-line	;
}
.right-list-option li:nth-child(1){
    color: #847f7f;
}
.option-msg{
    position: relative;
}
.text-over{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
p {
  margin: 0;
}
</style>
