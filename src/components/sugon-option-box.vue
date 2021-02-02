<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    props:['isTitle','labelStyle','datas','noLoading'],
    provide() {
       return {
          config:this
       }
    },
    data(){
        return{
            old_msg:'',
            option_state:true
        }
    },
    watch:{
        datas:function(_new,old){
            this.option_state = this.isObjEqual(_new,this.old_msg)
            this.option_init(this.option_state)
        }
    },
    created(){
        if(this.datas == undefined) return
        this.old_msg = JSON.stringify(this.datas);
        this.old_msg =JSON.parse(this.old_msg);
    },
    mounted(){
        if(this.datas == undefined) return
        this.option_init(this.option_state)
    },
    methods:{
        option_init(state){
            this.$children.filter((item)=> item.is_option).map((item,index)=>{
                item.noMsg = state
            })
        },
        isObjEqual(o1,o2){
            var props1 = JSON.stringify(o1);
            var props2 = JSON.stringify(o2);
            var res = false;
            if(props1 == props2){
                res = true
            }
            return res
        }
    }
}
</script>
<style scoped>

</style>