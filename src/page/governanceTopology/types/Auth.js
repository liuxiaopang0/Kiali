"use strict";
exports.__esModule = true;
exports.AuthResult = exports.AuthStrategy = void 0;
var AuthStrategy;
(function (AuthStrategy) {
    AuthStrategy["anonymous"] = "anonymous";
    AuthStrategy["openshift"] = "openshift";
    AuthStrategy["token"] = "token";
    AuthStrategy["openid"] = "openid";
})(AuthStrategy = exports.AuthStrategy || (exports.AuthStrategy = {}));
// Stores the result of a computation:
// hold = stop all computation and wait for a side-effect, such as a redirect
// continue = continue...
// success = authentication was a success, session is available
// failure = authentication failed, session is undefined but error is available
var AuthResult;
(function (AuthResult) {
    AuthResult["HOLD"] = "hold";
    AuthResult["CONTINUE"] = "continue";
    AuthResult["SUCCESS"] = "success";
    AuthResult["FAILURE"] = "failure";
})(AuthResult = exports.AuthResult || (exports.AuthResult = {}));
