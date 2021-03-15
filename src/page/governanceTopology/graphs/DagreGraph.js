export const DagreGraph = {
  getLayout() {
    return {
      name: 'dagre',
      fit: false,
      nodeDimensionsIncludeLabels: true,
      rankDir: 'LR'
    }
  }
}
