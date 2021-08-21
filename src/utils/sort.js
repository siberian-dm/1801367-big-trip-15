import {getDateDiff} from './date-format';

export const sortPointDay = (pointA, pointB) => getDateDiff(pointA.dateFrom, pointB.dateFrom);


export const sortPointTime = (pointA, pointB) => (pointB.dateTo - pointB.dateFrom) - (pointA.dateTo - pointA.dateFrom);


export const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
