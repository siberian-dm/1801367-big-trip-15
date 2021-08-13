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
