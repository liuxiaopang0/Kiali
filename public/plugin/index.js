
import Qs from 'qs'
export default {
  install: function(Vue, options) { //
    const static_name = Vue.prototype.pageConfig
    Vue.prototype.$table_select_repeat = function(serverSelected, tableList, dom, type, idKey) { // 列表勾选项复现
      var select_table = JSON.stringify(serverSelected)
      select_table = JSON.parse(select_table)
      var key = 'id'
      if (idKey) {
        key = idKey
      }
      setTimeout(() => {
        for (var item of select_table) {
          for (var ite of tableList) {
            var old = get_val(ite, key)
            var _new = get_val(item, key)
            if (old == _new) {
              this.$refs[dom].toggleRowSelection(ite, true)
            } else {
              if (type != 'list') {
                this.$refs[dom].toggleRowSelection(ite, false)
              }
            }
          }
        }
      })
      function get_val(data, key) {
        var keys = key.split('.')
        var val = JSON.stringify(data),
          val = JSON.parse(val)
        var res = ''
        for (var k of keys) {
          val = val[k]
        }
        if (JSON.stringify(val) !== JSON.stringify(data)) {
          res = val
        }
        return val
      }
    }
    Vue.prototype.$clone = function(obj) {
      var _toString = Object.prototype.toString
      // null, undefined, non-object, function
      if (!obj || typeof obj !== 'object') {
        return obj
      }
      // DOM Node
      if (obj.nodeType && 'cloneNode' in obj) {
        return obj.cloneNode(true)
      }
      // Date
      if (_toString.call(obj) === '[object Date]') {
        return new Date(obj.getTime())
      }
      // RegExp
      if (_toString.call(obj) === '[object RegExp]') {
        var flags = []
        if (obj.global) { flags.push('g') }
        if (obj.multiline) { flags.push('m') }
        if (obj.ignoreCase) { flags.push('i') }

        return new RegExp(obj.source, flags.join(''))
      }
      var result = Array.isArray(obj) ? []
        : obj.constructor ? new obj.constructor() : {}

      for (var key in obj) {
        result[key] = this.$clone(obj[key])
      }
      return result
    }
    Vue.directive('ToOther', {
      bind: function(el, binding, vnode) {
        el.onclick = function() {
          var api_header = JSON.parse(localStorage.getItem('api_header'))
          var path_name = ''
          if (typeof (binding.value) === 'string') {
            path_name = binding.value
          } else if (typeof (binding.value) === 'object') {
            path_name = binding.value.name
            var api_header = JSON.parse(localStorage.getItem('api_header'))
            api_header.workspaceId = binding.value.spaceId
            localStorage.setItem('api_header', JSON.stringify(api_header))
          }
          var path = static_name.all_path.filter((item) => item.name === path_name)[0].path + '?' + Qs.stringify(api_header) + '&app=' + path_name
          window.open(path, '_blank')
        }
      }
    })
    Vue.prototype.$handle_http_back = (res, isOk, isErr, msg) => { // 返回结果处理函数,res数据，isok = true不显示成功提示fasle显示，isErr = true,不显示错误提示false显示，elm暂时不用
      return new Promise((resolve, reject) => {
        if (res.status_code == 1) {
          if (!isOk) {
            setTimeout(() => {
              Vue.prototype.$message({
                customClass: 'customClass',
                type: 'success',
                duration: 3000,
                message: msg || res.status_mes
              })
            })
          }
          resolve(res)
        } else {
          if (!isErr) {
            setTimeout(() => {
              Vue.prototype.$message({
                type: 'error',
                duration: 3000,
                message: res.status_mes
              })
            })
          }
          reject(res)
        }
      })
    }
    Vue.prototype.$sugon_alert = function(data = { type: '', msg: '' }, fn) {
      var dialog_dom = document.createElement('div')
      dialog_dom.className = 'sugon-dialog'
      var dialog_box_out = document.createElement('div')
      dialog_box_out.style.position = 'relative'
      var dialog_box = document.createElement('div')
      dialog_box.className = 'sugon-dialog-box'
      dialog_box.style.width = '500px'
      dialog_box_out.appendChild(dialog_box)
      var dialog_header = document.createElement('div')
      dialog_header.className = 'sugon-dialog-header'
      dialog_header.innerText = '提示'
      var dialog_header_del = document.createElement('i')
      dialog_header_del.className = 'el-icon-close icon-cancle'
      dialog_header_del.style.cursor = 'pointer'
      dialog_header.appendChild(dialog_header_del)
      dialog_box.appendChild(dialog_header)
      var dialog_content = document.createElement('div')
      dialog_content.className = 'sugon-dialog-content'
      var dialog_confirm = document.createElement('div')
      dialog_confirm.className = 'sugon-confirm'
      var dialog_confirm_i = document.createElement('i')
      dialog_confirm_i.className = 'el-icon-warning'
      var dialog_confirm_span = document.createElement('span')
      dialog_confirm_span.innerText = data.msg
      dialog_confirm_span.className = 'sugon_alert_msg'
      dialog_confirm.appendChild(dialog_confirm_i)
      dialog_confirm.appendChild(dialog_confirm_span)
      dialog_content.appendChild(dialog_confirm)
      dialog_box.appendChild(dialog_content)
      var dialog_footer = document.createElement('div')
      dialog_footer.className = 'sugon-dialog-footer'
      dialog_footer.style.padding = '16px 16px'
      var div = document.createElement('div')
      var btn_box = document.createElement('div')
      btn_box.style = 'margin-right: 20px'
      var button_ok = document.createElement('button')
      button_ok.className = 'el-button blue sugon_dialog_confirm_btn el-button--primary el-button--mini'
      button_ok.innerHTML = '<span><span>确定</span></span>'

      var button_cancel = document.createElement('button')
      button_cancel.className = `el-button reset sugon_dialog_cancel_btn el-button--primary el-button--mini is-plain`
      button_cancel.innerHTML = '<span>取消</span>'
      dialog_footer.appendChild(div)
      btn_box.appendChild(button_ok)
      btn_box.appendChild(button_cancel)
      dialog_footer.appendChild(btn_box)
      dialog_box.appendChild(dialog_footer)
      dialog_dom.appendChild(dialog_box_out)
      document.body.appendChild(dialog_dom)

      button_cancel.onclick = function() { // 取消事件
        document.body.removeChild(dialog_dom)
      }
      dialog_header_del.onclick = function() { // 取消事件
        document.body.removeChild(dialog_dom)
      }
      var loding_dom = document.createElement('i')
      loding_dom.className = 'el-icon-loading'
      button_ok.onclick = function() { // 确认事件
        button_ok.classList.add('is-loading')
        button_ok.innerHTML = '<span><span>确认中</span></span>'
        button_ok.insertBefore(loding_dom, button_ok.childNodes[0])
        fn({
          close: function() {
            document.body.removeChild(dialog_dom)
          },
          loading_close: function() {
            button_ok.classList.remove('is-loading')
            button_ok.innerHTML = '<span><span>确定</span></span>'
          }
        })
      }
    }
    // 指令
  }
}
