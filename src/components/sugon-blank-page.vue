<template>
    <div>
        <!-- <sugon-header style="position:relative"></sugon-header> -->
        <div class="page-content">
            <slot></slot>
        </div>
        <!-- <sugon-footer></sugon-footer> -->
    </div>
</template>

<script>
/*
去除导航栏的空白页
*/
// import SugonHeader from '@/components/layout/Topbar.vue'
// import SugonFooter from '@/components/component/sugon-footer'
export default {
  components: {
    // SugonHeader,
    // SugonFooter
  }
}
</script>
<style scoped>
.page-content{
    min-width: 700px;
}
</style>