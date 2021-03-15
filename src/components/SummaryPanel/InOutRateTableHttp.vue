<template>
  <div>
    <strong>{{title}}</strong>
    <el-table :data="[{'titl':'In','Total':inRate,'Success':percentInSuccess,'Error':percentInErr},{'titl':'Out','Total':outRate,'Success':percentOutSuccess,'Error':percentOutErr}]" style="width: 100%">
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
  name: 'InOutRateTableHttp',
  props: ['title', 'inRate', 'inRate3xx', 'inRate4xx', 'inRate5xx', 'inRateNR', 'outRate', 'outRate3xx', 'outRate4xx', 'outRate5xx', 'outRateNR'],
  computed: {
    id() {
      return 'echarts' + Math.random() * 100000
    },
    // for the table
    inErrRate() {
      return this.inRate4xx + this.inRate5xx + this.inRateNR
    },
    outErrRate() {
      return this.outRate4xx + this.outRate5xx + this.outRateNR
    },
    percentInErr() {
      return this.inRate === 0 ? 0 : (this.inErrRate / this.inRate) * 100
    },
    percentOutErr() {
      return this.outRate === 0 ? 0 : (this.outErrRate / this.outRate) * 100
    },
    percentInSuccess() {
      return 100 - this.percentInErr
    },
    percentOutSuccess() {
      return 100 - this.percentOutErr
    },

    // for the graphs
    rate2xxIn() {
      return this.inRate === 0 ? 0 : this.inRate - this.inRate3xx - this.inRate4xx - this.inRate5xx - this.inRateNR
    }, rate2xxOut() {
      return this.outRate === 0 ? 0 : this.outRate - this.outRate3xx - this.outRate4xx - this.outRate5xx - this.outRateNR
    }, percent2xxIn() {
      return this.inRate === 0 ? 0 : (this.rate2xxIn / this.inRate) * 100
    },
    percent3xxIn() {
      return this.inRate === 0 ? 0 : (this.inRate3xx / this.inRate) * 100
    },
    percent4xxIn() {
      return this.inRate === 0 ? 0 : (this.inRate4xx / this.inRate) * 100
    },
    percent5xxIn() {
      return this.inRate === 0 ? 0 : (this.inRate5xx / this.inRate) * 100
    },
    percentNRIn() {
      return this.inRate === 0 ? 0 : (this.inRateNR / this.inRate) * 100
    },
    percent2xxOut() {
      return this.outRate === 0 ? 0 : (this.rate2xxOut / this.outRate) * 100
    },
    percent3xxOut() {
      return this.outRate === 0 ? 0 : (this.outRate3xx / this.outRate) * 100
    },
    percent4xxOut() {
      return this.outRate === 0 ? 0 : (this.outRate4xx / this.outRate) * 100
    },
    percent5xxOut() {
      return this.outRate === 0 ? 0 : (this.outRate5xx / this.outRate) * 100
    },
    percentNROut() {
      return this.outRate === 0 ? 0 : (this.outRateNR / this.outRate) * 100
    }
  },
  data() {
    return {
      chart: {}
    }
  },
  mounted() {
    this.renderRateChartGrpc(this.percent2xxIn, this.percent3xxIn, this.percent4xxIn, this.percent5xxIn, this.percentNRIn, this.percent2xxOut, this.percent3xxOut, this.percent4xxOut, this.percent5xxOut, this.percentNROut)
  },
  methods: {
    renderRateChartGrpc(percent2xxIn, percent3xxIn, percent4xxIn, percent5xxIn, percentNRIn, percent2xxOut, percent3xxOut, percent4xxOut, percent5xxOut, percentNROut) {
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