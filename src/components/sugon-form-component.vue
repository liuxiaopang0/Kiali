<template>
    <div class="form-container">
        <div class="form-left">
            <slot></slot>
        </div>
        <!-- <div class="form-right">
            <p style="font-weight:600;padding:10px 20px;border-bottom:1px solid gainsboro">当前配置</p>
            <div class="text-list" v-for="(item,index) of options" :key="index">
                <p style="color:#847f7f">{{item.label}}:</p>
                <p>{{item.value}}</p>
            </div>
        </div> -->
    </div>
</template>
<script>
export default {
    props:['options']
}
</script>
<style scoped>
.form-container{
    width: 100%;
}
.form-left{
    width: 100%;
}
.form-right{
    width: 200px;
    margin-left:14px; 
    padding: 0 5px;
    background: #fafafa;
    margin-bottom: 14px;
}
.text-list{
    display: flex
}
.text-list p{
    padding: 10px 20px;
    flex: 1
}
</style>