<template>
<!-- 能滚动的盒子 -->
  <div class="viewport" ref="viewport" @scroll="scrollFn" :id="type">
    <!-- //自己做的一个滚动条 -->
    <div class="scroll-bar" ref="scrollBar" :style="{width:ul_width}"></div>
    <!-- 真实的渲染内容 -->
    <div class="scroll-list" :style="{transform:`translate3d(0,${offset}px,0)`,width:ul_width}">
      <!-- <div v-for="item in visibleData" :key="item.id" :vid="item.id" ref="items">
        <slot></slot>
      </div> -->
      <slot></slot>
    </div>
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
  props: {
    size: Number, // 当前每一项的高度度
    remain: Number, // 可见区域的个数
    items: Array,
    variable: Boolean,
    scrollTop: Number,
    type: String,
    currentType: String,
    scrollWidth: Number,
    ul_width: String
  },
  created() {
    // this.scrollFn = throttle(this.hancleScroll,200,{leading:false})
  },
  watch: {
    items: function() {
      if (this.items.length < this.remain) {
        this.$refs.viewport.style.height = this.size * this.items.length + 'px'
      } else {
        this.$refs.viewport.style.height = this.size * this.remain + 'px'
      }
      // this.$refs.viewport.style.height = this.size*this.remain+'px'
      this.$refs.scrollBar.style.height = this.size * this.items.length + 'px'
      this.scrollBar = this.size * this.items.length
      this.cacheList()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.viewport.style.height = this.size * this.remain + 'px'
      this.$refs.scrollBar.style.height = this.size * this.items.length + 'px'
      this.scrollBar = this.size * this.items.length
      // 如果加载完毕，需要缓存每一项的高度
      this.cacheList()// 先记录好，等一会儿滚动到的时候 ，去渲染页面时获取真实dom的高度，未更新缓存内容
      // 2、在重新计算滚动太的高度
    })
  },
  data() {
    return {
      start: 0,
      end: this.remain, // 默认显示8个
      offset: 0,
      positions: [],
      debounce_timer: null
    }
  },
  computed: {
    // 渲染3屏
    // 前面预留几个
    preCount() {
      return Math.min(this.start, this.remain)// 例如（5，8）//取5
    },
    // 后面预留几个
    nextCount() {
      return Math.min(this.remain, this.items.length - this.end)// 例如（8，5）取5
    },
    visibleData() {
      const start = this.start - this.preCount
      const end = this.end + this.nextCount
      return this.items.slice(start, end)
    }
  },

  methods: {
    debounce(fn) {
      var _this = this
      return (function() {
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments
        clearTimeout(_this.debounce_timer)
        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 fn
        _this.debounce_timer = setTimeout(function() {
          fn.apply(context, args)
        }, 200)
      }())
    },
    scrollFn(e) {
      var scrollTop = e.target.scrollTop
      var table_left = document.getElementById('sugon-table-left')
      if (table_left) {
        table_left.style.top = -scrollTop + 'px'
      }
      this.$emit('scrollFn')
      var _this = this
      this.debounce(() => {
        this.hancleScroll()
      })
    },

    updatedFn() { // 页面渲染完成后，需要根据当前展示的数据 更新缓存区的内容
      this.$nextTick(() => {
        // 根据当前显示的 更新缓存中的height bottom ,top 最终更新滚动条的高度
        const nodes = this.$children.map((item) => item.$el)// 获取真实的节点
        if (!(nodes && nodes.length > 0)) {
          return
        }
        nodes.forEach(node => {
          const { height } = node.getBoundingClientRect()// 获取真实的高度
          // 我希望改变老的高度
          const id = node.getAttribute('vid') * 1// 字符串转为number
          const oldHeight = this.positions[id].height
          const val = oldHeight - height // 计算当前的高度是否和之前的高度有变化
          if (val) {
            this.positions[id].height = height
            this.positions[id].bottom = this.positions[id].bottom - val // bottom增加了
            for (let i = id + 1; i < this.positions.length; i++) {
              this.positions[i].top = this.positions[i - 1].bottom
              this.positions[i].bottom = this.positions[i].bottom - val
            }
          }
        })
        // this.$refs.scrollBar.style.height  = this.size*this.items.length+'px'
        this.scrollBar = this.size * this.items.length
        // 只要更新过，会算出滚动条的最新高度
        // this.scrollBar = this.positions[this.positions.length
        // -1].bottom
        // this.$refs.scrollBar.style.height = this.positions[this.positions.length
        // -1].bottom+'px'
        // 动态的计算滚动条的高度
      })
    },
    cacheList() {
      // 缓存每一项的的高度，top 和bottom
      this.positions = this.items.map((item, index) => ({
        height: this.size,
        top: this.size * index,
        bottom: this.size * (index + 1)
      }))
    },
    getStartIndex(value) { // 查找当前滚动条的需要找到的值
      let start = 0
      let end = this.positions.length - 1
      let temp = null
      while (start <= end) {
        const middleIndex = parseInt((start + end) / 2)
        const middleValue = this.positions[middleIndex].bottom// 找到当前的中间的那个人的结尾点
        if (middleValue === value) { // 如果直接找到了，即返回当前的下一个人
          return middleIndex + 1
        } else if (middleValue < value) { // 查找当前的人 ，在右边
          start = middleIndex + 1
        } else if (middleValue > value) { // 查找当前的人，在左边
          if (temp === null || temp > middleIndex) {
            temp = middleIndex// 找到范围
          }
          end = middleIndex - 1
        }
      }
      return temp
    },
    hancleScroll() {
      // 1、应该下算出来当前滚过去几个了，当前应该从几个开始显示
      // 拿到当前用户滚动的距离
      const scrollTop = document.getElementById(this.type).scrollTop
      if (this.variable) { // 如果有传值variable,说明要使用二分查找找到对应的记录
        this.start = this.getStartIndex(scrollTop)
        this.end = this.start + this.remain
        // 位置偏移
        this.offset = this.positions[this.start - this.preCount] ? this.positions[this.start - this.preCount].top : 0
      } else {
        // 2、获取当期应该从第几个开始渲染
        this.start = Math.floor(scrollTop / this.size)// 130/40 = 3.25取3
        this.end = this.start + this.remain
        // 定位当前的可视区域，让当前渲染的内容在当前的viewport的可视区域
        // 如果有预留渲染，应该把这个位置在向上移动当这么多
        this.offset = this.start * this.size - this.size * this.preCount
        var table_left_box = document.getElementById('sugon-table-left-box')
        table_left_box.style.transform = `translate3d(0,${this.offset}px,0)`
      }
      const start = this.start
      const end = this.end
      this.$emit('change', { start: start, end: end })
      // return this.items.slice(start,end)
    }
  }
}
</script>
<style lang="scss" scoped>
  .viewport{
    width: 100%;
    overflow-y: scroll;
    overflow-x: scroll;
    position: relative;
  }
  .scroll-bar{
    position: absolute;
    top:0;
    left:0;
    width:100%;
  }
  .scroll-list{
    position: relative;
    overflow: hidden;
  }
</style>
