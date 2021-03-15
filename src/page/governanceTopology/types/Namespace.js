"use strict";
exports.__esModule = true;
exports.namespacesToString = exports.namespacesFromString = exports.namespaceFromString = void 0;
var namespaceFromString = function (namespace) { return ({ name: namespace }); };
exports.namespaceFromString = namespaceFromString;
var namespacesFromString = function (namespaces) {
    return namespaces.split(',').map(function (name) { return exports.namespaceFromString(name); });
};
exports.namespacesFromString = namespacesFromString;
var namespacesToString = function (namespaces) { return namespaces.map(function (namespace) { return namespace.name; }).join(','); };
exports.namespacesToString = namespacesToString;
