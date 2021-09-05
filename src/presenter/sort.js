import SortView from '../view/sort.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType} from '../const.js';

export default class Sort {
  constructor(sortContainer, pointsModel, filterModel, sortModel) {
    this._sortContainer = sortContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._sortModel = sortModel;
    this._sortComponent = null;

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

    const prevSortComponent = this._sortComponent;

    this._sortComponent = new SortView(this._sortModel.getSort());

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    if (prevSortComponent === null) {
      render(this._sortContainer, this._sortComponent, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  destroy() {
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._sortModel.removeObserver(this._handleModelEvent);

    remove(this._sortComponent);
    this._sortComponent = null;
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
