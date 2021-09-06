import PointEditView from '../view/point-edit';

import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {OFFER_TYPES} from '../const.js';
import {nanoid} from 'nanoid';

const NEW_POINT = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: OFFER_TYPES.map((offer) => offer.type)[0],
};


export default class PointNew {
  constructor(changeData) {
    this._changeData = changeData;

    this._component = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(container, callback) {
    this._destroyCallback = callback;

    if (this._component !== null) {
      return;
    }

    this._component = new PointEditView({point: Object.assign({}, NEW_POINT, {id: nanoid()}), isNewPoint: true});
    this._component.setFormSubmitHandler(this._handleFormSubmit);
    this._component.setDeleteClickHandler(this._handleDeleteClick);

    render(container, this._component, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._component === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._component);
    this._component = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
