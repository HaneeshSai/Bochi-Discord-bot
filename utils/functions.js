let sqlite = require("sqlite3");

function formatDays(remTIme) {
  const roundTowardsZero = remTIme > 0 ? Math.floor : Math.ceil;
  const days = roundTowardsZero(remTIme / 86400000),
    hours = roundTowardsZero(remTIme / 3600000) % 24,
    minutes = roundTowardsZero(remTIme / 60000) % 60;
  let seconds = roundTowardsZero(remTIme / 1000) % 60;
  if (seconds === 0) seconds++;
  const isDay = days > 0,
    isHour = hours > 0,
    isMinute = minutes > 0;
  const dayUnit = days < 2 ? "day" : "days",
    hourUnit = hours < 2 ? "hour" : "hours",
    minuteUnit = minutes < 2 ? "minute" : "minutes",
    secondUnit = seconds < 2 ? "second" : "seconds";

  const pattern =
    (!isDay ? "" : `{days} ${dayUnit}, `) +
    (!isHour ? "" : `{hours} ${hourUnit}, `) +
    (!isMinute ? "" : `{minutes} ${minuteUnit}, `) +
    `{seconds} ${secondUnit}`;

  const content = pattern
    .replace("{days}", days.toString())
    .replace("{hours}", hours.toString())
    .replace("{minutes}", minutes.toString())
    .replace("{seconds}", seconds.toString());

  if (remTIme === 0) {
    return "0 seconds";
  }

  return content;
}

async function dbdata(x, y) {
  return new Promise((resolve, reject) => {
    x.get(y, [], (err, row) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

module.exports = { formatDays, dbdata };
