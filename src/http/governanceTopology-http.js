import { get, post, put, del, axiosDel } from '@/http/base-http/base-http'
import { static_name } from '@/utils'

// 获取服务信息
export const get_graph =
(params) => get(`/${static_name.cy_path}/api/namespaces/graph`, params)

// 获取health
export const get_health =
(namespace, p) => get(`/${static_name.cy_path}/api/namespaces/${namespace}/health`, p)

// 获取namespaces
export const get_namespaces =
() => get(`/${static_name.cy_path}/api/namespaces`)
