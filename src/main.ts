import { isArray, isString, isFunction, forEach } from "lodash-es";
import { timeFormat } from "d3-time-format";
import { stringify as queryStringStringify } from "query-string";

export default class Library {
  static get timeFormatted() {
    const formatter = timeFormat("%Y-%m-%d-%H");
    return formatter(new Date());
  }

  static isArray(thing: any) {
    return isArray(thing);
  }

  static queryStringify(params: object) {
    return queryStringStringify(params);
  }
}