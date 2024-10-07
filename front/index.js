/**
 * @typedef {import('../schema.js').PrayerTimesResponse} PrayerTimesResponse
 */

function parseTime(time_str) {
  const hr = Number(time_str.slice(0, 2));
  const min = Number(time_str.slice(3, 5));

  return {
    hour: hr,
    minute: min,
  };
}

var currentPrayer;
/**
 * @type {PrayerTimesResponse | null}
 */
var cachedPrayerTimesResponse = null;
var currentDate = new Date();

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

    for (let i in b.data.timings) {
      const time = parseTime(b.data.timings[i]);
      const hr = (((time.hour - 1) % 12) + 1).toString();
      const min = time.minute < 10 ? `0${time.minute}` : time.minute.toString();

      const selector = `.prayerList_elem--${i.toLowerCase()} .time`;
      const el = document.querySelector(selector);
      if (el === null) continue;
      el.textContent = `${hr}:${min} ${time.hour < 12 ? "AM" : "PM"}`;
    }
  }

  let tempTime = {
    hour: -1,
    minute: -1,
  };

  let currentPrayer_ = "-----";
  for (let i in b.data.timings) {
    let time = parseTime(b.data.timings[i]);

    if (time.hour < tempTime.hour) {
      time.hour += 24; // Because the time flips after midnight, it messes with setting the h1 header. this is the fix.
    }
    tempTime = {
      ...time,
    };

    if (
      (d.getHours() > time.hour ||
        (d.getHours() === time.hour && d.getMinutes() >= time.minute)) &&
      document.querySelector(`.prayerList_elem--${i.toLowerCase()}`) !== null
    ) {
      currentPrayer_ = i;
    }
  }

  if (currentPrayer !== currentPrayer_) {
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
  }
}

setInterval(() => {
  getPrayerTimes();
}, 1000);
