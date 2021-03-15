<template>
  <div id="cy" className="graph" style="height: calc(100vh - 230px);width:100%" ref='CytoscapeReactWrapper' />
</template>
<script>
import { GraphStyles } from './graphs/GraphStyles'

import canvas from 'cytoscape-canvas'
import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import dagre from 'cytoscape-dagre'
import coseBilkent from 'cytoscape-cose-bilkent'
import GroupCompoundLayout from './Layout/GroupCompoundLayout'
import popper from 'cytoscape-popper'
const nodeHtmlLabel = require('cy-node-html-label')

cytoscape.use(canvas)
cytoscape.use(cycola)
cytoscape.use(dagre)
cytoscape.use(coseBilkent)
cytoscape.use(popper)
cytoscape('layout', 'group-compound-layout', GroupCompoundLayout)
nodeHtmlLabel(cytoscape)

export default {
  name: 'CytoscapeReactWrapper',
  data() {
    return {
    }
  },
  mounted() {
    this.build()
  },
  methods: {
    build() {
      // if (this.$cy) {
      //   this.destroy()
      // }
      const opts = {
        container: this.$refs.CytoscapeReactWrapper,
        boxSelectionEnabled: false,
        style: GraphStyles.styles(),
        ...GraphStyles.options()
      }
      this.$cy = cytoscape(opts)
      // // Using an extension
      this.$cy.nodeHtmlLabel(GraphStyles.htmlNodeLabels(this.$cy))
    },
    destroy() {
      if (this.$cy) {
        this.$cy.destroy()
        this.$cy = undefined
      }
    }
  },
  destroyed() {
    this.destroy()
  }
}
</script>
<style scoped>

</style>