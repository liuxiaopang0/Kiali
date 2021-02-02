<template>
  <div class="container-box" :style="{background:bgColor,padding:padding}">
    <container-title-component :title="title" :back="back" :bread="bread_res" v-if="!noHead" @isClick="bread_click"></container-title-component>
    <div class="container-box-content" :style="{padding:contentPadding}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import ContainerTitleComponent from '@/components/container-title-component'
import { mapState } from 'vuex'
/**
 * 列表页面容器
 *
 * title 页面盒子的标题 string
 * back 是否需要返回按钮 形式为路由路径 string
 * bread 面包屑
 * bgColor 整体背景色 #
 * padding 整体padding
 * contentPadding 内容区域padding
 * noHead 是否需要隐藏头部 true 隐藏，fasle显示，默认显示
 * contentColor 内容区域 背景色
**/
export default {
  props: ['title', 'back', 'bread', 'bgColor', 'padding', 'contentPadding', 'noHead', 'contentColor'],
  components: {
    ContainerTitleComponent
  },

  computed: mapState({
    bread_res(state) {
      var res = ''
      if (this.bread === 'route') {
        var arr = []
        if (state.menu.current_first_nav) {
          arr.push(state.menu.current_first_nav)
        }
        if (!state.menu.current_menu) return arr
        if (state.menu.current_menu.group !== state.menu.current_menu.item) {
          arr.push(state.menu.current_menu.group)
          arr.push(state.menu.current_menu.item)
        } else {
          arr.push(state.menu.current_menu.group)
        }
        const menu = arr.map((item, index) => {
          const obj = {
            name: item.name,
            href: item.index || item.href
          }
          if (item.children) {
            obj.name = item.name
            obj.href = item.children[0].index
          } else {
            obj.name = item.name
            obj.href = item.index || item.href
          }
          return obj
        })
        res = menu
      } else {
        res = this.bread
      }
      return res
    }
  }),
  methods: {
    bread_click(href) {
      this.$emit('breadClick', href)
    }
  }
}
</script>
