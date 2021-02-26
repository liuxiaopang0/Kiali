// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/main.css'
// import './assets/css/page.css'
// import './assets/css/element.css'
import './assets/styles/main.scss'
import './assets/iconfont/iconfont.css'
import 'vue-slider-component/theme/default.css'
import axios from 'axios'
import './interceptor'
import myPlugin from './my-plugin.js'
import store from './store'
import * as custom from '~/filter'
import publicPlugin from '~/plugin'
import VueClipboard from 'vue-clipboard2'
import infiniteScroll from 'vue-infinite-scroll'
import cytoscape from 'cytoscape'

Vue.prototype.$cytoscape = cytoscape

Vue.use(infiniteScroll)
Vue.use(VueClipboard)
Vue.prototype.$axios = axios
Object.keys(custom).forEach((key) => {
  Vue.filter(key, custom[key])
})
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })

window.addEventListener('storage', function(e) {
  if (e.key === 'token' && !window.location.href.includes('login')) {
    window.location.reload()
  }
})
var debounce_timer = null
Vue.prototype.$debounce = function(fn) {
  // 定时器，用来 setTimeout
// 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return (function() {
    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments
    clearTimeout(debounce_timer)
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    debounce_timer = setTimeout(function() {
      fn.apply(context, args)
    }, 50)
  }())
}
// 全局混入
Vue.mixin({
  data() {
    return {
      api_header: {}
    }
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.api_header = JSON.parse(localStorage.getItem('api_header')) ? JSON.parse(localStorage.getItem('api_header')) : {}
    })
  },
  methods: {
    unitConverter() { // 数据转换
      // 此处为防止字符串形式的数值进来，因为toFixed方法只能用于数值型数
      num = Number(num)
      if (Math.abs(num) > 100000000) {
        return (num / 100000000).toFixed(2) + '亿'
      } else if (Math.abs(num) > 10000) {
        return (num / 10000).toFixed(2) + '万'
      } else {
        return num.toFixed(2)
      }
    },
    table_scroll() { // 滚动条中间
      if (this.$refs['tableList']) {
        var width = this.$refs['tableList'].bodyWrapper.scrollWidth - this.$refs['tableList'].bodyWrapper.clientWidth
        this.$refs['tableList'].bodyWrapper.scrollLeft = width / 2
      }
    },
    table_scroll_left() { // 滚动条左边
      if (this.$refs['tableList']) {
        this.$refs['tableList'].bodyWrapper.scrollLeft = 0
      }
    },
    table_scroll_right() { // 滚动条右边
      if (this.$refs['tableList']) {
        var width = this.$refs['tableList'].bodyWrapper.scrollWidth - this.$refs['tableList'].bodyWrapper.clientWidth
        this.$refs['tableList'].bodyWrapper.scrollLeft = width
      }
    },
    messageBox(type, data, duration = 3000) {
      this.$message[type]({
        showClose: true,
        message: data,
        duration: duration
      })
    },
    open_dialog(name, data) { // 打开弹框
      this.$nextTick(() => {
        this.$refs[name].open_dialog(data)
      })
    },
    // 表单重置
    resetForm(formN) {
      if (formN) {
        formN.resetFields()
      }
    }
  }
})
var xhr = new XMLHttpRequest() // XMLHttpRequest对象用于在后台与服务器交换数据
xhr.open('GET', './static/pageConfig.json', true)
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) { // readyState == 4说明请求已完成
    var data = JSON.parse(xhr.responseText)
    for (var item of data.all_path) {
      if (item.path.split(':')[0] === 'IP') {
        item.path = data.IP + item.path.split('IP')[1]
      }
    }
    store.commit('set_page_config', data)
    Vue.prototype.pageConfig = data
    Vue.use(myPlugin)
    Vue.use(publicPlugin)
    new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>'
    })
  }
}
xhr.send()
