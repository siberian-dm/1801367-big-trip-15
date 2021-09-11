import {FilterType} from './const';
import {isFutureDate} from './date';

export const filterPoints = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureDate(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => !isFutureDate(point.dateFrom)),
};
