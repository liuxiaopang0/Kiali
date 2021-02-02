import SugonListBox from './components/sugon-list-box'
import SugonDialog from './components/sugon-dialog'
import SugonOption from './components/sugon-option'
import SugonOptionBox from './components/sugon-option-box'
import SugonMenu from './components/sugon-menu'
import SugonNavMenu from './components/sugon-nav-menu'
import SugonDeleteDialog from './components/sugon-delete-dialog.vue'
import SugonSelectBlock from './components/sugon-select-block.vue'
export default {
  install: function (Vue, options) {//
    // 公用组件
    Vue.component('SugonListBox', SugonListBox)
    Vue.component('SugonDialog', SugonDialog)
    Vue.component('SugonOption', SugonOption)
    Vue.component('SugonOptionBox', SugonOptionBox)
    Vue.component('SugonMenu', SugonMenu)
    Vue.component('SugonNavMenu', SugonNavMenu)
    Vue.component('SugonDeleteDialog', SugonDeleteDialog)
    Vue.component('SugonSelectBlock', SugonSelectBlock)
    //指令
  }
}