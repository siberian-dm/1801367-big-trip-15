import dayjs from 'dayjs';

const MINUTE_TO_MS = 6e4;
const HOUR_TO_MS = 3.6e6;

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
