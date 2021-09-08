import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(duration);


export const getHumanizeDate = (date) => dayjs(date).format('YYYY-MM-DD');


export const getHumanizeVisibleDate = (date) => dayjs(date).format('MMM D');


export const getHumanizeEventTime = (date) => dayjs(date).format('HH:mm');


export const getHumanizeVisibleDateForForm = (date) => dayjs(date).format('DD/MM/YY HH:mm');


export const getHumanizeVisibleDateForInfo = (dateFrom, dateTo) => `${dayjs(dateFrom).format('D MMM')}&nbsp;&mdash;&nbsp;${dayjs(dateTo).format('D MMM')}`;


export const getHumanizeEventDuration = (milliseconds) => {
  const days = dayjs.duration(milliseconds).format('DD');
  const hours = dayjs.duration(milliseconds).format('HH');
  const minutes = dayjs.duration(milliseconds).format('mm');

  const humanizeEventDuration = `${days === '00' ? '' : `${days}D`} ${days === '00' && hours === '00' ? '' : `${hours}H`} ${minutes}M`;

  return humanizeEventDuration;
};


export const getDateDiff = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));


export const getDateInUtc = (date) => dayjs.utc(date).format();


export const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB);


export const isFutureDate = (date) => dayjs().isBefore(date);
