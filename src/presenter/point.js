import PointView from '../view/trip-point';
import EditPointFormView from '../view/edit-trip-point-form';
import {replace, remove, render} from '../utils/render';
import {UserAction, UpdateType} from '../const';
import {isDatesEqual} from '../utils/date-format';

const Mode = {
  POINT: 'POINT',
  FORM: 'FORM',
};

export default class Point {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointFormComponent = null;
    this._mode = Mode.POINT;

    this._handleSwtichToForm = this._handleSwtichToForm.bind(this);
    this._handleSwitchToPoint = this._handleSwitchToPoint.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRemoveComponent = this._handleRemoveComponent.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEditPointFormComponent = this._editPointFormComponent;

    this._pointComponent = new PointView(point);
    this._editPointFormComponent = new EditPointFormView(point);

    this._pointComponent.setSwitchToFormHandler(this._handleSwtichToForm);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editPointFormComponent.setSwitchToPointHandler(this._handleSwitchToPoint);
    this._editPointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointFormComponent.setRemoveComponentHandler(this._handleRemoveComponent);

    if (prevPointComponent === null || prevEditPointFormComponent === null) {
      render(this._container, this._pointComponent);
      return;
    }

    if (this._mode === Mode.POINT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.FORM) {
      replace(this._editPointFormComponent, prevEditPointFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointFormComponent);
  }

  destroy() {
    remove(this._editPointFormComponent);
    remove(this._pointComponent);
  }

  resetMode() {
    if (this._mode !== Mode.POINT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._editPointFormComponent, this._pointComponent);
    this._changeMode();
    this._mode = Mode.FORM;
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointFormComponent);
    this._mode = Mode.POINT;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleSwtichToForm() {
    this._replacePointToForm();
  }

  _handleSwitchToPoint() {
    this._editPointFormComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _handleFormSubmit(update) {
    const isMinorMajor =
      !isDatesEqual(this._point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this._point.dateTo, update.dateTo);

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorMajor ? UpdateType.MAJOR : UpdateType.PATCH,
      update,
    );

    this._replaceFormToPoint();
  }

  _handleRemoveComponent() {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      this._point,
    );
  }

  _handleFavoriteClick() {
    const point = Object.assign({}, this._point, {isFavorite: !this._point.isFavorite});

    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, point);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointFormComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }
}
