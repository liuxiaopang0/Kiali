"use strict";
exports.__esModule = true;
exports.getTrafficHealth = void 0;
var utils_1 = require("./utils");
var GraphEdgeStatus_1 = require("./GraphEdgeStatus");
/*
 Calculate Health for DetailsTraffic
*/
var getTrafficHealth = function (item, direction) {
    // Get the configuration for the node
    var config = utils_1.getRateHealthConfig(item.node.namespace, item.node.name, item.node.type);
    // Get tolerances of the configuration for the direction provided
    var tolerances = config === null || config === void 0 ? void 0 : config.tolerance.filter(function (tol) { return utils_1.checkExpr(tol.direction, direction); });
    // Get the responses like a item with traffic
    var traffic = item.traffic;
    // Aggregate the responses and transform them for calculate the status
    var agg = utils_1.aggregate(utils_1.transformEdgeResponses(traffic.responses, traffic.protocol), tolerances, true);
    return GraphEdgeStatus_1.calculateStatusGraph(agg, traffic.responses).status;
};
exports.getTrafficHealth = getTrafficHealth;
