import AbstractObserver from './abstract-observer.js';
import {SortType} from '../utils/const.js';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort.js';


export default class Sort extends AbstractObserver {
  constructor(filterModel) {
    super();
    this._activeSortType = SortType.DAY;
    this._filterModel = filterModel;
  }

  setSort(updateType, sortType) {
    this._activeSortType = sortType;
    this._notify(updateType);
  }

  getSort() {
    return this._activeSortType;
  }

  getSortedPoints() {
    const points = this._filterModel.getFilteredPoints();

    switch (this.getSort()) {
      case SortType.DAY:
        return points.sort(sortPointDay);
      case SortType.TIME:
        return points.sort(sortPointTime);
      case SortType.PRICE:
        return points.sort(sortPointPrice);
    }
  }
}
