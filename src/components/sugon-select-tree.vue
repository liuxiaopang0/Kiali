<template>
  <el-select :value="valueTitle" :clearable="clearable" @clear="clearHandle" popper-class='home-box'>
    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree  
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :default-expanded-keys="defaultExpandedKey"
        :render-content="renderContent"
        @node-click="handleNodeClick">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
import SugonRightHandle from '@/components/component/sugon-right-handle'
export default {
  name: 'el-tree-select',
  components: {
    SugonRightHandle
  },
  props: {
    // 配置项
    props: {
      type: Object,
      default: {
        isLeaf: '',
        label: '',
        value: '', // 显示名称
        children: '' // 子级字段名
      }
    },

    // 选项列表数据(树形结构的对象数组)
    options: { type: Array, default: [] },

    // 可清空选项
    clearable: { type: Boolean, default: true },

    // 自动收起
    accordion: { type: Boolean, default: false }
  },
  data() {
    return {
      valueId: null,
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  mounted() {
    // this.valueId = this.value,    // 初始值
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle() {
    //   if(this.valueId){
    //     this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label]     // 初始化显示
    //     this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
    //     this.defaultExpandedKey = [this.valueId]      // 设置默认展开
    //   }
      this.initScroll()
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        const scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    // 切换选项
    handleNodeClick(node) {
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('getValue', this.valueId)
      this.defaultExpandedKey = []
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },
    // 清空选中样式
    clearSelected() {
      const allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    },
    renderContent(h, { node, data, store }) {
      var obj = {
        handle: data.handle,
        data: data,
        node: node
      }
      return (
        <SugonRightHandle item={obj}>
          <i class={data.icon ? data.icon : ''}></i>
          <span class='menu-label'>{node.label}</span>
        </SugonRightHandle>
      )
    }
    // 懒加载
    // loadNode(node, resolve) {
    //     if (node.level === 0) {
    //       return resolve([]);
    //     }
    //     // if (node.level > 1) return resolve([]);
    //     this.$emit('load_lazy', {node: node, resolve: resolve})
    // }
  },
  watch: {
    value() {
      this.valueId = this.value
      this.initHandle()
    }
  }
}
</script>

<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#fff;
    font-weight: normal;
  }
</style>