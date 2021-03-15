<template>
  <div>
    <strong>{{title}}</strong>
    <el-table :data="[{'rate':rate.toFixed(2),'percentOK':percentOK,'percentErr':percentErr}]" style="width: 100%">
      <el-table-column prop="rate" label="Total"></el-table-column>
      <el-table-column prop="percentOK"  label="%Success"></el-table-column>
      <el-table-column prop="percentErr"  label="%Error"></el-table-column>
    </el-table>
    <div :id="id" :style="{height:'180px'}" class="echarts" ref="echarts"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: ['title', 'rate', 'rateGrpcErr', 'rateNR'],
  computed: {
    id() {
      return 'echarts' + Math.random() * 100000
    },
    errRate() {
      return this.rateGrpcErr + this.rateNR
    },
    percentErr() {
      return this.rate === 0 ? 0 : ((this.errRate / this.rate) * 100).toFixed(2)
    },
    percentOK() {
      return (100 - this.percentErr).toFixed(2)
    }
  },
  data() {
    return {
      chart: {}
    }
  },
  mounted() {
    this.renderRateChartGrpc(this.percentOK, this.percentErr)
  },
  methods: {
    renderRateChartGrpc(percentOK, percentErr) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.resize()

      const optionData = {
        color: ['rgb(62, 134, 53)', 'rgb(201, 25, 11)'],
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return params.seriesName + ' ' + params.value + '%'
          }
        },
        legend: {
          show: true,
          x: 'left',
          y: 'bottom',
          data: [
            'OK',
            'Err'
          ]
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
          data: [percentOK]
        },
        {
          name: 'Err',
          type: 'bar',
          stack: 'total',
          barWidth: 20,
          data: [percentErr]
        }]
      }

      this.chart.setOption(optionData, true)
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
      // const colorVals = getPFAlertColorVals()
      // const vcLines = [
      //   { name: 'OK', x: 'rate', y: percentOK, color: '#3e8635' },
      //   { name: 'Err', x: 'rate', y: percentErr, color: 'red' }
      // ].map(dp => {
      //   return {
      //     datapoints: [dp],
      //     color: dp.color,
      //     legendItem: {
      //       name: dp.name,
      //       symbol: { fill: dp.color }
      //     }
      //   }
      // })
      // return vcLines
    }
  }

}
</script>
<style scoped>

</style>