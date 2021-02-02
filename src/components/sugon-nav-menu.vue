<template>
<div class="sugon_nav_menu_comp">
  <span class="sugon_nav_menue_span" :class="drawer?'active_span':''" @click="drawer = true">
    <i class="el-icon-menu"></i>
  </span>
  <el-drawer
      :visible.sync="drawer"
    direction="ltr" 
    :withHeader="false" size="250px" 
    :modal="false"
    :modal-append-to-body="false"
    custom-class="sugon_nav_menue">
    <ul class="ul_sty">
      <li class="li_sty" @click="drawer=false" v-ToOther="item.name" v-for="item in menuList" :key="item.id" >
        <!-- <i class="icon icon_sty" :class="item.icon?item.icon:'el-icon-s-tools'"></i> -->
        <img :src="item.imgUrl" />
        {{item.name}}
      </li>
    </ul>
  </el-drawer>
  <div class="span_modal" v-show="drawer" @click="drawer=false"></div>
</div>
  
  
</template>
<script>
export default {
  props: {
    menuList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      drawer: false
    }
  }
}
</script>
<style lang="scss">
.sugon_nav_menue{
  top:48px !important;
  .el-drawer__header{
    display: none;
  }
}
.sugon_nav_menu_comp{
  .v-modal{
    opacity: 0;
  }
}
</style>
<style lang="scss" scoped>
.span_modal{
  position: fixed;
  width: 48px;
  height: 48px;
  top: 0;
  left: 0;
  z-index: 9999;
  background: transparent;
  cursor: pointer;
}
.active_span{
  background: cornflowerblue;
}
.sugon_nav_menue{
  .ul_sty{
    margin-top: 20px;
    .li_sty{
      height: 40px;
      padding-left: 14px;
      padding-right: 10px;
      cursor: pointer;
      color:#FEFEFE;
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      &:hover{
      }
      .icon_sty{
        margin-right: 5px;
      }
      img{
        width:24px;
        height: 24px;
        margin-right: 5px;
      }
    }
  }
}
</style>