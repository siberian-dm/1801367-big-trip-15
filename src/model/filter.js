import AbstractObserver from './abstract-observer.js';
import {FilterType} from '../const.js';
import {filterPoints} from '../utils/filter.js';

export default class Filter extends AbstractObserver {
  constructor(pointsModel) {
    super();
    this._activeFilter = FilterType.EVERYTHING;
    this._pointsModel = pointsModel;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }

  getFilteredPoints() {
    const points = this._pointsModel.getPoints();

    return filterPoints[this.getFilter()](points);
  }
}
