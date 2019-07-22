(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Library = factory());
}(this, function () { 'use strict';

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var t0 = new Date, t1 = new Date;
  function newInterval(floori, offseti, count, field) {
      function interval(date) {
          return floori(date = new Date(+date)), date;
      }
      interval.floor = interval;
      interval.ceil = function (date) {
          return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };
      interval.round = function (date) {
          var d0 = interval(date), d1 = interval.ceil(date);
          return date - d0 < d1 - date ? d0 : d1;
      };
      interval.offset = function (date, step) {
          return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };
      interval.range = function (start, stop, step) {
          var range = [], previous;
          start = interval.ceil(start);
          step = step == null ? 1 : Math.floor(step);
          if (!(start < stop) || !(step > 0))
              return range; // also handles Invalid Date
          do
              range.push(previous = new Date(+start)), offseti(start, step), floori(start);
          while (previous < start && start < stop);
          return range;
      };
      interval.filter = function (test) {
          return newInterval(function (date) {
              if (date >= date)
                  while (floori(date), !test(date))
                      date.setTime(date - 1);
          }, function (date, step) {
              if (date >= date) {
                  if (step < 0)
                      while (++step <= 0) {
                          while (offseti(date, -1), !test(date)) { } // eslint-disable-line no-empty
                      }
                  else
                      while (--step >= 0) {
                          while (offseti(date, +1), !test(date)) { } // eslint-disable-line no-empty
                      }
              }
          });
      };
      if (count) {
          interval.count = function (start, end) {
              t0.setTime(+start), t1.setTime(+end);
              floori(t0), floori(t1);
              return Math.floor(count(t0, t1));
          };
          interval.every = function (step) {
              step = Math.floor(step);
              return !isFinite(step) || !(step > 0) ? null
                  : !(step > 1) ? interval
                      : interval.filter(field
                          ? function (d) { return field(d) % step === 0; }
                          : function (d) { return interval.count(0, d) % step === 0; });
          };
      }
      return interval;
  }

  var millisecond = newInterval(function () {
      // noop
  }, function (date, step) {
      date.setTime(+date + step);
  }, function (start, end) {
      return end - start;
  });
  // An optimized implementation for this simple case.
  millisecond.every = function (k) {
      k = Math.floor(k);
      if (!isFinite(k) || !(k > 0))
          return null;
      if (!(k > 1))
          return millisecond;
      return newInterval(function (date) {
          date.setTime(Math.floor(date / k) * k);
      }, function (date, step) {
          date.setTime(+date + step * k);
      }, function (start, end) {
          return (end - start) / k;
      });
  };

  var durationSecond = 1e3;
  var durationMinute = 6e4;
  var durationHour = 36e5;
  var durationDay = 864e5;
  var durationWeek = 6048e5;

  var second = newInterval(function (date) {
      date.setTime(date - date.getMilliseconds());
  }, function (date, step) {
      date.setTime(+date + step * durationSecond);
  }, function (start, end) {
      return (end - start) / durationSecond;
  }, function (date) {
      return date.getUTCSeconds();
  });

  var minute = newInterval(function (date) {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
  }, function (date, step) {
      date.setTime(+date + step * durationMinute);
  }, function (start, end) {
      return (end - start) / durationMinute;
  }, function (date) {
      return date.getMinutes();
  });

  var hour = newInterval(function (date) {
      date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
  }, function (date, step) {
      date.setTime(+date + step * durationHour);
  }, function (start, end) {
      return (end - start) / durationHour;
  }, function (date) {
      return date.getHours();
  });

  var day = newInterval(function (date) {
      date.setHours(0, 0, 0, 0);
  }, function (date, step) {
      date.setDate(date.getDate() + step);
  }, function (start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
  }, function (date) {
      return date.getDate() - 1;
  });

  function weekday(i) {
      return newInterval(function (date) {
          date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
          date.setHours(0, 0, 0, 0);
      }, function (date, step) {
          date.setDate(date.getDate() + step * 7);
      }, function (start, end) {
          return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
  }
  var sunday = weekday(0);
  var monday = weekday(1);
  var tuesday = weekday(2);
  var wednesday = weekday(3);
  var thursday = weekday(4);
  var friday = weekday(5);
  var saturday = weekday(6);

  var month = newInterval(function (date) {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
  }, function (date, step) {
      date.setMonth(date.getMonth() + step);
  }, function (start, end) {
      return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  }, function (date) {
      return date.getMonth();
  });

  var year = newInterval(function (date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
  }, function (date, step) {
      date.setFullYear(date.getFullYear() + step);
  }, function (start, end) {
      return end.getFullYear() - start.getFullYear();
  }, function (date) {
      return date.getFullYear();
  });
  // An optimized implementation for this simple case.
  year.every = function (k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
          date.setFullYear(Math.floor(date.getFullYear() / k) * k);
          date.setMonth(0, 1);
          date.setHours(0, 0, 0, 0);
      }, function (date, step) {
          date.setFullYear(date.getFullYear() + step * k);
      });
  };

  var utcMinute = newInterval(function (date) {
      date.setUTCSeconds(0, 0);
  }, function (date, step) {
      date.setTime(+date + step * durationMinute);
  }, function (start, end) {
      return (end - start) / durationMinute;
  }, function (date) {
      return date.getUTCMinutes();
  });

  var utcHour = newInterval(function (date) {
      date.setUTCMinutes(0, 0, 0);
  }, function (date, step) {
      date.setTime(+date + step * durationHour);
  }, function (start, end) {
      return (end - start) / durationHour;
  }, function (date) {
      return date.getUTCHours();
  });

  var utcDay = newInterval(function (date) {
      date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
      date.setUTCDate(date.getUTCDate() + step);
  }, function (start, end) {
      return (end - start) / durationDay;
  }, function (date) {
      return date.getUTCDate() - 1;
  });

  function utcWeekday(i) {
      return newInterval(function (date) {
          date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
          date.setUTCHours(0, 0, 0, 0);
      }, function (date, step) {
          date.setUTCDate(date.getUTCDate() + step * 7);
      }, function (start, end) {
          return (end - start) / durationWeek;
      });
  }
  var utcSunday = utcWeekday(0);
  var utcMonday = utcWeekday(1);
  var utcTuesday = utcWeekday(2);
  var utcWednesday = utcWeekday(3);
  var utcThursday = utcWeekday(4);
  var utcFriday = utcWeekday(5);
  var utcSaturday = utcWeekday(6);

  var utcMonth = newInterval(function (date) {
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
      date.setUTCMonth(date.getUTCMonth() + step);
  }, function (start, end) {
      return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  }, function (date) {
      return date.getUTCMonth();
  });

  var utcYear = newInterval(function (date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function (start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
  }, function (date) {
      return date.getUTCFullYear();
  });
  // An optimized implementation for this simple case.
  utcYear.every = function (k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function (date) {
          date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
          date.setUTCMonth(0, 1);
          date.setUTCHours(0, 0, 0, 0);
      }, function (date, step) {
          date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
  };

  function localDate(d) {
      if (0 <= d.y && d.y < 100) {
          var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
          date.setFullYear(d.y);
          return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }
  function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
          var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
          date.setUTCFullYear(d.y);
          return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }
  function newYear(y) {
      return { y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0 };
  }
  function formatLocale(locale) {
      var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_weekdays = locale.days, locale_shortWeekdays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
      var periodRe = formatRe(locale_periods), periodLookup = formatLookup(locale_periods), weekdayRe = formatRe(locale_weekdays), weekdayLookup = formatLookup(locale_weekdays), shortWeekdayRe = formatRe(locale_shortWeekdays), shortWeekdayLookup = formatLookup(locale_shortWeekdays), monthRe = formatRe(locale_months), monthLookup = formatLookup(locale_months), shortMonthRe = formatRe(locale_shortMonths), shortMonthLookup = formatLookup(locale_shortMonths);
      var formats = {
          "a": formatShortWeekday,
          "A": formatWeekday,
          "b": formatShortMonth,
          "B": formatMonth,
          "c": null,
          "d": formatDayOfMonth,
          "e": formatDayOfMonth,
          "f": formatMicroseconds,
          "H": formatHour24,
          "I": formatHour12,
          "j": formatDayOfYear,
          "L": formatMilliseconds,
          "m": formatMonthNumber,
          "M": formatMinutes,
          "p": formatPeriod,
          "Q": formatUnixTimestamp,
          "s": formatUnixTimestampSeconds,
          "S": formatSeconds,
          "u": formatWeekdayNumberMonday,
          "U": formatWeekNumberSunday,
          "V": formatWeekNumberISO,
          "w": formatWeekdayNumberSunday,
          "W": formatWeekNumberMonday,
          "x": null,
          "X": null,
          "y": formatYear,
          "Y": formatFullYear,
          "Z": formatZone,
          "%": formatLiteralPercent
      };
      var utcFormats = {
          "a": formatUTCShortWeekday,
          "A": formatUTCWeekday,
          "b": formatUTCShortMonth,
          "B": formatUTCMonth,
          "c": null,
          "d": formatUTCDayOfMonth,
          "e": formatUTCDayOfMonth,
          "f": formatUTCMicroseconds,
          "H": formatUTCHour24,
          "I": formatUTCHour12,
          "j": formatUTCDayOfYear,
          "L": formatUTCMilliseconds,
          "m": formatUTCMonthNumber,
          "M": formatUTCMinutes,
          "p": formatUTCPeriod,
          "Q": formatUnixTimestamp,
          "s": formatUnixTimestampSeconds,
          "S": formatUTCSeconds,
          "u": formatUTCWeekdayNumberMonday,
          "U": formatUTCWeekNumberSunday,
          "V": formatUTCWeekNumberISO,
          "w": formatUTCWeekdayNumberSunday,
          "W": formatUTCWeekNumberMonday,
          "x": null,
          "X": null,
          "y": formatUTCYear,
          "Y": formatUTCFullYear,
          "Z": formatUTCZone,
          "%": formatLiteralPercent
      };
      var parses = {
          "a": parseShortWeekday,
          "A": parseWeekday,
          "b": parseShortMonth,
          "B": parseMonth,
          "c": parseLocaleDateTime,
          "d": parseDayOfMonth,
          "e": parseDayOfMonth,
          "f": parseMicroseconds,
          "H": parseHour24,
          "I": parseHour24,
          "j": parseDayOfYear,
          "L": parseMilliseconds,
          "m": parseMonthNumber,
          "M": parseMinutes,
          "p": parsePeriod,
          "Q": parseUnixTimestamp,
          "s": parseUnixTimestampSeconds,
          "S": parseSeconds,
          "u": parseWeekdayNumberMonday,
          "U": parseWeekNumberSunday,
          "V": parseWeekNumberISO,
          "w": parseWeekdayNumberSunday,
          "W": parseWeekNumberMonday,
          "x": parseLocaleDate,
          "X": parseLocaleTime,
          "y": parseYear,
          "Y": parseFullYear,
          "Z": parseZone,
          "%": parseLiteralPercent
      };
      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);
      function newFormat(specifier, formats) {
          return function (date) {
              var string = [], i = -1, j = 0, n = specifier.length, c, pad, format;
              if (!(date instanceof Date))
                  date = new Date(+date);
              while (++i < n) {
                  if (specifier.charCodeAt(i) === 37) {
                      string.push(specifier.slice(j, i));
                      if ((pad = pads[c = specifier.charAt(++i)]) != null)
                          c = specifier.charAt(++i);
                      else
                          pad = c === "e" ? " " : "0";
                      if (format = formats[c])
                          c = format(date, pad);
                      string.push(c);
                      j = i + 1;
                  }
              }
              string.push(specifier.slice(j, i));
              return string.join("");
          };
      }
      function newParse(specifier, newDate) {
          return function (string) {
              var d = newYear(1900), i = parseSpecifier(d, specifier, string += "", 0), week, day$1;
              if (i != string.length)
                  return null;
              // If a UNIX timestamp is specified, return it.
              if ("Q" in d)
                  return new Date(d.Q);
              // The am-pm flag is 0 for AM, and 1 for PM.
              if ("p" in d)
                  d.H = d.H % 12 + d.p * 12;
              // Convert day-of-week and week-of-year to day-of-year.
              if ("V" in d) {
                  if (d.V < 1 || d.V > 53)
                      return null;
                  if (!("w" in d))
                      d.w = 1;
                  if ("Z" in d) {
                      week = utcDate(newYear(d.y)), day$1 = week.getUTCDay();
                      week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
                      week = utcDay.offset(week, (d.V - 1) * 7);
                      d.y = week.getUTCFullYear();
                      d.m = week.getUTCMonth();
                      d.d = week.getUTCDate() + (d.w + 6) % 7;
                  }
                  else {
                      week = newDate(newYear(d.y)), day$1 = week.getDay();
                      week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
                      week = day.offset(week, (d.V - 1) * 7);
                      d.y = week.getFullYear();
                      d.m = week.getMonth();
                      d.d = week.getDate() + (d.w + 6) % 7;
                  }
              }
              else if ("W" in d || "U" in d) {
                  if (!("w" in d))
                      d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
                  day$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
                  d.m = 0;
                  d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
              }
              // If a time zone is specified, all fields are interpreted as UTC and then
              // offset according to the specified time zone.
              if ("Z" in d) {
                  d.H += d.Z / 100 | 0;
                  d.M += d.Z % 100;
                  return utcDate(d);
              }
              // Otherwise, all fields are in local time.
              return newDate(d);
          };
      }
      function parseSpecifier(d, specifier, string, j) {
          var i = 0, n = specifier.length, m = string.length, c, parse;
          while (i < n) {
              if (j >= m)
                  return -1;
              c = specifier.charCodeAt(i++);
              if (c === 37) {
                  c = specifier.charAt(i++);
                  parse = parses[c in pads ? specifier.charAt(i++) : c];
                  if (!parse || ((j = parse(d, string, j)) < 0))
                      return -1;
              }
              else if (c != string.charCodeAt(j++)) {
                  return -1;
              }
          }
          return j;
      }
      function parsePeriod(d, string, i) {
          var n = periodRe.exec(string.slice(i));
          return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }
      function parseShortWeekday(d, string, i) {
          var n = shortWeekdayRe.exec(string.slice(i));
          return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }
      function parseWeekday(d, string, i) {
          var n = weekdayRe.exec(string.slice(i));
          return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }
      function parseShortMonth(d, string, i) {
          var n = shortMonthRe.exec(string.slice(i));
          return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }
      function parseMonth(d, string, i) {
          var n = monthRe.exec(string.slice(i));
          return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }
      function parseLocaleDateTime(d, string, i) {
          return parseSpecifier(d, locale_dateTime, string, i);
      }
      function parseLocaleDate(d, string, i) {
          return parseSpecifier(d, locale_date, string, i);
      }
      function parseLocaleTime(d, string, i) {
          return parseSpecifier(d, locale_time, string, i);
      }
      function formatShortWeekday(d) {
          return locale_shortWeekdays[d.getDay()];
      }
      function formatWeekday(d) {
          return locale_weekdays[d.getDay()];
      }
      function formatShortMonth(d) {
          return locale_shortMonths[d.getMonth()];
      }
      function formatMonth(d) {
          return locale_months[d.getMonth()];
      }
      function formatPeriod(d) {
          return locale_periods[+(d.getHours() >= 12)];
      }
      function formatUTCShortWeekday(d) {
          return locale_shortWeekdays[d.getUTCDay()];
      }
      function formatUTCWeekday(d) {
          return locale_weekdays[d.getUTCDay()];
      }
      function formatUTCShortMonth(d) {
          return locale_shortMonths[d.getUTCMonth()];
      }
      function formatUTCMonth(d) {
          return locale_months[d.getUTCMonth()];
      }
      function formatUTCPeriod(d) {
          return locale_periods[+(d.getUTCHours() >= 12)];
      }
      return {
          format: function (specifier) {
              var f = newFormat(specifier += "", formats);
              f.toString = function () { return specifier; };
              return f;
          },
          parse: function (specifier) {
              var p = newParse(specifier += "", localDate);
              p.toString = function () { return specifier; };
              return p;
          },
          utcFormat: function (specifier) {
              var f = newFormat(specifier += "", utcFormats);
              f.toString = function () { return specifier; };
              return f;
          },
          utcParse: function (specifier) {
              var p = newParse(specifier, utcDate);
              p.toString = function () { return specifier; };
              return p;
          }
      };
  }
  var pads = { "-": "", "_": " ", "0": "0" }, numberRe = /^\s*\d+/, // note: ignores next directive
  percentRe = /^%/, requoteRe = /[\\^$*+?|[\]().{}]/g;
  function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  function requote(s) {
      return s.replace(requoteRe, "\\$&");
  }
  function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }
  function formatLookup(names) {
      var map = {}, i = -1, n = names.length;
      while (++i < n)
          map[names[i].toLowerCase()] = i;
      return map;
  }
  function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
  }
  function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
  }
  function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
  }
  function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
  }
  function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
  }
  function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
  }
  function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }
  function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
  }
  function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }
  function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
  }
  function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }
  function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
  }
  function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
  }
  function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
  }
  function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
  }
  function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
  }
  function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
  }
  function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
  }
  function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
  }
  function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
  }
  function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
  }
  function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
  }
  function formatDayOfYear(d, p) {
      return pad(1 + day.count(year(d), d), p, 3);
  }
  function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
  }
  function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
  }
  function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
  }
  function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
  }
  function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
  }
  function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
  }
  function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(year(d), d), p, 2);
  }
  function formatWeekNumberISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
  }
  function formatWeekdayNumberSunday(d) {
      return d.getDay();
  }
  function formatWeekNumberMonday(d, p) {
      return pad(monday.count(year(d), d), p, 2);
  }
  function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
  }
  function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
  }
  function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
  }
  function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
  }
  function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
  }
  function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
  }
  function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }
  function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
  }
  function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
  }
  function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
  }
  function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
  }
  function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
  }
  function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
  }
  function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear(d), d), p, 2);
  }
  function formatUTCWeekNumberISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
  }
  function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
  }
  function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear(d), d), p, 2);
  }
  function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
  }
  function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
  }
  function formatUTCZone() {
      return "+0000";
  }
  function formatLiteralPercent() {
      return "%";
  }
  function formatUnixTimestamp(d) {
      return +d;
  }
  function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
  }

  var locale;
  var timeFormat;
  var timeParse;
  var utcFormat;
  var utcParse;
  defaultLocale({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });
  function defaultLocale(definition) {
      locale = formatLocale(definition);
      timeFormat = locale.format;
      timeParse = locale.parse;
      utcFormat = locale.utcFormat;
      utcParse = locale.utcParse;
      return locale;
  }

  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
  function formatIsoNative(date) {
      return date.toISOString();
  }
  var formatIso = Date.prototype.toISOString
      ? formatIsoNative
      : utcFormat(isoSpecifier);

  function parseIsoNative(string) {
      var date = new Date(string);
      return isNaN(date) ? null : date;
  }
  var parseIso = +new Date("2000-01-01T00:00:00.000Z")
      ? parseIsoNative
      : utcParse(isoSpecifier);

  var strictUriEncode = function (str) { return encodeURIComponent(str).replace(/[!'()*]/g, function (x) { return "%" + x.charCodeAt(0).toString(16).toUpperCase(); }); };

  function encoderForArrayFormat(options) {
      switch (options.arrayFormat) {
          case 'index':
              return function (key) { return function (result, value) {
                  var index = result.length;
                  if (value === undefined) {
                      return result;
                  }
                  if (value === null) {
                      return result.concat([[encode(key, options), '[', index, ']'].join('')]);
                  }
                  return result.concat([
                      [encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
                  ]);
              }; };
          case 'bracket':
              return function (key) { return function (result, value) {
                  if (value === undefined) {
                      return result;
                  }
                  if (value === null) {
                      return result.concat([[encode(key, options), '[]'].join('')]);
                  }
                  return result.concat([[encode(key, options), '[]=', encode(value, options)].join('')]);
              }; };
          case 'comma':
              return function (key) { return function (result, value, index) {
                  if (value === null || value === undefined || value.length === 0) {
                      return result;
                  }
                  if (index === 0) {
                      return [[encode(key, options), '=', encode(value, options)].join('')];
                  }
                  return [[result, encode(value, options)].join(',')];
              }; };
          default:
              return function (key) { return function (result, value) {
                  if (value === undefined) {
                      return result;
                  }
                  if (value === null) {
                      return result.concat([encode(key, options)]);
                  }
                  return result.concat([[encode(key, options), '=', encode(value, options)].join('')]);
              }; };
      }
  }
  function encode(value, options) {
      if (options.encode) {
          return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
      }
      return value;
  }
  var stringify = function (object, options) {
      if (!object) {
          return '';
      }
      options = Object.assign({
          encode: true,
          strict: true,
          arrayFormat: 'none'
      }, options);
      var formatter = encoderForArrayFormat(options);
      var keys = Object.keys(object);
      if (options.sort !== false) {
          keys.sort(options.sort);
      }
      return keys.map(function (key) {
          var value = object[key];
          if (value === undefined) {
              return '';
          }
          if (value === null) {
              return encode(key, options);
          }
          if (Array.isArray(value)) {
              return value
                  .reduce(formatter(key), [])
                  .join('&');
          }
          return encode(key, options) + '=' + encode(value, options);
      }).filter(function (x) { return x.length > 0; }).join('&');
  };

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

  return Library;

}));
