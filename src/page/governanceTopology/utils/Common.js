"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.groupBy = exports.namespaceEquals = exports.arrayEquals = exports.removeDuplicatesArray = void 0;
var removeDuplicatesArray = function (a) { return __spreadArray([], Array.from(new Set(a))); };
exports.removeDuplicatesArray = removeDuplicatesArray;
var arrayEquals = function (a1, a2, comparator) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (var i = 0; i < a1.length; ++i) {
        if (!comparator(a1[i], a2[i])) {
            return false;
        }
    }
    return true;
};
exports.arrayEquals = arrayEquals;
var namespaceEquals = function (ns1, ns2) {
    return exports.arrayEquals(ns1, ns2, function (n1, n2) { return n1.name === n2.name; });
};
exports.namespaceEquals = namespaceEquals;
function groupBy(items, key) {
    return items.reduce(function (result, item) {
        var _a;
        return (__assign(__assign({}, result), (_a = {}, _a[item[key]] = __spreadArray(__spreadArray([], (result[item[key]] || [])), [item]), _a)));
    }, {});
}
exports.groupBy = groupBy;
