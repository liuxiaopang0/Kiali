<template>
  <div>
    <strong>{{title}}</strong>
    <el-table :data="[{'rate':rate,'successErr':successErr,'percentErr':percentErr}]" style="width: 100%">
      <el-table-column prop="rate" label="Total"></el-table-column>
      <el-table-column prop="successErr"  label="%Success"></el-table-column>
      <el-table-column prop="percentErr"  label="%Error"></el-table-column>
    </el-table>
    <div :id="id" :style="{height:'180px'}" class="echarts" ref="echarts1"></div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  props: ['title', 'rate', 'rateGrpcErr', 'rateNR', 'rate2xx', 'rate3xx', 'rate4xx', 'rate5xx'],
  computed: {
    id() {
      return 'echarts' + Math.random() * 100000
    },
    errRate() {
      return (this.rate4xx + this.rate5xx + this.rateNR).toFixed(2)
    },
    percentErr() {
      return this.rate === 0 ? 0 : ((this.errRate / this.rate) * 100).toFixed(2)
    },
    successErr() {
      return (100 - this.percentErr).toFixed(2)
    },
    percent2xx() {
      return this.rate === 0 ? 0 : ((this.rate2xx / this.rate) * 100).toFixed(2)
    },
    percent3xx() {
      return this.rate === 0 ? 0 : ((this.rate3xx / this.rate) * 100).toFixed(2)
    },
    percent4xx() {
      return this.rate === 0 ? 0 : ((this.rate4xx / this.rate) * 100).toFixed(2)
    },
    percent5xx() {
      return this.rate === 0 ? 0 : ((this.rate5xx / this.rate) * 100).toFixed(2)
    },
    percentNR() {
      return this.rate === 0 ? 0 : ((this.rateNR / this.rate) * 100).toFixed(2)
    }
  },
  data() {
    return {
      chart: {}
    }
  },
  mounted() {
    this.renderRateChartGrpc(this.percent2xx, this.percent3xx, this.percent4xx, this.percent5xx, this.percentNR)
  },
  methods: {
    renderRateChartGrpc(percent2xx, percent3xx, percent4xx, percent5xx, percentNR) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.resize()

      const optionData = {
        color: ['rgb(62, 134, 53)', 'rgb(115, 188, 247)', 'rgb(201, 25, 11)', 'rgb(71, 0, 0)', 'rgb(3, 3, 3)'],
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.seriesName + ' ' + params.value + '%'
          }
        },
        legend: {
          show: true,
          type: 'scroll',
          x: 'left',
          y: 'bottom',
          data: ['OK', '3xx', '4xx', '5xx', 'No']
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          show: false,
          data: [''],
          type: 'category'
        },
        series: [{
          name: 'OK',
          type: 'bar',
          stack: 'total',
          barWidth: 20,
          data: [percent2xx]
        },
        {
          name: '3xx',
          type: 'bar',
          stack: 'total',
          barWidth: 20,
          data: [percent3xx]
        },
        {
          name: '4xx',
          type: 'bar',
          stack: 'total',
          barWidth: 20,
          data: [percent4xx]
        },
        {
          name: '5xx',
          type: 'bar',
          stack: 'total',
          barWidth: 20,
          data: [percent5xx]
        },
        {
          name: 'No',
          type: 'bar',
          stack: 'total',
          barWidth: 20,
          data: [percentNR]
        }]
      }

      this.chart.setOption(optionData, true)
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
    }
  }

}
</script>
<style scoped>

</style>