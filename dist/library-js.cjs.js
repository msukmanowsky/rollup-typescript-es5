'use strict';

var lodashEs = require('lodash-es');
var d3TimeFormat = require('d3-time-format');
var queryString = require('query-string');

var Library = /** @class */ (function () {
    function Library() {
    }
    Object.defineProperty(Library, "timeFormatted", {
        get: function () {
            var formatter = d3TimeFormat.timeFormat("%Y-%m-%d-%H");
            return formatter(new Date());
        },
        enumerable: true,
        configurable: true
    });
    Library.isArray = function (thing) {
        return lodashEs.isArray(thing);
    };
    Library.queryStringify = function (params) {
        return queryString.stringify(params);
    };
    return Library;
}());

module.exports = Library;
