import { get, post, put, del } from '@/http/base-http/base-http'
import Qs from 'qs'
import { static_name } from '@/utils'

export const get_space_list = // 获取空间列表
() => get(`/${static_name.api_path}/scheduler/workspace/list`)

/* 应用分区列表*/
export const get_application_available =
 (cluster) => get(`/${static_name.api_path}/kubeops-api/api/kubeoperator/namespace/available?cluster=${cluster}`)

/* 集群列表*/
export const get_clusters =
  (page_num, page_size, item_name) => get(`/${static_name.api_path}/kubeops-api/api/kubeoperator/clusters?page_num=${page_num}&page_size=${page_size}&item_name=${item_name}`)
