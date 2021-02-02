<template>
    <div>
        <div class="tooltip" v-if="type == 'click'">
            <div class="slot-box" ref="msg">
                <div class="shanjiao-box" :style="{visibility:show_dom_click}">
                    <i class="shanjiao"></i>
                </div>
                <slot></slot>
            </div>
            <div class="blank_bg" ref="blank_bg" v-if="this.isShow" @click="hide"></div>
            <div class="msg-content" ref="msg_content" :style="{visibility:show_dom_click}">
                <slot name="content"></slot>
            </div>
        </div>
        <div class="tooltip" v-else>
            <div class="slot-box" ref="msg">
                <div class="shanjiao-box" :style="{visibility:show_dom}">
                    <i class="shanjiao"></i>
                </div>
                <slot></slot>
            </div>
            <div class="msg-content" ref="msg_content" :style="{visibility:show_dom}">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['type','isShow'],
    mounted(){
      this.$nextTick(function () {
            var h = this.$refs['msg_content'].offsetHeight;
            this.$refs['msg_content'].style.height = h -2 + 'px'
            var h2 = this.$refs['msg'].offsetHeight;
            this.$refs['msg_content'].style.top = h2+10 + 'px';
        })  
    },
    data(){
        return{
            is_show:false
        }
    },
    computed:{
        show_dom_click(){
            var res = '';
            if(this.isShow){
                res = 'initial'
            }else{
                res = 'hidden'
            }
            return res
        },
        show_dom(){
            var res = '';
            if(this.is_show){
                res = 'initial'
            }else{
                res = 'hidden'
            }
            return res
        }
    },
    methods:{
        show(){
            this.is_show = true
        },
        hide(){
            if(this.type == 'click'){
                this.$emit('update:isShow',false)
            }else{
                this.is_show = false
            }
        }
    }
}
</script>
<style scoped>
.slot-box{
    display: inline-block;
    position: relative;
}
.shanjiao-box{
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%);
    display: inline-block;
    z-index: 1001;
}
.shanjiao{
    position: relative;
    width: 0;
    height: 0;
    border: 10px solid;
    border-color: transparent transparent #d6d7d8 transparent
}
.shanjiao:after{
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    width: 0;
    height: 0;
    border: 9px solid;
    border-color: transparent transparent white transparent
}
.tooltip{
    position: relative;
}
.msg-content{
    position: absolute;
    background: white;
    right: 0;
    bottom: 0px;
    border: 1px solid #d6d7d8;
    z-index: 1000;
}
.blank_bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: 0;
    z-index: 900;
}
</style>