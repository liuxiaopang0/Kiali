"use strict";
exports.__esModule = true;
exports.sumRequestsTEST = exports.aggregateTEST = exports.calculateStatusTEST = exports.getRateHealthConfigTEST = exports.getTrafficHealth = exports.getEdgeHealth = exports.DEFAULTCONF = exports.calculateErrorRate = void 0;
var TrafficHealth_1 = require("./TrafficHealth");
exports.getTrafficHealth = TrafficHealth_1.getTrafficHealth;
var GraphEdgeStatus_1 = require("./GraphEdgeStatus");
exports.getEdgeHealth = GraphEdgeStatus_1.getEdgeHealth;
var ErrorRate_1 = require("./ErrorRate");
exports.calculateErrorRate = ErrorRate_1.calculateErrorRate;
var utils_1 = require("./utils");
exports.DEFAULTCONF = utils_1.DEFAULTCONF;
/*

Export for testing

*/
exports.getRateHealthConfigTEST = utils_1.getRateHealthConfig;
exports.calculateStatusTEST = ErrorRate_1.calculateStatus;
exports.aggregateTEST = ErrorRate_1.aggregate;
exports.sumRequestsTEST = ErrorRate_1.sumRequests;
