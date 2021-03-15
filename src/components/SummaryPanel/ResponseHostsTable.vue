<template>
  <div>
    <el-table :data="rows" style="width: 100%" v-if="rows.length >0">
      <strong>{{title}}</strong>
      <el-table-column prop="code" label="Code"></el-table-column>
      <el-table-column prop="host" label="Host" show-overflow-tooltip></el-table-column>
      <el-table-column prop="val" label="% Req"></el-table-column>
    </el-table>
    <div v-else>No Host Information Available</div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  mame: 'ResponseHostsTable',
  props: ['title', 'responses'],
  data() {
    return {
      rows: []
    }
  },
  watch: {
    responses() {
      this.rows = this.getRows(this.responses)
    }
  },
  mounted() {
    this.rows = this.getRows(this.responses)
  },
  methods: {
    getRows(responses) {
      const rows = []
      _.keys(responses).forEach(code => {
        _.keys(responses[code].hosts).forEach(h => {
          rows.push({ key: `${code} ${h}`, code: code, host: h, val: responses[code].hosts[h] })
        })
      })
      return rows
    }
  }
}
</script>
<style scoped>

</style>