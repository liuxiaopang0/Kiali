<template>
  <div>
    <strong>{{title}}</strong>
    <el-table :data="rows" style="width: 100%">
      <el-table-column prop="key" label="Code"></el-table-column>
      <el-table-column prop="name" label="Flags">
        <template slot-scope="scope">{{ scope.row.flags }}</template>
      </el-table-column>
      <el-table-column prop="val" label="% Req"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import _ from 'lodash'
import responseFlags from '@/page/governanceTopology/utils/ResponseFlags'
export default {
  name: 'ResponseFlagsTable',
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
  methods: {
    getRows(responses) {
      const rows = []
      _.keys(responses).forEach(code => {
        _.keys(responses[code].flags).forEach(f => {
          rows.push({ key: `${code} ${f}`, code: code, flags: f, val: responses[code].flags[f] })
        })
      })
      return rows
    },
    getTitle(flags) {
      return flags
        .split(',')
        .map(flagToken => {
          flagToken = flagToken.trim()
          const flag = responseFlags[flagToken]
          return flagToken === '-' ? '' : `[${flagToken}] ${flag ? flag.help : 'Unknown Flag'}`
        })
        .join('\n')
    }
  }
}
</script>
<style scoped>

</style>