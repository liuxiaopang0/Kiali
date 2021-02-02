<template>
<!-- 能滚动的盒子 -->
  <div class="viewport" ref="viewport" :id="type">
    <!-- //自己做的一个滚动条 -->
    <div class="scroll-bar" ref="scrollBar" :style="{height:scrollBar + 'px'}" id="sugon-table-left">
      <div class="scroll-list"  id="sugon-table-left-box">
        <slot></slot>
      </div>
    </div>
    <!-- 真实的渲染内容 -->
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
  props:{
    size:Number,//当前每一项的高度度
    remain:Number,//可见区域的个数
    items:Array,
    variable:Boolean,
    scrollTop:Number,
    type:String,
    currentType:String,
    offsetIn:Number,
    scrollBar:Number,
  },
  created(){
    //this.scrollFn = throttle(this.hancleScroll,200,{leading:false})
  },
  mounted(){
    this.$nextTick(()=>{
      this.$refs.viewport.style.height = this.size*this.remain+'px'
      this.$refs.scrollBar.style.height  = this.size*this.items.length+'px'
      //如果加载完毕，需要缓存每一项的高度
      this.cacheList()//先记录好，等一会儿滚动到的时候 ，去渲染页面时获取真实dom的高度，未更新缓存内容
      //console.log(this.$children)
      //2、在重新计算滚动太的高度
      var num = this.scrollTop
      document.getElementById('left').onmousewheel = function (e) {
                e = e || window.event;
                if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
                    if (e.wheelDelta > 0) { //当滑轮向上滚动时
                        scroll('add')
                    }
                    if (e.wheelDelta < 0) { //当滑轮向下滚动时
                        scroll('down')
                    }
                } else if (e.detail) {  //Firefox滑轮事件
                    if (e.detail> 0) { //当滑轮向上滚动时
                        scroll('add')
                    }
                    if (e.detail< 0) { //当滑轮向下滚动时
                        scroll('down')
                    }
                }
            }
        var _this = this
        function scroll(type){
          if(type == 'down'){
            num = document.getElementById('all').scrollTop + 36
            _this.$emit('scrollFnLeft',num)
            _this.debounce(()=>{
              num = document.getElementById('all').scrollTop
            })
          }else if(type == 'add'){
            num = document.getElementById('all').scrollTop - 36
            _this.$emit('scrollFnLeft',num)
            _this.debounce(()=>{
              num = document.getElementById('all').scrollTop
            })
          }
        }
    })
  },
  data(){
    return{
      start:0,
      end:this.remain,//默认显示8个
      offset:0,
      positions:[],
      debounce_timer:null,
    }
  },
  watch:{
    items:function(){
      this.$nextTick(()=>{
        this.$refs.viewport.style.height = this.size*this.remain+'px'
      })
    }
  },
  computed:{
    //渲染3屏
    //前面预留几个
    preCount(){
      return Math.min(this.start,this.remain)//例如（5，8）//取5
    },
    //后面预留几个
    nextCount(){
      return Math.min(this.remain,this.items.length-this.end)//例如（8，5）取5
    },
    visibleData(){
      let start = this.start - this.preCount
      let end = this.end + this.nextCount
      return this.items.slice(start,end)
    }
  },

  methods:{
    debounce(fn){
       var _this = this
       return function () {
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this
        var args = arguments
        clearTimeout(_this.debounce_timer)
          // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
        // 再过 delay 毫秒就执行 fn
        _this.debounce_timer = setTimeout(function () {
            fn.apply(context, args)
        }, 200)
      }()
    },
    scrollFn(e){
      var scrollTop = e.target.scrollTop
      console.log(this.type,scrollTop)
      if(this.currentType === 'all'){
        this.$emit('scrollFn',scrollTop)
      }else if(this.currentType === 'left'){
        this.$emit('scrollFnLeft',scrollTop)
      }
      //throttle(this.hancleScroll,200,{leading:false})
      // scrollTop:scrollTop
      
      var _this = this
      this.hancleScroll()
      // this.debounce(()=>{
      //   this.hancleScroll()
      // })
    },
    updatedFn(){//页面渲染完成后，需要根据当前展示的数据 更新缓存区的内容
      this.$nextTick(()=>{
        //根据当前显示的 更新缓存中的height bottom ,top 最终更新滚动条的高度
        let nodes = this.$children.map((item)=> item.$el)//获取真实的节点
        if(!(nodes && nodes.length>0)){
          return
        }
        nodes.forEach(node => {
          let {height} = node.getBoundingClientRect()//获取真实的高度
          //我希望改变老的高度
          let id = node.getAttribute('vid')//字符串转为number
          let oldHeight = this.positions[id].height
          let val = oldHeight - height //计算当前的高度是否和之前的高度有变化
          if(val){
            this.positions[id].height = height
            this.positions[id].bottom = this.positions[id].bottom-val //bottom增加了
            for(let i= id+1; i<this.positions.length;i++){
              this.positions[i].top = this.positions[i-1].bottom
              this.positions[i].bottom = this.positions[i].bottom-val
            }
          }
        });
        //只要更新过，会算出滚动条的最新高度
        this.$refs.scrollBar.style.height = this.positions[this.positions.length
        -1].bottom+'px'
        //动态的计算滚动条的高度
      })
    },
    cacheList(){
      //缓存每一项的的高度，top 和bottom
      this.positions = this.items.map((item,index) => ({
        height:this.size,
        top:this.size*index,
        bottom:this.size*(index+1)
      }))
    },
    getStartIndex(value){//查找当前滚动条的需要找到的值
      let start = 0
      let end = this.positions.length-1
      let temp = null
      while(start<=end){
        let middleIndex = parseInt((start+end)/2)
        let middleValue = this.positions[middleIndex].bottom//找到当前的中间的那个人的结尾点
        if(middleValue === value){//如果直接找到了，即返回当前的下一个人
          return middleIndex+1
        }else if(middleValue<value){//查找当前的人 ，在右边
          start = middleIndex + 1
        }else if(middleValue>value){//查找当前的人，在左边
          if(temp === null||temp>middleIndex){
            temp = middleIndex//找到范围
          }
          end = middleIndex - 1
        }
      }
      return temp
    },
    hancleScroll(){
      //1、应该下算出来当前滚过去几个了，当前应该从几个开始显示
      //拿到当前用户滚动的距离
      let scrollTop = document.getElementById(this.type).scrollTop
      if(this.variable){//如果有传值variable,说明要使用二分查找找到对应的记录
        this.start = this.getStartIndex(scrollTop)
        this.end = this.start + this.remain
        //位置偏移
        this.offset = this.positions[this.start-this.preCount]?this.positions[this.start-this.preCount].top:0
        //console.log(this.type)
      }else{
        //2、获取当期应该从第几个开始渲染
        this.start = Math.floor(scrollTop/this.size)// 130/40 = 3.25取3
        this.end = this.start +this.remain
        //定位当前的可视区域，让当前渲染的内容在当前的viewport的可视区域
        //如果有预留渲染，应该把这个位置在向上移动当这么多
        if(this.type !== 'all'){
          if(this.items.length*this.size-this.size*this.remain+16 === scrollTop){
            this.offset = this.start *this.size - this.size*this.preCount - 17
          }
          
        }else{
          this.offset = this.start *this.size - this.size*this.preCount
        }
        //this.offset = this.start *this.size - this.size*this.preCount//让可视区域去调整偏移
        // console.log(this.type)
      }
      let start = this.start
      let end = this.end
      this.$emit('change',{start:start,end:end})
      // return this.items.slice(start,end)
    }
  }
}
</script>
<style lang="scss" scoped>
  .viewport{
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
  }
</style>0
