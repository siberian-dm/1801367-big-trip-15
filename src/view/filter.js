import AbstractView from './abstract';
import {FilterType} from '../utils/const';

const createFiltersTemplate = (filterType, isDisabled) => (
  `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="everything" ${filterType === FilterType.EVERYTHING ? 'checked' : ''} ${isDisabled[FilterType.EVERYTHING] ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="future" ${filterType === FilterType.FUTURE ? 'checked' : ''} ${isDisabled[FilterType.FUTURE] ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
        value="past" ${filterType === FilterType.PAST ? 'checked' : ''} ${isDisabled[FilterType.PAST] ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);


export default class Filter extends AbstractView {
  constructor(currentFilter, isDisabled) {
    super();

    this._isDisabled = isDisabled;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._currentFilter, this._isDisabled);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
