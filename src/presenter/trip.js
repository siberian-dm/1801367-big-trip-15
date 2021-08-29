import PointPresenter from './point';

import InfoView from '../view/trip-info';
import MenuView from '../view/menu';
import FiltersView from '../view/filter';
import SortView from '../view/sort';
import PointsView from '../view/trip-points';
import NoPointsView from '../view/no-trip-points';

import {SortType, UserAction, UpdateType} from '../const';
import {render, remove, RenderPosition} from '../utils/render';
import {sortPointDay, sortPointTime, sortPointPrice} from '../utils/sort';
import {filterPoints} from '../utils/filter';


export default class Trip {
  constructor(infoContainer, menuContainer, pointsContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._infoContainer = infoContainer;
    this._menuContainer = menuContainer;
    this._pointsContainer = pointsContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;
    this._infoComponent = null;
    this._noPointsComponent = null;

    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
    this._pointsComponent = new PointsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._menuContainer, this._menuComponent);
    render(this._pointsContainer, this._pointsComponent);

    this._renderTrip();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filterPoints[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredPoints.sort(sortPointDay);
      case SortType.TIME:
        return filtredPoints.sort(sortPointTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortPointPrice);
    }
  }

  _renderInfo() {
    if (this._infoComponent !== null) {
      this._infoComponent !== null;
    }

    this._infoComponent = new InfoView(this._getPoints());
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    this._sortComponent = new SortView(this._currentSortType);
    render(this._pointsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoints() {
    this._noPointsComponent = new NoPointsView();
    render(this._pointsComponent, this._noPointsComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsComponent, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    if (!this._pointsModel.getPoints().length) {
      this._renderNoPoints();
    }

    if (this._infoComponent === null) {
      this._renderInfo();
    }

    this._renderSort();
    this._getPoints().forEach((point) => this._renderPoint(point));
  }

  _clearTrip({resetInfo = false, resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._sortComponent);
    remove(this._noPointsComponent);

    if (resetInfo) {
      remove(this._infoComponent);
      this._infoComponent = null;
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetInfo: true, resetSortType: false});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }
}
