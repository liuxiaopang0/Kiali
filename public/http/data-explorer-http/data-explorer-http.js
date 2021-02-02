import { get, post, put, del } from '@/http/base-http/base-http'
import Qs from 'qs'
import { static_name } from '@/utils'
import axios from 'axios'

export const login =
(data) => post(`${static_name.api_path}/oauth/anno/login?${Qs.stringify(data)}`)

// 获取字典列表
export const get_dict_Data =
(data) => get(`${static_name.api_path}/data-map/xyDictData/getDictData`, data)

// 获取字典列表map
export const get_dict_Data_map =
(data) => get(`${static_name.api_path}/data-map/xyDictData/getDictDataMap`, data)

// 统计总量信息
export const get_query_count_number =
() => get(`${static_name.api_path}/data-map/app-system/queryCountNumber`)

// 获取来源数据资源列表详情
export const get_details =
(data) => get(`${static_name.api_path}/data-map/app-system/${data}`)

// 获取数据探查列表详情
export const get_table_details =
(data) => get(`${static_name.api_path}/data-map/table/${data.id}`, data)

// 第三步验证重复
export const get_queryRepeat =
(data) => get(`${static_name.api_path}/data-map/table/queryRepeat`, data)

// 删除来源数据资源
export const delete_source_data =
(data) => del(`${static_name.api_path}/data-map/app-system?${Qs.stringify(data)}`)

// 删除表与来源系统关系
export const delete_table_system_relation =
(data) => post(`${static_name.api_path}/data-map/table/delTable?${Qs.stringify(data)}`)

// 删除标准映射探查
export const delete_standard_mapping_probe =
(data) => post(`${static_name.api_path}/data-map/hive/deleteStandardMappingProbe?${Qs.stringify(data)}`)

// 查询来源数据
export const get_source_data =
(data) => post(`${static_name.api_path}/data-map/app-system/page`, data)

// 数据接入探查列表
export const get_access_explore =
(data) => post(`${static_name.api_path}/data-map/table/page`, data)

// 获取命名空间
export const get_schema_table =
(data) => get(`${static_name.api_path}/data-map/table/listSchemaTableInfo`, data)

// 查询行政区域
export const get_city_code =
(data) => get(`${static_name.api_path}/data-map/xyDictData/listCityCode`, data)

// 添加数据接入探查
export const updata_table =
(data) => put(`${static_name.api_path}/data-map/table/updateAppSystemTable`, data)
// export const updata_table =
// (data)=>put(`${static_name.api_path}/data-map/table`,data)

// 添加来源数据
export const save_source_data =
(data) => post(`${static_name.api_path}/data-map/app-system`, data)

// 修改来源数据
export const updata_source_data =
(data) => put(`${static_name.api_path}/data-map/app-system`, data)

// 数据字段探查列表
export const get_field_explore =
(data) => post(`${static_name.api_path}/data-map/table/pageColumn`, data)

// 查询字段列表
export const query_structure_list =
(data) => get(`${static_name.api_path}/data-map/dataExploreExport/queryStructureByTbId`, data)

// 查询标准映射探查
export const get_mapping_probe =
(data) => get(`${static_name.api_path}/data-map/dataExploreExport/queryStandardMappingProbe`, data)

// 执行表字段探查
export const execute_data_explore =
(data) => post(`${static_name.api_path}/data-map/table/field/saveTableColumn`, data)

// 查询字典信息
export const get_dict_list =
(data) => get(`${static_name.api_path}/data-map/datamap-dict-condition/dict-list-paging`, data)

// 查询公安数据元素列表
export const get_ga_element =
(data) => get(`${static_name.api_path}/data-map/dataExploreExport/listGaDataElement`, data)

// 查询网安元素内部标识符
export const get_xy_dic =
(data) => post(`${static_name.api_path}/data-map/xyDictData/getDictItem`, data)

// 修改标准映射探查
export const update_source_data =
(data) => post(`${static_name.api_path}/data-map/dataExploreExport/updateStandardMappingProbe`, data)

// 保存字段探查列表
export const update_field_explore =
(data) => put(`${static_name.api_path}/data-map/table/field/update`, data)

// excel模板下载
export function template_download(data) { // 模板下载
  console.log(`/${static_name.api_path}/data-map/static/template/${data}`, 999)
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `/${static_name.api_path}/data-map/static/template/${data}`, // 请求地址
      // params: data, // 参数
      responseType: 'blob', // 表明返回服务器返回的数据类型
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

// 文件导出
export function ExportList(data) { // 导出数据探查定义表和字段
  return new Promise((resolve, reject) => {
    // axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8'
    axios({
      // method: 'get',
      // url: `/${static_name.api_path}/data-map/dataExploreExport/export`, // 请求地址
      method: 'post',
      url: `/${static_name.api_path}/data-map/excel/exportAppSystem?type=${data.model.type}`,
      // params: data, // 参数
      data: data, // 参数
      headers: { 'content-type': 'application/json;charset=UTF-8' },
      responseType: 'blob' // 表明返回服务器返回的数据类型
      // headers:{
      //   'content-type':'application/json;charset=UTF-8'
      // }
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function template_upload(data) { // 文件上传
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `/${static_name.api_path}/data-map/excel/uploadSystem`, // 请求地址
      data: data, // 参数
      headers: { 'content-type': 'multipart/form-data;charset=UTF-8' }
      // responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
export const queryStandard =
(data) => post(`${static_name.api_path}/data-map/table/queryStandard?${Qs.stringify(data)}`)
