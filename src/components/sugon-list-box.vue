<template>
  <div class="sugon-list-box" ref="box">
    <div class="sugon-list-box-content" :style="{width:width}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props:['over_width'],
  data(){
    return{
      width:'100%'
    }
  },
  mounted(){
    this.$nextTick(()=>{
      var old_width = this.$refs['box'].offsetWidth
          this.width = this.over_width?(this.$refs['box'].offsetWidth+this.over_width + 'px'):(this.$refs['box'].offsetWidth+'px')
    })
  }
}
</script>

<style scoped>
.sugon-list-box{
  width: 100%;
  overflow: hidden;
}
.sugon-list-box-content{
  display: flex;
  flex-wrap: wrap;
}
</style>