<template>
  <div style="padding: 7px 10px;position: absolute;bottom: 0px;" v-show="!isError && !isLoading&&namespaces.length !== 0&&(elements && elements.nodes && elements.nodes.length > 1) && isMiniGraph">
    <el-tooltip
      class="item"
      effect="dark"
      :content="allowGrab ? '禁用拖动' : '启用拖动'"
      placement="top"
    >
      <el-button
        icon="icon-move-full"
        @click="allowGrab = !allowGrab,toggleDrag()"
        :style="{ color: allowGrab ? '#409EFF' : '' }"
      ></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="放大" placement="top">
      <el-button
        icon="icon-zoomIn"
        @click="zoomIn"
      ></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="缩小" placement="top">
      <el-button
        style="margin-left: -3px"
        icon="icon-suoxiao"
        @click="zoomOut"
      ></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="缩放以适合" placement="top">
      <el-button
        icon="icon-suofang"
        @click="fit"
      ></el-button>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="布局默认dagre"
      placement="top"
    >
      <el-button
        icon="icon-guanxitu1"
        @click="changeLayout('DagreGraph'),(layoutName = 'dagre')
        "
        :style="{ color: layoutName === 'dagre' ? '#409EFF' : '' }"
      ></el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="布局1" placement="top">
      <el-button
        style="margin-left: -3px"
        icon="icon-guanxitu1"
        @click="changeLayout('CoseGraph'),(layoutName = 'cose-bilkent')
        "
        :style="{ color: layoutName === 'cose-bilkent' ? '#409EFF' : '' }"
        >1</el-button
      >
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="布局2" placement="top">
      <el-button
        style="margin-left: -4px"
        icon="icon-guanxitu1"
        @click="changeLayout('ColaGraph'),(layoutName = 'cola')"
        :style="{ color: layoutName === 'cola' ? '#409EFF' : '' }"
        >2</el-button
      >
    </el-tooltip>
    <el-button type="primary" @click="$emit('clickLegend')">Legend</el-button>
  </div>
</template>
<script>
import * as CytoscapeGraphUtils from './CytoscapeGraphUtils'

import store from '@/store'

import { ColaGraph } from './graphs/ColaGraph'
import { CoseGraph } from './graphs/CoseGraph'
import { DagreGraph } from './graphs/DagreGraph'

export default {
  props: ['isError', 'dom', 'isLoading', 'namespaces', 'elements', 'isMiniGraph'],

  data() {
    return {
      allowGrab: false, // 是否能拖动

      layoutName: 'dagre' // 画图布局

    }
  },
  watch: {
    dom(newValue, oldValue) {
      console.log(newValue.$children[0].$refs.CytoscapeReactWrapper, 'newValue')
      this.$cy = newValue.$children[0].$refs.CytoscapeReactWrapper.$cy
    }
  },
  mounted() {

  },
  methods: {
    toggleDrag() {
      if (!this.$cy) {
        return
      }
      this.$cy.autoungrabify(!this.allowGrab)
      // this.setState({ allowGrab: !this.allowGrab })
    },
    zoom(step) {
      const container = this.$cy ? this.$cy.container() : undefined
      if (this.$cy && container) {
        this.$cy.zoom({
          level: this.$cy.zoom() * (1 + step),
          renderedPosition: {
            x: container.offsetWidth / 2,
            y: container.offsetHeight / 2
          }
        })
      }
    },

    zoomIn() {
      this.zoom(0.2)
    },

    zoomOut() {
      this.zoom(-0.2)
    },
    fit() {
      console.log(this.$cy, 'this.$cy')
      if (this.$cy) {
        CytoscapeGraphUtils.safeFit(this.$cy)
      }
    },
    changeLayout(data) {
      switch (data) {
        case 'ColaGraph':
          store.commit('set_layout', ColaGraph.getLayout())
          // this.$cy.ready()
          break
        case 'CoseGraph':
          store.commit('set_layout', CoseGraph.getLayout())
          // this.$cy.ready()
          break
        default:
          store.commit('set_layout', DagreGraph.getLayout())
          // this.$cy.ready()
      }
    }
  }
}
</script>
<style scoped>
</style>