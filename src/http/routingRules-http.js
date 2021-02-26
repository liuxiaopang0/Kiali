import { get, post, put, del, axiosDel } from '@/http/base-http/base-http'
import { static_name } from '@/utils'

// 获取服务治理路由规则列表
export const get_routerRuleList =
(cluster_name, namespace) => get(`/${static_name.api_path}/kubeops-api/api/istio/router-rule/list?cluster_name=${cluster_name}&namespace=${namespace}`)

// 删除服务治理路由规则
export const del_routerRule =
(id) => del(`/${static_name.api_path}/kubeops-api/api/istio/router-rule?id=${id}`)

// 获取服务治理路由规则详情
export const get_routerRule_detail =
(id) => get(`/${static_name.api_path}/kubeops-api/api/istio/router-rule?id=${id}`)

// 部署服务治理路由规则
export const deploy_routerRule =
(id) => post(`/${static_name.api_path}/kubeops-api/api/istio/router-rule/deploy?id=${id}`)

// 获取具体服务治理路由规则
export const get_routerRule =
(id) => get(`/${static_name.api_path}/kubeops-api/api/istio/router-rule?id=${id}`)

// 创建服务治理路由规则
export const post_routerRule =
(p) => post(`/${static_name.api_path}/kubeops-api/api/istio/router-rule`, p)

// 更新服务治理路由规则
export const put_routerRule =
(p) => put(`/${static_name.api_path}/kubeops-api/api/istio/router-rule`, p)

// 获取服务列表
export const get_service =
(page_num, page_size, cluster_name, namespace, instance_id = '', name = '') => get(`/${static_name.api_path}/kubeops-api/api/app/services?page_num=${page_num}&page_size=${page_size}&cluster_name=${cluster_name}&namespace=${namespace}&instance_id=${instance_id}&name=${name}`)

/* 服务详情*/
export const get_services_detail =
(service_id) => get(`/${static_name.api_path}/kubeops-api/api/app/services/${service_id}`)
