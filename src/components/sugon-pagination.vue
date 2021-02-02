<template>
  <el-pagination class="pagination" @size-change="handleSizeChange" background @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize" :total="total" :layout="layout">
    <slot>
      <ul class="el-pager">
        <li class="number active">{{currentPage}}</li>
        <li class="number" @click="handlePage(item)" v-for="(item, index) in pager" :key="index">{{item}}</li>
      </ul>
    </slot>
  </el-pagination>
</template>
<script>
export default {
  props: {
    currentPage: {
      type: [String, Number],
      default: 1
    },
    total: {
      type: [String, Number],
      default: 0
    },
    pageSizes: {
      type: Array,
      default:function(){
        return  [10,20,40,50]
      }
    },
    pageSize: {
      type: [String, Number],
      default: 10
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return {
    }
  },
  computed:{
    pager:function(){
      let pager=this.total/this.pageSize
      pager=Math.ceil(pager)//总页数
      if(pager<this.currentPage){
        return []
      }
      let flag=this.currentPage+4
      if(flag>pager){//大于总页数
        let arr=[]
        let total=pager-this.currentPage
        for(let i=1;i<=total;i++){
          arr.push(this.currentPage+i)
        }
        return arr
      }else if(flag<=pager){
        return [this.currentPage+1,this.currentPage+2,this.currentPage+3,this.currentPage+4]
      }
    }
  },
  methods: {
    handlePage(page){
      this.handleCurrentChange(page)
    },
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}

</script>
<style lang="scss" scoped>
.page {
  text-align: center;
  color: #409EFF;
}
.pagination {
  text-align: right;
  width: 100%;
  position: relative;
  top: 10px;
}
</style>