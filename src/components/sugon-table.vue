<template>
  <div class="sugon-table" id="sugon-table" :style="{paddingTop:column_height+'px'}">
    <ul class="sugon-table-container-header" id="sugon-table-column" :style="{width:ul_width,left:table_header_left}" :class="[ul_class(1)]">
        <li :style="{width:item.width?item.width:'',flex:item.width?'':'1',borderRight:(index==data.columns.length -1)?'none':border_style,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px'}" v-for="(item,index) of data.columns" :key="index">
          <input type="checkbox"  @change="all_check_change($event)" v-if="item.type === 'check'"/>
          <span v-else-if="item.type === 'sequenceNumber'">序号</span>
          <span v-else>{{item.title}}</span>
        </li>
        <div :style="{height:'100%',width:scroll_width+'px'}" v-if="ul_width === '100%'"></div>
    </ul>
    <div class="all-table-container"  @mouseover="change_scroll_type($event,'all')" id="sugon-table-body">
      <div class="sugon-table-container-body">
        <VirtualScrollList :size=36 :remain=8 :items="data.data"  @change="change" @scrollFn="scrollFn" ref="VirtualScrollList" :scrollTop="scrollTop" type="all" :currentType="scroll_type" key="VirtualScrollListAll" :scrollWidth="scroll_width" :ul_width="ul_width">
          <!-- <transition-group name="flip-list" tag="div"> -->
            <Item v-for="(item,index) of table_data" :key="item.sortNum" @dragstart.native="dragStart($event,item,index)" draggable="true" @drop.native="stop_drop($event,item,index)" @dragover.native="allowDrop($event)" :style="{width:ul_width}" :class="[ul_class(index)]" :vid="index">
              <li v-if="isCheck" :style="{width:isCheck.width,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px',borderRight:border_style}">
                <input type="checkbox" :checked="judege_checked(item)" @change="li_check_change($event,item)">
              </li>
              <li class="sequenceNumber" v-if="is_sequenceNumber" :style="{lineHeight:config.columnHeight+'px',borderRight:border_style,height:config.columnHeight+'px'}">
                {{index+1}}
              </li>
              <li v-for="(ite,inde) of list[index]" :key="inde" :style="{width:ite.width?ite.width:'',flex:ite.width?'':'1',borderRight:(inde==list[index].length -1)?'none':border_style,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px'}">
                <slot :name="ite.key" v-bind:data="item">
                  {{ite.msg}}
                </slot>
              </li>
            </Item>
          <!-- </transition-group> -->
        </VirtualScrollList>
      </div>
    </div>
    <!--固定列左侧-->
    <div class="sugon-fixed-left" :style="{width:fixed_left_width+'px',height:table_body_height+column_height-scroll_width+'px'}">
      <ul class="sugon-table-header" :class="[ul_class(1)]">
        <li :style="{width:item.width?item.width:'',flex:item.width?'':'1',borderRight:(index==fixed_left_header.length -1)?border_style:border_style,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px'}" v-for="(item,index) of fixed_left_header" :key="index">
          <input type="checkbox"  @change="all_check_change($event)" v-if="item.type === 'check'"/>
          <span v-else-if="item.type === 'sequenceNumber'">序号</span>
          <span v-else>{{item.title}}</span>
        </li>
      </ul>
      <div class="sugon-table-body" :style="{width:fixed_left_width + 'px'}"   @mouseover="change_scroll_type($event,'left')">
      <VirtualScrollListLeft :offsetIn="offsetIn" :scrollBar="scrollBar" :size=36 :remain=8 :items="data.data" @scrollFnLeft="scrollFnLeft" @change="change" ref="VirtualScrollListLeft" :scrollTop="scrollTop" type="left" :currentType="scroll_type"  key="VirtualScrollListAll2" :style="{width:fixed_left_width+scroll_width+'px'}">
        <!-- <transition-group name="flip-list" tag="div"> -->
              <Item v-for="(item,index) of table_data" :key="item.sortNum" @dragstart.native="dragStart($event,item,index)" draggable="true" @drop.native="stop_drop($event,item,index)" @dragover.native="allowDrop($event)" :class="[ul_class(index)]" :vid="index" :style="{width:ul_width}">
                <li v-if="isCheck" :style="{width:isCheck.width,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px',borderRight:border_style}">
                  <input type="checkbox" :checked="judege_checked(item)" @change="li_check_change($event,item)">
                </li>
                <li class="sequenceNumber" v-if="is_sequenceNumber" :style="{lineHeight:config.columnHeight+'px',borderRight:border_style,height:config.columnHeight+'px'}">
                  {{index+1}}
                </li>
                <li v-for="(ite,inde) of fixed_left_list[index]" :key="inde" :style="{width:ite.width?ite.width:'',flex:ite.width?'':'1',borderRight:border_style,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px'}">
                  <slot :name="ite.key" v-bind:data="item">
                    {{ite.msg}}
                  </slot>
                </li>
              </Item>
          <!-- </transition-group> -->
          </VirtualScrollListLeft>
        </div>
    </div>
    <!--固定列右侧-->
    <div class="sugon-fixed-right" :style="{width:fixed_right_width+'px',height:table_body_height+column_height-scroll_width-2+'px',right:scroll_width+'px'}" v-if="false">
      <ul class="sugon-table-header" :class="[ul_class(1)]">
        <li :style="{width:item.width?item.width:'',flex:item.width?'':'1',borderRight:(index==fixed_right_header.length -1)?'none':border_style,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px'}" v-for="(item,index) of fixed_right_header" :key="index">
          <input type="checkbox" v-if="item.type === 'check'" @change="all_check_change($event)"/>
          <span v-else>{{item.title}}</span>
        </li>
      </ul>
      <div class="sugon-table-body" :style="{width:fixed_right_width+scroll_width+'px'}" id="sugon-fixed-right-body" @mouseover="change_scroll_type($event,'right')">
      <div class="table-blank" :style="{width:'100%',height:all_height+'px'}"></div>
      <div :style="{transform:`translate3d(0,${offset}px,0)`}">
        <!-- <transition-group name="flip-list" tag="div"> -->
              <ul v-for="(item,index) of table_data" :key="item.sortNum" @dragstart="dragStart($event,item,index)" draggable="true" @drop="stop_drop($event,item,index)" @dragover="allowDrop($event)" :class="[ul_class(index)]">
                <li v-for="(ite,inde) of fixed_right_list[index]" :key="inde" :style="{width:ite.width?ite.width:'',flex:ite.width?'':'1',borderRight:(inde==fixed_right_list[index].length -1)?'none':border_style,height:config.columnHeight+'px',lineHeight:config.columnHeight+'px'}">
                  <slot :name="ite.key" v-bind:data="item">
                    {{ite.msg}}
                  </slot>
                </li>
              </ul>
          <!-- </transition-group> -->
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import VirtualScrollList from './virtual-scroll-list'
import VirtualScrollListLeft from './virtual-scroll-list-left'
import Item from './item'
export default {
  components: {
    VirtualScrollList,
    VirtualScrollListLeft,
    Item
  },
  props: {
    allList: {
      type: Array,
      default: function() {
        return []
      }
    },
    data: {
      type: Object,
      default: function() {
        return {
          columns: [
            {
              title: '第一列',
              key: 'a'
            },
            {
              title: '第二列',
              key: 'b'
            }
          ],
          data: []
        }
      }
    },
    config: {
      type: Object,
      default: function() {
        return {
          width: 0,
          padding: 5,
          limit: 10,
          columnHeight: 36,
          border: true
        }
      }
    },
    fixedList: {
      type: Object,
      default: function() {
        return {
          left: 1,
          right: 0
        }
      }
    },
    sequenceNumber: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    table_data() {
      const start = this.start - this.preCount
      const end = this.end + this.nextCount
      if (this.$refs['VirtualScrollList']) {
        this.$refs['VirtualScrollList'].updatedFn()
        // this.$refs['VirtualScrollListLeft'].updatedFn()
      }
      return this.data.data.slice(start, end)
    },
    preCount() {
      return Math.min(this.start, this.remain)// 例如（5，8）//取5
    },
    // 后面预留几个
    nextCount() {
      return Math.min(this.remain, this.data.data.length - this.end)// 例如（8，5）取5
    },
    border_style() {
      var res = '1px solid rgba(0,0,0,0)'
      if (this.config.border) {
        res = '1px solid black'
      }
      return res
    },
    ul_width() {
      var width = '100%'
      var state = this.data.columns.some((item) => !item.width)
      if (!state) {
        width = 0
        this.data.columns.forEach((item) => {
          width += parseInt(item.width)
        })
        width = width + 'px'
      }
      return width
    },
    // table_data(){
    //   return this.data.data.slice(this.table_start,this.table_end)
    // },
    list() {
      var arr = []
      for (var item of this.table_data) {
        var data = []
        for (var ite of this.data.columns) {
          for (var i in item) {
            if (ite.key === i) {
              var obj = {
                msg: item[i],
                width: ite.width,
                key: i
              }
              data.push(obj)
            }
          }
        }

        arr.push(data)
      }
      return arr
    },
    fixed_left_header() {
      var res = []
      if (this.sequenceNumber && this.fixedList.left === 1) {
        res = []
      } else {
        return this.data.columns.filter((item, index) => index < this.fixedList.left)
      }
    },
    fixed_left_list() {
      // if(this.sequenceNumber && this.fixedList.left === 1){
      //   return []
      // }
      var arr = this.list.map((item) => {
        var left = this.fixedList.left
        if (this.is_sequenceNumber && !this.is_checked) {
          left = left - 1
        }
        return item.filter((ite, index) => index < left)
      })
      return arr
    },
    fixed_right_header() {
      return this.data.columns.filter((item, index) => index > this.data.columns.length - this.fixedList.right - 1)
    },
    fixed_right_list() {
      return this.list.map((item) => {
        return item.filter((ite, index) => index > this.data.columns.length - this.fixedList.right - 2)
      })
    }
  },
  data() {
    return {
      table_height: 0,
      column_height: 0,
      scroll_width: 0,
      table_body_height: 0,
      limit: 0,
      table_start: 0,
      table_end: 0,
      all_height: 0,
      offset: 0,
      slice_arr: [],
      start_drag_data: '',
      check_arr: [],
      fixed_left_width: 0,
      fixed_right_width: 0,
      scroll_type: '',
      old_scroll_y: 0,
      old_scroll_x: 0,
      table_header_left: 0,
      is_checked: false,
      is_sequenceNumber: false,
      start: 0,
      end: 0,
      remain: 8,
      scrollTop: 0,
      offsetIn: 0,
      scrollBar: 0
    }
  },
  watch: {
    'data.data': {
      handler: function(_new) {
        this.computed_table()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.computed_table()
    })
  },
  created() {
    this.end = this.remain
    var checked = false
    var is_index = false
    for (var item of this.data.columns) {
      if (item.type === 'checked') {
        this.checked = true
      }
      if (item.type === 'sequenceNumber') {
        this.is_sequenceNumber = true
      }
    }
  },
  methods: {
    scrollFn(data) {
      if (this.judege_scroll() === 'x') {
        this.$nextTick(() => {
          document.getElementById('sugon-table-column').style.left = -document.getElementById('all').scrollLeft + 'px'
        })
      }
    },
    scrollFnLeft(data) {
      document.getElementById('all').scrollTop = data
    },
    change(data) {
      this.start = data.start
      this.end = data.end
    },
    computed_table() {
      this.table_height = document.getElementById('sugon-table').clientHeight
      this.column_height = document.getElementById('sugon-table-column').offsetHeight
      if (this.data.data.length < this.remain) {
        this.table_body_height = 36 * this.data.data.length
      } else {
        this.table_body_height = 36 * this.remain
      }
      this.limit = Math.floor(this.table_body_height / this.column_height)
      this.table_end = Math.floor((this.table_body_height * 3) / this.column_height)
      var all_height = this.data.data.length * this.column_height
      this.all_height = all_height
      /** 计算滚动条宽度 */
      function getScrollBarWidth() {
        var el = document.createElement('p'),
          styles = {
            width: '100px',
            height: '100px',
            overflowY: 'scroll'
          },
          i

        // 这里很巧妙呀，先定义了一个styles对象，里面写了各种样式值，然后通过for in将这个对象的值赋给p元素的style对象
        // 而不用通过style.width=***等来给p的样式对象赋值。
        for (i in styles) {
          el.style[i] = styles[i]
        }

        // 将元素加到body里面
        document.body.appendChild(el)

        var scrollBarWidth = el.offsetWidth - el.clientWidth
        // 将添加的元素删除
        el.remove()
        return scrollBarWidth
      }
      this.scroll_width = getScrollBarWidth()
      /** 计算固定列宽度 */
      var columns_header_list = document.getElementById('sugon-table-column').children
      if (this.fixedList.left) {
        var fixed_left_width = 0
        var left = this.fixedList.left
        for (var i = 0; i < left; i++) {
          fixed_left_width += columns_header_list[i].offsetWidth
        }
        this.fixed_left_width = fixed_left_width
      }
      /** 右侧固定列宽度 */
      if (this.fixedList.right) {
        var fixed_right_width = 0
        for (var i = columns_header_list.length - this.fixedList.right - 1; i < columns_header_list.length; i++) {
          fixed_right_width += columns_header_list[i].offsetWidth
        }
        this.fixed_right_width = fixed_right_width - 1
      }
    },
    ul_class(index) {
      var res = 'one-li'
      if (index % 2 === 0) {
        res = 'tow-li'
      }
      return res
    },
    change_scroll_type(e, type) {
      this.element = e
      this.scroll_type = type
    },
    all_check_change(e) {
      if (e.target.checked) {
        this.check_arr = this.data.data
      } else {
        this.check_arr = []
      }
    },
    li_check_change(e, item) {
      if (e.target.checked) {
        this.check_arr.push(item)
      } else {
        var index = this.check_arr.findIndex((ite) => item = ite)
        this.check_arr.splice(index, 1)
      }
    },
    judege_checked(item) {
      var state = false
      if (this.check_arr.indexOf(item) !== -1) {
        state = true
      }
      return state
    },
    allowDrop(event) {
      event.preventDefault()
    },
    stop_drop(e, item, index) {
      var start_data = this.table_data[this.start_drag_data.index]
      var start_index = this.allList.indexOf(start_data)
      var end_index = this.allList.indexOf(item)
      this.$set(this.allList, start_index, item)
      this.$set(this.allList, end_index, start_data)
    },
    dragStart(e, item, index) {
      var obj = {
        index: index,
        data: item
      }
      this.start_drag_data = obj
    },
    judege_scroll() {
      var e = document.getElementById('all')
      var res = ''
      if (e.scrollTop != this.old_scroll_y) {
        res = 'y'
      } else if (e.scrollLeft != this.old_scroll_x) {
        res = 'x'
      }
      this.old_scroll_y = e.scrollTop
      this.old_scroll_x = e.scrollLeft
      return res
    }
  }
}
</script>

<style scoped>
.sugon-table{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.all-table-container{
  /* overflow:auto; */
  height: 100%;  
  position: relative;
}
.sugon-table-container-header{
  display: flex;
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
}
.sugon-table-container-header li span{
    color: #FEFEFE !important
}
.sugon-table-header li span{
    color: #FEFEFE !important
}
.sugon-table ul{
  /* border-bottom: 1px solid black; */
  box-sizing: border-box;
}
.sugon-table ul li{
  border-right:1px solid black;
  padding:0 10px;
  box-sizing: border-box;
}
.sugon-table-header{
  display: flex;
}
.sugon-table-container-body ul{
  display: flex;
  position: relative;
  color: #c5c5ac
}
.sugon-table-body {
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative; 
}
.sugon-table-body ul{
  display: flex;
  color: #c5c5ac;
}
.table-blank{
  position: absolute;
  left: 0;
  top:0;
  z-index: -1;
}
.flip-list-move {
  transition: transform 0.3s;
}
.sugon-fixed-left{
  position: absolute;
  left: 0;
  top:0;
  display:flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  z-index: 101;
}
.sugon-fixed-right{
  position: absolute;
  right: 0;
  top:0;
  display:flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  z-index: 101;
}
.one-li{
  background: #262839
}
.tow-li{
  background: #323548
}
.sequenceNumber{
  width: 50px;
  color: #FEFEFE;
}
</style>