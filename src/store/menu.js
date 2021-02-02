export const MenuModule = {
  state: {
    current_menu: '', // 当前菜单栏选中信息
    current_nav: [], //  当前导航信息
    //  当前一级菜单
    current_first_nav: '',
    dialogMsg: ''
  },
  mutations: {
    set_current_menu(state, data) {
      state.current_menu = data
    },
    set_current_nav(state, data) {
      state.current_nav = data
    },
    set_first_nav(state, data) {
      state.current_first_nav = data
    },
    dialog_msg(state, msg) {
      state.dialogMsg = msg
    }
  },
  actions: {},
  getters: {}
}
