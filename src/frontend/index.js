/**
 * @typedef {import('../schema.js').PrayerTimesResponse} PrayerTimesResponse
 * @typedef {import('../schema.js').Timings} Timings
 */

/**
 * @type {(keyof Timings)[]}
 */
const ALL_TIMINGS_IN_ORDER = [
  "Imsak",
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Sunset",
  "Isha",
  "Firstthird",
  "Midnight",
  "Lastthird",
];

/**
 * @typedef {Object} Time
 * @prop {number} hour
 * @prop {number} minute
 */

/**
 *
 * @param {string} time_str
 * @returns {Time}
 */
function parseTime(time_str) {
  const hr = Number(time_str.slice(0, 2));
  const min = Number(time_str.slice(3, 5));

  return {
    hour: hr,
    minute: min,
  };
}

/**
 * @type {string}
 */
var currentPrayer;
/**
 * @type {PrayerTimesResponse | null}
 */
var cachedPrayerTimesResponse = null;
var currentDate = new Date();

/**
 *
 * @param {Time} time
 * @returns {string}
 */
function timeToString(time) {
  const hr = (((time.hour - 1) % 12) + 1).toString();
  const min = time.minute < 10 ? `0${time.minute}` : time.minute.toString();
  return `${hr}:${min} ${time.hour < 12 ? "AM" : "PM"}`;
}

async function getPrayerTimes() {
  const d = new Date();

  /**
   * @type {PrayerTimesResponse}
   */
  let b;

  if (currentDate.getDate() === d.getDate() && cachedPrayerTimesResponse) {
    b = cachedPrayerTimesResponse;
  } else {
    b = await window.indexBridge.getPrayerTimes();
    cachedPrayerTimesResponse = b;

    for (let ix = 0; ix < ALL_TIMINGS_IN_ORDER.length; ix++) {
      const i = ALL_TIMINGS_IN_ORDER[ix];

      const selector = `.prayerList_elem--${i.toLowerCase()} .time`;
      const el = document.querySelector(selector);
      if (el === null) continue;

      el.textContent = timeToString(parseTime(b.data.timings[i]));
    }
  }

  const timeToMinAfterZero = ({ minute, hour }) => minute + hour * 60;

  let currentPrayer_ = currentPrayer;
  for (let ix = 0; ix < ALL_TIMINGS_IN_ORDER.length; ix++) {
    const i = ALL_TIMINGS_IN_ORDER[ix];

    let time = parseTime(b.data.timings[i]);

    let timeMinCount = timeToMinAfterZero(time);

    if (
      timeMinCount <
      timeToMinAfterZero(parseTime(b.data.timings[ALL_TIMINGS_IN_ORDER[0]]))
    ) {
      timeMinCount += 60 * 24;
    }

    if (
      timeToMinAfterZero({ hour: d.getHours(), minute: d.getMinutes() }) >=
        timeMinCount &&
      document.querySelector(`.prayerList_elem--${i.toLowerCase()}`) !== null
    ) {
      currentPrayer_ = i;
    }
  }

  if (currentPrayer_ !== currentPrayer) {
    let selected = document.querySelector(`.selected`);
    if (selected !== null) selected.classList.remove("selected");

    currentPrayer = currentPrayer_;
    const header = document.querySelector("h1");
    if (header === null) throw Error("NO HEADER");
    header.textContent = currentPrayer_;
    selected = document.querySelector(
      `.prayerList_elem--${currentPrayer_.toLowerCase()}`,
    );
    if (selected === null) throw Error("NO PRAYER TIME LIST ELEM TO SELECT");
    selected.classList.add("selected");

    const trayDisplayNames = getTrayDisplayNames(currentPrayer);
    const trayDisplayTimes = trayDisplayNames.map((n) =>
      timeToString(parseTime(b.data.timings[n])),
    );
    indexBridge.setCurrentPrayerTime(
      currentPrayer,
      trayDisplayNames,
      trayDisplayTimes,
    );

    const headerDisplayNames = getHeaderDisplayNames(currentPrayer);
    const headerDisplayTimes = trayDisplayNames.map((n) =>
      timeToString(parseTime(b.data.timings[n])),
    );
    let extra_info = "";
    for (let i = 0; i < headerDisplayNames.length; i++) {
      if (i > 0) extra_info += "\n";
      extra_info += `${formatHDN(headerDisplayNames[i])} - ${headerDisplayTimes[i]}`;
    }
    document.getElementById("extra_info").innerHTML = extra_info.replaceAll(
      "\n",
      "<br>",
    );
  }
}

/**
 * @function formatHDN
 * @param {keyof Timings} displayName
 * @returns {string}
 */
function formatHDN(displayName) {
  switch (displayName) {
    case "Fajr":
      return "F";
    case "Sunrise":
      return "SR";
    case "Dhuhr":
      return "Dh";
    case "Asr":
      return "A";
    case "Maghrib":
      return "M";
    case "Isha":
      return "I";
    case "Firstthird":
      return "FT";
    case "Midnight":
      return "MDNT";
    case "Lastthird":
      return "LT";
    default:
      return displayName;
  }
}

/**
 * @function getHeaderDisplayNames
 * @param {keyof Timings} name
 * @returns {(keyof Timings)[]}
 */
function getHeaderDisplayNames(name) {
  switch (name) {
    case "Imsak":
      return ["Fajr"];
    case "Fajr":
      return ["Sunrise"];
    case "Sunrise":
      return ["Dhuhr"];
    case "Dhuhr":
      return ["Asr"];
    case "Asr":
      return ["Maghrib"];
    case "Sunset":
    case "Maghrib":
      return ["Isha"];
    case "Isha":
      return ["Firstthird", "Lastthird"];
    case "Firstthird":
      return ["Firstthird", "Midnight", "Lastthird"];
    case "Midnight":
      return ["Firstthird", "Lastthird", "Fajr"];
    case "Lastthird":
      return ["Imsak", "Fajr"];
    default:
      return [];
  }
}

/**
 * @function getTrayDisplayNames
 * @param {keyof Timings} name
 * @returns {(keyof Timings)[]}
 */
function getTrayDisplayNames(name) {
  switch (name) {
    case "Imsak":
      return ["Fajr"];
    case "Fajr":
      return ["Sunrise"];
    case "Sunrise":
      return ["Dhuhr"];
    case "Dhuhr":
      return ["Asr"];
    case "Asr":
      return ["Maghrib"];
    case "Sunset":
    case "Maghrib":
      return ["Isha"];
    case "Isha":
      return ["Firstthird", "Midnight", "Lastthird", "Fajr"];
    case "Firstthird":
      return ["Firstthird", "Midnight", "Lastthird", "Fajr"];
    case "Midnight":
      return ["Firstthird", "Midnight", "Lastthird", "Fajr"];
    case "Lastthird":
      return ["Imsak", "Fajr"];
    default:
      return [];
  }
}

setInterval(() => {
  getPrayerTimes();
}, 1000);
