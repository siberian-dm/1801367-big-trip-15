import {getDateDiff} from './date-format';

export const sortPointDay = (pointA, pointB) => getDateDiff(pointA.dateFrom, pointB.dateFrom);


export const sortPointTime = (pointA, pointB) => getDateDiff(pointB.dateTo, pointB.dateFrom) - getDateDiff(pointA.dateTo, pointA.dateFrom);


export const sortPointPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
