<template>
  <div>
    <strong>{{title}}</strong>
    <el-table :data="[{'titl':'In','Total':inRate,'Success':percentOkIn,'Error':percentErrIn},{'titl':'Out','Total':outRate,'Success':percentOkOut,'Error':percentErrOut}]" style="width: 100%">
      <el-table-column prop="titl"></el-table-column>
      <el-table-column prop="Total" label="Total"></el-table-column>
      <el-table-column prop="Success"  label="%Success"></el-table-column>
      <el-table-column prop="Error"  label="%Error"></el-table-column>
    </el-table>
    <div :id="id" :style="{height:'180px'}" class="echarts" ref="echarts1"></div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  name: 'InOutRateTableGrpc',
  props: ['title', 'inRate', 'inRateGrpcErr', 'inRateNR', 'outRateGrpcErr', 'outRateNR', 'outRate', 'outErrRate'],
  computed: {
    id() {
      return 'echarts' + Math.random() * 100000
    },
    inErrRate() {
      return this.inRateGrpcErr + this.inRateNR
    },
    outErrRate() {
      return this.outRateGrpcErr + this.outRateNR
    },
    percentErrIn() {
      return this.inRate === 0 ? 0 : ((this.inErrRate / this.inRate) * 100).toFixed(2)
    },
    percentErrOut() {
      return this.outRate === 0 ? 0 : ((this.outErrRate / this.outRate) * 100).toFixed(2)
    },
    percentOkIn() {
      return (100 - this.percentErrIn).toFixed(2)
    },
    percentOkOut() {
      return (100 - this.percentErrOut).toFixed(2)
    }
  },
  data() {
    return {
      chart: {}
    }
  },
  mounted() {
    this.renderRateChartGrpc(this.percentOkIn, this.percentErrIn, this.percentOkOut, this.percentErrOut)
  },
  methods: {
    renderRateChartGrpc(percentOkIn, percentErrIn, percentOkOut, percentErrOut) {
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
        }
        // series: [{
        //   name: 'OK',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 20,
        //   data: [outErrRate]
        // },
        // {
        //   name: '3xx',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 20,
        //   data: [percent3xx]
        // },
        // {
        //   name: '4xx',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 20,
        //   data: [percent4xx]
        // },
        // {
        //   name: '5xx',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 20,
        //   data: [percent5xx]
        // },
        // {
        //   name: 'No',
        //   type: 'bar',
        //   stack: 'total',
        //   barWidth: 20,
        //   data: [percentNR]
        // }]
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