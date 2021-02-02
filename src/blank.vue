<template>
  <div style="width:100%;height:100%" v-loading="loading" element-loading-text="系统跳转中"></div>
</template>

<script>
import * as user_http from '~/http/user-http/user-http'
export default {
  data() {
    return {
      loading: true
    }
  },
  created() {
    var data = {}
    for (var i in this.$route.query) {
      data[i] = this.$route.query[i]
    }
    console.log(data)
    localStorage.setItem('projectid', JSON.stringify(data.projectid))
    localStorage.setItem('token', JSON.stringify(data.Authorization))
    localStorage.setItem('user_info', JSON.stringify(data))
    this.$store.commit('set_user_info', data)
    this.$store.commit('set_api_header', {
      Authorization: JSON.stringify(data.Authorization)
    })
    localStorage.setItem('api_header', JSON.stringify(data))

    localStorage.setItem('currentName', data.username)
    localStorage.setItem('userType', data.userType)
    console.log('jinlaiel')
    setTimeout(() => {
      console.log(this, 'this')
      this.$store.dispatch('getWeedApp').then((res) => {
        this.$handle_http_back(res, true, false).then((data) => {
        })
      }).catch(() => {
      })
    }, 1000)
  }
}
</script>

<style>

</style>