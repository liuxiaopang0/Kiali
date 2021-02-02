<template>
  <div>
    <ul class="tabs" :style="headStyle">
        <li class="tab-phone" @click="tab_change(item.name,index)" 
        v-for="(item,index) of childsNames"
        :key="index"
        :class="is_class(item.name)"
        ref="tabs"
        :style="tabStyle"
        >
        {{item.label}}
        </li>
        <div class="tab-line" :style="tab_line" v-if="!hideLine"></div>
    </ul>
    <div>
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['activeName', 'activeClass', 'hideLine', 'headStyle', 'tabStyle'],
  model: {
    prop: 'activeName',
    event: 'change'
  },
  provide() {
    return {
      config: this
    }
  },
  data() {
    return {
      childsNames: [],
      childs: [],
      labels: [],
      tab_line: {
        left: '0px',
        width: '0px'
      },
      avtive_class: 'tab-active'
    }
  },
  // computed:{
  //     is_class(data){
  //         var res = {'tab-active':this.activeName == data}
  //         if(this.activeClass){
  //             var obj = {};
  //             obj[this.activeClass] = this.activeName == data
  //             res = obj
  //         }
  //         return res
  //     }
  // },
  mounted() {
    this.childs = this.$children.filter((item) => item.is_phtone)
    this.childsNames = this.childs.map((item, index) => {
      var obj = {
        name: item.name,
        label: item.label
      }
      return obj
    })
    setTimeout(() => {
      this.tab_change(this.childsNames[0].name, 0)
    })
    // this.tab_change(this.childsNames[0].name,0)
    // setTimeout(()=>{
    //     this.tab_change(this.childsNames[0].name,0)
    // },1000)
  },
  methods: {
    is_class(data) {
      var res = { 'tab-active': this.activeName == data }
      if (this.activeClass) {
        var obj = {}
        obj[this.activeClass] = this.activeName == data
        res = obj
      }
      return res
    },
    tab_change(num, index) {
      this.$emit('change', num)
      var childs = this.$refs['tabs']
      var dom = childs[index]
      var width = dom.offsetWidth + 'px'
      var left = 0
      for (var i = 0; i < childs.length; i++) {
        if (i < index) {
          left += childs[i].offsetWidth + 16
        }
      }
      this.tab_line.width = width
      this.tab_line.left = left + 'px'
    }
  }
}
</script>

<style scoped>
.tabs{
    display: flex;
    font-size:14px;
    position: relative;
    margin-bottom: 14px;
    border-bottom: 1px solid gainsboro
  }

  .tab-phone{
    padding: 8px 16px;
    margin-right: 16px;
    cursor: pointer;
  }
  .tab-active{
    color: #2d8cf0;
  }
  .tab-line{
    position: absolute;
    bottom: 0;
    height: 2px;
    background: #2d8cf0;
    transition: left 0.1s
  }
</style>

