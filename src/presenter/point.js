import PointView from '../view/trip-point';
import EditPointFormView from '../view/edit-trip-point-form';
import {replace, remove, render} from '../utils/render';


export default class Point {
  constructor(container) {
    this._container = container;

    this._handleSwtichToForm = this._handleSwtichToForm.bind(this);
    this._handleSwitchToPoint = this._handleSwitchToPoint.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRemoveComponent = this._handleRemoveComponent.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._pointComponent = new PointView(point);
    this._editPointFormComponent = new EditPointFormView(point);

    this._pointComponent.setSwitchToFormHandler(this._handleSwtichToForm);
    this._editPointFormComponent.setSwitchToPointHandler(this._handleSwitchToPoint);
    this._editPointFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editPointFormComponent.setRemoveComponentHandler(this._handleRemoveComponent);

    render(this._container, this._pointComponent);
  }

  _replacePointToForm() {
    replace(this._editPointFormComponent, this._pointComponent);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._editPointFormComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleSwtichToForm() {
    this._replacePointToForm();
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleSwitchToPoint() {
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleRemoveComponent() {
    remove(this._editPointFormComponent);
    remove(this._pointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }
}
