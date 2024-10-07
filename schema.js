/**
 * @typedef {Object} Timings
 * @property {string} Imsak - Time for Imsak (pre-dawn meal ending).
 * @property {string} Fajr - Time for Fajr prayer.
 * @property {string} Sunrise - Time for Sunrise.
 * @property {string} Dhuhr - Time for Dhuhr prayer.
 * @property {string} Asr - Time for Asr prayer.
 * @property {string} Maghrib - Time for Maghrib prayer.
 * @property {string} Sunset - Time for Sunset.
 * @property {string} Isha - Time for Isha prayer.
 * @property {string} Firstthird - Time for First Third of the Night.
 * @property {string} Midnight - Time for Midnight.
 * @property {string} Lastthird - Time for Last Third of the Night.
 */

/**
 * @typedef {Object} DateInfo
 * @property {string} readable - The human-readable date format.
 * @property {string} timestamp - Timestamp for the date.
 * @property {Object} gregorian - Gregorian calendar date.
 * @property {Object} hijri - Hijri calendar date.
 */

/**
 * @typedef {Object} MetaInfo
 * @property {number} latitude - The latitude of the location.
 * @property {number} longitude - The longitude of the location.
 * @property {string} timezone - The timezone of the location.
 * @property {Object} method - The prayer calculation method used.
 * @property {string} latitudeAdjustmentMethod - Method for latitude adjustment.
 * @property {string} midnightMode - Mode used for calculating midnight.
 * @property {string} school - School of thought used for prayer timings.
 */

/**
 * @typedef {Object} PrayerTimesResponse
 * @property {number} code - Response status code.
 * @property {string} status - Status description.
 * @property {Object} data - Contains timings, date info, and metadata.
 * @property {Timings} data.timings - Prayer timings.
 * @property {DateInfo} data.date - Date information.
 * @property {MetaInfo} data.meta - Meta information including latitude, longitude, and timezone.
 */
