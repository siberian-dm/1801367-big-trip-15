import SortView from '../view/sort.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType} from '../utils/const.js';

export default class Sort {
  constructor(container, model) {
    this._container = container;
    this._model = model;
    this._component = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._model.points.addObserver(this._handleModelEvent);
    this._model.filter.addObserver(this._handleModelEvent);
    this._model.sort.addObserver(this._handleModelEvent);
    this._model.menu.addObserver(this._handleModelEvent);
  }

  init() {
    if (!this._model.sort.getSortedPoints().length) {
      this._destroy();

      return;
    }

    const prevComponent = this._component;

    this._component = new SortView(this._model.sort.getSort());

    this._component.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _destroy() {
    remove(this._component);
    this._component = null;
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.INIT:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
      case UpdateType.TABLE_SHOW:
        this.init();
        break;
      case UpdateType.STATS_SHOW:
        this._destroy();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._model.sort.getSort() === sortType) {
      return;
    }

    this._model.sort.setSort(UpdateType.MINOR, sortType);
  }
}
