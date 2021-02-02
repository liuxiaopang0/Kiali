<template>
  <div class="sugon-dialog" v-if="isShow">
    <div style="position:relative;">
      <div class="sugon-dialog-box" :style="{width:box_width}">
        <div class="sugon-dialog-header" :style="header_style">
          {{title}}
          <i class="el-icon-close cancle" style="cursor:pointer" @click="cancel" v-if="!noCancle"></i>
        </div>
        <div class="sugon-dialog-content">
          <slot ref="sugon_dialog"></slot>
        </div>
        <div class="sugon-dialog-footer" :style="footer_style">
          <div></div>
          <div style="margin-right: 20px;" v-if="buttonMsg == '删除中'">
            <Button type="error" :loading="confirm_loading" @click.native="confirm" :disabled="isDisabled" class="blue">
              <span v-if="!confirm_loading">确定</span>
              <span v-else>{{ buttonMsg }}</span>
            </Button>
            <Button @click.native="cancel" class="reset" v-if="!noCancle">取消</Button>
          </div>
          <div style="margin-right: 20px;" v-else>
            <el-button type="primary" :loading="confirm_loading" @click.native="confirm" :disabled="isDisabled" class="blue">
              <span v-if="!confirm_loading">确定</span>
              <span v-else>{{ buttonMsg?buttonMsg:'确定中...' }}</span>
            </el-button>
            <el-button @click.native="cancel" class="reset" v-if="!noCancle">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** 说明
  // 头部可配置项
  headerConfig={
    background:'',
    padding:'12px 16px 16px 16px',
    fontSize:'18px',
    color:'#333',
    fontWeight:'400',
  }
  尾部可配置项
  footerConfig={
    background:'',
    padding:'12px 16px 16px 16px',
    textAlign: 'center'
  }

  传入表单对象 form

  eg:
  <sugon-dialog :isShow.sync="test" @confirm="dialogTest" ref="testDialog" title="我是头部" :form="testObj">
    我是要一个小测试
  </sugon-dialog>

  数据处理函数，每个参数为必填。
  参数1，传入返回值，参数2，是否需要正确信息提示，参数3是否需要错误信息提示，参数4弹框的对象。
  then里面处理状态正确的，catch处理状态错误的。
  this.$handle_http_back(data,false,true,this.$refs['testDialog']).then((res)=>{
    this.test = false;
    console.log(res);
    console.log(this.testObj);
  }).catch((err)=>{
    console.log(err)
  })
**/
export default {
  props: ['width', 'headerConfig', 'footerConfig', 'isShow', 'title', 'form', 'dom', 'noLoading', 'isDisabled', 'buttonMsg', 'noCancle'],
  data() {
    return {
      confirm_loading: false
    }
  },
  watch: {
    'isShow': function(_new, _old) {
      if (_new) {
        this.confirm_loading = false
        if (this.form) {
          this.$clearObj(this.form)
        }
      }
    }
  },
  computed: {
    box_width() {
      var res = 0
      if (this.width) {
        res = this.width
      } else {
        res = 500
      }
      return res + 'px'
    },
    header_style() {
      var config = {
        background: '#EBEEF5',
        padding: '12px 16px 12px 16px',
        fontSize: '18px',
        color: '#333',
        textAlign: 'center'
      }
      if (this.headerConfig) {
        for (var key in this.headerConfig) {
          this.config[key] = this.headerConfig[key]
        }
      }
      return config
    },
    footer_style() {
      var config = {
        background: '',
        padding: '12px 16px 16px 16px'
      }
      if (this.footerConfig) {
        for (var key in this.footerConfig) {
          this.config[key] = this.footerConfig[key]
        }
      }
      return config
    }
  },
  methods: {
    confirm() {
      if (this.dom) {
        var a = this.dom()
        a.validate((valid) => {
          if (valid) {
            this.confirm_loading = true
            this.$emit('confirm', true)
          }
        })
      } else {
        var validate = true
        const dom = this.$children
        dom.filter(v => v.rules)
          .map(item => item.validate((state) => {
            if (!state) {
              validate = false
            }
          }))
        if (!validate) return
        if (!this.noLoading) {
          this.confirm_loading = true
        }
        var _this = this
        this.$emit('confirm', {
          status: true,
          close: function() {
            _this.confirm_loading = false
          }
        })
      }
    },
    cancel() {
      this.$emit('close', false)
      this.$emit('update:isShow', false)
    }
  }
}
</script>

<style scoped>
  .sugon-dialog{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    background: rgba(1,1,1, 0.7);
    z-index: 2003;
  }
  .sugon-dialog-box{
    background: white;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 120px;
    display: inline-block;
  }
  .sugon-dialog-header{
    overflow: hidden
  }
  .sugon-dialog-footer{
    display: flex;
    justify-content: space-between;
    align-items:center;
    border-top: 1px solid #e8eaec;
  }
  .cancle{
    float: right;
  }
  .el-button--primary:hover{
    background: #3F8BEE;
    color: #ffffff;
    opacity: 1;
  }
  .el-button--small{
    border-radius: 2px;
  }
  .el-button+.el-button{
    margin-left: 4px;
  }
</style>
