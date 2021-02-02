
// var url = `http://133.50.0.15`
var url = window.location.protocol + '//' + window.location.hostname
export default {
  all_path: [
    {
      name: '轩辕大数据',
      path: `${url}:9080/#/blank`
    },
    {
      name: '工作空间配置',
      path: `${url}:9081/#/blank`
    },
    {
      name: '运维中心',
      path: `${url}:9083/#/blank`
    },
    {
      name: '数据资源目录',
      path: `${url}:9084/#/blank`
    },
    {
      name: '元数据管理',
      path: `${url}:9085/#/blank`
    },
    {
      name: '数据开发',
      path: `${url}:9082/#/blank`
    },
    {
      name: '服务资源管理',
      path: `${url}:9086/#/blank`
    }
  ]
}
