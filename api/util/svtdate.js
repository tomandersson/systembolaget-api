'use strict';

/*
 * NOTE This code originated from svtservice-svtse-render.
 * I should at some point be consolidated into to a shared library
 */

var moment = require('moment');

var MONTHS = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december'
];

var MONTHS_SHORT = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'dec'
];

var WEEEKDAYS = [
  'Söndag',
  'Måndag',
  'Tisdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lördag'
];

var WEEEKDAYS_SHORT = [
  'sön',
  'mån',
  'tis',
  'ons',
  'tor',
  'fre',
  'lör'
];

function yesterdayFormat(pubMoment) {
  return 'I går ' + pubMoment.format("HH.mm");
}

function todayFormat(pubMoment) {
  return 'I dag ' + pubMoment.format("HH.mm");
}

function withinOneHourFormat() {
  return 'inom 1 timme';
}

function inOneHourFormat() {
  return 'om 1 timme';
}

function inXHoursFormat(pubMoment, currentMoment) {
  var hour = pubMoment.diff(currentMoment, 'hours');
  return 'om ' + hour + ' timmar';
}

function tomorrowFormat(pubMoment, currentMoment) {
  return 'i morgon';
}

function onWeekdayFormat(pubMoment, currentMoment) {
  var dayNo = pubMoment.weekday();
  return 'på ' + WEEEKDAYS[dayNo];
}

function weekdayDateMonthFormat(pubMoment, currentMoment) {
  var dayNo = pubMoment.weekday();
  var monthNo = pubMoment.month();
  return WEEEKDAYS_SHORT[dayNo] + ' ' + pubMoment.date() + ' ' + MONTHS_SHORT[monthNo];
}

function dateMonthYearFormat(pubMoment) {
  var monthNo = pubMoment.month();
  return pubMoment.date() + ' ' + MONTHS_SHORT[monthNo] + ' ' + pubMoment.year();
}


function beforeStartOfYear(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().startOf('year'));
}

function beforeYesterday(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().subtract(1, 'days').startOf('day'));
}

function beforeToday(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().startOf('day'));
}

function beforeNow(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment);
}

function beforeOneHour(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().add(1, 'hours'));
}

function beforeTowHours(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().add(2, 'hours'));
}

function before24HoursButToday(pubMoment, currentMoment) {
  return pubMoment.isBefore(moment.min(
      currentMoment.clone().add(24, 'hours'),
      currentMoment.clone().add(1, 'days').startOf('day')));
}

function before24Hours(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().add(24, 'hours'));
}

function beforeOneWeek(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().add(1, 'weeks'));
}

function beforeEndOfYear(pubMoment, currentMoment) {
  return pubMoment.isBefore(currentMoment.clone().add(1, 'years').startOf('year'));
}

function isValidDate(date) {
  return date && (date instanceof Date);
}

function splitSeconds(seconds) {
  var secondsPart = seconds % 60;
  var minutePart = Math.floor((seconds % 3600) / 60);
  var hourPart = Math.floor(seconds/ 3600);

  return {
    seconds: secondsPart,
    minutes: minutePart,
    hours: hourPart
  };
}

var TEN_MINUTES_IN_SECONDS = 600;

module.exports = {


  formatDuration: function (seconds) {
    var format = [];
    var duration = splitSeconds(seconds);

    if (seconds > 0) {
      if (duration.hours > 0) {
        format.push(duration.hours);
        format.push('tim');
      }
      if (duration.minutes > 0) {
        format.push(duration.minutes);
        format.push('min');
      }
      if (seconds < TEN_MINUTES_IN_SECONDS) {
        if (duration.seconds > 0) {
          format.push(duration.seconds);
          format.push('sek');
        }
      }
    } else {
      format.push('0 sek');
    }

    return format.join(' ');
  },

  formatLongDate: function(date) {
    if (!isValidDate(date)) {
      return '';
    }

    var dateMoment = moment(date).clone();
    var dayNo = dateMoment.weekday();
    var monthNo = dateMoment.month();

    return WEEEKDAYS[dayNo] + ' ' + dateMoment.date() + ' ' + MONTHS[monthNo] + ' ' + dateMoment.year();
  },

  formatLongDateAndTime: function(date) {
    if (!isValidDate(date)) {
      return '';
    }

    var today = moment();
    var dateMoment = moment(date).clone();
    var dayNo = dateMoment.weekday();
    var monthNo = dateMoment.month();

    var hour = dateMoment.hour();
    var minute = dateMoment.minute();


    var daysFromToday = dateMoment.diff(today, "days");

    if (daysFromToday === 0) {
      return todayFormat() + ' ' + dateMoment.format("HH.mm");
    } else {
      return WEEEKDAYS[dayNo] + ' ' + dateMoment.date() + ' ' + MONTHS[monthNo] + ' ' + dateMoment.format("HH.mm");
    }

  },

  /**
   * Format the publication data accordingly to the SVT date format specification.
   *
   * @param {Date} publicationDate the date to format
   * @return {String} the date in its string format
   */
  formatPublicationDate: function (publicationDate) {
    if (!isValidDate(publicationDate)) {
      return '';
    }

    // TODO make sure we use correct time zome (+01:00) when formatting

    var currentMoment = moment();
    var pubMoment = moment(publicationDate).clone();
    var result;

    if (beforeStartOfYear(pubMoment, currentMoment)) {
      return dateMonthYearFormat(pubMoment);
    } else if (beforeYesterday(pubMoment, currentMoment)) {
      return weekdayDateMonthFormat(pubMoment);
    } else if (beforeToday(pubMoment, currentMoment)) {
      return yesterdayFormat(pubMoment);
    } else if (beforeNow(pubMoment, currentMoment)) {
      return todayFormat(pubMoment);
    } else if (beforeOneHour(pubMoment, currentMoment)) {
      result = withinOneHourFormat();
    } else if (beforeTowHours(pubMoment, currentMoment)) {
      result = inOneHourFormat();
    } else if (before24HoursButToday(pubMoment, currentMoment)) {
      result = inXHoursFormat(pubMoment, currentMoment);
    } else if (before24Hours(pubMoment, currentMoment)) {
      result = tomorrowFormat(pubMoment, currentMoment);
    } else if (beforeOneWeek(pubMoment, currentMoment)) {
      result = onWeekdayFormat(pubMoment, currentMoment);
    } else if (beforeEndOfYear(pubMoment, currentMoment)) {
      result = weekdayDateMonthFormat(pubMoment, currentMoment);
    } else {
      result = dateMonthYearFormat(pubMoment);
    }

    return result;
  },

  /**
   * Format the date accordingly to number of days to date. Ex 6 days into
   * the future becomes '6 dagar'
   *
   * @param {Date} date the date to format
   * @param {Date} currentMoment (optinal) date instance, for testing
   * @return {String} the date in its string format
   */
  formatDurationFromToday: function(date, currentMoment) {
    if (!currentMoment) {
      currentMoment = moment();
    }
    var laterMoment = moment(date).clone();
    laterMoment.locale('us');
    return laterMoment.from(currentMoment, true);
  },

  /**
   * Parse a date string in ISO 8601 format and return a date.
   *
   * If the date string does not contain a specific time zone it will assumed by the standard
   * to be the local time which is usually not a good this since this can differ for different
   * users.
   *
   * @param {isoString} isoString the date time string
   * @returns {Date} the date
   *
   */
  parseIsoString: function (isoString) {
    var momentDate = moment(isoString, moment.ISO_8601);
    var date = null;
    if (momentDate.isValid()) {
      date = momentDate.toDate();
    }
    return date;
  }


};
