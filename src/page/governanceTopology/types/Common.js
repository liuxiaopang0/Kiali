'use strict'
exports.__esModule = true
exports.isEqualTimeRange = exports.durationToBounds = exports.boundsToDuration = exports.evalTimeRange = exports.guardTimeRange = exports.UNIT_TIME = exports.MILLISECONDS = exports.HTTP_VERBS = void 0
// var Helper_1 = require('../components/Metrics/Helper')
// var HTTP_VERBS;
// (function(HTTP_VERBS) {
//   HTTP_VERBS['DELETE'] = 'DELETE'
//   HTTP_VERBS['GET'] = 'get'
//   HTTP_VERBS['PATCH'] = 'patch'
//   HTTP_VERBS['POST'] = 'post'
//   HTTP_VERBS['PUT'] = 'put'
// })(HTTP_VERBS = exports.HTTP_VERBS || (exports.HTTP_VERBS = {}))
exports.MILLISECONDS = 1000
exports.UNIT_TIME = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 3600,
  DAY: 24 * 3600
}
// Type-guarding TimeRange: executes first callback when range is a duration, or second callback when it's a bounded range, mapping to a value
function guardTimeRange(range, ifDuration, ifBounded) {
  if (range.from) {
    var b = {
      from: range.from
    }
    if (range.to) {
      b.to = range.to
    }
    return ifBounded(b)
  } else {
    if (range.rangeDuration) {
      return ifDuration(range.rangeDuration)
    }
  }
  // It shouldn't reach here a TimeRange should have DurationInSeconds or BoundsInMilliseconds
  return ifDuration(600)
}
exports.guardTimeRange = guardTimeRange
var evalTimeRange = function(range) {
  var bounds = guardTimeRange(range, exports.durationToBounds, function(b) { return b })
  return [bounds.from ? new Date(bounds.from) : new Date(), bounds.to ? new Date(bounds.to) : new Date()]
}
exports.evalTimeRange = evalTimeRange
var boundsToDuration = function(bounds) {
  return Math.floor(((bounds.to || new Date().getTime()) - (bounds.from || new Date().getTime())) / 1000)
}
exports.boundsToDuration = boundsToDuration
var durationToBounds = function(duration) {
  return {
    from: new Date().getTime() - duration * 1000
  }
}
exports.durationToBounds = durationToBounds
var isEqualTimeRange = function(t1, t2) {
  if (t1.from && t2.from && t1.from !== t2.from) {
    return false
  }
  if (t1.to && t2.to && t1.to !== t2.to) {
    return false
  }
  if (t1.rangeDuration && t2.rangeDuration && t1.rangeDuration !== t2.rangeDuration) {
    return false
  }
  return true
}
exports.isEqualTimeRange = isEqualTimeRange
