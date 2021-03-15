<template>
  <div className="hidden">
    <div ref='contextMenuRef' />
  </div>
</template>
<script>
export default {
  name: 'CytoscapeContextMenuWrapper',
  mounted() {
    document.addEventListener('mouseup', this.handleDocumentMouseUp)
  },
  methods: {
    connectCy(cy) {
      cy.on('cxttapstart taphold', (event) => {
        event.preventDefault()
        if (event.target) {
          const currentContextMenu = this.getCurrentContextMenu()
          if (currentContextMenu) {
            currentContextMenu.hide(0) // hide it in 0ms
          }

          let contextMenuComponentType

          if (event.target === cy) {
            contextMenuComponentType = undefined
          } else if (event.target.isNode() && event.target.isParent()) {
            contextMenuComponentType = this.props.groupContextMenuContent
          } else if (event.target.isNode()) {
            contextMenuComponentType = this.props.nodeContextMenuContent
          } else if (event.target.isEdge()) {
            contextMenuComponentType = this.props.edgeContextMenuContent
          }

          if (contextMenuComponentType) {
            this.makeContextMenu(contextMenuComponentType, event.target)
          }
        }
        return false
      })
    },
    handleDocumentMouseUp(event) {
      if (event.button === 2) {
        // Ignore mouseup of right button
        return
      }
      const currentContextMenu = this.getCurrentContextMenu()
      if (currentContextMenu) {
        // Allow interaction in our popper component (Selecting and copying) without it disappearing
        if (event.target && currentContextMenu.popper.contains(event.target)) {
          return
        }
        currentContextMenu.hide()
      }
    },

    handleContextMenu(event) {
    // Disable the context menu in popper
      const currentContextMenu = this.getCurrentContextMenu()
      if (currentContextMenu) {
        if (event.target && currentContextMenu.popper.contains(event.target)) {
          event.preventDefault()
        }
      }
      return true
    },

    getCurrentContextMenu() {
      return this.$refs.contextMenuRef.current._contextMenu
    },

    setCurrentContextMenu(current) {
      this.$refs.contextMenuRef.current._contextMenu = current
    },

    tippyDistance(target) {
      if (target.isNode === undefined || target.isNode()) {
        return 10
      }
      return -30
    },
    addContextMenuEventListener() {
      document.addEventListener('contextmenu', this.handleContextMenu)
    },

    removeContextMenuEventListener() {
      document.removeEventListener('contextmenu', this.handleContextMenu)
    },
    makeContextMenu(ContextMenuComponentClass, target) {
    // Prevent the tippy content from picking up the right-click when we are moving it over to the edge/node
      this.addContextMenuEventListener()
      // const content = this.contextMenuRef.current
      // const tippyInstance = tippy(
      //   target.popperRef(), // Using an extension, popperRef is not in base definition
      //   {
      //     content: content,
      //     trigger: 'manual',
      //     arrow: true,
      //     placement: 'bottom',
      //     hideOnClick: false,
      //     multiple: false,
      //     sticky: true,
      //     interactive: true,
      //     theme: 'light-border',
      //     size: 'large',
      //     distance: this.tippyDistance(target)
      //   }
      // ).instances[0]

      // const result = (
      //   <Provider store={store}>
      //     <Router history={history}>
      //       <ContextMenuComponentClass element={target} contextMenu={tippyInstance} {...target.data()} />
      //     </Router>
      //   </Provider>
      // )

      // ReactDOM.render(result, content, () => {
      //   this.setCurrentContextMenu(tippyInstance)
      //   tippyInstance.show()
      //   // Schedule the removal of the contextmenu listener after finishing with the show procedure, so we can
      //   // interact with the popper content e.g. select and copy (with right click) values from it.
      //   setTimeout(() => {
      //     this.removeContextMenuEventListener()
      //   }, 0)
      // })
    }
  },
  destroyed() {
    document.removeEventListener('mouseup', this.handleDocumentMouseUp)
  }
}
</script>
<style scoped>

</style>