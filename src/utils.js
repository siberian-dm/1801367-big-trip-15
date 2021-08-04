import dayjs from 'dayjs';
/**
 * Возвращает случайное целое число из заданного диапозона положительных чисел
 *
 * @param {number} a - начало/конец диапозона
 * @param {number} b - начало/конец диапозона
 * @return {number}
 */
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getHumanizeDate = (date) => dayjs(date).format('YYYY-MM-DD');

export const getHumanizeVisibleDate = (date) => dayjs(date).format('MMM D');

export const getHumanizeVisibleDateInForm = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export const getHumanizeEventTime = (date) => dayjs(date).format('HH:mm');

export const getHumanizeEventDuration = (dateFrom, dateTo) => {
  const oneMinuteToMs = 6e4;
  const oneHourToMs = 3.6e6;
  const duration = dateTo - dateFrom;

  const hours = Math.floor(duration / oneHourToMs);
  const minutes = Math.floor(duration % (oneHourToMs) / (oneMinuteToMs));

  const hoursToString = (hours > 0 && hours < 10) ? `0${hours}H` : `${hours}H`;
  const minutesToString = (minutes > 0 && minutes < 10) ? `0${minutes}M` : `${minutes}M`;

  const humanizeEventDuration = hours === 0 ? minutesToString : `${hoursToString} ${minutesToString}`;

  return humanizeEventDuration;
};
