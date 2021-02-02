<template>
  <ul class="item">
    <slot></slot>
  </ul>
</template>
<script>
export default {

  props: {
    item: Object
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
.item{
  //border: 1px solid lightblue;
 // padding: 20px 0;
}
</style>