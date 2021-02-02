import { get, post, put, del } from '@/http/base-http/base-http'
import Qs from 'qs'
import { static_name } from '@/utils'
import axios from 'axios'

export const login =
(data) => axios({
  method: 'post',
  url: `${static_name.api_path}/oauth/token?${Qs.stringify(data)}`,
  headers: { Authorization: 'Basic c3Vnb25jbXM6MTIzNDU2CiA=' }
})

export const get_weed_app = // 判断用户是否开通了统一存储管理功能
() => get(`/${static_name.api_path}/seaweedfs-api/api/weed/app`)

export const post_weed_app = // 同步主账号的appId到weed的app_info
(p) => post(`/${static_name.api_path}/seaweedfs-api/api/weed/app`, p)

export const get_info_by_token =
(data) => get(`${static_name.api_path}/oauth/user`, data)

export const exit =
(data) => del(`${static_name.api_path}/api/oauth2/logout`, data)

export const get_user_info =
() => get(`${static_name.api_path}/scheduler/osUser/queryOsUserByUuid`)
