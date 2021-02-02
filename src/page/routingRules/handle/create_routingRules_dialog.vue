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
            <el-form-item label="访问方式" prop="interviewMethod">
              <el-radio v-model="form_msg.interviewMethod" label="外部访问">外部访问</el-radio>
              <el-radio v-model="form_msg.interviewMethod" label="集群内部访问">集群内部访问</el-radio>
            </el-form-item>
            <template>
            </template>
            <el-form-item label="网关" prop="gateway">
              <el-select v-model="form_msg.item_name" placeholder="请选择" style="margin-right:4px;width:300px;">
                <el-option v-for="(option,index) in gatewayItems" :key="'gateway-'+index" :label="option.label" :value="option.name"></el-option>
              </el-select>
              <!-- <sugon-reset-href :state="zone_loading" @reset="getZones" href="HostUsableArea" type="button" router_path="/Vpc/Network"></sugon-reset-href> -->
            </el-form-item>
            <div class="row-layout" v-for="(data,ind) of form_msg.DNS" :key="'DNS-'+ind">
              <el-col :span="24">
                <el-form-item style="width:100%" label="域名解析" :prop="'DNS.' + ind + '.DNS_name'" :rules="{ required: true, message: '请输入域名解析', trigger: 'blur' }">
                  <span slot="label" style="position:relative;">
                    域名解析
                    <el-tooltip class="item" effect="dark" placement="top">
                      <div slot="content">网关的子域名</div>
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </span>
                  <el-input v-model="data.DNS_name" placeholder="" style="margin-right:4px;width:300px;"></el-input>
                  <el-button type="primary" icon="el-icon-plus"  @click="add_node_form()"></el-button>
                  <el-button type="danger" icon="el-icon-delete"  @click="delete_form(index)"></el-button>
                <!-- <i class="el-icon-delete delete-icon" style="color:red;color:red;cursor: pointer;" @click="delete_form(index)"></i> -->
                </el-form-item>
              </el-col>
            </div>
            <!-- <div style="text-align:center;cursor:pointer" class="add-image-btn border-style" @click="add_node_form()">+添加域名解析</div> -->
          </sugon-form-box>
          <sugon-form-box title="路由">
            <el-form-item label="路径 url" prop="path">
              <el-radio v-model="form_msg.path" label="前缀匹配">前缀匹配</el-radio>
              <el-radio v-model="form_msg.path" label="精准匹配">精准匹配</el-radio>
              <el-radio v-model="form_msg.path" label="正则匹配">正则匹配</el-radio>
            </el-form-item>
            <div v-for="(item,index1) in form_msg.paths" :key="'path_url-'+index1">
              <el-form-item label :prop="'paths.' + index1 + '.path_url'" :rules="{ required: true, message: '请输入路径url', trigger: 'blur' }">
                <el-input v-model="item.path_url" placeholder="" style="margin-right:4px;width:300px;" ></el-input>
                <el-button type="primary" icon="el-icon-plus"  @click="add_paths_form()"></el-button>
                <el-button type="danger" icon="el-icon-delete"  @click="delete_paths_form(index1)"></el-button>
                <!-- <i class="el-icon-delete delete-icon" style="color:red;color:red;cursor: pointer;" @click="delete_paths_form(index)"></i> -->
              </el-form-item>
            </div>
            <!-- <div style="text-align:center;cursor:pointer" class="add-image-btn border-style" @click="add_paths_form()">+添加路径 url</div> -->
            <el-form-item label="请求参数">
              <el-switch v-model="form_msg.requestParameter" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="符合以下条件" prop="condition"  v-if="form_msg.requestParameter">
              <el-radio v-model="form_msg.condition" label="全部">全部</el-radio>
              <el-radio v-model="form_msg.condition" label="任何">任何</el-radio>
            </el-form-item>
            <div v-for="(ele,index2) in form_msg.conditionData" :key="'conditionData-'+index2" v-show="form_msg.requestParameter">
              <el-form-item label required>
                <el-col :span="4">
                  <el-form-item :prop="'conditionData.' + index2 + '.name'" :rules="{ required: true, message: '请输入参数名', trigger: 'blur' }">
                    <el-input v-model="ele.name" placeholder="请输入参数名" style="margin-right:4px;width:150px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item :prop="'conditionData.' + index2 + '.condition'" :rules="{ required: true, message: '请选择', trigger: 'change' }">
                    <el-select v-model="ele.condition" placeholder="请选择" style="margin-right:4px;width:100px;">
                      <el-option v-for="(item,inde) in [{name:'>',value:'>'},{name:'=',value:'='}]" :key="inde" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item :prop="'conditionData.' + index2 + '.rule'" :rules="{ required: true, message: '请输入规则', trigger: 'blur' }">
                    <el-input v-model="ele.rule" placeholder="请输入规则" style="margin-right:4px;width:150px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                </el-col>
                <el-button type="primary" icon="el-icon-plus"  @click="add_conditionData_form()"></el-button>
                <el-button type="danger" icon="el-icon-delete"  @click="delete_conditionData_form(index2)"></el-button>
                <!-- <i class="el-icon-plus" style="color:#3f8bee;cursor: pointer;" @click="add_conditionData_form()"></i> -->
                <!-- <i class="el-icon-delete delete-icon" style="color:red;cursor: pointer;" @click="delete_conditionData_form(index)"></i> -->
              </el-form-item>
            </div>
            <el-form-item label="请求头部">
              <el-switch v-model="form_msg.header" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <div v-for="(item,index3) in form_msg.headerData" :key="'headerData-'+index3" v-show="form_msg.header">
              <el-form-item required>
                <el-col :span="4">
                  <el-form-item :prop="'headerData.' + index3 + '.key'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                    <el-input v-model="item.key" placeholder=""  style="margin-right:4px;width:150px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item :prop="'headerData.' + index3 + '.value'" :rules="{ required: true, message: '请输入', trigger: 'blur' }">
                    :<el-input v-model="item.value" placeholder=""  style="margin-right:4px;width:150px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14"></el-col>
                <el-button type="primary" icon="el-icon-plus"  @click="add_headerData_form()"></el-button>
                <el-button type="danger" icon="el-icon-delete"  @click="delete_headerData_form(index3)"></el-button>
              </el-form-item>
            </div>
            <el-form-item label="作用服务" prop="roleService">
              <el-select v-model="form_msg.roleService" filterable  @change="changeRoleService()" multiple placeholder="请选择" style="margin-right:4px;width:300px;">
                <el-option v-for="(item,index4) in storagesItems"  :key="'roleService-'+index4" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="权重配置">
              <el-switch v-model="form_msg.configuration" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item v-if="form_msg.configuration">
              <vue-slider v-model="form_msg.configurationValue" :dot-options="form_msg.dotOptions" :process="val => {
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
                    ]">{{form_msg.roleService[index]}}
                      {{ form_msg.configurationValue[index] }} - {{ form_msg.configurationValue[index + 1] }}
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
        <sugon-option label="访问方式" :value="form_msg.interviewMethod"></sugon-option>
        <sugon-option label="网关" :value="form_msg.item_name"></sugon-option>
        <sugon-option label="域名解析" :value="form_msg.DNS"></sugon-option>
        <sugon-option label="路径" :value="form_msg.path"></sugon-option>
        <sugon-option label="路径url" :value="form_msg.paths"></sugon-option>
        <sugon-option label="符合以下条件" :value="form_msg.condition" v-if="form_msg.requestParameter"></sugon-option>
        <sugon-option label="请求参数" :value="form_msg.condition" v-if="form_msg.conditionData"></sugon-option>
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

import * as clusterHttp from '@/http/serviceGovernance-http/'

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
        clusterHttp.get_clusters(1, 1000, this.form_msg.name).then(res => {
          if (res.status_code === 1) {
            if (res.content.list.length > 0) {
              callback(new Error('集群名称重复，请重写'))
            } else {
              callback()
            }
          } else {
            this.$message({
              message: res.status_mes,
              type: 'error'
            })
          }
        })
      }
    }
    return {
      loading: false,
      start_loading: false,
      form_msg: {
        name: '',
        interviewMethod: '外部访问',
        DNS: [{ DNS_name: '' }],
        path: '前缀匹配',
        paths: [{ path_url: '' }], // 路由数组
        requestParameter: false, // 请求参数
        condition: '全部', // 条件
        conditionData: [{ name: '', condition: '', rule: '' }], // 条件数组
        header: false,
        headerData: [{ key: '', value: '' }], // 头部数组
        roleService: [],
        configuration: false, // 权重配置
        configurationValue: [],
        configurationValueprocess: [],
        dotOptions: [{ disabled: true }]

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
        roleService: [
          { required: true, message: '请选择作用服务', trigger: 'change' }
        ]

      },
      process: val => [
        [val[0], val[1]]
        // [val[1], val[2]],
        // [val[2], val[3]]
      ],
      gatewayItems: [], // 网关列表

      storagesItems: [
        {
          lable: 'nfs',
          value: 'nfs'
        },
        {
          lable: 'external-ceph',
          value: 'external-ceph'
        },
        {
          lable: 'local-volume',
          value: 'local-volume'
        },
        {
          lable: 'local',
          value: 'local'
        }
      ]
    }
  },
  watch: {
    'form_msg.configurationValue'(_new, old) {
      console.log(_new, '`````````')
    },
    form_msg: {
      handler: function(_new, old) {
        var checked = true
        if (_new.name.length > 64 || _new.name.length < 1) {
          checked = false
        }
        if (_new.lb_name > 64 || _new.lb_name < 1) {
          checked = false
        }
        if (_new.listener_name > 64 || _new.listener_name < 1) {
          checked = false
        }
        if (_new.pool_name > 64 || _new.pool_name < 1) {
          checked = false
        }
        var obj = JSON.stringify(_new)
        obj = JSON.parse(obj)
        for (var i in obj) {
          if (!obj[i]) {
            checked = false
          }
        }
        this.checked = checked
      },
      deep: true
    }
  },
  created() {},
  methods: {
    add_headerData_form() {
      this.form_msg.headerData.push({ key: '', value: '' })
    },
    delete_headerData_form(index) {
      this.form_msg.headerData.splice(index, 1)
    },
    add_conditionData_form() {
      this.form_msg.conditionData.push({ name: '', condition: '', rule: '' })
    },
    delete_conditionData_form(index) {
      this.form_msg.conditionData.splice(index, 1)
    },
    add_paths_form() {
      this.form_msg.paths.push({ path_url: '' })
    },
    delete_paths_form(index) {
      this.form_msg.paths.splice(index, 1)
    },
    add_node_form() {
      this.form_msg.DNS.push({ DNS_name: '' })
    },
    delete_form(index) {
      this.form_msg.DNS.splice(index, 1)
    },
    // 更改作用服务
    changeRoleService() {
      const ll = 100 / this.form_msg.roleService.length
      this.form_msg.dotOptions = []
      this.form_msg.configurationValue = []
      this.form_msg.roleService.forEach((ele, index) => {
        this.form_msg.configurationValue.push(Math.floor(index * ll))
        this.form_msg.dotOptions.push({ disabled: !!(index === 0 && ll !== 100) })
      })
      this.form_msg.configurationValue.push(100)
      const arr = []
      this.form_msg.configurationValue.forEach((item, index) => {
        // if (index > 0) {
        arr.push(
          [`dotsPos[${index - 1}]`, `dotsPos[${index}]`, { 'backgroundColor': 'pink' }]
        )
        // }
      })
      if (ll !== 100) this.form_msg.dotOptions.push({ disabled: true })
    },
    // 创建
    create_prolicy() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            cluster_doamin_suffix: this.form_msg.cluster_doamin_suffix,
            configs: {
              PROXY_MODE: this.form_msg.configs.PROXY_MODE,
              ingress_backend: this.form_msg.configs.ingress_backend,
              // FLANNEL_BACKEND: this.form_msg.configs.FLANNEL_BACKEND,
              SERVICE_CIDR: this.form_msg.configs.SERVICE_CIDR,
              CLUSTER_CIDR: this.form_msg.configs.CLUSTER_CIDR,
              // local_volume_path: this.form_msg.configs.local_volume_path,
              MAX_PODS: this.form_msg.configs.MAX_PODS,
              STORAGE_DIR: this.form_msg.configs.STORAGE_DIR,
              DOCKER_ADDR: this.form_msg.configs.DOCKER_ADDR,
              PROMETHEUS_RETENTION: this.form_msg.configs.PROMETHEUS_RETENTION
            },
            deploy_type: this.form_msg.deploy_type,
            item_name: this.form_msg.item_name,
            meta: {},
            name: this.form_msg.name,
            network_plugin: this.form_msg.network_plugin,
            nodes: this.form_msg.nodes,
            package: this.form_msg.package,
            persistent_storage: this.form_msg.persistent_storage,
            template: this.form_msg.template,
            worker_size: this.form_msg.worker_size,
            zones: []
          }
          if (data.network_plugin === 'flannel') {
            data.configs.FLANNEL_BACKEND = this.form_msg.configs.FLANNEL_BACKEND
          } else if (data.network_plugin === 'calico') {
            data.configs.CALICO_IPV4POOL_IPIP = this.form_msg.configs.CALICO_IPV4POOL_IPIP
          }
          if (data.persistent_storage === 'nfs') {
            data.configs.nfs = this.form_msg.configs.nfs
          } else if (data.persistent_storage === 'external-ceph') {
            data.configs['external-ceph'] = this.form_msg.configs.external_ceph
          } else if (data.persistent_storage === 'local-volume') {
            data.configs.local_volume_path = this.form_msg.configs.local_volume_path
          }
          clusterHttp.create_cluster(data).then(res => {
            if (res.status_code === 1) {
              this.addNode(res.resouce)
            } else {
              this.$message({
                message: res.status_mes,
                type: 'error'
              })
            }
            this.loading = false
          })
        }
      })
    },
    // 添加节点
    async addNode(name) {
      try {
        if (this.form_msg.template === '一主多节点') {
          let list = this.hostList.filter(
            ele => ele.name === this.form_msg.master1Host
          )
          list = list[0]
          const data = {
            vars: {},
            roles: ['master'],
            delete: false,
            volumes: [],
            conditions: [],
            info: {},
            name: `master1.${this.form_msg.name}.${this.form_msg.cluster_doamin_suffix}`,
            host: list.id,
            ip: list.ip,
            host_memory: list.memory,
            host_cpu_core: list.cpu_core,
            host_os: list.os,
            host_os_version: list.os_version
          }
          list.volumes.forEach(ele => {
            data.volumes.push(ele.name)
          })
          await clusterHttp.post_nodes(name, data)
        } else {
          const buff = []
          for (let i = 1; i <= 3; i++) {
            let list = this.hostList.filter(
              ele => ele.name === this.form_msg[`master${i}Host`]
            )
            list = list[0]
            const data = {
              vars: {},
              roles: ['master'],
              delete: false,
              volumes: [],
              conditions: [],
              info: {},
              name: `master${i}.${this.form_msg.name}.${this.form_msg.cluster_doamin_suffix}`,
              host: list.id,
              ip: list.ip,
              host_memory: list.memory,
              host_cpu_core: list.cpu_core,
              host_os: list.os,
              host_os_version: list.os_version
            }
            list.volumes.forEach(ele => {
              data.volumes.push(ele.name)
            })
            await clusterHttp.post_nodes(name, data).then(res => {
              buff.push(res)
            }).catch(error => {
              this.loading = false
              this.$message({
                message: error.status_mes,
                type: 'error'
              })
            })
          }
        }
        for (let i = 1; i <= this.form_msg.worker_size; i++) {
          const buff = []
          let list = this.hostList.filter(
            ele => ele.name === this.form_msg[`worker${i}Host`]
          )
          list = list[0]
          const data = {
            vars: {},
            roles: ['worker'],
            delete: false,
            volumes: [],
            conditions: [],
            info: {},
            name: `worker${i}.${this.form_msg.name}.${this.form_msg.cluster_doamin_suffix}`,
            host: list.id,
            ip: list.ip,
            host_memory: list.memory,
            host_cpu_core: list.cpu_core,
            host_os: list.os,
            host_os_version: list.os_version
          }
          list.volumes.forEach(ele => {
            data.volumes.push(ele.name)
          })
          await clusterHttp.post_nodes(name, data).then(res => {
            buff.push(res)
          }).catch(error => {
            this.loading = false
            this.$message({
              message: error.status_mes,
              type: 'error'
            })
          })
        }
        this.getClusters()
        this.$router.push(`/cluster`)
        this.$message({
          message: '集群创建成功',
          type: 'success'
        })
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$message({
          message: err.status_mes,
          type: 'error'
        })
      }
    },
    // 获取集群列表
    getClusters() {
      clusterHttp.get_clusters(1, 10000, 'all').then(data => {
        this.$handle_http_back(data, true, false).then((res) => {
          this.clusterActiveList = data.content ? data.content.list : []
          store.commit('set_clusterActiveList', this.clusterActiveList)
        })
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
