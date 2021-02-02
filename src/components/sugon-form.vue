<template>
   <div>
     <slot></slot>
   </div>
</template>
<script>
   export default {
     props:['model','rules'],
     provide() {
       return {
          form:this
       }
     },
     methods:{
        validate(cb) {
        //执行所有的FormItem的方法
          const tasks = this.$children
          .filter(v => v.prop)
          .map(item => item.validate({type:'check_all'}))

          Promise.all(tasks)
          .then((data) =>{
            var status = true
            for(var item of data){
              if(!item){
                status = false
              }
            }
             cb(status)
          })
          .catch(() => cb(false))
        }
     }
   }
</script>
