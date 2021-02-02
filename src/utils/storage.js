// 登录用户id
export function setUserId(val) {
  return localStorage.setItem('userId', val)
}

export function getUserId() {
  return localStorage.getItem('userId')
}

export function remUserId() {
  return localStorage.removeItem('userId')
}
// 登录用户组织角色
export function setDomainRole(val) {
  return sessionStorage.setItem('domainRole', val)
}

export function getDomainRole() {
  return sessionStorage.getItem('domainRole')
}

// 登录页验证码显示状态管理
export function setTestWordShow(val) {
  return sessionStorage.setItem('testShow', val)
}

export function getTestWordShow() {
  return sessionStorage.getItem('testShow')
}

export function removeTestWordShow() {
  return sessionStorage.removeItem('testShow')
}

// 登录用户是否是重置密码后的第一次登录状态
export function setIsReset(val) {
  return sessionStorage.setItem('isReset', val)
}

export function getIsReset() {
  return sessionStorage.getItem('isReset')
}

// 当前dcId
export function setDcId(val) {
  return sessionStorage.setItem('dcId', val)
}

export function getDcId() {
  return sessionStorage.getItem('dcId')
}
// 当前项目
export function setProject(val) {
  return localStorage.setItem('currentProjectId', val)
}

export function getProject() {
  return localStorage.getItem('currentProjectId')
}
// 当前项目
export function setDomain(val) {
  return localStorage.setItem('domainId', val)
}

export function getDomain() {
  return localStorage.getItem('domainId')
}
// 列表页信息
export function setPageSize(key, val) {
  return sessionStorage.setItem(key, val)
}
export function getPageSize(key) {
  return parseInt(sessionStorage.getItem(key))
}
// 菜单信息
export function setMenu(obj) {
  return sessionStorage.setItem('menu', JSON.stringify(obj))
}
export function getmenu() {
  return JSON.parse(sessionStorage.getItem('menu'))
}
// 用户信息
export function setUser(obj) {
  return sessionStorage.setItem('userobj', JSON.stringify(obj))
}
export function getUser() {
  return JSON.parse(sessionStorage.getItem('userobj'))
}
// 主页
export function setHome(url) {
  return sessionStorage.setItem('home', url)
}
export function getHome() {
  return sessionStorage.getItem('home')
}
// 列表信息缓存
export function setTable(object) {
  return localStorage.setItem(object.name, JSON.stringify(object.info))
}
export function getTable(name) {
  return JSON.parse(localStorage.getItem(name))
}
export function recoverTable(name) {
  return localStorage.removeItem(name)
}
// 全新创建云主机提示flag
export function setVmCreateTypeTipeKnown() {
  return sessionStorage.setItem('vmCreateTypeTipeKnown', true)
}
export function getVmCreateTypeTipeKnown(name) {
  return sessionStorage.getItem('vmCreateTypeTipeKnown')
}
// 清空localstorage数据
export function clearStorage() {
  remUserId()
  sessionStorage.clear()
}
