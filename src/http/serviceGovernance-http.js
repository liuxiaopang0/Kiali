import { get, post, put, del, axiosDel } from '@/http/base-http/base-http'
import Qs from 'qs'
import { static_name } from '@/utils'
import axios from 'axios'

export const get_weed_app = // 判断用户是否开通了统一存储管理功能
() => get(`/${static_name.api_path}/seaweedfs-api/api/weed/app`)

export const post_weed_app = // 同步主账号的appId到weed的app_info
(p) => post(`/${static_name.api_path}/seaweedfs-api/api/weed/app`, p)

export const get_users = // 获取子账户
(page_num, page_size, user_name, main_user_id) => get(`/${static_name.api_path}/api/ram/users?page_num=${page_num}&page_size=${page_size}&user_name=${user_name}&main_user_id=${main_user_id}`)

export const get_users_sub = // 获取开通子账户信息
() => get(`/${static_name.api_path}/seaweedfs-api/api/weed/app/sub`)

export const post_subapp = // admin给主账号开通，或是主账号给子账号开通存储管理功能
(p) => post(`/${static_name.api_path}/seaweedfs-api/api/weed/app/subapp`, p)

export const post_reset = // 主账号重置自己的appId
(p) => post(`/${static_name.api_path}/seaweedfs-api/api/weed/app/reset`, p)

export const del_sub = // 删除
(p) => axiosDel(`/${static_name.api_path}/seaweedfs-api/api/weed/app/sub`, p)

// export const del_sub = // 删除
// (p) => axios({
//   method: 'delete',
//   url: `${static_name.api_path}/seaweedfs-api/api/weed/app/sub`,
//   data: p
// })
