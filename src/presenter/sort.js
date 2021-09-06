import SortView from '../view/sort.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType} from '../const.js';

export default class Sort {
  constructor(container, pointsModel, filterModel, sortModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._sortModel = sortModel;
    this._component = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._sortModel.addObserver(this._handleModelEvent);

    if (!this._sortModel.getSortedPoints().length) {
      this.destroy();

      return;
    }

    const prevComponent = this._component;

    this._component = new SortView(this._sortModel.getSort());

    this._component.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  destroy() {
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._sortModel.removeObserver(this._handleModelEvent);

    remove(this._component);
    this._component = null;
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.init();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._sortModel.getSort() === sortType) {
      return;
    }

    this._sortModel.setSort(UpdateType.MINOR, sortType);
  }
}
