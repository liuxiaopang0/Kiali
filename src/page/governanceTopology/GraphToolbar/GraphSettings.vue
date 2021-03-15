<template>
  <div style="margin-bottom: 10px;">
    <el-select v-model="value" placeholder="请选择" style="width:120px" @visible-change="focusEvent">
      <el-option-group label="Show Edge Labels">
        <div v-for="(item,index) in [{name:'No Label',value:'noLabel'},{name:'Request Rate',value:'requestRate'},{name:'Request Distribution',value:'requestDistribution'},{name:'Response Time',value:'responseTime'}]" :key="index">
          <el-radio style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" v-model="radio" :label="item.value">{{item.name}}</el-radio>
        </div>
      </el-option-group>
      <el-option-group label="Show Edge Labels">
        <div v-for="item in ['Compress Hidden', 'Node Names', 'Operation Nodes', 'Service Nodes','Traffic Animation','Unused Nodes']" :key="item">
          <el-checkbox-group v-model="checked">
            <el-checkbox style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-option-group>
      <el-option-group label="Show Edge Labels">
        <div v-for="item in ['Circuit Breakers', 'Missing Sidecars', 'Virtual Services', 'Security']" :key="item">
          <el-checkbox-group v-model="checked">
            <el-checkbox style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" :label="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-option-group>
      <el-option-group v-for="group in options" :key="group.label" :label="group.label" style="display:none">
        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-option-group>
    </el-select>
      <el-input v-model="find" style="width:100px;display:inline-block;" />
    <el-input v-model="hide" style="width:100px;display:inline-block;" />
  </div>
</template>
<script>
import store from '@/store'

export default {

  data() {
    return {
      isShow: false,
      checked: ['Compress Hidden', 'Node Names', 'Circuit Breakers', 'Missing Sidecars', 'Virtual Services'],
      radio: 'noLabel',
      hide: '',
      find: '',
      demo: '',

      value: '',
      options: [{
        label: '热门城市',
        options: [{
          value: 'Shanghai',
          label: '上海'
        }]
      }]

    }
  },
  watch: {
    checked(newValue, oldValue) {
      store.commit('set_fetchParams', {
        isMTLSEnabled: newValue.indexOf('') !== -1,
        showCircuitBreakers: newValue.indexOf('Circuit Breakers') !== -1,
        showMissingSidecars: newValue.indexOf('Missing Sidecars') !== -1,
        showSecurity: newValue.indexOf('Security') !== -1,
        showNodeLabels: newValue.indexOf('Node Names') !== -1,
        showVirtualServices: newValue.indexOf('Traffic Animation') !== -1,
        showOperationNodes: newValue.indexOf('Operation Nodes') !== -1,
        node: newValue.indexOf('Service Nodes') !== -1,
        showUnusedNodes: newValue.indexOf('Unused Nodes') !== -1
      })
    }
  },
  created() {
    store.commit('set_edgeLabelMode', this.radio)
    store.commit('set_fetchParams', {
      isMTLSEnabled: this.checked.indexOf('') !== -1,
      showCircuitBreakers: this.checked.indexOf('Circuit Breakers') !== -1,
      showMissingSidecars: this.checked.indexOf('Missing Sidecars') !== -1,
      showSecurity: this.checked.indexOf('Security') !== -1,
      showNodeLabels: this.checked.indexOf('Node Names') !== -1,
      showVirtualServices: this.checked.indexOf('Traffic Animation') !== -1,
      showOperationNodes: this.checked.indexOf('Operation Nodes') !== -1,
      node: this.checked.indexOf('Service Nodes') !== -1,
      showUnusedNodes: this.checked.indexOf('Unused Nodes') !== -1
    })
  },
  methods: {
    focusEvent(val) {
      if (!val) {
        store.commit('set_edgeLabelMode', this.radio)
      }
    }
  }
}
</script>
<style scoped>
</style>