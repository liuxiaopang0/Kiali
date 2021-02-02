<template>
  <div class="sugon-menu">
    <div class="sugon-menu-group">
      <div class="sugon-menu-container" v-for="(item,index) of menu_list" :key="index">
        <div class="sugon-menu-li" @click="change_nav(item,index,'group')" :class="active_group(item)">
          <i :class="item.icon" v-if="item.icon" class="font_family sugon-menu-icon"></i>
          <span class="sugon-menu-text">{{item.name}}</span>
          <i class="el-icon-arrow-down sugon-menu-phone" :class="{'open-box':item.open}" v-if="item.children"></i>
        </div>
        <sugon-menu-box v-if="item.children" :ref="item.index">
          <sugon-menu-child-li v-for="(ite,inde) of item.children" :key="inde" ref="sugon-menu-li" :style="li_style" @click.native="change_nav(ite,inde,'child',item)">
            <span class="sugon-menu-text" :class="{'active-item':current_index == ite.index}">{{ite.name}}</span>
          </sugon-menu-child-li>
          <i class="sugon-menu-line" :style="{height:height/2 + 'px',top:item.top?item.top:'0'}" v-if="!item.hide_line"></i>
        </sugon-menu-box>
      </div>
    </div>
  </div>
</template>

<script>
/* 盒子组件*/
const SugonMenuBox = {
  template: `
        <div class="sugon-menu-box">
            <slot></slot>
        </div>
    `
}
/* 列组件*/
const SugonMenuChildLi = {
  template: `
        <div class="sugon-menu-li sugon-menu-child-li">
            <slot></slot>
        </div>
    `
}
export default {
  components: {
    SugonMenuBox,
    SugonMenuChildLi
  },
  props: {
    width: {// 宽带，暂时没使用，宽度根据内容自动撑开
      type: String,
      default: '240px'
    },
    menuData: {// 数据
      type: Array,
      default: () => []
    },
    li_height: {// 列的高度单位px
      type: Number,
      default: 32
    }
  },
  watch: {
    menuData: function(_new) {
      let list = JSON.stringify(this.menuData)
      list = JSON.parse(list)
      this.menu_list = list
    },
    activeBreadCrumb(val) {
      if (val) {
        // this.init(val)
        // this.$store.commit('set_active_breadcrumb', '')
      }
    }
  },
  data() {
    return {
      height: 32,
      menu_list: [],
      /* 当前组*/
      current_group: '',
      /* 当前路由具体信息*/
      current_route: '',
      /* 当前index*/
      current_index: '',
      /* 上一个组*/
      is_group: '',
      list: '',
      isInit: false
    }
  },
  computed: {
    li_style() { // 列的样式
      const obj = {
        height: this.height + 'px',
        lineHeight: this.height + 'px'
      }
      return obj
    },
    activeBreadCrumb() {
      return this.$store.state.active_breadcrumb
    }
  },
  created() {
    // 克隆数据
    this.height = this.li_height
    let list = JSON.stringify(this.menuData)
    list = JSON.parse(list)
    this.menu_list = list
  },
  mounted() {
    // this.$nextTick(() => {
    //   const path = this.$route.path
    //         // 初始化
    //         this.init(path)
    // })
  },
  methods: {
    /* 更新数据*/
    update_index(path) {
      this.$nextTick(() => {
        this.init(path)
      })
    },
    /* 初始化数据*/
    init(path) {
      let list = JSON.stringify(this.menuData)
      list = JSON.parse(list)
      this.menu_list = list
      const _this = this
      this.isInit = true
      if (this.menu_list.length) {
        find(this.menu_list)
      } else {
        this.$emit('change', null)
      }
      function find(data) {
        data.forEach((item, index) => {
          if (item.index === path) {
            _this.current_index = item.index
            _this.current_group = item
            _this.change_nav(item, index, 'group')
            if (item.children) {
              item.children.forEach((ite, inde) => {
                if (ite.index === path) {
                  _this.current_group = item
                  _this.is_group = item
                  _this.current_route = ite
                  if (!item.open) {
                    _this.change_nav(item, index, 'group')
                  }

                  _this.change_nav(ite, inde, 'child', item)
                  _this.current_index = ite.index
                }
              })
            }
          } else if (item.index !== path && item.children) {
            item.children.forEach((ele, inde) => {
              if (ele.index === path) {
                _this.current_group = item
                _this.is_group = item
                _this.current_route = ele
                if (!item.open) {
                  _this.change_nav(item, index, 'group')
                }
                _this.change_nav(ele, inde, 'child', item)
                _this.current_index = ele.index
              } else if (ele.index !== path && ele.children) {
                ele.children.forEach((element, ind) => {
                  if (element.index === path) {
                    _this.current_group = item
                    _this.is_group = item
                    _this.current_route = element
                    if (!item.open) {
                      _this.change_nav(item, index, 'group')
                    }
                    _this.change_nav(element, inde, 'child', item)
                    _this.current_index = ele.index
                  }
                })
              }
            })
          }
        })
      }
      this.isInit = false
    },
    // 当前组的样式
    active_group(item) {
      let obj = ''
      if (item.children) {
        obj = { 'active-group': this.current_group === item }
      } else {
        obj = { 'active-item': this.current_group === item }
      }
      return obj
    },
    // 改变导航
    change_nav(item, index, type, group) { // 数据，标记，类型，组数据
      if (type === 'child') {
        this.$set(group, 'top', this.height * index + 'px')
        if (!item.index) return
        this.current_group = group
        this.is_group = group
        this.$set(group, 'hide_line', false)
        this.current_index = item.index
        this.$emit('change', { group: this.current_group, item: item })
      } else {
        if (item.children) {
          if (!item['open']) {
            this.$set(item, 'open', true)
            for (const data of this.menu_list) {
              if (data.index !== item.index) {
                if (data.children) {
                  this.$set(data, 'open', false)
                  this.open_box(data, data.open)
                }
              }
            //   if (this.isInit) {
            //     // 点击顶部一级菜单时保证当左侧第一项包含子菜单时能正常跳转，但会导致页面停留在第三极菜单的非第一项时，点击浏览器刷新后三级当前菜单与实际主体内容不匹配问题
            //     this.$emit('change', { group: item, item: item.children[0] })
            //   }
            }
          } else {
            item['open'] = false
          }
          if (this.is_group.index === item.index) {
            this.$set(item, 'hide_line', false)
          } else {
            this.$set(item, 'hide_line', true)
          }
          this.current_group = item
          this.open_box(item, item.open)
        } else {
          this.is_group = item
          for (const data of this.menu_list) {
            if (data.index !== item.index) {
              if (data.children) {
                this.$set(data, 'open', false)
                this.$set(data, 'hide_line', true)
                this.open_box(data, data.open)
              }
            }
          }
          this.current_group = item
          this.current_index = item.index
          this.$emit('change', { group: this.current_group, item: item })
        }
      }
    },
    // 展开盒子
    open_box(data, state) {
      const box = this.$refs[data.index][0]
      const children = box.$children
      const height = children.length * this.height + 'px'
      if (state) {
        box.$el.style.height = height
      } else {
        box.$el.style.height = '0'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .sugon-menu .sugon-menu-li:hover{
    color: #00B1FF;
  }
  .sugon-menu .sugon-menu-box .sugon-menu-child-li:hover{
    color: #00B1FF;
  }
</style>
