<template>
  <div class="custom-tree-node sugon-right-handle"  v-rightMouse="handle_data" >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      state: false,
      style: {
        left: 0,
        top: 0
      },
      list: [
        {
          label: '新建',
          type: 'create'
        },
        {
          label: '删除',
          type: 'delete'
        }
      ],
      handle_data: {
        state: true,
        target: 'project_menu'
      }
    }
  },
  created() {
    this.handle_data['item'] = this.item
  },
  mounted() {
    this.$nextTick(() => {
      var _this = this
      window.onmousedown = function() {
        _this.state = false
      }
    })
  },
  methods: {
    handle(e) {
      this.style.left = e.pageX
      this.style.top = e.pageY
      this.state = true
    },
    test() {
    }
  }
}
</script>

<style scoped lang="scss">
.sugon-right-handle{

  .handle-list{
    display: inline-block;
    position: fixed;
    border: 1px solid gainsboro;
    border-bottom:none;
    li{
      border-bottom:1px solid gainsboro;
      padding:8px 18px;
      background: white;

      &:hover{
        background: $blue;
        color:$text-white;
      }
    }
  }
}
</style>