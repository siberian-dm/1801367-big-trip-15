import AbstractObserver from './abstract-observer.js';
import {FilterType, Status} from '../utils/const.js';
import {filterPoints} from '../utils/filter.js';

export default class Filter extends AbstractObserver {
  constructor(pointsModel) {
    super();
    this._activeFilter = FilterType.EVERYTHING;
    this._status = Status.ENABLED;
    this._pointsModel = pointsModel;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }

  setStatus(updateType, status) {
    this._status = status;
    this._notify(updateType, status);
  }

  getStatus() {
    return this._status;
  }

  getFilteredPoints() {
    const points = this._pointsModel.getPoints();

    return filterPoints[this.getFilter()](points);
  }
}
