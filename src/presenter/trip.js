import PointPresenter from './point';

import InfoView from '../view/trip-info';
import MenuView from '../view/menu';
import FiltersView from '../view/filters';
import SortView from '../view/sort';
import PointsView from '../view/trip-points';
import NoPointsView from '../view/no-trip-points';

import {SortType} from '../const';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort';


export default class Trip {
  constructor(infoContainer, menuContainer, filtersContainer, pointsContainer) {
    this._infoContainer = infoContainer;
    this._menuContainer = menuContainer;
    this._filtersContainer = filtersContainer;
    this._pointsContainer = pointsContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
    this._sortComponent = new SortView();
    this._pointsComponent = new PointsView();
    this._noPointsComponent = new NoPointsView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();

    render(this._menuContainer, this._menuComponent);
    render(this._filtersContainer, this._filtersComponent);
    render(this._pointsContainer, this._pointsComponent);

    if (!this._points.length) {
      this._renderNoPoints();
    }
    else {
      this._renderInfo();
      this._renderSort();
      this._renderTripPoints();
    }
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._points.sort(sortPointDay);
        break;
      case SortType.TIME:
        this._points.sort(sortPointTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortPointPrice);
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPoints();
    this._renderTripPoints();
  }

  _renderInfo() {
    this._tripInfoComponent = new InfoView(this._points);

    render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    render(this._pointsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    render(this._pointsComponent, this._noPointsComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsComponent, this._handlePointChange, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTripPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _clearPoints() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }
}
