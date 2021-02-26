<!--用户界面-->
<template>
  <div class="viewFramework-product-body">
    <el-row style="padding-right: 15px; padding-left: 15px;">
      <div class="console-table-wapper margin-top" style="position: relative;background: #FFFFFF;padding: 20px 18px;">
        <div style="position: relative;margin-bottom: 16px;">
          <div class="margin-top" v-loading="Loading">
            <el-row>
              <div class="console-table-wapper">
                <div class="cv-vm-infobox">
                  <dl>
                    <dt>
                      <span class="iconfont icon-jurassic_form-template" style="font-size:80px;"></span>
                      <i></i>
                    </dt>
                    <dd>
                      <h3>{{ routingRulesDetail.name || '-'}}</h3>
                      <p>描述: {{ routingRulesDetail.description || '-'}}</p>
                      <p>创建时间: {{ routingRulesDetail.create_at|dateformat('YYYY-MM-DD HH:mm:ss') }}</p>
                    </dd>
                  </dl>
                </div>
              </div>
                <el-card dis-hover style="margin-bottom: 8px;" class="card-style">
                  <div class="info-box">
                    <div class="info-box-title">
                      <h2>网关信息</h2>
                    </div>
                    <div class="info-box-con">
                      <dl>
                        <dt>访问类型</dt>
                        <dd>
                          <span>{{ access_type[routingRulesDetail.access_type] || '-'}}</span>
                        </dd>
                      </dl>
                      <dl>
                        <dt>网关</dt>
                        <dd>
                          <span v-for="(ele,index) in routingRulesDetail.gateways" :key="index">{{ele.name || '-'}}<br /></span>
                        </dd>
                      </dl>
                      <dl>
                        <dt>域名解析</dt>
                        <dd>
                          <span v-for="(ele,index) in routingRulesDetail.hosts" :key="index">{{ele.domain || '-'}}<br /></span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </el-card>
                <el-collapse v-model="activeNames">
                  <el-collapse-item :title="item.component_name" v-for="(item, index) in routingRulesDetail.items" :key="index" :name="index">
                    <template slot="title" style="padding:10px">
                      <div style="margin-left:5px;">
                        <p style="margin:0;line-height:18px;font-size:14px;font-weight:700;">路由{{ index+1 }}</p>
                      </div>
                    </template>
                    <el-card dis-hover style="margin-bottom: 8px;" class="card-style" v-for="(each,index1) in item.uris" :key="'uris-'+index1">
                      <div class="info-box">
                        <div class="info-box-title">
                          <h2>路由信息{{ index1+1 }}</h2>
                        </div>
                        <div class="info-box-con">
                          <dl>
                            <dt>路径 url</dt>
                            <dd>
                              <span>{{ type[each.type] || '-'}}</span> - <span>{{each.path}}</span>
                            </dd>
                          </dl>
                          <dl>
                            <dt>请求参数</dt>
                            <dd>
                              <span v-for="(ele,index2) in each.requestParams" :key="'ele-'+index2">{{`${ele.param_name}-${ele.param_value}` || '-'}}<br /></span>
                            </dd>
                          </dl>
                          <dl>
                            <dt>请求头部</dt>
                            <dd>
                              <span v-for="(item,index3) in each.requestHeaders" :key="'item-'+index3">{{`${item.header_param}-${item.header_param_value}` || '-'}}<br /></span>
                            </dd>
                          </dl>
                        </div>
                        <el-table :data="item.serviceWeights" stripe style="width: 100%">
                        <el-table-column label="服务名称">
                          <template slot-scope="scope">
                            <span>{{ scope.row.service.service_name }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="端口">
                          <template slot-scope="scope">
                            <span>{{ scope.row.service_port_number }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="权重">
                          <template slot-scope="scope">
                            <span>{{ scope.row.weight }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                      </div>
                    </el-card>
                  </el-collapse-item>
                </el-collapse>
              <!-- </div> -->
            </el-row>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import * as routingRulesHttp from '@/http/routingRules-http/'
import { mapState } from 'vuex'

export default {
  name: 'routingRulesDetail',
  components: {},
  filters: {
    typeFilter(data) {
      switch (data) {
        case 'web':
          return 'web服务'
        case 'sql':
          return '数据库'
        case 'middleware':
          return '中间件'
        case 'system':
          return '操作系统'
        case 'language':
          return '编程语言'
        case 'other':
          return '其他'
        default:
          return '--'
      }
    }
  },
  data() {
    return {
      type: {
        PREFIX: '前缀匹配',
        EXACT: '精准匹配',
        REGEX: '正则匹配'
      },
      access_type: {
        OUTER: '外部访问',
        INNER: '集群内部访问'
      },
      activeNames: [],
      Loading: false,
      ReceiverLoading: true,
      routingRulesDetail: { componentEntities: [] }
    }
  },
  computed: mapState({
  }),
  created() {
    this.getProlicyDetails()
  },
  methods: {
    getProlicyDetails() {
      this.Loading = true
      routingRulesHttp.get_routerRule_detail(this.$route.params.id).then(res => {
        if (res.status_code === 1) {
          this.routingRulesDetail = res.content ? res.content : {}
          for (var arry in this.routingRulesDetail.items) {
            this.activeNames.push(arry)
          }
          this.activeNames = JSON.parse('[' + String(this.activeNames) + ']')
          this.Loading = false
        } else {
          this.Loading = false
          this.messageBox('error', res.status_mes)
          return
        }
        this.hostLoading = false
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
p {
  margin:12px 0;
}
.dialog-span-1{
  color: rgb(0, 108, 220);
  margin-right: 15px;
  font-size: 13px;
}
.dialog-span-2{
  color: #19be6b;
  font-size: 13px;
}
.info-box .info-box-con dl dd {
  margin-left: 200px;
}
.list-header{
  /* border-bottom: 1px solid #E1E1E1; */
  /* padding-bottom: 5px; */
  font-size: 16px;
  font-weight: 600;
  color: #333333
}
.el-collapse {
  border: 0px;
}
.el-collapse >>> .el-collapse-item__header {
  padding: 0 10px;
  border: 1px solid #ebeef5;
  margin-top: 10px;
}
.el-collapse >>> .el-collapse-item__arrow {
    margin:0 8px 0 auto
}

.collapse {
    background:none;
    padding: 0;
    margin-bottom: 0;
}
</style>
