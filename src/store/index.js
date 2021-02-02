import Vue from 'vue'
import Vuex from 'vuex'
import { UserModule } from './user'
import { MenuModule } from './menu'
import { InformationModule } from './information'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  modules: {
    user: UserModule,
    menu: MenuModule,
    information: InformationModule
  }
})

export default store
