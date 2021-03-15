<template>
  <div class="cv-creat-page">
    <div v-loading="start_loading" element-loading-text="数据初始化中" class="creat-page">
      <sugon-form-component>
        <el-form label-width="160px" :model="form_msg" label-position="left" :rules="from_rule" ref="form">
          <sugon-form-box title="基本信息">
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="form_msg.name" style="width:300px"></el-input>
            </el-form-item>
          </sugon-form-box>
          <sugon-form-box title="网关">
            <el-form-item label="访问类型" prop="access_type">
              <el-radio v-model="form_msg.access_type" label="OUTER">外部访问</el-radio>
              <el-radio v-model="form_msg.access_type" label="INNER">集群内部访问</el-radio>
            </el-form-item>
            <template>
            </template>
            <el-form-item label="网关" prop="gateways">
              <el-select v-model="form_msg.gateways" multiple placeholder="请选择网关" style="margin-right:4px;width:300px;">
                <el-option v-for="(option,index) in gatewayItems" :key="'gateway-'+index" :label="option.name" :value="option.name"></el-option>
              </el-select>
              <sugon-reset-href :state="gateway_loading" @reset="getGatewayList" href="Gateway" type="button"></sugon-reset-href>
            </el-form-item>
            <div class="row-layout" v-for="(data,ind) of form_msg.hosts" :key="'hosts-'+ind">
              <el-col :span="24">
                <el-form-item style="width:100%" label="域名解析" :prop="'hosts.' + ind + '.domain'" :rules="{ required: true, message: '请输入域名解析', trigger: 'blur' }">
                  <span slot="label" style="position:relative;">
                    域名解析
                    <el-tooltip class="item" effect="dark" placement="top">
                      <div slot="content">网关的子域名</div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="data.domain" placeholder="" style="margin-right:4px;width:300px;"></el-input>
                  <el-button type="primary" icon="el-icon-plus"  @click="add_node_form()"></el-button>
                  <el-button type="danger" icon="el-icon-delete"  @click="delete_form(index)"></el-button>
                <!-- <i class="el-icon-delete delete-icon" style="color:red;color:red;cursor: pointer;" @click="delete_form(index)"></i> -->
                </el-form-item>
              </el-col>
            </div>
            <el-button v-if="form_msg.hosts.length===0" type="primary" icon="el-icon-plus"  @click="add_node_form()">添加域名解析</el-button>
            <!-- <div style="text-align:center;cursor:pointer" class="add-image-btn border-style" @click="add_node_form()">+添加域名解析</div> -->
          </sugon-form-box>
          <sugon-form-box :type="'title'" v-for="(ele,index_ele) in form_msg.items" :key="'items-'+index_ele">
            <template v-slot:title>
              <div style="position: absolute;width: 100px;top: 40%;margin: 0 auto;top: 50%;transform: translateY(-50%);">
                <span style="display: block">路由</span>
                <div style="display:flex">
                  <el-button type="primary" icon="el-icon-plus"  @click="add_iteme_form()"></el-button>
                  <el-button type="danger" icon="el-icon-delete"  @click="delete_item_form(index_ele)"></el-button>
                </div>
              </div>
            </template>
              <div v-for="(each,index_each) in ele.uris" style="margin-bottom: 10px;border: 1px solid #ccc;padding: 5px;border-radius: 5px;" :key="'uris-'+index_each">
                <el-row>
                  <el-col :span="20">
                    <el-form-item label="路径 url">
                      <el-radio v-model="each.type" label="PREFIX">前缀匹配</el-radio>
                      <el-radio v-model="each.type" label="EXACT">精准匹配</el-radio>
                      <el-radio v-model="each.type" label="REGEX">正则匹配</el-radio>
                    </el-form-item>
                    <el-form-item label :prop="'items.'+index_ele+'.uris.'+index_each+'.path'" :rules="{ required: true, message: '请输入路径url', trigger: 'blur' }">
                      <el-input v-model="each.path" placeholder="" style="margin-right:4px;width:300px;" ></el-input>
                    </el-form-item>
                    <el-form-item label="请求参数">
                      <el-switch v-model="each.requestParameter" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                    <div v-for="(ele,index2) in each.requestParams" :key="'requestParams-'+index2" v-show="each.requestParameter">
                      <el-form-item label required>
                        <el-row :gutter="20">
                          <el-col :span="7">
                            <el-form-item :prop="'items.'+index_ele+'.uris.'+index_each+'.requestParams.' + index2 + '.param_name'" :rules="{ required: true, message: '请输入参数名', trigger: 'blur' }">
                              <el-input v-model="ele.param_name" placeholder="请输入参数名" style="margin-right:4px;width:100%;"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="0.5">:</el-col>
                          <el-col :span="7">
                            <el-form-item :prop="'items.'+index_ele+'.uris.'+index_each+'.requestParams.' + index2 + '.param_value'" :rules="{ required: true, message: '请输入规则', trigger: 'blur' }">
                              <el-input v-model="ele.param_value" placeholder="请输入规则" style="margin-right:4px;width:100%;"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="9.5">
                            <el-button type="primary" icon="el-icon-plus"  @click="add_requestParams_form(index_ele,index_each)"></el-button>
                            <el-button type="danger" icon="el-icon-delete"  @click="delete_requestParams_form(index_ele,index_each,index2)"></el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </div>
                    <el-form-item label="请求头部">
                      <el-switch v-model="each.header" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                    <div v-for="(item,index3) in each.requestHeaders" :key="'requestHeaders-'+index3" v-show="each.header">
                      <el-form-item required>
                        <el-row :gutter="20">
                          <el-col :span="7">
                            <el-form-item :prop="'items.'+index_ele+'.uris.'+index_each+'.requestHeaders.' + index3 + '.header_param'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                              <el-input v-model="item.header_param" placeholder=""  style="margin-right:4px;width:100%;"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="0.5">:</el-col>
                          <el-col :span="7">
                            <el-form-item :prop="'items.'+index_ele+'.uris.'+index_each+'.requestHeaders.' + index3 + '.header_param_value'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                              <el-input v-model="item.header_param_value" placeholder=""  style="margin-right:4px;width:100%;"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="9.5">
                            <el-button type="primary" icon="el-icon-plus"  @click="add_requestHeaders_form(index_ele,index_each)"></el-button>
                            <el-button type="danger" icon="el-icon-delete"  @click="delete_requestHeaders_form(index_ele,index_each,index3)"></el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div style="height:100%">
                      <el-button type="primary" icon="el-icon-plus"  @click="add_uris_form(index_ele)"></el-button>
                          <el-button type="danger" icon="el-icon-delete"  @click="delete_uris_form(index_ele,index3)"></el-button>
                    </div>
                    <!-- <el-button type="primary" icon="el-icon-plus"  @click="add_uris_form()">添加路由</el-button> -->
                  </el-col>
                </el-row>
              </div>
              <div v-for="(each1,index1) in ele.serviceWeights" :key="index1">
                <el-form-item label required>
                  <span slot="label" style="position:relative;">
                    作用服务
                    <el-tooltip class="item" effect="dark" placement="top">
                      <div slot="content">如果选择多个服务 ，请选择同类服务的不同版本。</div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-row :gutter="5">
                    <el-col :span="9">
                      <el-form-item :prop="'items.'+index_ele+'.serviceWeights.'+index1+'.services'" :rules="{ required: true, message: '请选择服务', trigger: 'change' }">
                        <el-select v-model="each1.services"  @change="changeservices(each1.services,index_ele,index1),changeserviceWeights(index_ele,index1)" placeholder="请选择服务" style="width: 100%">
                          <el-option v-for="(item,index4) in serviceWeightsItems"  :key="'serviceWeights-'+index4" :label="item.service_name" :value="item.service_name+','+item.service_id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item :prop="'items.'+index_ele+'.serviceWeights.'+index1+'.service_port'" :rules="{ required: true, message: '请选择端口', trigger: 'change' }">
                        <el-select v-model="each1.service_port" placeholder="请选择端口" style="width: 100%">
                          <el-option v-for="(elee,index5) in each1.portItems"  :key="'serviceWeights-'+index5" :label="elee.target_port" :value="elee.target_port+','+elee.uuid"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" icon="el-icon-plus"  @click="add_serviceWeights_form(index_ele)"></el-button>
                      <el-button style="margin:0" type="danger" icon="el-icon-delete"  @click="delete_serviceWeights_form(index_ele,index1),changeserviceWeights(index_ele,index1)"></el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            <el-form-item label="权重配置">
              <el-switch v-model="ele.configuration" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item v-if="ele.configuration">
              <vue-slider v-model="ele.configurationValue" :dot-options="ele.dotOptions" :process="val => {
                  let arr = []
                  if(val.length>1) {
                    for(let i = 0; i< val.length-1; i++) {
                      arr.push([val[i], val[i+1]])
                    }
                  }
                  return arr
                }" tooltip="none" :min-range="10">
                 <template v-slot:process="{ start, end, style, index }">
                  <div class="vue-slider-process" :style="style">
                    <div :class="[
                      'merge-tooltip',
                      'vue-slider-dot-tooltip-inner',
                      'vue-slider-dot-tooltip-inner-top',
                    ]">{{(ele.serviceWeights[index]['services']).split(',')[0]}}
                      {{ ele.configurationValue[index] }} - {{ ele.configurationValue[index + 1] }}
                    </div>
                  </div>
                </template>
              </vue-slider>
            </el-form-item>
          </sugon-form-box>
        </el-form>
      </sugon-form-component>
      <sugon-form-component-right title="当前配置">
        <sugon-option label="规则名称" :value="form_msg.name"></sugon-option>
        <sugon-option label="访问方式" :isDom="true">
          <span>{{access_type[form_msg.access_type]}}</span>
        </sugon-option>
        <sugon-option label="网关" :isDom="true">
          <p v-show="form_msg.gateways.length<1">--</p>
          <p v-for="(gateway,index_gateways) in form_msg.gateways" :key="index_gateways">{{gateway}}</p>
        </sugon-option>
        <sugon-option label="域名解析" :isDom="true">
          <p v-for="(host,index_host) in form_msg.hosts" :key="index_host">{{host.domain||'--'}}</p>
        </sugon-option>
          <div v-for="(ele,index_ele) in form_msg.items" :key="'items1-'+index_ele" style="margin-bottom: 10px;border: 1px solid #ccc;padding: 5px;border-radius: 5px;">
            <sugon-option :label="`路由${index_ele+1}`" :isDom="true">
              <div v-for="(each,index_each) in ele.uris" style="margin-bottom: 10px;border: 1px solid #ccc;padding: 5px;border-radius: 5px;" :key="'uris-'+index_each">
                <sugon-option label="路径url" :value="each.path" :isDom="true">
                  <div>{{type[each.type]||'--'}}</div>
                  <div>{{each.path||'--'}}</div>
                </sugon-option>
                <sugon-option label="请求参数" :value="each.path" :isDom="true">
                  <div v-for="(ele,index2_ele) in each.requestParams" :key="'requestParams1-'+index2_ele">
                    <span>{{ele.param_name}}</span>-<span>{{ele.param_value}}</span>
                  </div>
                </sugon-option>
                <sugon-option label="请求头部" :value="each.path" :isDom="true">
                  <div v-for="(item,index3_item) in each.requestHeaders" :key="'requestHeaders1-'+index3_item">
                    <span>{{item.header_param}}</span>-<span>{{item.header_param_value}}</span>
                  </div>
                </sugon-option>
              </div>
              <sugon-option label="作用服务" :value="ele.serviceWeights" :isDom="true">
                <div v-for="(each1,index3_each1) in ele.serviceWeights" :key="'requestHeaders1-'+index3_each1">
                  <span>{{(each1.services).split(',')[0]}}</span>-<span>{{(each1.service_port).split(',')[0]}}</span><span>-</span><span>{{ele.serviceWeights.length > 1 ? ele.configurationValue[index3_each1 + 1] - ele.configurationValue[index3_each1] || '' : ele.configurationValue[1] - ele.configurationValue[0] || ''}}</span>
                </div>
              </sugon-option>
            </sugon-option>
          </div>
        <sugon-option label="符合以下条件" :value="form_msg.condition" v-if="form_msg.requestParameter"></sugon-option>
        <sugon-option label="请求参数" :value="form_msg.condition" v-if="form_msg.requestParams"></sugon-option>
        <div class="confirm-btn">
          <el-button type="primary" @click="create_prolicy" class="blue" :loading="loading">
            <span v-if="!loading">立即创建</span>
            <span v-else>创建中</span>
          </el-button>
        </div>
      </sugon-form-component-right>
    </div>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import SugonFormComponent from '@/components/sugon-form-component'
import SugonFormComponentRight from '@/components/sugon-form-component-right'
import SugonFormBox from '@/components/sugon-form-box'
import SugonOption from '@/components/sugon-option'
import SugonBlankPage from '@/components/sugon-blank-page'
import SugonResetHref from '@/components/sugon-reset-href'

import * as gatewayHttp from '@/http/gateway-http'
import * as routingRulesHttp from '@/http/routingRules-http'

export default {
  name: 'create_cluster_dialog',
  components: {
    vueSlider,
    SugonFormComponent,
    SugonFormBox,
    SugonFormComponentRight,
    SugonOption,
    SugonBlankPage,
    SugonResetHref
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!(/^[a-z][a-z0-9-]{1,62}[a-z0-9]$/.exec(value))) {
        callback(new Error('名称只支持小写字母、数字、中划线，以小写字母开头'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      start_loading: false,
      type: {
        PREFIX: '前缀匹配',
        EXACT: '精准匹配',
        REGEX: '正则匹配'
      },
      access_type: {
        OUTER: '外部访问',
        INNER: '集群内部访问'
      },
      form_msg: {
        name: '',
        access_type: 'OUTER', // 访问类型
        cluster_name: '', // 集群名
        gateways: [], // 一个路由规则可以选择多个网关
        hosts: [{ domain: '' }],
        items: [{
          uris: [
            { type: 'PREFIX', // 类型
              path: '',
              header: false,
              requestHeaders: [
                {
                  header_param: '',
                  header_param_value: '',
                  router_rule_id: '',
                  router_rule_uri_id: ''
                }
              ],
              requestParameter: false,
              requestParams: [
                {
                  param_name: '',
                  param_value: '',
                  router_rule_id: '',
                  router_rule_uri_id: ''
                }
              ]
            }
          ], // 路由头部
          serviceWeights: [{ services: '', service_port: '', portItems: [] }],
          configuration: false, // 权重配置
          configurationValue: [],
          dotOptions: [{ disabled: true }]
        }]

      },
      from_rule: {
        name: [
          { required: true, message: '名称必填', trigger: 'blur' },
          { min: 3, max: 64, message: '长度为3到64个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        interviewMethod: [
          { required: true, message: '请选择访问方式', trigger: 'change' }
        ],
        gateway: [
          { required: true, message: '请选择网关', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请选择访问方式', trigger: 'change' }
        ],
        condition: [
          { required: true, message: '请选择条件', trigger: 'change' }
        ],
        serviceWeights: [
          { required: true, message: '请选择作用服务', trigger: 'change' }
        ]

      },
      gateway_loading: false,
      gatewayItems: [], // 网关列表

      serviceWeightsItems: []
    }
  },
  watch: {
    'form_msg.configurationValue'(_new, old) {
      console.log(_new, '`````````')
    },
    '$store.state.information.namespace'() {
      this.form_msg.gateways = ''
      this.getGatewayList()
      this.form_msg.items.forEach(ele => {
        ele.serviceWeights.forEach(item => {
          item.services = ''
        })
      })
      this.getServiceList()
    }
    // 'form_msg.serviceWeights': {
    //   handler: function(_new, old) {
    //     const ll = 100 / this.form_msg.serviceWeights.length
    //     this.form_msg.dotOptions = []
    //     this.form_msg.configurationValue = []
    //     // this.form_msg.serviceWeights.forEach((ele, index) => {
    //     //   this.form_msg.configurationValue.push(Math.floor(index * ll))
    //     //   this.form_msg.dotOptions.push({ disabled: !!(index === 0 && ll !== 100) })
    //     // })
    //     this.form_msg.configurationValue.push(100)
    //     const arr = []
    //     this.form_msg.configurationValue.forEach((item, index) => {
    //     // if (index > 0) {
    //       arr.push(
    //         [`dotsPos[${index - 1}]`, `dotsPos[${index}]`, { 'backgroundColor': 'pink' }]
    //       )
    //     // }
    //     })
    //     if (ll !== 100) this.form_msg.dotOptions.push({ disabled: true })
    //   },
    //   deep: true
    // }
  },
  created() {
    this.getGatewayList()
    this.getServiceList()
  },
  methods: {
    // 获取端口
    changeservices(services, parent, index) {
      const that = this
      that.form_msg.items[parent].serviceWeights[index].service_port = ''
      routingRulesHttp.get_services_detail(services.split(',')[1]).then(res => {
        if (res.status_code === 1) {
          that.form_msg.items[parent].serviceWeights[index].portItems = res.content.servicePortEntities.length ? res.content.servicePortEntities : []
          if (!res.content.servicePortEntities.length) {
            that.$message({
              message: '本服务没有端口，请选择别的服务',
              type: 'error'
            })
          }
        } else {
          that.form_msg.items[parent].serviceWeights[index].portItems = []
          that.$message({
            message: res.status_mes,
            type: 'error'
          })
        }
      })
    },
    // 获取网关列表
    getGatewayList() {
      const that = this
      that.gateway_loading = true
      gatewayHttp.get_gatewayList(this.$store.state.information.cluster_name, this.$store.state.information.namespace).then(res => {
        if (res.status_code === 1) {
          that.gatewayItems = res.content ? res.content : []
        } else {
          that.List = []
          that.$message({
            message: res.status_mes,
            type: 'error'
          })
        }
        that.gateway_loading = false
      })
    },
    // 获取服务治理列表
    getServiceList() {
      const that = this
      that.gateway_loading = true
      routingRulesHttp.get_service(1, 10000, this.$store.state.information.cluster_name, this.$store.state.information.namespace).then(res => {
        if (res.status_code === 1) {
          that.serviceWeightsItems = res.content ? res.content.list : []
        } else {
          that.List = []
          that.$message({
            message: res.status_mes,
            type: 'error'
          })
        }
        that.gateway_loading = false
      })
    },
    add_serviceWeights_form(index) {
      this.form_msg.items[index].serviceWeights.push({ services: '', service_port: '', portItems: [] })
    },
    delete_serviceWeights_form(parent, index) {
      if (this.form_msg.items[parent].serviceWeights.length <= 1) {
        this.$message({
          message: '剩余一条禁止删除',
          type: 'error'
        })
        return
      }
      this.form_msg.items[parent].serviceWeights.splice(index, 1)
    },
    add_iteme_form() {
      this.form_msg.items.push({
        uris: [
          { type: 'PREFIX', // 类型
            path: '',
            header: false,
            requestHeaders: [
              {
                header_param: '',
                header_param_value: '',
                router_rule_id: '',
                router_rule_uri_id: ''
              }
            ],
            requestParameter: false,
            requestParams: [
              {
                param_name: '',
                param_value: '',
                router_rule_id: '',
                router_rule_uri_id: ''
              }
            ]
          }
        ], // 路由头部
        serviceWeights: [{ services: '', service_port: '', portItems: [] }],
        configuration: false, // 权重配置
        configurationValue: [],
        dotOptions: [{ disabled: true }]
      })
    },
    delete_item_form(index) {
      if (this.form_msg.items.length <= 1) {
        this.$message({
          message: '剩余一条禁止删除',
          type: 'error'
        })
        return
      }
      this.form_msg.items.splice(index, 1)
    },
    add_uris_form(index) {
      this.form_msg.items[index].uris.push({ type: 'PREFIX', // 类型
        path: '',
        header: false,
        requestHeaders: [
          {
            header_param: '',
            header_param_value: '',
            router_rule_id: '',
            router_rule_uri_id: ''
          }
        ],
        requestParameter: false,
        requestParams: [
          {
            param_name: '',
            param_value: '',
            router_rule_id: '',
            router_rule_uri_id: ''
          }
        ]
      })
    },
    delete_uris_form(parent, index) {
      if (this.form_msg.items[parent].uris.length <= 1) {
        this.$message({
          message: '剩余一条禁止删除',
          type: 'error'
        })
        return
      }
      this.form_msg.items[parent].uris.splice(index, 1)
    },
    add_requestHeaders_form(parent, index) {
      this.form_msg.items[parent].uris[index].requestHeaders.push({
        header_param: '',
        header_param_value: '',
        router_rule_id: '',
        router_rule_uri_id: ''
      })
    },
    delete_requestHeaders_form(grandfather, parent, index) {
      if (this.form_msg.items[grandfather].uris[parent].requestHeaders.length <= 1) {
        this.$message({
          message: '剩余一条禁止删除',
          type: 'error'
        })
        return
      }
      this.form_msg.items[grandfather].uris[parent].requestHeaders.splice(index, 1)
    },
    add_requestParams_form(parent, index) {
      this.form_msg.items[parent].uris[index].requestParams.push({
        param_name: '',
        param_value: '',
        router_rule_id: '',
        router_rule_uri_id: ''
      })
    },
    delete_requestParams_form(grandfather, parent, index) {
      if (this.form_msg.items[grandfather].uris[parent].requestParams.length <= 1) {
        this.$message({
          message: '剩余一条禁止删除',
          type: 'error'
        })
        return
      }
      this.form_msg.items[grandfather].uris[parent].requestParams.splice(index, 1)
    },
    add_node_form() {
      this.form_msg.hosts.push({ domain: '' })
    },
    delete_form(index) {
      this.form_msg.hosts.splice(index, 1)
    },
    // 更改作用服务
    changeserviceWeights(parent, index) {
      const ll = 100 / this.form_msg.items[parent].serviceWeights.length
      this.form_msg.items[parent].dotOptions = []
      this.form_msg.items[parent].configurationValue = []
      this.form_msg.items[parent].serviceWeights.forEach((ele, index) => {
        this.form_msg.items[parent].configurationValue.push(Math.floor(index * ll))
        this.form_msg.items[parent].dotOptions.push({ disabled: !!(index === 0 && ll !== 100) })
      })
      this.form_msg.items[parent].configurationValue.push(100)
      const arr = []
      this.form_msg.items[parent].configurationValue.forEach((item, index) => {
        // if (index > 0) {
        arr.push(
          [`dotsPos[${index - 1}]`, `dotsPos[${index}]`, { 'backgroundColor': 'pink' }]
        )
        // }
      })
      if (ll !== 100) this.form_msg.items[parent].dotOptions.push({ disabled: true })
      console.log(this.form_msg.items[parent].dotOptions)
    },
    getGateways() {
      const arr = []
      this.form_msg.gateways.forEach(ele => {
        arr.push(this.gatewayItems.filter(item => {
          return item.name === ele
        })[0])
      })
      return arr
    },
    getArrayProps(array, key = 'host_name') {
      var res = []
      if (array) {
        array.forEach((t) => {
          res.push(t[key])
        })
      }
      return res
    },
    getItems() {
      const arr = []
      this.form_msg.items.forEach(ele => {
        const obj = { uris: [], serviceWeights: [] }
        ele.uris.forEach(ele => {
          obj.uris.push({
            path: ele.path,
            requestHeaders: ele.requestHeaders,
            requestParams: ele.requestParams,
            type: ele.type
          })
        })
        ele.serviceWeights.forEach((item, index) => {
          if (ele.serviceWeights.length > 1) {
            obj.serviceWeights.push({
              service: {
                service_id: (item.services).split(',')[1]
              },
              service_port_id: (item.service_port).split(',')[1],
              service_port_number: (item.service_port).split(',')[0],
              weight: ele.configurationValue[index + 1] - ele.configurationValue[index]
            })
          } else {
            obj.serviceWeights.push({
              service: {
                service_id: (item.services).split(',')[1]
              },
              service_port_id: (item.service_port).split(',')[1],
              service_port_number: (item.service_port).split(',')[0],
              weight: ele.configurationValue[1] - ele.configurationValue[0]
            })
          }
        })
        arr.push(obj)
      })
      return arr
    },
    // 创建
    create_prolicy() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.form_msg, 'this.form_msg')
          const data = {
            access_type: this.form_msg.access_type,
            name: this.form_msg.name,
            cluster_name: this.$store.state.information.cluster_name,
            namespace: this.$store.state.information.namespace,
            gateways: this.getGateways(),
            hosts: this.form_msg.hosts,
            items: this.getItems()
          }
          routingRulesHttp.post_routerRule(data).then(res => {
            this.loading = false
            if (res.status_code === 1) {
              this.$message({
                message: res.status_mes,
                type: 'success'
              })
              this.$router.push(`/routingRules`)
            } else {
              this.$message({
                message: res.status_mes,
                type: 'error'
              })
            }
          })
        }
      })
    },
    messageBox(type, data, duration = 3000) {
      this.$message[type]({
        showClose: true,
        message: data,
        duration: duration
      })
    }
  }
}
</script>

<style scoped>
.creat-page {
  display: flex;
}
.creat-page .form-container {
  flex: 8;
}
.creat-page .form-right {
  flex: 2;
  position: relative;
}
.text-over {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-over-2 {
  width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  white-space: pre-wrap;
}
.confirm-btn {
  position: absolute;
  margin-top: 20px;
  padding: 10px 14px;
  left: 14px;
  bottom: 20px;
}
.el-pagination {
  background: white;
  padding: 2px 0 2px 10px;
}
.row-layout{
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
}

.merge-tooltip {
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, -15px);
}
</style>
