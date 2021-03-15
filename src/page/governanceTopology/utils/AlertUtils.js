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
exports.__esModule = true;
exports.addWarning = exports.addSuccess = exports.addInfo = exports.extractAxiosError = exports.addError = exports.addMessage = exports.add = void 0;
var ConfigStore_1 = require("../store/ConfigStore");
var MessageCenter_1 = require("../types/MessageCenter");
var MessageCenterActions_1 = require("../actions/MessageCenterActions");
var API = require("../services/Api");
var add = function (content, group, type) {
    ConfigStore_1.store.dispatch(MessageCenterActions_1.MessageCenterActions.addMessage(content, '', group, type));
};
exports.add = add;
var addMessage = function (msg) {
    ConfigStore_1.store.dispatch(MessageCenterActions_1.MessageCenterActions.addMessage(msg.content, msg.detail || '', msg.group, msg.type, msg.showNotification));
};
exports.addMessage = addMessage;
var addError = function (message, error, group, type, detail) {
    if (!error) {
        ConfigStore_1.store.dispatch(MessageCenterActions_1.MessageCenterActions.addMessage(message, detail ? detail : '', group, MessageCenter_1.MessageType.ERROR));
        return;
    }
    var finalType = type ? type : MessageCenter_1.MessageType.ERROR;
    var err = exports.extractAxiosError(message, error);
    exports.addMessage(__assign(__assign({}, err), { group: group, type: finalType }));
};
exports.addError = addError;
var extractAxiosError = function (message, error) {
    var errorString = API.getErrorString(error);
    var errorDetail = API.getErrorDetail(error);
    if (message) {
        // combine error string and detail into a single detail
        if (errorString && errorDetail) {
            return { content: message, detail: errorString + "\nAdditional Detail:\n" + errorDetail };
        }
        else if (errorDetail) {
            return { content: message, detail: errorDetail };
        }
        else {
            return { content: message, detail: errorString };
        }
    }
    return { content: errorString, detail: errorDetail };
};
exports.extractAxiosError = extractAxiosError;
// info level message do not generate a toast notification
var addInfo = function (content, showNotification, group) {
    ConfigStore_1.store.dispatch(MessageCenterActions_1.MessageCenterActions.addMessage(content, '', group, MessageCenter_1.MessageType.INFO, showNotification));
};
exports.addInfo = addInfo;
var addSuccess = function (content, showNotification, group) {
    ConfigStore_1.store.dispatch(MessageCenterActions_1.MessageCenterActions.addMessage(content, '', group, MessageCenter_1.MessageType.SUCCESS, showNotification));
};
exports.addSuccess = addSuccess;
var addWarning = function (content, showNotification, group, detail) {
    ConfigStore_1.store.dispatch(MessageCenterActions_1.MessageCenterActions.addMessage(content, detail ? detail : '', group, MessageCenter_1.MessageType.WARNING, showNotification));
};
exports.addWarning = addWarning;
