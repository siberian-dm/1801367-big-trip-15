import PointPresenter from './point';
import PointNewPresenter from './point-new';

import PointsContainerView from '../view/points-container';
import NoPointsView from '../view/no-points';
import LoadingView from '../view/loading';

import {UserAction, UpdateType, FilterType, SortType, Status, State} from '../utils/const';
import {render, remove, replace, RenderPosition} from '../utils/render';


export default class Trip {
  constructor(tripContainer, model, api) {
    this._tripContainer = tripContainer;
    this._model = model;
    this._pointPresenter = new Map();
    this._isLoading = true;
    this._api = api;

    this._noPointsComponent = null;
    this._pointsContainerComponent = null;
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._model.points.addObserver(this._handleModelEvent);
    this._model.filter.addObserver(this._handleModelEvent);
    this._model.sort.addObserver(this._handleModelEvent);
    this._model.menu.addObserver(this._handleModelEvent);
    this._model.pointNewButton.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._handleViewAction, this._model);
  }

  init() {
    if (this._pointsContainerComponent !== null) {
      this._destroy();
    }

    this._pointsContainerComponent = new PointsContainerView();

    render(this._tripContainer, this._pointsContainerComponent, RenderPosition.BEFOREEND);

    if (this._isLoading) {
      this._renderLoading();

      return;
    }

    const points = this._model.sort.getSortedPoints();

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

  _createPoint() {
    const destroyCallback = () => (
      this._model.pointNewButton.setStatus(UpdateType.NEW_POINT_FORM_DESTROY, Status.ENABLED)
    );

    if (this._model.sort.getSort() !== SortType.DAY) {
      this._model.sort.setSort(UpdateType.MINOR, SortType.DAY);
    }

    if (this._model.filter.getFilter() !== FilterType.EVERYTHING) {
      this._model.filter.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }

    this._pointNewPresenter.init(this._pointsContainerComponent, destroyCallback);
  }

  _destroy() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._pointsContainerComponent);
    this._pointsContainerComponent = null;
  }

  _renderLoading() {
    render(this._pointsContainerComponent, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    const prevNoPointsComponent = this._noPointsComponent;

    this._noPointsComponent = new NoPointsView(this._model.filter.getFilter());

    if (prevNoPointsComponent === null) {
      render(this._pointsContainerComponent, this._noPointsComponent);

      return;
    }

    replace(this._noPointsComponent, prevNoPointsComponent);
    remove(prevNoPointsComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsContainerComponent, this._handleViewAction, this._handleModeChange, this._model);

    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(State.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._model.points.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._model.points.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(State.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._model.points.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this.init();
        break;
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this._destroy();
        this.init();
        break;
      case UpdateType.STATS_SHOW:
        this._destroy();
        break;
      case UpdateType.TABLE_SHOW:
        this.init();
        break;
      case UpdateType.NEW_POINT_FORM_SHOW:
        this._handleModeChange();
        this._createPoint();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetMode());
  }
}
