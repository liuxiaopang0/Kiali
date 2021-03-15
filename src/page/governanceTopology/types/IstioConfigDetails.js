'use strict'
exports.__esModule = true
exports.compareResourceVersion = exports.safeDumpOptions = exports.aceOptions = void 0
exports.aceOptions = {
  showPrintMargin: false,
  autoScrollEditorIntoView: true
}
exports.safeDumpOptions = {
  styles: {
    '!!null': 'canonical' // dump null as ~
  }
}
// Helper function to compare two IstioConfigDetails iterating over its IstioObject children.
// When an IstioObject child has changed (resourceVersion is different) it will return a tuple with
//  boolean: true if resourceVersion has changed in newer version
//  string: IstioObject child
//  string: resourceVersion of newer version
var compareResourceVersion = function(oldIstioConfigDetails, newIstioConfigDetails) {
  var keys = Object.keys(oldIstioConfigDetails)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var oldIstioObject = oldIstioConfigDetails[key]
    var newIstioObject = newIstioConfigDetails[key]
    if (oldIstioObject &&
            newIstioObject &&
            oldIstioObject.metadata &&
            newIstioObject.metadata &&
            oldIstioObject.metadata.resourceVersion &&
            newIstioObject.metadata.resourceVersion &&
            oldIstioObject.metadata.resourceVersion !== newIstioObject.metadata.resourceVersion) {
      return [true, key, newIstioObject.metadata.resourceVersion]
    }
  }
  return [false, '', '']
}
exports.compareResourceVersion = compareResourceVersion
