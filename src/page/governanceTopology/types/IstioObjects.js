"use strict";
exports.__esModule = true;
exports.PeerAuthenticationMutualTLSMode = exports.PrincipalBinding = exports.MutualTlsMode = exports.CaptureMode = exports.ValidationTypes = void 0;
var ValidationTypes;
(function (ValidationTypes) {
    ValidationTypes["Error"] = "error";
    ValidationTypes["Warning"] = "warning";
    ValidationTypes["Correct"] = "correct";
    ValidationTypes["Info"] = "info";
})(ValidationTypes = exports.ValidationTypes || (exports.ValidationTypes = {}));
// Sidecar resource https://preliminary.istio.io/docs/reference/config/networking/v1alpha3/sidecar
// 1.6
var CaptureMode;
(function (CaptureMode) {
    CaptureMode["DEFAULT"] = "DEFAULT";
    CaptureMode["IPTABLES"] = "IPTABLES";
    CaptureMode["NONE"] = "NONE";
})(CaptureMode = exports.CaptureMode || (exports.CaptureMode = {}));
var MutualTlsMode;
(function (MutualTlsMode) {
    MutualTlsMode["STRICT"] = "STRICT";
    MutualTlsMode["PERMISSIVE"] = "PERMISSIVE";
})(MutualTlsMode = exports.MutualTlsMode || (exports.MutualTlsMode = {}));
var PrincipalBinding;
(function (PrincipalBinding) {
    PrincipalBinding["USE_PEER"] = "USE_PEER";
    PrincipalBinding["USE_ORIGIN"] = "USE_ORIGIN";
})(PrincipalBinding = exports.PrincipalBinding || (exports.PrincipalBinding = {}));
var PeerAuthenticationMutualTLSMode;
(function (PeerAuthenticationMutualTLSMode) {
    PeerAuthenticationMutualTLSMode["UNSET"] = "UNSET";
    PeerAuthenticationMutualTLSMode["DISABLE"] = "DISABLE";
    PeerAuthenticationMutualTLSMode["PERMISSIVE"] = "PERMISSIVE";
    PeerAuthenticationMutualTLSMode["STRICT"] = "STRICT";
})(PeerAuthenticationMutualTLSMode = exports.PeerAuthenticationMutualTLSMode || (exports.PeerAuthenticationMutualTLSMode = {}));
