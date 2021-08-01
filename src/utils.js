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

export const isTaskExpired = (dueDate) => dueDate === null ? false : dayjs().isAfter(dueDate, 'D');

export const isTaskExpiringToday = (dueDate) => dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), 'D');

export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean);

export const humanizeDate = (Date) => dayjs(Date).format('YYYY-MM-DD');
export const humanizeVisibleDate = (Date) => dayjs(Date).format('MMM D');
export const humanizeEventTime = (Date) => dayjs(Date).format('HH-mm');
