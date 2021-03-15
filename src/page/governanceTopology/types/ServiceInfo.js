"use strict";
exports.__esModule = true;
exports.globalChecks = exports.checkForPath = exports.validationToSeverity = exports.validationToHealth = exports.highestSeverity = exports.higherSeverity = void 0;
var Health_1 = require("./Health");
var IstioObjects_1 = require("./IstioObjects");
var higherThan = [
    'error-warning',
    'error-improvement',
    'error-correct',
    'warning-improvement',
    'warning-correct',
    'improvement-correct'
];
var higherSeverity = function (a, b) {
    return higherThan.includes(a + '-' + b);
};
exports.higherSeverity = higherSeverity;
var highestSeverity = function (checks) {
    var severity = IstioObjects_1.ValidationTypes.Correct;
    checks.forEach(function (check) {
        if (exports.higherSeverity(check.severity, severity)) {
            severity = check.severity;
        }
    });
    return severity;
};
exports.highestSeverity = highestSeverity;
var validationToHealth = function (severity) {
    var status = Health_1.NA;
    if (severity === IstioObjects_1.ValidationTypes.Correct) {
        status = Health_1.HEALTHY;
    }
    else if (severity === IstioObjects_1.ValidationTypes.Warning) {
        status = Health_1.DEGRADED;
    }
    else if (severity === IstioObjects_1.ValidationTypes.Error) {
        status = Health_1.FAILURE;
    }
    return status;
};
exports.validationToHealth = validationToHealth;
var numberOfChecks = function (type, object) {
    return (object && object.checks ? object.checks : []).filter(function (i) { return i.severity === type; }).length;
};
var validationToSeverity = function (object) {
    var warnChecks = numberOfChecks(IstioObjects_1.ValidationTypes.Warning, object);
    var errChecks = numberOfChecks(IstioObjects_1.ValidationTypes.Error, object);
    return errChecks > 0 ? IstioObjects_1.ValidationTypes.Error : warnChecks > 0 ? IstioObjects_1.ValidationTypes.Warning : IstioObjects_1.ValidationTypes.Correct;
};
exports.validationToSeverity = validationToSeverity;
var checkForPath = function (object, path) {
    if (!object || !object.checks) {
        return [];
    }
    return object.checks.filter(function (item) {
        return item.path === path;
    });
};
exports.checkForPath = checkForPath;
var globalChecks = function (object) {
    return exports.checkForPath(object, '');
};
exports.globalChecks = globalChecks;
