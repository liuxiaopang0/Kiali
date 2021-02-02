<template>
    <div class="form-box">
        <div class="form-box-title-2"  v-if="type == 'row' && !noLabel" :style="labelStyle">
            <p>{{title}}</p>
        </div>
        <div class="form-box-title" :style="labelStyle" v-else-if="!type && !noLabel">
            <p>{{title}}</p>
        </div>
        <div class="form-box-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
  props: ['title', 'type', 'labelStyle', 'noLabel']
}
</script>
<style scoped>
    .form-box{
        width: 100%;
        display: flex;
        margin-bottom: 14px;

    }
    .form-box-title{
        width: 100px;
        text-align: center;
        background: #f2f2f2;
        color: #8e8a8a;
        position: relative;
    }
    .form-box-title-2{
        width: 80px;
        text-align: right;
        background: #f2f2f2;
        color: #8e8a8a;
        padding-top: 20px;
        padding-right:4px;
    }
    .form-box-title p{
      position: absolute;
      width: 100px;
      top: 40%;
      margin: 0 auto;
      top: 50%;
      transform: translateY(-50%);
    }
    .form-box-content{
        flex: 1;
        background: #fafafa;
        padding: 14px;
    }
</style>
