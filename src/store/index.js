import Vue from 'vue'
import Vuex from 'vuex'
import { UserModule } from './user'
import { MenuModule } from './menu'
import { InformationModule } from './information'
import { GovernanceTopology } from './governanceTopology'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  modules: {
    user: UserModule,
    menu: MenuModule,
    information: InformationModule,
    governanceTopology: GovernanceTopology
  }
})

export default store
