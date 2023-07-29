/**
 * A module for working with dates and times.
 * @module datetime
 */

"use strict";

const moment = require("jalali-moment");
require("moment-timezone");

/**
 * Converts a given date and time to the format "dddd D MMMM YYYY h:mm a" in the "fa" locale and the "Asia/Tehran" timezone.
 * @param {string} data - The date and time to convert, in any format that can be parsed by the `moment` library.
 * @returns {string} The converted date and time in the format "dddd D MMMM YYYY h:mm a".
 */
const changeTime = (data) => {
  const now = moment(data)
    .locale("fa")
    .tz("Asia/Tehran")
    .format("dddd D MMMM YYYY h:mm a");
  return now;
};

/**
 * Gets the current time in milliseconds since January 1, 1970 00:00:00 UTC.
 * @returns {number} The current time in milliseconds.
 */
const time = () => {
  const time = new Date().getTime();
  return time;
};

module.exports = {
  changeTime,
  time
};