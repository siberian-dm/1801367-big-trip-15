import dayjs from 'dayjs';

const MINUTE_TO_MS = 6e4;
const HOUR_TO_MS = 3.6e6;


export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};


export const renderElement = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};


export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};


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

export const getHumanizeEventTime = (date) => dayjs(date).format('HH:mm');

export const getHumanizeVisibleDateForForm = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export const getHumanizeVisibleDateForInfo = (dateFrom, dateTo) => `${dayjs(dateFrom).format('D MMM')}&nbsp;&mdash;&nbsp;${dayjs(dateTo).format('D MMM')}`;

export const getHumanizeEventDuration = (dateFrom, dateTo) => {
  const duration = dateTo - dateFrom;

  const hours = Math.floor(duration / HOUR_TO_MS);
  const minutes = Math.floor(duration % HOUR_TO_MS / MINUTE_TO_MS);

  const hoursToString = (hours > 0 && hours < 10) ? `0${hours}H` : `${hours}H`;
  const minutesToString = (minutes > 0 && minutes < 10) ? `0${minutes}M` : `${minutes}M`;

  const humanizeEventDuration = hours === 0 ? minutesToString : `${hoursToString} ${minutesToString}`;

  return humanizeEventDuration;
};
