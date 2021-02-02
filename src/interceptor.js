import axios from 'axios'
import router from '@/router'
import store from './store'
import Vue from 'vue'

axios.interceptors.request.use((config) => {
  if (localStorage.api_header && localStorage.user_info && localStorage.token) {
    var api_header = JSON.parse(localStorage.api_header)
    config.headers.Authorization = api_header ? api_header.Authorization : ''
    config.headers.userId = JSON.parse(localStorage.user_info).userId
    return config
  } else {
    return config
  }
}, (error) => {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  if (response.status === 401 || response.data.msg === '缺少token参数') {
    store.commit('delete_user')
    router.push('/login')
  }
  return response
}, (error) => {
  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        var _url = ''
        var arr = window.location.href.split('#')
        if (arr[1] !== '/') {
          _url = window.location.href
        }
        store.commit('delete_user')
        if (arr[1] === '/') return
        Vue.prototype.$alert(`<strong><i class="el-icon-warning time_out"></i>您已登录超时，请重新登录</strong>`, '会话过期', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          confirmButtonClass: 'time-out-confirm',
          callback: (res) => {
            // store.commit('set_tokenState', 0)
            router.push('/login')
          }
        })
        break
      case 405:
        store.commit('dialog_msg', '客户端请求中的方法被禁止')
        break
      case 400:
        if (error.response.data.error == 'invalid_grant') {
          store.commit('dialog_msg', '密码错误，请重新输入')
        } else if (error.response.data.status_code == 0) {
          store.commit('dialog_msg', error.response.data.status_mes)
        } else {
          store.commit('dialog_msg', '客户端请求的语法错误，服务器无法理解')
        }
        break
      case 404:
        store.commit('dialog_msg', '请求的资源（网页）不存在')
        break
      case 500:
        if (error.response.data.detail == 'Unauthorized') {
          store.commit('dialog_msg', '请检查用户名、密码或域名')
        } else {
          store.commit('dialog_msg', '服务器内部错误，无法完成请求')
        }
        break
      case 502:
        store.commit('dialog_msg', '账号未被激活，请激活后重新登录')
        break
      case 504:
        store.commit('dialog_msg', '网关超时，请稍后登录')
        break
    }
  }
  return Promise.reject(error.response.data)
})

export default axios
