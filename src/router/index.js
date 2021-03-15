import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

import index from '@/page/index'
import Login from '@/page/login/login'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Blank from '@/blank'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/gateway'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/blank',
      name: 'Blank',
      component: Blank
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        {
          path: '/routingRules',
          name: 'RoutingRules',
          component: resolve => require(['@/page/routingRules/index'], resolve)
        },
        {
          path: '/routingRulesDetail/:id/:name',
          name: 'RoutingRulesDetail',
          component: resolve => require(['@/page/routingRules/handle/routingRulesDetail'], resolve)
        },
        {
          path: '/modifyRoutingRules/:id/:name',
          name: 'ModifyRoutingRules',
          component: resolve => require(['@/page/routingRules/handle/modify_routingRules'], resolve)
        },
        {
          path: '/createRoutingRules',
          name: 'createRoutingRules',
          component: resolve => require(['@/page/routingRules/handle/create_routingRules'], resolve)
        },
        {
          path: '/governanceTopology',
          name: 'GovernanceTopology',
          component: resolve => require(['@/page/governanceTopology/index'], resolve)
        },
        {
          path: '/gateway',
          name: 'Gateway',
          component: resolve => require(['@/page/gateway/index'], resolve)
        }
      ]
    }
  ]
})

const whiteRouter = ['/login', '/blank', '/prompt']

router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log(to, localStorage.getItem('token'), from.path)
  if (process.env.NODE_ENV === 'production' && to.path === '/login') {
    const static_name = Vue.prototype.pageConfig
    var path_name = '统一登录'
    var current_herf = window.location.href.split('#')[0]
    var app_name = static_name.all_path.filter((item) => item.path.includes(current_herf))[0].name
    var path = static_name.all_path.filter((item) => item.name === path_name)[0].path.split('#')[0] + '#/login?app=' + app_name
    window.open(path, '_self')
    return
  }
  if (localStorage.getItem('token')) {
    if (to.matched.length === 0) { // 如果未匹配到路由
      from.path ? next({ path: from.path }) : next('/gateway') // 如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
    } else {
      next() // 如果匹配到正确跳转
    }
  } else {
    if (whiteRouter.indexOf(to.path) !== -1) { // 当to.path == '/login' 的时候，存在，执行next(),跳到login页面,不触发beforeEach
      next() // 指向(进入)to钩子--进入下一个页面,to.path == '/login'
    } else {
      next('/login') // 发生路由指向变化，触发beforeEach ---> to.path == '/login'
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
export default router
