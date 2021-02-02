<template>
    <div class="form-right" :style="{width:width}">
        <p style="font-weight:600;padding:10px 14px;border-bottom:1px solid gainsboro">{{title}}</p>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props:['title','width']
}
</script>
<style scoped>
.form-right{
    width: 200px;
    margin-left:14px; 
    padding: 0 5px;
    background: #fafafa;
    margin-bottom: 14px;
}
</style>