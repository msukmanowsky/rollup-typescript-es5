import { isArray } from 'lodash-es';
import { timeFormat } from 'd3-time-format';
import { stringify } from 'query-string';

var Library = /** @class */ (function () {
    function Library() {
    }
    Object.defineProperty(Library, "timeFormatted", {
        get: function () {
            var formatter = timeFormat("%Y-%m-%d-%H");
            return formatter(new Date());
        },
        enumerable: true,
        configurable: true
    });
    Library.isArray = function (thing) {
        return isArray(thing);
    };
    Library.queryStringify = function (params) {
        return stringify(params);
    };
    return Library;
}());

export default Library;
