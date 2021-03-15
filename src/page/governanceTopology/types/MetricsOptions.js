"use strict";
exports.__esModule = true;
exports.genStatsKey = exports.statsQueryToKey = void 0;
var statsQueryToKey = function (q) { return exports.genStatsKey(q.target, q.peerTarget, q.direction, q.interval); };
exports.statsQueryToKey = statsQueryToKey;
// !! genStatsKey HAS to mirror backend's models.MetricsStatsQuery#GenKey in models/metrics.go
var genStatsKey = function (target, peer, direction, interval) {
    var peerKey = peer ? genTargetKey(peer) : '';
    return genTargetKey(target) + ":" + peerKey + ":" + direction + ":" + interval;
};
exports.genStatsKey = genStatsKey;
var genTargetKey = function (target) {
    return target.namespace + ":" + target.kind + ":" + target.name;
};
