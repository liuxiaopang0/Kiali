"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.AutoComplete = void 0;
var AutoComplete = /** @class */ (function () {
    function AutoComplete(options) {
        this.options = options;
        this.endings = __spreadArray([], options);
        this.start = '';
    }
    AutoComplete.prototype.setInput = function (input, delims) {
        delims = !delims ? [' '] : delims;
        var lastDelim = -1;
        for (var _i = 0, delims_1 = delims; _i < delims_1.length; _i++) {
            var d = delims_1[_i];
            var i = input.lastIndexOf(d);
            lastDelim = i > lastDelim ? i : lastDelim;
        }
        this.start = lastDelim < 0 ? '' : input.slice(0, lastDelim + 1);
        var end = lastDelim < 0 ? input : input.slice(lastDelim + 1);
        this.endings = !end ? __spreadArray([], this.options) : this.options.filter(function (o) { return o.startsWith(end) && o !== end; });
        if (!this.endings.length) {
            this.start = input;
        }
    };
    AutoComplete.prototype.next = function () {
        if (!this.endings.length) {
            return this.start;
        }
        var nextEnding = this.endings.shift();
        this.endings.push(nextEnding);
        return "" + this.start + nextEnding;
    };
    return AutoComplete;
}());
exports.AutoComplete = AutoComplete;
