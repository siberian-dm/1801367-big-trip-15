import FilterView from '../view/filter.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType, FilterType, Status} from '../utils/const.js';
import {filterPoints} from '../utils/filter.js';

export default class Filter {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._model.filter.addObserver(this._handleModelEvent);
    this._model.points.addObserver(this._handleModelEvent);
  }

  init() {
    const prevComponent = this._component;

    const points = this._model.points.getPoints();
    const status = this._model.filter.getStatus();

    const isDisabled = {
      [FilterType.EVERYTHING]: points.length === 0 || status !== Status.ENABLED,
      [FilterType.FUTURE]: filterPoints[FilterType.FUTURE](points).length === 0 || status !== Status.ENABLED,
      [FilterType.PAST]: filterPoints[FilterType.PAST](points).length === 0 || status !== Status.ENABLED,
    };

    this._component = new FilterView(this._model.filter.getFilter(), isDisabled);

    this._component.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      case UpdateType.STATS_SHOW:
      case UpdateType.TABLE_SHOW:
        this.init();
    }
  }

  _handleFilterTypeChange(filterType) {
    if (this._model.filter.getFilter() === filterType) {
      return;
    }

    this._model.filter.setFilter(UpdateType.MINOR, filterType);
  }
}
