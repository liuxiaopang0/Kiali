<template>
  <div style="width:100%;height:100%" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.9)" element-loading-text="页面重载中"></div>
</template>

<script>
export default {
  data(){
    return{
      loading:true
    }
  },
  created(){
    setTimeout(()=>{
      this.$router.push(sessionStorage.getItem('last_url'))
    },1000)
  }
}
</script>

<style>

</style>