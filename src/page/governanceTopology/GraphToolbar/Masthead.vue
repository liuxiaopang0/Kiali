<template>
  <div style="display:flex;margin-bottom: 10px;">
    <div style="flex:1">
      <el-select
        class="pop_select"
        v-model="provinceType"
        multiple
        filterable
        collapse-tags
        popper-class="pop_select_down"
        @change="selectCheck"
        @visible-change="focusEvent"
        @remove-tag="removeTag"
        style="width:200px"
      >
        <el-checkbox v-model="isSelectAll" style="padding-left:18px" @change="selectAll">全选</el-checkbox>
        <el-option v-for="(item,index) of provinceData" :label="item.name" :value="item.name" :key="index">
          <span class="check" />
          <span>{{item.name}}</span>
        </el-option>
      </el-select>

      <el-select v-model="graph_type" placeholder="图形类型" @change="graphType_change" style="width:150px;">
        <el-option :label="item.lable" :value="item.value" v-for="(item,index) in graphTypeList" :key="index"></el-option>
      </el-select>
    </div>
    <div>
      <el-select v-model="selected_time" placeholder="时间" @change="selectedTime_change" style="width:100px">
        <el-option :label="'Last '+item.lable" :value="item.value" v-for="(item,index) in timeData" :key="index"></el-option>
      </el-select>
      <el-select v-model="update_time" placeholder="定时" @change="graphType_change" style="width:100px">
        <el-option :label="item.lable" :value="item.value" v-for="(item,index) in liveUpdate" :key="index"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import * as governanceTopologyHttp from '@/http/governanceTopology-http'

export default {
  name: 'home',
  data() {
    return {
      provinceType: [],
      isSelectAll: false,
      provinceData: [],

      graphTypeList: [
        {
          lable: '应用图',
          value: 'app'
        },
        {
          lable: '服务图',
          value: 'service'
        },
        {
          lable: '版本化的应用',
          value: 'versionedApp'
        },
        {
          lable: '工作量图',
          value: 'workload'
        }
      ],
      graph_type: 'versionedApp',

      timeData: [
        {
          lable: '1m',
          value: '60s'
        },
        {
          lable: '5m',
          value: '300s'
        },
        {
          lable: '10m',
          value: '600s'
        },
        {
          lable: '30m',
          value: '1800s'
        },
        {
          lable: '1h',
          value: '3600s'
        },
        {
          lable: '3h',
          value: '10800s'
        },
        {
          lable: '6h',
          value: '21600s'
        },
        {
          lable: '12h',
          value: '43200s'
        },
        {
          lable: '1d',
          value: '86400s'
        },
        {
          lable: '7d',
          value: '604800s'
        },
        {
          lable: '30d',
          value: '2592000s'
        }
      ],
      selected_time: '60s',

      liveUpdate: [
        {
          lable: '暂停',
          value: 0
        },
        {
          lable: '10s',
          value: 10
        },
        {
          lable: '15s',
          value: 15
        },
        {
          lable: '30s',
          value: 30
        },
        {
          lable: '1m',
          value: 60
        },
        {
          lable: '5m',
          value: 300
        },
        {
          lable: '15m',
          value: 650
        }
      ],
      update_time: 0
    }
  },
  watch: {
    update_time(newValue, oldValue) {
      if ((newValue !== oldValue) && newValue) {
        this.$emit('ok', newValue)
      }
    }
  },
  created() {
    this.getProvinceData()
    store.commit('set_namespaces', this.provinceType)
    store.commit('set_graph_type', this.graph_type)
    store.commit('set_selected_time', this.selected_time)
  },
  methods: {
    getProvinceData() {
      const that = this
      governanceTopologyHttp.get_namespaces().then(res => {
        if (res) {
          that.provinceData = res || []
          this.loading = false
        } else {
          that.provinceData = []
          that.$message({
            message: res.status_mes,
            type: 'error'
          })
        }
      })
    },
    selectAll(val) {
      this.provinceType = val ? this.provinceData.map(item => {
        return item.name
      }) : []
    },
    selectCheck(val) {
      if (val.length === this.provinceData.length) {
        this.provinceType = this.provinceData.map(item => {
          return item.name
        })
        this.isSelectAll = true
      } else {
        this.isSelectAll = false
      }
    },
    focusEvent(val) { // 失去焦点事件
      if (!val) {
        store.commit('set_namespaces', this.provinceType)
        // 更改了选中的分区 获取数据
      }
    },
    removeTag() {
      store.commit('set_namespaces', this.provinceType)
    },
    graphType_change() {
      store.commit('set_graph_type', this.graph_type)
    },
    selectedTime_change() {
      store.commit('set_selected_time', this.selected_time)
    }
  }
}
</script>

<style>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  left: 21px;
  z-index: 1;
  color: #fff;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected .check {
  background-color: #409eff;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item .check {
  display: inline-block;
  position: relative;
  border: 1px solid #409eff;
  border-radius: 2px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 10px;
  transition: border-color 0.25s cubic-bezier(0.71, -0.49, 0.26, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.49, 0.26, 1.46);
}
</style>