import PointView from '../view/trip-point';
import EditPointFormView from '../view/edit-trip-point-form';
import {replace, remove, render} from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editPointFormComponent = null;
    this._mode = Mode.DEFAULT;

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

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editPointFormComponent, prevEditPointFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointFormComponent);
  }

  destroy() {
    this._handleRemoveComponent();
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._editPointFormComponent, this._pointComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointFormComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleSwtichToForm() {
    this._replacePointToForm();
  }

  _handleSwitchToPoint() {
    this._replaceFormToPoint();
  }

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }

  _handleRemoveComponent() {
    remove(this._editPointFormComponent);
    remove(this._pointComponent);
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }
}
