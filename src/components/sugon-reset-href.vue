<template>
  <div style="display: inline-block">
    <div class="sugon-reset-href" v-if="!type">
      <i class="el-icon-refresh-right" @click="reset" title="刷新" :class="{'fa-spin':state}"></i>
      <i class="el-icon-plus" title="新建" @click="go_to" v-show="needAdd"></i>
    </div>
    <div class="sugon-reset-href" v-if="type == 'button'">
      <el-button type="primary" @click="reset" title="刷新">
        <i class="el-icon-refresh-right"></i>
      </el-button>
      <el-button type="primary" title="新建" @click="go_to" v-show="needAdd">
        <span>新建</span>
      </el-button>
    </div>
    <div class="sugon-reset-href" v-if="type == 'zone'">
      <i class="el-icon-refresh-right" @click="reset" title="刷新" :class="{'fa-spin':state}"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    'href': {
      type: String
    },
    'state': {
      type: Boolean
    },
    'type': {
      type: String
    },
    'needAdd': {
      type: Boolean,
      default: true
    },
    router_path: {
      type: String,
      default: ''
    }
  },
  methods: {
    go_to() {
      if (this.href) {
        const routeData = this.$router.resolve({
          name: this.href
        })
        window.open(routeData.href, '_blank')
      }
    },
    reset() {
      this.$emit('reset', true)
    }
  }
}
</script>

<style scoped>
.sugon-reset-href{
    display: inline-block;
    font-size: 0;
    /*margin-left:5px;*/
}
.sugon-reset-href > i{
    margin: 0 2px;
    font-size: 12px;
    cursor: pointer;
}
.sugon-reset-href i:hover{
    color: #4694f9
}
</style>
