"use strict";
exports.__esModule = true;
exports.isMTLSEnabled = exports.nsWideMTLSStatus = exports.MTLSStatuses = void 0;
var MTLSStatuses;
(function (MTLSStatuses) {
    MTLSStatuses["ENABLED"] = "MTLS_ENABLED";
    MTLSStatuses["PARTIALLY"] = "MTLS_PARTIALLY_ENABLED";
    MTLSStatuses["NOT_ENABLED"] = "MTLS_NOT_ENABLED";
    MTLSStatuses["DISABLED"] = "MTLS_DISABLED";
})(MTLSStatuses = exports.MTLSStatuses || (exports.MTLSStatuses = {}));
var nsWideMTLSStatus = function (nsStatus, meshStatus) {
    var finalStatus = nsStatus;
    // When mTLS is enabled meshwide but not disabled at ns level
    // Then the ns has mtls enabled
    if (meshStatus === MTLSStatuses.ENABLED && nsStatus === MTLSStatuses.NOT_ENABLED) {
        finalStatus = MTLSStatuses.ENABLED;
    }
    return finalStatus;
};
exports.nsWideMTLSStatus = nsWideMTLSStatus;
var isMTLSEnabled = function (status) {
    return status === MTLSStatuses.ENABLED;
};
exports.isMTLSEnabled = isMTLSEnabled;
