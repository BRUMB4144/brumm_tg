const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Разница между двумя датами в секундах. Возвращает null, если любая из границ не задана. */
const secondsBetween = (from, to) => {
  if (!from || !to) {
    return null;
  }
  return (new Date(to) - new Date(from)) / 1000;
};

/**
 * Сколько секунд длится интервал: до `to`, если он задан, иначе до текущего момента.
 * Возвращает 0, если начало не задано.
 */
const elapsedSeconds = (from, to) => {
  if (!from) {
    return 0;
  }
  const end = to ? new Date(to).getTime() : Date.now();
  return Math.floor((end - new Date(from).getTime()) / 1000);
};

/** Человекочитаемая длительность: "15 мин 30 сек". */
const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} мин ${seconds} сек`;
};

/** Дата, отстоящая от текущего момента на указанное число дней. */
const dateInDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + Number(days));
  return date;
};

/** Unix-время в секундах через указанное число секунд — формат, который ждёт Telegram API. */
const unixTimestampIn = (seconds) => Math.floor(Date.now() / 1000) + seconds;

module.exports = {
  delay,
  secondsBetween,
  elapsedSeconds,
  formatDuration,
  dateInDays,
  unixTimestampIn
};
