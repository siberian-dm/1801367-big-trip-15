import PointPresenter from './point';
import PointNewPresenter from './point-new';
import PointsView from '../view/trip-points';
import NoPointsView from '../view/no-trip-points';

import {UserAction, UpdateType, FilterType, SortType} from '../const';
import {render, remove, replace, RenderPosition} from '../utils/render';


export default class Trip {
  constructor(pointsContainer, pointsModel, filterModel, sortModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._sortModel = sortModel;
    this._pointsContainer = pointsContainer;
    this._pointPresenter = new Map();

    this._noPointsComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._sortModel.addObserver(this._handleModelEvent);

    this._pointsContainerComponent = new PointsView();

    render(this._pointsContainer, this._pointsContainerComponent, RenderPosition.BEFOREEND);

    const points = this._sortModel.getSortedPoints();

    if (this._noPointsComponent !== null) {
      remove(this._noPointsComponent);
      this._noPointsComponent = null;
    }

    if (!points.length) {
      this._renderNoPoints();
    }
    else {
      points.forEach((point) => this._renderPoint(point));
    }
  }

  destroy() {
    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._sortModel.removeObserver(this._handleModelEvent);

    this._clearTrip();
  }

  createPoint(callback) {
    if (this._sortModel.getSort() !== SortType.DAY) {
      this._sortModel.setSort(UpdateType.MINOR, SortType.DAY);
    }

    if (this._filterModel.getFilter() !== FilterType.EVERYTHING) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }

    this._pointNewPresenter.init(this._pointsContainerComponent, callback);
  }

  _clearTrip() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._pointsContainerComponent);
    this._pointsContainerComponent = null;
  }

  _renderNoPoints() {
    const prevNoPointsComponent = this._noPointsComponent;

    this._noPointsComponent = new NoPointsView(this._filterModel.getFilter());

    if (prevNoPointsComponent === null) {
      render(this._pointsContainerComponent, this._noPointsComponent);

      return;
    }

    replace(this._noPointsComponent, prevNoPointsComponent);
    remove(prevNoPointsComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsContainerComponent, this._handleViewAction, this._handleModeChange);

    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
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
      case UpdateType.MAJOR:
        this._clearTrip();
        this.init();
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }
}
