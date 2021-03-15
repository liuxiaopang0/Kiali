"use strict";
exports.__esModule = true;
exports.getFormatter = void 0;
var getFormatter = function (d3Format, unit) {
    return function (val) {
        // Round to dismiss float imprecision
        val = Math.round(val * 10000) / 10000;
        switch (unit) {
            case 'seconds':
                return formatSI(d3Format, val, 's');
            case 'bytes':
            case 'bytes-si':
                return formatDataSI(d3Format, val, 'B');
            case 'bytes-iec':
                return formatDataIEC(d3Format, val, 'B');
            case 'bitrate':
            case 'bitrate-si':
                return formatDataSI(d3Format, val, 'bit/s');
            case 'bitrate-iec':
                return formatDataIEC(d3Format, val, 'bit/s');
            default:
                // Fallback to default SI scaler:
                return formatDataSI(d3Format, val, unit);
        }
    };
};
exports.getFormatter = getFormatter;
var formatDataSI = function (d3Format, val, suffix) {
    return formatData(d3Format, val, 1000, ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']) + suffix;
};
var formatDataIEC = function (d3Format, val, suffix) {
    return formatData(d3Format, val, 1024, ['Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi', 'Yi']) + suffix;
};
var formatData = function (d3Format, val, threshold, units) {
    if (Math.abs(val) < threshold) {
        return val + ' ';
    }
    var u = -1;
    do {
        val /= threshold;
        ++u;
    } while (Math.abs(val) >= threshold && u < units.length - 1);
    return d3Format('~r')(val) + ' ' + units[u];
};
var formatSI = function (d3Format, val, suffix) {
    var fmt = d3Format('~s')(val);
    var si = '';
    // Insert space before SI
    // "fmt" can be something like:
    // - "9k" => we want "9 kB"
    // - "9" => we want "9 B"
    for (var i = fmt.length - 1; i >= 0; i--) {
        var c = fmt.charAt(i);
        if (c >= '0' && c <= '9') {
            return fmt.substr(0, i + 1) + ' ' + si + suffix;
        }
        si = c + si;
    }
    // Weird: no number found?
    return fmt + suffix;
};
