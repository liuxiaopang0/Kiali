import * as user_http from '~/http/user-http/user-http'

export const UserModule = {
  state: {
    user_info: '',
    api_header: '',
    role_info: '',
    page_config: '' // page_config内容
  },
  mutations: {
    set_role_info(state, data) {
      state.role_info = data
    },
    set_token(state, data) {
      state.token = data
    },
    set_user_info(state, data) {
      state.token = data.access_token
      state.user_info = data
      localStorage.setItem('user_info', JSON.stringify(data))
    },
    set_api_header(state, data) {
      state.api_header = data
      localStorage.setItem('api_header', JSON.stringify(data))
    },
    set_page_config(state, data) {
      state.page_config = data
    },
    delete_user(state) {
      state.token = ''
      state.user_info = ''
      localStorage.removeItem('api_header')
      localStorage.removeItem('token')
      localStorage.removeItem('user_info')
    }
  },
  actions: {
    async login(context, data) {
      context.commit('delete_user')
      return new Promise((resolve, reject) => {
        user_http.login(data).then((res) => {
          localStorage.setItem('projectid', res.data.projectId)
          localStorage.setItem('token', 'Bearer ' + res.data.access_token)
          context.commit('set_user_info', res.data)
          context.commit('set_api_header', {
            Authorization: 'Bearer ' + res.data.access_token
          })
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    exit(context) {
      return new Promise((resolve, reject) => {
        var api_header = JSON.parse(localStorage.getItem('api_header'))
        user_http.exit().then((res) => {
          context.commit('delete_user')
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  },
  getters: {}
}
