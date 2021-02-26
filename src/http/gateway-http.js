import { get, post, put, del, axiosDel } from '@/http/base-http/base-http'
import { static_name } from '@/utils'

// 获取服务治理网关列表数据
export const get_gatewayList =
(cluster_name, namespace) => get(`/${static_name.api_path}/kubeops-api/api/istio/gateway/list?cluster_name=${cluster_name}&namespace=${namespace}`)

// 获取服务治理网关详情
export const get_gatewayDetails =
(id) => get(`/${static_name.api_path}/kubeops-api/api/istio/gateway?id=${id}`)

// 删除服务治理网关
export const del_gateway =
(id) => del(`/${static_name.api_path}/kubeops-api/api/istio/gateway?id=${id}`)

// 部署服务治理网关
export const deploy_gateway =
(id) => post(`/${static_name.api_path}/kubeops-api/api/istio/gateway/deploy_gateway?id=${id}`)

// 获取服务网格出口
export const get_service_grid_exit =
(cluster_name) => get(`/${static_name.api_path}/kubeops-api/api/istio/gateway/service_grid_exit?cluster_name=${cluster_name}`)

// 创建服务治理网关
export const post_gateway =
(p) => post(`/${static_name.api_path}/kubeops-api/api/istio/gateway`, p)

// 更新服务治理网关
export const put_gateway =
(p) => put(`/${static_name.api_path}/kubeops-api/api/istio/gateway`, p)
