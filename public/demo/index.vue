<template>
  <div class="myPadding">
    <el-button @click="open">打开弹框</el-button>
    <Dialog ref="Dialog"/>
  </div>
</template>

<script>
import Dialog from './handle/dialog'
export default {
  data(){
     return {
       search_msg:'',
       input:'',
       tableData:[{title1:'xxxxxx',title2:'xxxxx',title3:'xxxxx'},{title1:'xxxx',title2:'xxxxx',title3:'xxxxx'}],
       title:[
        {label:'应用系统编号',prop:'title1',isLink:true},
        {label:'应用系统名称',prop:'title2'},
        {label:'应用系统说明',prop:'title2'},
        {label:'应用系统事权单位代码',prop:'title2',width:100},
        {label:'应用系统管理单位代码',prop:'title2',width:100},
        {label:'应用系统承建单位名称',prop:'title2',width:100},
        {label:'应用系统运维单位名称',prop:'title2',width:100},
        {label:'应用系统分类',prop:'title2'},
        {label:'应用来源系统种类',prop:'title2',width:100},
        {label:'应用获取方式',prop:'title2'},
        {label:'应用系统认证级别',prop:'title2',width:100},
        {label:'系统在用标识',prop:'title3'},
        {label:'系统架构类型',prop:'title2'},
        {label:'应用系统访问地址',prop:'title2'},
        {label:'业务使用场景代码',prop:'title2',width:100},
       ],
     }
  },
  components:{
    Dialog
  },
  methods:{
    open(){
      this.open_dialog('Dialog','传入数据')
    }
  }
}
</script>

<style scoped lang="scss">
.el-input{
  margin-right:15px;
}
.word{
  color:#fff;
  margin-right:80px;
}
</style>